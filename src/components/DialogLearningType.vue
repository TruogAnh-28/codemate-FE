<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon color="green" class="mr-2">mdi-check-circle</v-icon>
        <span class="text-h6">Select Your Preferred Learning Type</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-subtitle class="text-body-2 mb-4">
        Select the learning type that works best for you in this module
      </v-card-subtitle>

      <v-card-subtitle class="font-weight-bold pb-2">
        Module: {{ module.introduction }}
      </v-card-subtitle>

      <v-card-text>
        <v-radio-group v-model="selectedOption">
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

          <v-row align="center" class="px-2 pt-2">
            <v-radio label="Reading Materials (Rec: for All Levels)" value="reading" class="pr-2" />
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-icon small v-bind="props" color="grey" >mdi-help-circle-outline</v-icon>
              </template>
              Purpose: Detailed theory and background information.<br>
              Engagement: Low, primarily passive reading.
            </v-tooltip>
          </v-row>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="closeDialog">Cancel</v-btn>
        <v-btn color="black" dark @click="confirmSelection">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">

import type { Module } from "@/types/Lesson";

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
      default: () => ({ id: '', introduction: '', objectives: [] })
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
    
    const closeDialog = () => {
      emit('update:dialog', false);
    };

    const confirmSelection = () => {
      emit('confirm', selectedOption.value);
      emit('update:dialog', false);
      
      const lessonId = props.lessonId;
      const moduleId = props.module.id; 
      
      switch (selectedOption.value) {
        case 'quizzes':
          router.push(`/lessonRecommend/${lessonId}/module/${moduleId}/Quiz`);
          break;
        case 'exercises':
          router.push(`/lessonRecommend/${lessonId}/module/${moduleId}/Code`);
          break;
        case 'reading':
          router.push(`/lessonRecommend/${lessonId}/module/${moduleId}/Document`);
          break;
      }
    };

    return {
      selectedOption,
      closeDialog,
      confirmSelection
    };
  }
});
</script>