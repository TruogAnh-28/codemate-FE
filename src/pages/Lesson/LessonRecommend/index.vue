<template class="tailwind-scope">
  <v-container fluid class="px-12">
    <!-- Header Section -->
    <v-row class="mb-4">
      <v-col cols="8">
        <v-sheet class="text-h4 font-weight-bold">{{lesson.name}}</v-sheet>
      </v-col>
      <v-col cols="4" class="text-h5 font-weight-semibold text-right">
        {{lesson.progress}}% 
         <v-chip     
          class="ma-2"
          color="green"
          prepend-icon="mdi-checkbox-marked-circle"
        >
          Completed
        </v-chip>
      </v-col>
    </v-row>

    <!-- Details Section -->
    <v-col cols="3" class="text-gray-500 mb-4">
      <v-row><v-icon class="mr-2">mdi-clock-outline</v-icon> Recommend Time: "{{lesson.recommendTime}} hours"</v-row>
      <v-row><v-icon class="mr-2">mdi-book-open-outline</v-icon> {{lesson.modules.length}} Modules</v-row>
    </v-col>

    <!-- Recommend Content & Learning Outcomes -->
    <v-row class="mb-4">
      <v-col cols="8">
        <v-card flat class="pa-0 mb-2">
          <v-card-title class="font-weight-bold text-h6 pa-0">
            Recommend
          </v-card-title>
          <v-card-text class="pa-0">
            {{lesson.recommendContent}}
          </v-card-text>
        </v-card>
        <v-card flat class="pa-0">
          <v-card-title class="font-weight-bold text-h6 pa-0">
            Explain
          </v-card-title>
          <v-card-text class="pa-0">
            {{lesson.explain}}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4" class="pl-4">
        <v-card flat class="pa-0">
          <v-card-title class="font-weight-bold text-h6 pa-0">
            Learning Outcomes
          </v-card-title>
          <v-card-text class="pa-0">
            <ul class="list-disc pl-6 space-y-2">
              <li v-for="(outcome, index) in lesson.learningOutcomes" :key="index">
                {{ outcome }}
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

   
    <!-- Modules Section -->
    <v-row>
      <v-col cols="12">
        <v-sheet class="text-h6 font-weight-bold ">Modules:</v-sheet>
      </v-col>
      <v-col cols="4" v-for="module in lesson.modules" :key="module.id">
        <v-card
          class="p-4 text-center bg-green-100 hover:bg-green-200 cursor-pointer"
          @click="openDialog(module)"
        >
          <v-card-text class="font-weight-bold">{{ module.introduction }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog Component -->
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
import { LessonData } from "@/constants/lesson";
import { Lesson, Module } from "@/types/Lesson";
const lesson = ref<Lesson[]>(LessonData);
const showDialog = ref(false);
const selectedModule = ref<Module | null>(null);
const route=useRoute();
const lessonId = route.params.lessonId as string;
function openDialog(module: Module) {
  selectedModule.value = module;

  showDialog.value = true;
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
