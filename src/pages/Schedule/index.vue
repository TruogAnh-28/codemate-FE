<template>
  <div>
    <v-card 
      class="max-w-7xl mx-auto rounded-xl border border-gray-100 mb-6 mt-6 transition-shadow hover:shadow-lg" 
      elevation="3"
    >
      <v-card-text class="py-6">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
            <h2 class="text-h6">{{ currentMonthName }} {{ currentYear }}</h2>
          </div>
          <div class="flex items-center gap-2">
            <v-select
              v-model="selectedActivityType"
              :items="activityTypeOptions"
              item-title="name"
              item-value="id"
              label="Activity Type"
              variant="outlined"
              density="comfortable"
              class="w-64 rounded-lg transition-all hover:border-primary-lighten-1"
              hide-details
            ></v-select>
            <v-btn 
              icon 
              variant="text" 
              @click="previousMonth"
              class="rounded-lg transition-all duration-200 hover:scale-105"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn 
              class="mx-2 rounded-lg transition-all duration-200 hover:scale-105" 
              color="primary" 
              variant="tonal"
              @click="goToCurrentMonth"
            >
              Today
            </v-btn>
            <v-btn 
              icon 
              variant="text" 
              @click="nextMonth"
              class="rounded-lg transition-all duration-200 hover:scale-105"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card 
      class="max-w-7xl mx-auto border border-gray-100 transition-shadow hover:shadow-lg" 
      elevation="3"
    >
      <div class="grid grid-cols-7 border-b border-gray-200">
        <div 
          v-for="day in weekDays" 
          :key="day" 
          class="py-4 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
        >
          {{ day }}
        </div>
      </div>

      <div class="grid grid-cols-7 grid-rows-5 h-[700px]">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index" 
          :class="{
            'bg-gray-50': !day.inCurrentMonth,
            'border-blue-500': day.isToday,
            'border-2': day.isToday,
          }"
          class="border-r border-b border-gray-200 p-2 overflow-y-auto relative"
        >
          <div class="flex justify-between items-center mb-2">
            <span 
              :class="{
                'text-gray-400': !day.inCurrentMonth,
                'font-bold': day.isToday
              }"
              class="text-sm"
            >
              {{ day.date }}
            </span>
          </div>

          <div v-if="day.activities && day.activities.length > 0" class="space-y-2">
            <div 
              v-for="(activity, activityIndex) in day.activities" 
              :key="activityIndex"
              class="rounded-md p-2 text-xs cursor-pointer transition-all hover:scale-105"
              :class="getActivityColorClass(activity)"
              @click="showActivityDetails(activity)"
            >
              <div class="flex items-center">
                <v-icon size="small" class="mr-1">{{ getActivityIcon(activity) }}</v-icon>
                <span class="font-medium truncate">{{ getActivityLabel(activity) }}</span>
              </div>
              <div class="text-xs opacity-80 mt-1">
                {{ formatTime(activity.activity_date) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>

    <!-- Activity Details Dialog -->
    <v-dialog v-model="showActivityDetailsDialog" max-width="500px">
      <v-card class="rounded-xl">
        <v-card-title class="px-6 py-4 bg-gray-50 flex items-center">
          <v-icon :color="getActivityColor(selectedActivity)" class="mr-2">{{ getActivityIcon(selectedActivity) }}</v-icon>
          <span class="text-h6">{{ getActivityLabel(selectedActivity) }}</span>
        </v-card-title>
        <v-card-text class="px-6 py-4" v-if="selectedActivity">
          <div class="space-y-4">
            <div class="flex items-center">
              <v-icon color="primary" size="small" class="mr-2">mdi-information</v-icon>
              <span>{{ selectedActivity.activity_description }}</span>
            </div>
            <div class="flex items-center">
              <v-icon color="primary" size="small" class="mr-2">mdi-calendar-range</v-icon>
              <span>{{ formatDateTime(selectedActivity.activity_date) }}</span>
            </div>
            <div class="flex items-center">
              <v-icon color="primary" size="small" class="mr-2">mdi-tag</v-icon>
              <span>{{ selectedActivity.activity_type }}</span>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-6 py-4 bg-gray-50">
          <v-spacer></v-spacer>
          <v-btn 
            color="gray" 
            variant="tonal" 
            @click="showActivityDetailsDialog = false"
            class="rounded-lg transition-all duration-200 hover:scale-105"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { formatDateTime } from "@/utils/functions/time";
import { RecentActivitiesResponse } from '@/types/Dashboard';
import { dashboardService } from '@/services/dashboardService';
import { reloadManager } from "@/modals/manager/reload";

interface CalendarDay {
  date: number;
  fullDate: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  activities: RecentActivitiesResponse[];
}

interface ActivityTypeOption {
  id: string;
  name: string;
}

// Activity type mapping
const ACTIVITY_MAP: Record<
  string,
  {
    label: string;
    icon: string;
    color: string;
  }
> = {
  access_course: {
    label: "Accessed Course",
    icon: "mdi-account-plus",
    color: "yellow",
  },
  complete_lesson: {
    label: "Completed Lesson",
    icon: "mdi-checkbox-marked-circle",
    color: "success",
  },
  add_feedback: {
    label: "Added Feedback",
    icon: "mdi-comment-plus",
    color: "info",
  },
  access_recommend_lesson: {
    label: "Accessed Recommended Lesson",
    icon: "mdi-star-box-outline",
    color: "purple",
  },
  access_module: {
    label: "Accessed Module",
    icon: "mdi-folder-open",
    color: "primary",
  },
  do_quiz: {
    label: "Took Quiz",
    icon: "mdi-help-circle-outline",
    color: "accent",
  },
};

// User activities data
const recentActivities = ref<RecentActivitiesResponse[]>([]);
const selectedActivityType = ref('all');
const activityTypeOptions = ref<ActivityTypeOption[]>([{ id: 'all', name: 'All Activities' }]);

const currentDate = ref(new Date());
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const showActivityDetailsDialog = ref(false);
const selectedActivity = ref<RecentActivitiesResponse | null>(null);

// Current month and year for display
const currentMonthName = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: 'long' };
  return new Intl.DateTimeFormat('en-EN', options).format(currentDate.value);
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

// Generate calendar days for the current month view
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  // const lastDayOfMonth = new Date(year, month + 1, 0);

  // Adjust for week starting on Monday (0 = Monday, 6 = Sunday)
  let firstDayOfCalendar = new Date(firstDayOfMonth);
  const dayOfWeek = firstDayOfMonth.getDay();
  const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  firstDayOfCalendar.setDate(firstDayOfMonth.getDate() - adjustment);

  const today = new Date();
  const days: CalendarDay[] = [];

  // Generate 35 days (5 weeks)
  for (let i = 0; i < 35; i++) {
    const currentDay = new Date(firstDayOfCalendar);
    currentDay.setDate(firstDayOfCalendar.getDate() + i);
    
    const isToday = currentDay.getDate() === today.getDate() &&
                    currentDay.getMonth() === today.getMonth() &&
                    currentDay.getFullYear() === today.getFullYear();
    
    const inCurrentMonth = currentDay.getMonth() === month;
                    
    // Filter activities for this day
    const dayActivities = recentActivities.value.filter(activity => {
      if (selectedActivityType.value !== 'all' && activity.activity_type !== selectedActivityType.value) {
        return false;
      }
      
      const activityDate = new Date(activity.activity_date);
      return activityDate.getDate() === currentDay.getDate() &&
             activityDate.getMonth() === currentDay.getMonth() &&
             activityDate.getFullYear() === currentDay.getFullYear();
    });
      
    days.push({
      date: currentDay.getDate(),
      fullDate: currentDay,
      inCurrentMonth,
      isToday,
      activities: dayActivities
    });
  }
  
  return days;
});

// Navigation functions
const previousMonth = () => {
  const date = new Date(currentDate.value);
  date.setMonth(date.getMonth() - 1);
  currentDate.value = date;
};

const nextMonth = () => {
  const date = new Date(currentDate.value);
  date.setMonth(date.getMonth() + 1);
  currentDate.value = date;
};

const goToCurrentMonth = () => {
  currentDate.value = new Date();
};

// Format time for display
const formatTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Activity handling
const showActivityDetails = (activity: RecentActivitiesResponse) => {
  selectedActivity.value = activity;
  showActivityDetailsDialog.value = true;
};

// Styling helpers
const getActivityIcon = (activity: RecentActivitiesResponse | null): string => {
  if (!activity) return 'mdi-calendar-blank';
  
  return ACTIVITY_MAP[activity.activity_type]?.icon || 'mdi-information-outline';
};

const getActivityLabel = (activity: RecentActivitiesResponse | null): string => {
  if (!activity) return '';
  
  return ACTIVITY_MAP[activity.activity_type]?.label || activity.activity_type;
};

const getActivityColor = (activity: RecentActivitiesResponse | null): string => {
  if (!activity) return 'gray';
  
  return ACTIVITY_MAP[activity.activity_type]?.color || 'gray';
};

const getActivityColorClass = (activity: RecentActivitiesResponse): string => {
  const color = ACTIVITY_MAP[activity.activity_type]?.color || 'gray';
  
  switch (color) {
    case 'yellow':
      return 'bg-amber-100 text-amber-800';
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'info':
      return 'bg-blue-100 text-blue-800';
    case 'purple':
      return 'bg-purple-100 text-purple-800';
    case 'primary':
      return 'bg-indigo-100 text-indigo-800';
    case 'accent':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Update activity type options when activities are fetched
const updateActivityTypeOptions = () => {
  // Start with the "All Activities" option
  const options: ActivityTypeOption[] = [{ id: 'all', name: 'All Activities' }];
  
  // Add unique activity types from the fetched data
  const uniqueTypes = new Set<string>();
  
  recentActivities.value.forEach(activity => {
    if (!uniqueTypes.has(activity.activity_type)) {
      uniqueTypes.add(activity.activity_type);
      
      options.push({
        id: activity.activity_type,
        name: ACTIVITY_MAP[activity.activity_type]?.label || activity.activity_type
      });
    }
  });
  
  // Update the ref
  activityTypeOptions.value = options;
};

const fetchRecentActivities = async () => {
  reloadManager.on("activities", async () => {
    try {
      const response = await dashboardService.fetchRecentActivities({
        showError,
        showSuccess,
      });
      
      if (response && "data" in response && response.data) {
        recentActivities.value = response.data as RecentActivitiesResponse[];
        console.log('Fetched activities:', recentActivities.value);
        updateActivityTypeOptions();
      }
    } catch (error) {
      showError("Failed to fetch activity data");
      console.error("Error fetching activities:", error);
    }
  });
  
  await reloadManager.trigger("activities");
};

onMounted(async () => {
  currentDate.value = new Date();
  await fetchRecentActivities();
});
</script>

<style scoped>
.enhanced-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>