<template>
  <v-container fluid class="my-8">
    <v-card class="p-6" elevation="0">
      <h1 class="text-2xl font-bold mb-4">{{ doc.name }}</h1>

      <!-- Theory Content -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold mb-2">1. Theory Content</h2>
        <v-divider class="mb-4"></v-divider>
        <div v-for="content in doc.theoryContent" :key="content.title" class="mb-6">
          <h3 class="text-lg font-medium mb-1">{{ content.title }}</h3>
          <p class="text-gray-700 mb-1">
            <strong>Prerequisites:</strong> {{ content.prerequisites.join(", ") }}
          </p>
         
          <div class="text-gray-700 mb-3">
            <h4 class="font-medium mb-2">Description:</h4>
            <ul class="px-4">
              <li v-for="line in content.description" :key="line" class="mb-2">{{ line }}</li>
            </ul>
          </div>

          <div v-if="content.examples && content.examples.length" class="ml-4">
            <!-- <h4 class="font-medium mb-2">Examples:</h4> -->
            <v-card v-for="example in content.examples" :key="example.title" class="p-4 mb-3 ">
              <v-card-subtitle class="font-semibold px-2 pt-2">{{ example.title }}</v-card-subtitle>
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
        <h2 class="text-xl font-semibold mb-2">2. Practical Guide</h2>
        <v-divider class="mb-4"></v-divider>
        <div v-for="guide in doc.practicalGuide" :key="guide.title" class="mb-6 ">
          <h3 class="text-lg font-medium mb-1">{{ guide.title }}</h3>
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
        <h2 class="text-xl font-semibold mb-2">3. References</h2>
        <v-divider class="mb-4"></v-divider>
        <v-card v-for="ref in doc.references" :key="ref.title" class="p-4 mb-3 pa-2">
          <h4 class="font-semibold">{{ ref.title }}</h4>
          <p class="text-gray-700">{{ ref.description }}</p>
          <a :href="ref.link" target="_blank" class="text-blue-500 underline">View Reference</a>
        </v-card>
      </section>

      <!-- Summary and Review -->
      <section>
        <h2 class="text-xl font-semibold mb-2">4. Summary and Review</h2>
        <v-divider class="mb-4"></v-divider>
        <h3 class="text-lg font-medium mb-1">Key Points:</h3>
        <div class="px-4">
          <ul class="list-disc pl-5 text-gray-700 mb-4">
            <li v-for="point in doc.summaryAndReview.keyPoints" :key="point">{{ point }}</li>
          </ul>
        </div>
        <h3 class="text-lg font-medium mb-1">Review Questions:</h3>
        <div class="px-4">
          <ul class="list-decimal pl-5 text-gray-700 mb-4">
            <li v-for="question in doc.summaryAndReview.reviewQuestions" :key="question">{{ question }}</li>
          </ul>
        </div>
        
        <!-- <a v-if="doc.summaryAndReview.quizLink" :href="doc.summaryAndReview.quizLink" target="_blank" class="text-blue-500 underline">
          Take the Quiz
        </a> -->
      </section>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { documentData } from "@/constants/document";
import { Document } from "@/types/Document";
const doc = ref<Document>(documentData);
</script>
