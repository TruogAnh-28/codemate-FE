<template>
  <v-dialog v-model="localDialog" max-width="500px">
    <v-card class="pa-2">
      <v-card-title class="d-flex align-center">
        <v-icon color="green" class="mr-2">mdi-check-circle</v-icon>
        <span class="text-heading-4 font-bold">Select Your Learning Type</span>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-subtitle class="text-body-2 mb-4">
        Select the learning type that works best for you in this module
      </v-card-subtitle>

      <v-card-subtitle class="font-weight-bold text-body-large-4 pb-2" style="opacity: 1;">
        Module: {{ module.title }}
      </v-card-subtitle>

      <v-card-text>
        <v-radio-group v-model="selectedOption">
          <v-row align="center" class="px-2 pt-2">
            <v-radio label="Reading Materials (Rec: for All Levels)" value="reading" class="pr-2" />
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-icon small v-bind="props" color="grey">mdi-help-circle-outline</v-icon>
              </template>
              Purpose: Detailed theory and background information.<br>
              Engagement: Low, primarily passive reading.
            </v-tooltip>
          </v-row>

          <v-row align="center" class="px-2 pt-2">
            <v-radio label="Interactive Quizzes (Rec: for Beginner to Intermediate)" value="quizzes" class="pr-2" />
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-icon small v-bind="props" color="grey">mdi-help-circle-outline</v-icon>
              </template>
              Purpose: Quick assessments to test knowledge retention.<br>
              Engagement: High, through direct Q&A interaction.
            </v-tooltip>
          </v-row>

          <v-row align="center" class="px-2 pt-2">
            <v-radio label="Hands-On Exercises (Rec: for Intermediate to Advanced)" value="exercises" class="pr-2" />
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-icon small v-bind="props" color="grey">mdi-help-circle-outline</v-icon>
              </template>
              Purpose: Practical application of skills in real-world scenarios.<br>
              Engagement: High, requiring active problem-solving.
            </v-tooltip>
          </v-row>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="closeDialog" variant="text">Cancel</v-btn>
        <v-btn @click="confirmSelection" color="text-primary" elevation="2" class="px-2">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import type { Module } from "@/types/Lesson";
import type { Breadcrumbs } from "@/types/Breadcrumbs";

export default defineComponent({
  name: 'DialogLearningType',
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    module: {
      type: Object as () => Module,
      required: true,
      default: () => ({ id: '', title: '', objectives: [] })
    },
    lessonId: {
      type: String,
      required: true
    }
  },
  emits: ['update:dialog', 'confirm'],
  setup(props: { dialog: boolean; module: Module; lessonId: string }, { emit }: { emit: (event: string, ...args: any[]) => void }) {
    const router = useRouter();
    const selectedOption = ref('');
    const localDialog = ref(props.dialog);

    watch(() => props.dialog, (newValue: boolean) => {
      localDialog.value = newValue;
    });

    const closeDialog = () => {
      emit('update:dialog', false); 
    };

    const confirmSelection = () => {
      emit('confirm', selectedOption.value);
      emit('update:dialog', false);

      const lessonId = props.lessonId;
      const moduleId = props.module.module_id;
      const breadcrumbsModule: Breadcrumbs = {
        title: props.module.title,
        disabled: true
      };
      const breadcrumbsStore = useBreadcrumbsStore();
      breadcrumbsStore.addBreadcrumbs(breadcrumbsModule);
      console.log(breadcrumbsStore.breadcrumbs);

      switch (selectedOption.value) {
        case 'quizzes':
          router.push(`/lessonRecommend/${lessonId}/module/${moduleId}/Quiz`);
          break;
        case 'exercises':
          // router.push(`/lessonRecommend/${lessonId}/module/${moduleId}/Code`);
          router.push(`/lessonRecommend/${lessonId}/module/${moduleId}/Quiz`);
          break;
        case 'reading':
          router.push(`/lessonRecommend/${lessonId}/module/${moduleId}/Document`);
          break;
      }
    };

    return {
      selectedOption,
      localDialog, 
      closeDialog,
      confirmSelection
    };
  }
});
</script>
