<template>
  <v-card class="mb-6">
    <v-card-title class="text-h6 pb-0">Progress Overview</v-card-title>
    <v-card-subtitle class="pt-2">
      Total spending time: {{ totalTimeSpentFormatted }}
      <!-- Optional: Add logic for comparison chip if needed -->
      <!-- <v-chip size="small" color="success" class="ml-2">
        ↑ 18.56% (1h 12m)
      </v-chip> -->
    </v-card-subtitle>

    <v-card-text>
      <div
        v-if="notAchievedLessons.length > 0"
        class="not-achieved-lessons mb-4"
      >
        <span class="text-subtitle-2 text-grey">Lessons Not Yet Completed</span>
        <div class="d-flex flex-wrap gap-2 mt-1">
          <v-chip
            v-for="lesson in notAchievedLessons"
            :key="lesson.id"
            color="warning-darken-1"
            size="small"
            label
          >
            {{ lesson.lesson_title }} ({{ lesson.progress }}%)
          </v-chip>
        </div>
      </div>

      <div v-if="chartSeries[0]?.data.length > 0" class="chart-container">
        <apexchart
          type="bar"
          :height="chartHeight"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </div>
      <div v-else class="text-center text-medium-emphasis pa-4">
        No time spent data available for lessons with progress.
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { GetRecommendedLessonsResponse } from "@/types/Course";

const props = defineProps<{
  lessons: GetRecommendedLessonsResponse[];
}>();

// --- Utility Functions ---

/**
 * Parses time strings like "X days Y hours Z minutes" into total hours.
 */
const parseTimeSpent = (timeString: string | null): number => {
  if (!timeString) return 0;

  let totalHours = 0;
  const daysMatch = timeString.match(/(\d+)\s+days?/);
  const hoursMatch = timeString.match(/(\d+)\s+hours?/);
  const minutesMatch = timeString.match(/(\d+)\s+minutes?/);

  if (daysMatch) totalHours += parseInt(daysMatch[1], 10) * 24;
  if (hoursMatch) totalHours += parseInt(hoursMatch[1], 10);
  if (minutesMatch) totalHours += parseInt(minutesMatch[1], 10) / 60;

  return totalHours;
};

/**
 * Formats total hours into a readable string "Xh Ym".
 */
const formatHoursToTime = (totalHours: number): string => {
  if (totalHours <= 0) return "0m";
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  let result = "";
  if (hours > 0) {
    result += `${hours}h`;
  }
  if (minutes > 0) {
    result += (hours > 0 ? " " : "") + `${minutes}m`;
  }
  // Handle case where totalHours is very small, e.g. 0.01 -> 1m
  if (result === "" && totalHours > 0) {
    return `${Math.round(totalHours * 60)}m`;
  }
  return result;
};

// --- Computed Properties for Chart Data ---
interface ProcessedLesson {
  id: string;
  title: string;
  timeHours: number;
  timeFormatted: string;
  progress: number;
  status: string;
  order: number;
}

const processedLessons = computed((): ProcessedLesson[] => {
  return props.lessons
    .map((lesson) => {
      if (!lesson.time_spent) return null; // Skip if no time spent
      const timeHours = parseTimeSpent(lesson.time_spent);
      return {
        id: lesson.id,
        title: lesson.lesson_title,
        timeHours: timeHours,
        timeFormatted: formatHoursToTime(timeHours),
        progress: lesson.progress,
        status: lesson.status,
        order: lesson.order,
      };
    })
    .filter((lesson): lesson is ProcessedLesson => lesson !== null) // Filter out null values
    .filter((lesson) => lesson.timeHours > 0)
    .sort((a, b) => a.order - b.order); // Sort by original lesson order
});

const totalTimeSpentHours = computed((): number => {
  return processedLessons.value.reduce(
    (sum, lesson) => sum + lesson.timeHours,
    0
  );
});

const totalTimeSpentFormatted = computed((): string => {
  return formatHoursToTime(totalTimeSpentHours.value);
});

const notAchievedLessons = computed(() => {
  return props.lessons
    .filter((lesson) => lesson.status !== "completed" && lesson.progress < 100) // Define your criteria for "not achieved"
    .sort((a, b) => a.order - b.order);
});

// --- ApexCharts Configuration ---

const chartHeight = computed(() => {
  // Adjust height based on number of bars for better readability
  const baseHeight = 100;
  const heightPerBar = 35;
  const numBars = processedLessons.value.length;
  return Math.max(baseHeight + numBars * heightPerBar, 200); // Min height 200px
});

const chartSeries = computed<ApexAxisChartSeries>(() => {
  return [
    {
      name: "Time Spent",
      data: processedLessons.value.map((lesson) =>
        parseFloat(lesson.timeHours.toFixed(2))
      ), // Use numeric hours
    },
  ];
});

const chartOptions = computed<ApexCharts.ApexOptions>(() => {
  // Find max time for scaling the x-axis appropriately
  const maxTime = Math.max(
    ...processedLessons.value.map((l) => l.timeHours),
    0
  );
  const xAxisMax = Math.ceil(maxTime / 2) * 2 || 4; // Round up to nearest even number, min 4

  // Determine colors (example: highlight 'in Progress' lessons)
  const colors = processedLessons.value.map((lesson) => {
    switch (lesson.status?.toLowerCase()) {
      case "in progress":
        return "#FFA726"; // Amber/Orange for in progress
      case "completed":
        return "#66BB6A"; // Green for completed (though we filtered for time > 0)
      case "new":
        return "#42A5F5"; // Blue for new
      default:
        return "#BDBDBD"; // Grey otherwise
    }
    // Alternate color logic based on progress:
    // if (lesson.progress >= 95) return '#4CAF50'; // Green
    // if (lesson.progress > 50) return '#FFC107'; // Amber
    // return '#EF5350'; // Red
  });

  return {
    chart: {
      type: "bar",
      height: chartHeight.value,
      toolbar: { show: false },
      margin: {
        left: 30, // Increase left margin if labels are clipped (adjust value)
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%", // Adjust bar thickness relative to available space
        distributed: true, // Use if you want each bar to potentially have a unique color from a palette
        borderRadius: 4, // Optional rounded bars
        dataLabels: {
          position: "top", // Show value outside the bar end
        },
      },
    },
    colors: colors, // Apply dynamic colors
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts) {
        // Find the corresponding lesson to get the formatted time string
        const lesson = processedLessons.value[opts.dataPointIndex];
        return lesson ? lesson.timeFormatted : `${val.toFixed(1)}h`;
      },
      offsetX: 30, // Adjust label position
      style: {
        fontSize: "12px",
        colors: ["#333"],
      },
    },
    xaxis: {
      categories: processedLessons.value.map((lesson) => lesson.title),
      min: 0,
      max: xAxisMax,
      title: {
        text: "Time Spent (hours)",
      },
      labels: {
        formatter: function (value: string) {
          // The categories are already strings (lesson titles)
          // For the axis scale labels:
          return parseFloat(value).toFixed(1) + "h";
        },
        show: true, // Ensure x-axis value labels are shown
      },
      tickAmount: Math.min(Math.ceil(xAxisMax / 1), 6), // Adjust tick amount based on max value
    },
    yaxis: {
      // Controls the appearance of the category labels (lesson titles)
      labels: {
        show: true,
        maxWidth: 150, // *** KEY: Limit the width allocated for the label ***
        style: {
          fontSize: "11px", // Slightly smaller font
        },
      },
    },
    tooltip: {
      // Ensure the custom tooltip shows the full title clearly
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const lesson = processedLessons.value[dataPointIndex];
        if (!lesson) return "";
        const color = w.globals.colors[dataPointIndex];
        // Use the 'lesson.title' which is the full, untruncated title
        return `
             <div class="apexcharts-tooltip-candlestick apexcharts-tooltip-custom">
                  <div class="apexcharts-tooltip-title" style="background: ${color}; color: white;">
                      ${lesson.title}
                 </div>
                 <div class="tooltip-content">
                     <span><strong>Time:</strong> ${lesson.timeFormatted}</span><br/>
                     <span><strong>Progress:</strong> ${lesson.progress}%</span><br/>
                     <span><strong>Status:</strong> ${lesson.status}</span>
                 </div>
             </div>
         `;
      },
    },
    legend: {
      show: false, // Colors per bar make legend redundant here
    },
    grid: {
      borderColor: "#f1f1f1",
      xaxis: {
        lines: {
          show: true, // Show vertical grid lines
        },
      },
      yaxis: {
        lines: {
          show: false, // Hide horizontal grid lines
        },
      },
    },
  };
});

// Watch for prop changes if necessary (ApexCharts should react automatically with computed)
// watch(() => props.lessons, () => {
//   // Chart should update automatically due to computed properties
// }, { deep: true });
</script>

<style scoped>
.gap-2 {
  gap: 8px; /* Vuetify class equivalent */
}
.chart-container {
  position: relative;
  /* height is now dynamic via chartHeight computed property */
}

/* Optional: Improve tooltip appearance */
:deep(.apexcharts-tooltip) {
  border-radius: 5px;
  box-shadow: 2px 2px 6px -4px #999;
  background: #fff;
  color: #333;
  border: 1px solid #e0e0e0;
}

:deep(.apexcharts-tooltip-title) {
  border-bottom: 1px solid #eee;
  font-size: 14px;
  margin: 0;
}

:deep(.apexcharts-tooltip-candlestick) {
  padding: 0 !important;
  overflow: hidden; /* Ensure title background fits rounded corners */
}
:deep(.apexcharts-tooltip-candlestick > div:last-child) {
  font-size: 13px;
}

:deep(.apexcharts-tooltip-custom) {
  max-width: 350px; /* Adjust max width of the tooltip box */
  white-space: normal; /* Allow text wrapping */
  word-wrap: break-word; /* Break long words if necessary */
}
:deep(.apexcharts-tooltip-custom .apexcharts-tooltip-title) {
  white-space: normal;
  word-wrap: break-word;
  padding: 6px 10px;
  font-weight: bold;
}
:deep(.apexcharts-tooltip-custom .tooltip-content) {
  padding: 6px 10px;
  font-size: 12px;
}
</style>
