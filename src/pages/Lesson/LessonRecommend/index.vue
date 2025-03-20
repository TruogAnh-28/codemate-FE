<template>
  <v-container fluid class="px-12" v-if="lesson">
    <!-- Breadcrumbs -->
    <v-breadcrumbs
      class="ma-0 pa-0 mb-4"
      :items="breadcrumbsStore.breadcrumbs"
      divider="/"
    ></v-breadcrumbs>
    
    <!-- Main Header Card -->
    <v-card class="border-card mb-6 overflow-hidden" elevation="3">
      <div class="card-header pa-6 d-flex align-center">
        <v-icon color="primary" size="x-large" class="mr-4">mdi-book-education-outline</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">{{ lesson.name }}</h2>
          <p class="text-subtitle-2 text-medium-emphasis mb-0">
            {{ lesson.modules.length }} modules to complete
          </p>
        </div>
        <v-spacer></v-spacer>
        <v-chip
          class="px-4 py-2"
          :color="renderStatusLabel(lesson.status)"
          prepend-icon="mdi-checkbox-marked-circle"
          elevation="1"
        >
          {{ lesson.status }}
        </v-chip>
      </div>
      
      <v-card-text class="px-6 pt-4 pb-6">
        <v-row>
          <v-col cols="6">
            <!-- Recommend Section -->
            <div class="mb-6">
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-lightbulb-outline</v-icon>
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Recommend</h3>
              </div>
              <v-sheet rounded="lg" elevation="0" class="pa-4 bg-grey-lighten-4 border-left-primary">
                <p class="text-body-1 mb-0">{{ lesson.recommend_content }}</p>
              </v-sheet>
            </div>
            
            <!-- Explain Section -->
            <div>
              <div class="d-flex align-center mb-2">
                <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Explain</h3>
              </div>
              <v-sheet rounded="lg" elevation="0" class="pa-4 bg-grey-lighten-4">
                <p class="text-body-1 mb-0">{{ lesson.explain }}</p>
              </v-sheet>
            </div>
          </v-col>
          
          <!-- Learning Outcomes Section - Improved to show all content -->
          <v-col cols="6">
            <div class="d-flex align-center mb-2">
              <v-icon color="error" class="mr-2">mdi-certificate-outline</v-icon>
              <h3 class="text-subtitle-1 font-weight-bold mb-0 text-error">Learning Outcomes</h3>
            </div>
            <v-sheet rounded="lg" elevation="1" class="pa-4 bg-error-lighten-5 border-left-error learning-outcomes-sheet">
              <v-list density="compact" class="bg-transparent pa-0">
                <v-list-item
                  v-for="(outcome, index) in parsedLearningOutcomes(lesson.learning_outcomes)"
                  :key="index"
                  prepend-icon="mdi-check-circle"
                  class="px-0 py-1"
                  :class="{'mb-2': index !== parsedLearningOutcomes(lesson.learning_outcomes).length - 1}"
                >
                  <v-list-item-title class="text-body-1 learning-outcome-text">{{ outcome }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Modules Section -->
    <div class="mb-4 d-flex align-center">
      <v-icon color="primary" size="large" class="mr-2">mdi-view-grid-outline</v-icon>
      <h2 class="text-h5 font-weight-bold mb-0">Modules</h2>
    </div>
    
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(module, index) in lesson.modules"
        :key="module.module_id"
      >
        <v-card
          @click="openDialog(module)"
          class="module-card rounded-xl border-card h-100"
          elevation="2"
        >
          <div class="module-header pa-4">
            <div class="d-flex align-center">
              <v-avatar
                :color="`primary-${(index % 3) + 1}`"
                class="mr-3"
                size="42"
              >
                <span class="text-h6 font-weight-bold white--text">{{ index + 1 }}</span>
              </v-avatar>
              <v-chip size="small" label color="primary" variant="outlined" class="ml-auto">
                Module
              </v-chip>
            </div>
          </div>
          
          <v-card-text class="pa-4">
            <h3 class="text-subtitle-1 font-weight-medium mb-2">{{ module.title }}</h3>
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
              <span>Estimated time: 30min</span>
            </div>
          </v-card-text>
          
          <v-card-actions class="pa-4 pt-0">
            <v-btn
              color="primary"
              variant="tonal"
              class="text-none rounded-lg"
              block
              prepend-icon="mdi-play-circle-outline"
            >
              Start Module
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <DialogLearningType
      :module="selectedModule"
      :dialog="showDialog"
      :lessonId="lessonId"
      @update:dialog="showDialog = $event"
    />
  </v-container>

  <router-view />
</template>

<script lang="ts" setup>
import { lessonsService } from "@/services/recommendLesson";
import { Lesson, Module } from "@/types/Lesson";
import { renderStatusLabel } from "@/utils/functions/render";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";

interface RouteParams {
  lessonId: string;
}

const lesson = ref<Lesson | null>(null);
const showDialog = ref(false);
const selectedModule = ref<Module>({} as Module);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const route = useRoute();
const { lessonId } = route.params as RouteParams;
const courseName = computed(() => {
  const name = route.query.courseName;
  return typeof name === "string" ? name : "";
});

const breadcrumbsStore = useBreadcrumbsStore();

function openDialog(module: Module) {
  selectedModule.value = module;
  showDialog.value = true;
}

const parsedLearningOutcomes = (learning_outcomes: string[]) => {
  try {
    // Return the array directly if they're already strings
    if (learning_outcomes && Array.isArray(learning_outcomes)) {
      // Only try to parse if an item appears to be a JSON string
      const outcomes = learning_outcomes.map(outcome => {
        if (typeof outcome === 'string' && (outcome.startsWith('{') || outcome.startsWith('['))) {
          try {
            return JSON.parse(outcome);
          } catch {
            return outcome;
          }
        }
        return outcome;
      }).flat();
      
      // Ensure we're returning an array of strings
      return outcomes.map(outcome => {
        if (typeof outcome === 'object' && outcome !== null) {
          return JSON.stringify(outcome);
        }
        return String(outcome);
      });
    }
    return learning_outcomes || [];
  } catch (e) {
    console.error("Error processing learning outcomes:", e);
    return [];
  }
};

const fetchRecommendedLesson = async () => {
  const respone = await lessonsService.fetchRecommendedLesson(
    { showError, showSuccess },
    lessonId
  );
  if (respone && "data" in respone && respone.data) {
    lesson.value = respone.data as Lesson;
    if (lesson.value) {
      breadcrumbsStore.setBreadcrumbs([
        { title: courseName.value, disabled: true },
        { title: lesson.value.name, disabled: true },
      ]);
    }
  }
};

onMounted(fetchRecommendedLesson);
</script>

<style scoped>
.border-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.border-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  background: linear-gradient(to right, rgba(var(--v-theme-primary), 0.05), transparent);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.05);
}

.module-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-header {
  background: linear-gradient(to right, rgba(var(--v-theme-primary), 0.05), transparent);
}

.primary-1 {
  background-color: var(--v-theme-primary) !important;
}

.primary-2 {
  background-color: #6200ea !important;
}

.primary-3 {
  background-color: #3949ab !important;
}

.border-left-primary {
  border-left: 4px solid var(--v-theme-primary);
}

.border-left-error {
  border-left: 4px solid var(--v-theme-error);
}

:deep(.v-list-item__prepend) {
  padding-right: 8px !important;
}

:deep(.v-list-item__prepend .v-icon) {
  color: var(--v-theme-error) !important;
  opacity: 0.7;
}

/* Added styles for learning outcomes */
.learning-outcomes-sheet {
  max-height: 100%;
  overflow-y: auto;
}

.learning-outcome-text {
  white-space: normal;
  word-break: break-word;
  line-height: 1.5;
}

:deep(.v-list-item__content) {
  overflow: visible;
  white-space: normal;
}

:deep(.v-list-item-title) {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
}
</style>