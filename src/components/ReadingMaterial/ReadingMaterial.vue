<template>
  <!-- Document Details Section -->
  <div v-if="documentDetails" class="mb-6">
    <!-- All Content in Expansion Panels -->
    <v-expansion-panels variant="accordion">
      <!-- Theory Content Panels -->
      <v-expansion-panel
        v-for="(theory, theoryIndex) in documentDetails.theoryContent"
        :key="`theory-${theoryIndex}`"
        class="mb-4"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-icon color="primary" size="large" class="mr-4">mdi-book-open-variant</v-icon>
            <h2 class="text-h5 font-weight-bold">{{ theory.title }}</h2>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card class="border-card overflow-hidden" elevation="1">
            <v-card-text class="px-6 pt-4 pb-6">
              <!-- Theory Description -->
              <div
                v-for="(desc, descIndex) in theory.description"
                :key="`desc-${descIndex}`"
                class="mb-4"
              >
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
                    :key="`example-${exampleIndex}`"
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
                        <p class="text-body-2 text-medium-emphasis">
                          {{ example.explanation }}
                        </p>
                      </v-sheet>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>
            </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Practical Guide Panel -->
      <v-expansion-panel
        v-if="documentDetails.practicalGuide && documentDetails.practicalGuide.length"
        class="mb-4"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-icon color="error" size="large" class="mr-4">mdi-lightbulb-on</v-icon>
            <h2 class="text-h5 font-weight-bold">
              {{ documentDetails.practicalGuide[0].title }}
            </h2>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card class="border-card overflow-hidden" elevation="1">
            <v-card-text class="px-6 pt-4 pb-6">
              <v-row>
                <v-col cols="6">
                  <h3 class="text-subtitle-1 font-weight-bold mb-3">Steps</h3>
                  <v-list density="compact" class="bg-transparent pa-0">
                    <v-list-item
                      v-for="(step, stepIndex) in documentDetails.practicalGuide[0].steps"
                      :key="`step-${stepIndex}`"
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
                      :key="`error-${errorIndex}`"
                      prepend-icon="mdi-alert-circle"
                      color="error"
                      class="px-0 py-2"
                    >
                      <v-list-item-title class="text-body-2 text-error">
                        {{ error.split("–")[0] }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- Summary Panel -->
      <v-expansion-panel v-if="documentDetails.summaryAndReview" class="mb-4">
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-icon color="primary" size="large" class="mr-4">mdi-file-document-edit</v-icon>
            <h2 class="text-h5 font-weight-bold">Summary</h2>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card class="border-card overflow-hidden" elevation="1">
            <v-card-text class="px-6 pt-4 pb-6">
              <v-list density="compact" class="bg-transparent pa-0">
                <v-list-item
                  v-for="(point, pointIndex) in documentDetails.summaryAndReview.keyPoints"
                  :key="`point-${pointIndex}`"
                  prepend-icon="mdi-check-circle"
                  class="px-0 py-2"
                >
                  <v-list-item-title class="text-body-2">{{ point }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- References Panel -->
      <v-expansion-panel
        v-if="documentDetails.references && documentDetails.references.length"
        class="mb-4"
      >
        <v-expansion-panel-title>
          <div class="d-flex align-center">
            <v-icon color="primary" size="large" class="mr-4">mdi-link-variant</v-icon>
            <h2 class="text-h5 font-weight-bold">References</h2>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card class="border-card overflow-hidden" elevation="1">
            <v-card-text class="px-6 pt-4 pb-6">
              <v-list density="compact" class="bg-transparent pa-0">
                <v-list-item
                  v-for="(ref, refIndex) in documentDetails.references"
                  :key="`ref-${refIndex}`"
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
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, inject } from "vue";
import { moduleService } from "@/services/module";
import { DocumentResponse } from "@/types/Document";

const props = defineProps({
  moduleId: {
    type: String,
    required: true,
  },
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
  font-family: "Courier New", monospace;
}

.border-left-secondary {
  border-left: 4px solid rgb(var(--v-theme-secondary));
}
</style>