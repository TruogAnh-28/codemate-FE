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
                v-model="selectedCourse"
                :items="courseOptions"
                item-title="name"
                item-value="id"
                label="Course"
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
  
            <div v-if="day.events && day.events.length > 0" class="space-y-2">
              <div 
                v-for="(event, eventIndex) in day.events" 
                :key="eventIndex"
                class="rounded-md p-2 text-xs cursor-pointer transition-all hover:scale-105"
                :class="getEventColorClass(event)"
                @click="showEventDetails(event)"
              >
                <div class="flex items-center">
                  <v-icon size="small" class="mr-1">{{ getEventIcon(event) }}</v-icon>
                  <span class="font-medium truncate">{{ event.exercise_name }}</span>
                </div>
                <div class="text-xs opacity-80 mt-1">
                  {{ formatTime(event.exercise_time_open) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
  
      <!-- Event Details Dialog -->
      <v-dialog v-model="showEventDetailsDialog" max-width="500px">
        <v-card class="rounded-xl">
          <v-card-title class="px-6 py-4 bg-gray-50 flex items-center">
            <v-icon :color="getEventColor(selectedEvent)" class="mr-2">{{ getEventIcon(selectedEvent) }}</v-icon>
            <span class="text-h6">{{ selectedEvent?.exercise_name }}</span>
          </v-card-title>
          <v-card-text class="px-6 py-4" v-if="selectedEvent">
            <div class="space-y-4">
              <div class="flex items-center">
                <v-icon color="primary" size="small" class="mr-2">mdi-school</v-icon>
                <span class="font-medium">{{ selectedEvent.course_name }}</span>
                <span class="text-gray-500 text-sm ml-2">({{ selectedEvent.course_courseID }})</span>
              </div>
              <div class="flex items-center">
                <v-icon color="primary" size="small" class="mr-2">mdi-calendar-range</v-icon>
                <span>
                  {{ formatDateTime(selectedEvent.exercise_time_open) }} - 
                  {{ formatDateTime(selectedEvent.exercise_time_close) }}
                </span>
              </div>
              <div class="flex items-center">
                <v-icon color="primary" size="small" class="mr-2">mdi-information</v-icon>
                <span>Học kỳ {{ selectedEvent.course_nSemester }}</span>
              </div>
            </div>
          </v-card-text>
          <v-card-actions class="px-6 py-4 bg-gray-50">
            <v-btn
              v-if="selectedEvent" 
              color="primary" 
              variant="tonal" 
              @click="navigateToExercise(selectedEvent)"
              class="rounded-lg transition-all duration-200 hover:scale-105"
            >
              <v-icon start>mdi-eye</v-icon>
              Xem chi tiết
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn 
              color="gray" 
              variant="tonal" 
              @click="showEventDetailsDialog = false"
              class="rounded-lg transition-all duration-200 hover:scale-105"
            >
              Đóng
            </v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { formatDateTime } from "@/utils/functions/time";
import { UpcomingEvent } from '@/types/Dashboard';
import { scheduleService } from '@/services/scheduleServices';

interface CalendarDay {
  date: number;
  fullDate: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  events: UpcomingEvent[];
}

interface CourseOption {
  id: string;
  name: string;
}

// Mock data - replace with your actual data
const professorEvents = ref<UpcomingEvent[]>([]);
const courseOptions = ref<CourseOption[]>([{ id: 'all', name: 'All Courses' }]);
  
const selectedCourse = ref('all');
const currentDate = ref(new Date());
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
const showEventDetailsDialog = ref(false);
const selectedEvent = ref<UpcomingEvent | null>(null);

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
                    
    // Filter events for this day
    const dayEvents = professorEvents.value.filter(event => {
      if (selectedCourse.value !== 'all' && event.course_id !== selectedCourse.value) {
        return false;
      }
      
      const eventDate = new Date(event.exercise_time_open);
      return eventDate.getDate() === currentDay.getDate() &&
             eventDate.getMonth() === currentDay.getMonth() &&
             eventDate.getFullYear() === currentDay.getFullYear();
    });
      
    days.push({
      date: currentDay.getDate(),
      fullDate: currentDay,
      inCurrentMonth,
      isToday,
      events: dayEvents
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

// Event handling
const showEventDetails = (event: UpcomingEvent) => {
  selectedEvent.value = event;
  showEventDetailsDialog.value = true;
};

const navigateToExercise = (event: UpcomingEvent) => {
  // Implement navigation to exercise details
  console.log('Navigate to exercise:', event.exercise_id);
  showEventDetailsDialog.value = false;
  // You would typically use router.push here
  // router.push(`/exercises/${event.exercise_id}`);
};

// Styling helpers
const getEventIcon = (event: UpcomingEvent | null): string => {
  if (!event) return 'mdi-calendar-blank';
  
  switch (event.exercise_type) {
    case 'quiz':
      return 'mdi-help-circle-outline';
    case 'code':
      return 'mdi-code-tags';
    case 'original':
      return 'mdi-pencil';
    default:
      return 'mdi-calendar-clock';
  }
};

const getEventColor = (event: UpcomingEvent | null): string => {
  if (!event) return 'gray';
  
  switch (event.exercise_type) {
    case 'quiz':
      return 'orange';
    case 'code':
      return 'blue';
    case 'original':
      return 'purple';
    default:
      return 'green';
  }
};

const getEventColorClass = (event: UpcomingEvent): string => {
  switch (event.exercise_type) {
    case 'quiz':
      return 'bg-orange-100 text-orange-800';
    case 'code':
      return 'bg-blue-100 text-blue-800';
    case 'original':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-green-100 text-green-800'; 
  }
};
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Update the course options when events are fetched
const updateCourseOptions = () => {
  // Start with the "All Courses" option
  const options: CourseOption[] = [{ id: 'all', name: 'All Courses' }];
  
  // Add unique courses from events
  professorEvents.value.forEach(event => {
    if (!options.some(c => c.id === event.course_id)) {
      options.push({
        id: event.course_id,
        name: `${event.course_courseID} - ${event.course_name}`
      });
    }
  });
  
  // Update the ref
  courseOptions.value = options;
};

const fetchSchedule = async () => {
  try {
    const response = await scheduleService.fetchSchedule({showError, showSuccess});
    professorEvents.value = response.data as UpcomingEvent[];
    console.log('Fetched schedule:', professorEvents.value);
    // Update course options after fetching events
    updateCourseOptions();
  } catch (error) {
    showError("Failed to fetch schedule data");
    console.error("Error fetching schedule:", error);
  }
};

// Initialize with current date
onMounted(async() => {
  currentDate.value = new Date();
  await fetchSchedule();
});
</script>

<style scoped>
.enhanced-table :deep(.v-data-table__tr:hover) {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>