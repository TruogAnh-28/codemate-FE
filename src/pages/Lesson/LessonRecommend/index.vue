<template>
  <v-container fluid class="px-12" v-if="lesson">
      <v-breadcrumbs class="ma-0 pa-0"
      :items="breadcrumbsStore.breadcrumbs"
      divider="/"
    ></v-breadcrumbs>
    <v-row class="">
      <v-col cols="8">
        <v-sheet class="text-heading-3 font-weight-bold">{{ lesson.name }}</v-sheet>
      </v-col>
      <v-col cols="4" class="text-heading-4 font-weight-bold text-right">
        {{ lesson.progress }}%
        <v-chip
          class="ma-2"
          :color="renderStatusLabel(lesson.status)"
          prepend-icon="mdi-checkbox-marked-circle"
        >
          {{ lesson.status }}
        </v-chip>
      </v-col>
    </v-row>

    <v-col cols="3" class="text-body-base-4 mb-4">
      <v-row>
        <v-icon color="primary" class="mr-2">mdi-book-open-outline</v-icon> 
        {{ lesson.modules.length }} Modules
      </v-row>
    </v-col>

    <v-row class="mb-4">
      <v-col cols="8">
        <v-card flat class="pa-0 mb-2">
          <v-card-title class="font-weight-bold text-heading-4 pa-0">
            Recommend:
          </v-card-title>
          <v-card-text class="pa-0 text-body-base-4">
            {{ lesson.recommend_content }}
          </v-card-text>
        </v-card>
        <v-card flat class="pa-0">
          <v-card-title class="font-weight-bold text-heading-4 pa-0">
            Explain:
          </v-card-title>
          <v-card-text class="pa-0 text-body-base-1">
            {{ lesson.explain }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4" class="pl-4">
        <v-card flat class="pa-0">
          <v-card-title class="font-weight-bold text-heading-4 text-error">
            Learning Outcomes
          </v-card-title>
          <v-card-text class="pa-0">
            <ul class="list-disc pl-6 space-y-2">
              <li v-for="(outcome, index) in lesson.learning_outcomes" :key="index" class="text-body-base-1">
                {{ outcome }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card-title class="font-weight-bold text-heading-4 pa-0">
          Modules:
        </v-card-title>
      </v-col>
      <v-col cols="4" v-for="module in lesson.modules" :key="module.module_id">
        <v-card
          class="p-4 text-center bg-secondary hover:bg-secondary-variant cursor-pointer"
          @click="openDialog(module)"
        >
          <v-card-text class="font-weight-bold text-body-base-1">{{ module.title }}</v-card-text>
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
import { lessonsService } from '@/services/recommendLesson';
import { Lesson, Module } from "@/types/Lesson";
import { renderStatusLabel } from "@/utils/functions/render";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";

interface RouteParams {
  lessonId: string;
}

const lesson = ref<Lesson | null>(null);
const showDialog = ref(false);
const selectedModule = ref<Module>({} as Module);

const route = useRoute();
const {  lessonId } = route.params as RouteParams;
const courseName = computed(() => {
  const name = route.query.courseName;
  return typeof name === 'string' ? name : '';
});

const showError = inject("showError") as (message: string) => void;
const breadcrumbsStore = useBreadcrumbsStore();

function openDialog(module: Module) {
  selectedModule.value = module;
  showDialog.value = true;
}

const fetchRecommendedLesson = async () => {
  try {
    const fetchedLesson = await lessonsService.fetchRecommendedLesson(showError, lessonId);
    lesson.value = fetchedLesson;
    
    if (lesson.value) {
      breadcrumbsStore.setBreadcrumbs([
        { title: courseName.value, disabled: true },
        { title: lesson.value.name, disabled: true }
      ]);
    }
  } catch (error) {
    console.error("Error fetching recommended lesson:", error);
  }
};

onMounted(fetchRecommendedLesson);
</script>

<style scoped>
</style>