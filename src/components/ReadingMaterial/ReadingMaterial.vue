<template>
  <!-- Document Details Section -->
  <div v-if="documentDetails" class="mb-6">
    <!-- Theory Content Card -->
    <v-card 
      v-for="(theory, theoryIndex) in documentDetails.theoryContent" 
      :key="theoryIndex" 
      class="border-card mb-4 overflow-hidden" 
      elevation="2"
    >
      <div class="card-header pa-6 d-flex align-center">
        <v-icon color="primary" size="x-large" class="mr-4">mdi-book-open-variant</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">{{ theory.title }}</h2>
        </div>
      </div>
      
      <v-card-text class="px-6 pt-4 pb-6">
        <!-- Theory Description -->
        <div v-for="(desc, descIndex) in theory.description" :key="descIndex" class="mb-4">
          <p class="text-body-1">{{ desc }}</p>
        </div>
        
        <!-- Examples Section -->
        <div v-if="theory.examples && theory.examples.length" class="mt-6">
          <div class="d-flex align-center mb-3">
            <v-icon color="secondary" class="mr-2">mdi-code-tags</v-icon>
            <h3 class="text-subtitle-1 font-weight-bold mb-0">Code Examples</h3>
          </div>
          
          <v-expansion-panels variant="accordion">
            <v-expansion-panel 
              v-for="(example, exampleIndex) in theory.examples" 
              :key="exampleIndex"
            >
              <v-expansion-panel-title>
                <v-icon color="primary" size="small" class="mr-2">mdi-function</v-icon>
                {{ example.title }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-sheet 
                  rounded="lg" 
                  elevation="0" 
                  class="pa-4 bg-grey-lighten-4 border-left-secondary"
                >
                  <pre class="text-body-2 mb-2 code-block"><code>{{ example.codeSnippet }}</code></pre>
                  <p class="text-body-2 text-medium-emphasis">{{ example.explanation }}</p>
                </v-sheet>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card-text>
    </v-card>

    <!-- Practical Guide Card -->
    <v-card 
      v-if="documentDetails.practicalGuide && documentDetails.practicalGuide.length"
      class="border-card mb-4 overflow-hidden" 
      elevation="2"
    >
      <div class="card-header pa-6 d-flex align-center">
        <v-icon color="error" size="x-large" class="mr-4">mdi-lightbulb-on</v-icon>
        <div>
          <h2 class="text-h5 font-weight-bold">{{ documentDetails.practicalGuide[0].title }}</h2>
        </div>
      </div>
      
      <v-card-text class="px-6 pt-4 pb-6">
        <v-row>
          <v-col cols="6">
            <h3 class="text-subtitle-1 font-weight-bold mb-3">Steps</h3>
            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item 
                v-for="(step, stepIndex) in documentDetails.practicalGuide[0].steps" 
                :key="stepIndex"
                prepend-icon="mdi-arrow-right"
                class="px-0 py-2"
              >
                <v-list-item-title class="text-body-2">{{ step }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          
          <v-col cols="6">
            <h3 class="text-subtitle-1 font-weight-bold mb-3 text-error">Common Errors</h3>
            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item 
                v-for="(error, errorIndex) in documentDetails.practicalGuide[0].commonErrors" 
                :key="errorIndex"
                prepend-icon="mdi-alert-circle"
                color="error"
                class="px-0 py-2"
              >
                <v-list-item-title class="text-body-2 text-error">{{ error.split('–')[0] }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- References Card -->
    <v-row>
        <v-col cols="6" class="d-flex">
            <v-card 
            v-if="documentDetails.summaryAndReview"
            class="border-card mb-4 overflow-hidden flex-grow-1" 
            elevation="2"
            >
            <div class="card-header pa-6 d-flex align-center">
                <v-icon color="primary" size="x-large" class="mr-4">mdi-file-document-edit</v-icon>
                <div>
                <h2 class="text-h5 font-weight-bold">Summary</h2>
                </div>
            </div>
            
            <v-card-text class="px-6 pt-4 pb-6 flex-grow-1">
                <v-list density="compact" class="bg-transparent pa-0 h-100">
                <v-list-item 
                    v-for="(point, pointIndex) in documentDetails.summaryAndReview.keyPoints" 
                    :key="pointIndex"
                    prepend-icon="mdi-check-circle"
                    class="px-0 py-2"
                >
                    <v-list-item-title class="text-body-2">{{ point }}</v-list-item-title>
                </v-list-item>
                </v-list>
            </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="6" class="d-flex">
            <v-card 
            v-if="documentDetails.references && documentDetails.references.length"
            class="border-card mb-4 overflow-hidden flex-grow-1" 
            elevation="2"
            >
            <div class="card-header pa-6 d-flex align-center">
                <v-icon color="primary" size="x-large" class="mr-4">mdi-link-variant</v-icon>
                <div>
                <h2 class="text-h5 font-weight-bold">References</h2>
                </div>
            </div>
            
            <v-card-text class="px-6 pt-4 pb-6 flex-grow-1">
                <v-list density="compact" class="bg-transparent pa-0 h-100">
                <v-list-item 
                    v-for="(ref, refIndex) in documentDetails.references" 
                    :key="refIndex"
                    :href="ref.link"
                    target="_blank"
                    class="px-0 py-2"
                >
                    <v-list-item-title class="text-body-1 font-weight-medium">
                    {{ ref.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-body-2 text-medium-emphasis">
                    {{ ref.description }}
                    </v-list-item-subtitle>
                </v-list-item>
                </v-list>
            </v-card-text>
            </v-card>
        </v-col>
        </v-row>
     <!-- Summary and Review Card -->
  <!-- <v-card 
    v-if="documentDetails?.summaryAndReview"
    class="border-card mb-4 overflow-hidden" 
    elevation="2"
  >
    <div class="card-header pa-6 d-flex align-center">
      <v-icon color="success" size="x-large" class="mr-4">mdi-file-document-edit</v-icon>
      <div>
        <h2 class="text-h5 font-weight-bold">Summary and Review</h2>
      </div>
    </div>
    
    <v-card-text class="px-6 pt-4 pb-6">
      <v-row>
        <v-col cols="6">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">Key Points</h3>
          <v-list density="compact" class="bg-transparent pa-0">
            <v-list-item 
              v-for="(point, pointIndex) in documentDetails.summaryAndReview.keyPoints" 
              :key="pointIndex"
              prepend-icon="mdi-check-circle"
              class="px-0 py-2"
            >
              <v-list-item-title class="text-body-2">{{ point }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        
        <v-col cols="6">
          <h3 class="text-subtitle-1 font-weight-bold mb-3 text-primary">Review Questions</h3>
          <v-expansion-panels variant="accordion">
            <v-expansion-panel 
              v-for="(question, questionIndex) in documentDetails.summaryAndReview.reviewQuestions" 
              :key="questionIndex"
            >
              <v-expansion-panel-title>
                <v-icon color="primary" size="small" class="mr-2">mdi-help-circle</v-icon>
                {{ question.question }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-sheet 
                  rounded="lg" 
                  elevation="0" 
                  class="pa-4 bg-grey-lighten-4 border-left-primary"
                >
                  <p class="text-body-2 font-weight-bold mb-2">Model Answer:</p>
                  <p class="text-body-2 text-medium-emphasis">{{ question.answer }}</p>
                  <div class="d-flex align-center mt-2">
                    <v-chip 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    >
                      Max Score: {{ question.maxscore }}
                    </v-chip>
                  </div>
                </v-sheet>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card> -->
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { moduleService } from "@/services/module";
import { DocumentResponse } from "@/types/Document";

const props = defineProps({
  moduleId: {
    type: String,
    required: true
  }
});

const documentDetails = ref<DocumentResponse | null>(null);
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

const fetchDocumentDetails = async () => {
  try {
    const response = await moduleService.fetchDocumentDetails(
      { showError, showSuccess }, 
      props.moduleId
    );
    
    if (response && "data" in response && response.data) {
      documentDetails.value = response.data as DocumentResponse;
      showSuccess("Document details loaded successfully!");
    }
  } catch (error) {
    console.error("Error fetching document details:", error);
    showError("Failed to load document details. Please try again.");
  }
};

onMounted(() => {
  fetchDocumentDetails();
});
</script>

<style scoped>
.code-block {
  background-color: #f4f4f4;
  border-radius: 4px;
  padding: 10px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
}

.border-left-secondary {
  border-left: 4px solid rgb(var(--v-theme-secondary));
}
</style>