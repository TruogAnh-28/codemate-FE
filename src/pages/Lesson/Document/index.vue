<template>
  <v-container v-if="document" fluid class="px-4 md:px-8 lg:px-12">
    <v-breadcrumbs
      class="ma-0 pa-0 mb-4"
      :items="breadcrumbs"
      divider="/"
    ></v-breadcrumbs>

    <v-card class="p-6 rounded-lg shadow-sm" elevation="1" v-if="document">
      <h1 class="text-2xl font-bold mb-6 text-indigo-800">
        {{ document.name }}
      </h1>

      <!-- Theory Content -->
      <section class="mb-8">
        <div class="flex items-center mb-4">
          <v-icon color="indigo" class="mr-2">mdi-book-open-variant</v-icon>
          <h2 class="text-xl font-bold text-indigo-700">1. Theory Content</h2>
        </div>
        <v-divider class="mb-6"></v-divider>

        <v-expansion-panels variant="accordion" class="mb-4">
          <v-expansion-panel
            v-for="(content, index) in document.theoryContent"
            :key="index"
            class="mb-4 rounded-lg overflow-hidden border border-gray-200"
          >
            <v-expansion-panel-title class="bg-gray-50">
              <div class="font-bold text-lg text-indigo-700">
                {{ content.title ?? "N/a" }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <div class="p-2">
                <v-chip-group class="mb-4">
                  <v-chip
                    v-for="prereq in content.prerequisites"
                    :key="prereq"
                    color="indigo-lighten-4"
                    class="mr-2"
                  >
                    {{ prereq }}
                  </v-chip>
                </v-chip-group>

                <div class="mb-6">
                  <h4 class="text-lg font-semibold mb-3 text-gray-800">
                    Description
                  </h4>
                  <div
                    v-for="(line, lineIndex) in content.description"
                    :key="lineIndex"
                    class="mb-3 text-gray-700 text-justify leading-relaxed"
                  >
                    {{ line }}
                  </div>
                </div>

                <div v-if="content.examples && content.examples.length">
                  <h4 class="text-lg font-semibold mb-3 text-gray-800">
                    Examples
                  </h4>
                  <v-card
                    v-for="(example, exIndex) in content.examples"
                    :key="exIndex"
                    class="mb-4 rounded-lg overflow-hidden border border-gray-200"
                    elevation="0"
                  >
                    <v-card-title
                      class="bg-indigo-50 text-indigo-800 py-3 px-4 text-base font-semibold"
                    >
                      {{ example.title }}
                    </v-card-title>

                    <v-card-text class="pt-4 pb-2 px-4">
                      <p class="text-gray-700">{{ example.explanation }}</p>
                    </v-card-text>

                    <div v-if="example.codeSnippet" class="px-4 pb-4">
                      <v-sheet
                        class="bg-gray-900 p-4 rounded-md overflow-x-auto"
                      >
                        <pre
                          class="text-gray-100 font-mono text-sm"
                        ><code>{{ example.codeSnippet }}</code></pre>
                      </v-sheet>
                    </div>
                  </v-card>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </section>

      <!-- Practical Guide -->
      <section class="mb-8">
        <div class="flex items-center mb-4">
          <v-icon color="green-darken-1" class="mr-2">mdi-tools</v-icon>
          <h2 class="text-xl font-bold text-green-700">2. Practical Guide</h2>
        </div>
        <v-divider class="mb-6"></v-divider>

        <v-expansion-panels variant="accordion">
          <v-expansion-panel
            v-for="(guide, index) in document.practicalGuide"
            :key="index"
            class="mb-4 rounded-lg overflow-hidden border border-gray-200"
          >
            <v-expansion-panel-title class="bg-green-50">
              <div class="font-bold text-lg text-green-700">
                {{ guide.title }}
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <div class="p-4">
                <h4 class="text-lg font-semibold mb-3 text-gray-800">
                  Implementation Steps
                </h4>
                <div class="mb-6 pl-4 border-l-4 border-green-200">
                  <ol class="list-decimal pl-6 space-y-3">
                    <li
                      v-for="(step, stepIndex) in guide.steps"
                      :key="stepIndex"
                      class="text-gray-700"
                    >
                      {{ step }}
                    </li>
                  </ol>
                </div>

                <div v-if="guide.commonErrors && guide.commonErrors.length">
                  <h4 class="text-lg font-semibold mb-3 text-red-600">
                    Common Errors to Avoid
                  </h4>
                  <v-alert
                    v-for="(error, errorIndex) in guide.commonErrors"
                    :key="errorIndex"
                    type="warning"
                    variant="tonal"
                    border="start"
                    class="mb-3"
                  >
                    {{ error }}
                  </v-alert>
                </div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </section>

      <!-- References -->
      <section class="mb-8">
        <div class="flex items-center mb-4">
          <v-icon color="blue-darken-1" class="mr-2">mdi-link-variant</v-icon>
          <h2 class="text-xl font-bold text-blue-700">3. References</h2>
        </div>
        <v-divider class="mb-6"></v-divider>

        <v-row>
          <v-col
            v-for="(ref, index) in document.references"
            :key="index"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card
              class="h-full rounded-lg border border-gray-200"
              elevation="0"
              hover
            >
              <v-card-title class="bg-blue-50 text-blue-800 py-3 px-4">
                {{ ref.title }}
              </v-card-title>
              <v-card-text class="pt-4">
                <p class="text-gray-700 mb-4">{{ ref.description }}</p>
                <v-btn
                  :href="ref.link"
                  target="_blank"
                  color="blue"
                  variant="text"
                  class="px-0"
                  prepend-icon="mdi-open-in-new"
                >
                  View Reference
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- Summary and Review -->
      <section>
        <div class="flex items-center mb-4">
          <v-icon color="amber-darken-2" class="mr-2">mdi-star</v-icon>
          <h2 class="text-xl font-bold text-amber-700">
            4. Summary and Review
          </h2>
        </div>
        <v-divider class="mb-6"></v-divider>

        <v-card
          class="mb-6 rounded-lg bg-amber-50 border border-amber-200"
          elevation="0"
        >
          <v-card-title class="text-amber-800">Key Points</v-card-title>
          <v-card-text>
            <ul class="list-disc pl-6 space-y-2">
              <li
                v-for="(point, index) in document.summaryAndReview?.keyPoints"
                :key="index"
                class="text-gray-700"
              >
                {{ point }}
              </li>
            </ul>
          </v-card-text>
        </v-card>

        <div v-if="document.summaryAndReview?.reviewQuestions?.length">
          <h3 class="text-lg font-semibold mb-4 text-amber-800">
            Review Questions
          </h3>

          <v-expansion-panels variant="accordion">
            <v-expansion-panel
              v-for="(question, index) in document.summaryAndReview
                .reviewQuestions"
              :key="question.id"
              class="mb-3 rounded-lg overflow-hidden border border-gray-200"
            >
              <v-expansion-panel-title class="bg-amber-50">
                <div class="font-medium">{{ question.question }}</div>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <div class="p-4">
                  <v-textarea
                    v-model="userAnswers[index]"
                    variant="outlined"
                    rows="3"
                    placeholder="Enter your answer here"
                    class="mb-4"
                  ></v-textarea>

                  <div class="flex justify-between items-center">
                    <v-btn
                      v-if="!answerSubmitted[index]"
                      @click="submitAnswer(index)"
                      color="amber-darken-2"
                      variant="elevated"
                    >
                      Submit Answer
                    </v-btn>

                    <div v-if="answerSubmitted[index]" class="text-gray-700">
                      <div class="flex items-center mb-2">
                        <span class="font-semibold mr-2">Your Score:</span>
                        <v-chip
                          :color="
                            getScoreColor(question.score, question.maxscore)
                          "
                        >
                          {{ question.score || 0 }} / {{ question.maxscore }}
                        </v-chip>
                      </div>
                      <div>
                        <span class="font-semibold block mb-1"
                          >Correct Answer:</span
                        >
                        <p
                          class="bg-green-50 p-3 rounded-lg border border-green-200"
                        >
                          {{ question.answer }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </section>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>

  <v-container v-else fluid class="px-12">
    <v-skeleton-loader type="article, actions" class="mt-4"></v-skeleton-loader>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import { moduleService } from "@/services/module";
import { DocumentResponse } from "@/types/Document";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { Breadcrumbs } from "@/types/Breadcrumbs";

interface RouteParams {
  moduleId: string;
}

// State
const document = ref<DocumentResponse | null>(null);
const route = useRoute();
const userAnswers = ref<string[]>([]);
const answerSubmitted = ref<boolean[]>([]);
const snackbar = ref({
  show: false,
  text: "",
  color: "success",
});

// Get route params
const { moduleId } = route.params as RouteParams;

// Breadcrumbs
const breadcrumbsStore = useBreadcrumbsStore();
const routeState = computed(() => {
  const state = (route as any & { state?: { breadcrumbs?: Breadcrumbs[] } })
    .state;
  return state?.breadcrumbs ? { breadcrumbs: state.breadcrumbs } : {};
});

// Set breadcrumbs if available
if (routeState.value.breadcrumbs) {
  breadcrumbsStore.setBreadcrumbs(routeState.value.breadcrumbs);
}

const breadcrumbs = computed(() => breadcrumbsStore.breadcrumbs);

// Injected methods
const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;

// Methods
const submitAnswer = (index: number) => {
  if (!document.value?.summaryAndReview?.reviewQuestions) return;

  const question = document.value.summaryAndReview.reviewQuestions[index];
  const userAnswer = userAnswers.value[index]?.trim().toLowerCase() || "";

  // Simple string comparison (could be enhanced with more sophisticated matching)
  const correctAnswer = question.answer.toLowerCase();
  question.score = userAnswer === correctAnswer ? question.maxscore : 0;

  // Mark as submitted
  answerSubmitted.value[index] = true;

  // Show feedback
  snackbar.value = {
    show: true,
    text:
      question.score > 0
        ? "Correct answer!"
        : "Not quite right. Review the correct answer.",
    color: question.score > 0 ? "success" : "error",
  };

  return question.score;
};

const getScoreColor = (score: number | null, maxScore: number): string => {
  if (score === null) return "gray";
  return score === maxScore ? "success" : "error";
};

const fetchDocumentDetails = async () => {
  try {
    if (moduleId) {
      const response = await moduleService.fetchDocumentDetails(
        { showError, showSuccess },
        moduleId
      );
      if (response && "data" in response) {
        document.value = response.data as DocumentResponse;
        console.log("Fetched document:", document.value);

        // Initialize answer arrays if we have review questions
        if (document.value?.summaryAndReview?.reviewQuestions) {
          userAnswers.value = new Array(
            document.value.summaryAndReview.reviewQuestions.length
          ).fill("");
          answerSubmitted.value = new Array(
            document.value.summaryAndReview.reviewQuestions.length
          ).fill(false);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching document details:", error);
    showError("Failed to fetch document details. Please try again later.");
  }
};

// Lifecycle hooks
onMounted(fetchDocumentDetails);
</script>

<style scoped>
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
}
</style>
