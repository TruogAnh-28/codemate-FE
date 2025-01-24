<template>
  <v-card class="mb-6">
    <v-card-title class="text-h6 pb-0">Progress Overview</v-card-title>
    <v-card-subtitle class="pt-2">
      Total spending time: 6h 55m
      <v-chip size="small" color="success" class="ml-2">
        ↑ 18.56% (1h 12m)
      </v-chip>
    </v-card-subtitle>

    <v-card-text>
      <div class="not-achieved-lessons mb-4">
        <span class="text-subtitle-2 text-grey">Not Achieved Lessons</span>
        <div class="d-flex gap-2 mt-1">
          <v-chip
            v-for="lesson in notAchievedLessons"
            :key="lesson"
            color="error-lighten-1"
            size="small"
          >
            Lesson {{ lesson }}
          </v-chip>
        </div>
      </div>

      <div class="chart-container" style="position: relative; height: 300px">
        <canvas ref="chartRef"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const chartRef = ref<HTMLCanvasElement | null>(null);

interface ILessonData {
  lesson: number;
  hours: number;
  minutes: number;
  progress: number;
}

const notAchievedLessons = ref<number[]>([1, 2, 4]);

const lessonData = ref<ILessonData[]>([
  { lesson: 7, hours: 3, minutes: 27, progress: 90 },
  { lesson: 5, hours: 2, minutes: 12, progress: 70 },
  { lesson: 3, hours: 1, minutes: 16, progress: 55 }
]);

onMounted(() => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [{
            type: 'bar',
            data: lessonData.value.map((item: ILessonData) => ({
              x: item.hours + item.minutes / 60,
              y: item.progress,
              label: `Lesson ${item.lesson} [${item.hours}h ${item.minutes}m]`
            })),
            backgroundColor: lessonData.value.map((item: ILessonData) =>
              item.lesson === 7 ? '#1976D2' : '#E0E0E0'
            ),
            barThickness: 24,
          }]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const item = lessonData.value[context.dataIndex];
                  return [
                    `Lesson ${item.lesson}`,
                    `Time: ${item.hours}h ${item.minutes}m`,
                    `Progress: ${item.progress}%`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              min: 0,
              max: 4,
              grid: {
                display: true,
              },
              title: {
                display: true,
                text: 'Time (hours)'
              },
              ticks: {
                stepSize: 1,
                callback: function(value: string | number) {
                  return value + 'h';
                }
              }
            },
            y: {
              min: 0,
              max: 100,
              grid: {
                display: true
              },
              title: {
                display: true,
                text: 'Progress (%)'
              },
              ticks: {
                stepSize: 20,
                callback: function(value: string | number) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    }
  }
});
</script>
