<template class="tailwind-scope">
  <v-container fluid class="px-12">
    <v-breadcrumbs class="ma-0 pa-0"
      :items="breadcrumbs"
      divider="/"
    ></v-breadcrumbs>
    <v-card class="p-6" elevation="0" v-if="document" >
      <h1 class="text-heading-3 font-bold mb-4">{{ document.name}}</h1>
      <!-- Theory Content -->
      <section class="mb-8">
        <h2 class="text-heading-4 font-bold">1. Theory Content</h2>
        <v-divider class="mb-4"></v-divider>
        <div v-for="content in document.theoryContent" :key="content.title" class="mb-6">
          <h3 class="text-body-large-1 font-bold mb-1">{{ content.title }}</h3>
          <p class="text-body-base-1 mb-1">
            <strong>Prerequisites:</strong> {{ content.prerequisites.join(", ") }}
          </p>
         
          <div class="text-gray-700 mb-3">
            <h4 class="text-body-base-1 font-bold mb-2">Description:</h4>
            <ul class="px-4 text-body-base-1">
              <li v-for="line in content.description" :key="line" style="text-align: justify;">{{ line }}</li>
            </ul>
          </div>

          <div v-if="content.examples && content.examples.length" class="ml-4">
            <!-- <h4 class="font-medium mb-2">Examples:</h4> -->
            <v-card v-for="example in content.examples" :key="example.title" class="p-4 mb-3 ">
              <v-card-title class="font-semibold px-2 pt-2 pb-0">{{ example.title }}</v-card-title>
              <v-card-text class="text-gray-700 px-2 pt-1">{{ example.explanation }}</v-card-text>
              <pre v-if="example.codeSnippet" class="bg-gray-100 p-3 rounded mt-2">
<code>{{ example.codeSnippet }}</code>
              </pre>
            </v-card>
          </div>
        </div>
      </section>

      <!-- Practical Guide -->
      <section class="mb-8">
        <h2 class="text-heading-4 font-semibold mb-2">2. Practical Guide</h2>
        <v-divider class="mb-4"></v-divider>
        <div v-for="guide in document.practicalGuide" :key="guide.title" class="mb-6 ">
          <h3 class="text-body-large-1 font-medium mb-1">{{ guide.title }}</h3>
          <div class="px-4">
              <ul class="list-decimal pl-5 text-gray-700 mb-2 ">
                <li v-for="step in guide.steps" :key="step" class="">{{ step }}</li>
              </ul>
              <ul v-if="guide.commonErrors && guide.commonErrors.length" class="list-disc pl-5 text-red-500">
                <li v-for="error in guide.commonErrors" :key="error">Common Error: {{ error }}</li>
              </ul>
          </div>
          
        </div>
      </section>

      <!-- References -->
      <section class="mb-8">
        <h2 class="text-heading-4 font-semibold mb-2">3. References</h2>
        <v-divider class="mb-4"></v-divider>
        <v-card v-for="ref in document.references" :key="ref.title" class="p-4 mb-3 pa-2">
          <h4 class="font-semibold">{{ ref.title }}</h4>
          <p class="text-gray-700">{{ ref.description }}</p>
          <a :href="ref.link" target="_blank" class="text-blue-500 underline">View Reference</a>
        </v-card>
      </section>

      <!-- Summary and Review -->
      <section>
        <h2 class="text-heading-4 font-semibold mb-2">4. Summary and Review</h2>
        <v-divider class="mb-4"></v-divider>
        
        <h3 class="text-body-large-1 font-medium mb-1">Key Points:</h3>
        <div class="px-4">
          <ul class="list-disc pl-5 text-gray-700 mb-4">
            <li v-for="point in document.summaryAndReview.keyPoints" :key="point">{{ point }}</li>
          </ul>
        </div>

        <!-- <h3 class="text-body-large-1 font-medium mb-1">Review Questions:</h3>
        <div class="px-4">
          <ul class="list-decimal pl-5 text-gray-700 mb-4">
            <li v-for="(question, index) in document.summaryAndReview.reviewQuestions" :key="question.id" class="mb-6">
              <p class="font-semibold">{{ question.question }}</p>
              
              <textarea
                v-model="document.summaryAndReview.reviewQuestions[index].inputUser"
                class="w-full p-2 mt-2 border border-gray-300 rounded"
                rows="4"
                placeholder="Enter your answer here"
              ></textarea>
              <div class="text-right mt-2">
                <v-btn
                  @click="submitAnswer(index)"
                  color="primary"
                >
                  Submit
                </v-btn>
              </div>
              <div v-if="document.summaryAndReview.reviewQuestions[index].score !== undefined" class="mt-2">
                <p><strong>Your Score:</strong> {{ document.summaryAndReview.reviewQuestions[index].score }} / {{ question.maxscore }}</p>
                <p><strong>Explaination:</strong> {{ question.answer }}</p>
              </div>
            </li>
          </ul>
        </div> -->
      </section>
    </v-card>
  </v-container>
</template>
<script lang="ts" setup>
import { moduleService } from "@/services/module";
import { DocumentResponse } from "@/types/Document";
import { useBreadcrumbsStore } from "@/stores/breadcrumbs";
import { Breadcrumbs } from "@/types/Breadcrumbs";

interface RouteParams {
  moduleId: string;
}
const document = ref<DocumentResponse | null>();
const route = useRoute();

const {  moduleId } = route.params as RouteParams;

const breadcrumbsStore = useBreadcrumbsStore();
const routeState = computed(() => {
  const state = (route as any & { state?: { breadcrumbs?: Breadcrumbs[] } }).state;
  return state?.breadcrumbs ? { breadcrumbs: state.breadcrumbs } : {};
});

if (routeState.value.breadcrumbs) {
  breadcrumbsStore.setBreadcrumbs(routeState.value.breadcrumbs);
}

const breadcrumbs = computed(() => breadcrumbsStore.breadcrumbs);

// const submitAnswer = (index: number) => {
//   const question = doc.value.summaryAndReview.reviewQuestions[index];
//   const userAnswer = question.inputUser?.trim().toLowerCase() || "";
//   question.score = userAnswer === question.answer.toLowerCase() ? question.maxscore : 0;
//   return question.score;
// };

const showError = inject<(message: string) => void>("showError");

const fetchDocumentDetails = async () => {
  try {
    if (moduleId) {
      if (showError) {
        document.value = await moduleService.fetchDocumentDetails(showError, moduleId);
      }
    }
  } catch (error) {
    console.error("Error fetching document details:", error);
  }
};

onMounted(fetchDocumentDetails);
</script>