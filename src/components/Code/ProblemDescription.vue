<template>
  <v-sheet class="d-flex flex-column" style="height: 100vh; overflow: hidden;">
    <v-tabs v-model="descriptionTab" bg-color="grey-darken-4">
      <v-tab value="description">Description</v-tab>
      <v-tab value="submission">Submission</v-tab>
      <v-tab value="coding-assistant">Coding assistant</v-tab>
    </v-tabs>

    <v-card-text v-if="descriptionTab === 'description'" class="problem-description pa-4 flex-grow-1 overflow-y-auto">
      <div v-html="problemDescription"></div>
    </v-card-text>
    
    <v-card-text v-else-if="descriptionTab === 'submission'" class="pa-4">
      <!-- Use the SubmissionList component without passing submissions prop -->
      <SubmissionList :programmingExerciseId="exerciseId" />
    </v-card-text>

    <v-card-text v-else class="chat-container d-flex flex-column flex-grow-1 pa-0">
      <div
        class="chat-messages-container flex-grow-1 overflow-y-auto px-4 py-2"
        ref="chatContainer"
      >
        <!-- Existing messages -->
        <div v-for="(message, index) in messages" :key="index" class="chat-line">
          <div class="sender" :class="message.role">
            {{ message.role === 'user' ? 'You' : 'Codemate Assistant' }}
          </div>

          <div
            class="message-content"
            v-if="message.role === 'assistant'"
            v-html="renderMarkdown(message.content)"
          ></div>

          <span
            class="message-content"
            v-else
          >{{ message.content }}</span>
        </div>

        <!-- Streaming buffer (AI is typing) -->
        <div v-if="streamingBuffer" class="chat-line">
          <span class="sender assistant">Codemate Assistant</span>
          <div
            class="message-content"
            v-html="renderMarkdown(streamingBuffer)"
          ></div>
        </div>

        <!-- Thinking indicator -->
        <div v-if="isThinking" class="chat-line">
          <span class="sender assistant">Codemate Assistant</span>
          <div class="message-content">
            Thinking<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
          </div>
        </div>

        <div ref="chatBottom"></div>
      </div>

      <div class="chat-input d-flex align-center pa-2 rounded-lg">
        <v-text-field
          v-model="inputMessage"
          placeholder="Ask Codemate assistant..."
          variant="solo"
          density="comfortable"
          hide-details
          bg-color="grey-darken-3"
          color="grey-lighten-2"
          class="flex-grow-1"
          rounded
          :style="{ color: '#fff' }"
          @keydown.enter="sendMessage"
        />

        <v-btn
          @click="sendMessage"
          icon
          color="primary"
          variant="flat"
          class="ml-2"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { llmCodeServices } from '@/services/llmCodeServices';
import type { ChatMessage } from '@/types/chat';
import SubmissionList from '@/components/Code/SubmissionList.vue';
import { streamFromApi } from '@/common/api.service';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface RouteParams {
  exerciseId: string;
}
const route = useRoute();
const {exerciseId} = route.params as RouteParams;

// Create MarkdownIt instance with proper typing
const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: function(code: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`;
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  }
});

interface ProblemExample {
  title: string;
  input: {
    nums: string;
    target: string;
  };
  output: string;
  explanation?: string;
}

interface ProblemDescriptionProps {
  initialTab?: string;
}

interface ExerciseCodeResponseForStudent {
  question: string;
  difficulty: string;
  tags: string[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
}

const props = withDefaults(defineProps<ProblemDescriptionProps>(), {
  initialTab: 'description'
});

const emit = defineEmits<{
  (e: 'update:tab', tab: string): void;
}>();

const descriptionTab = ref<string>(props.initialTab);
const messages = ref<ChatMessage[]>([]);

watch(descriptionTab, async (newValue) => {
  emit('update:tab', newValue);
  if (newValue === 'coding-assistant' && messages.value.length === 0) {
    try {
      const res = await llmCodeServices.getMessageHistory(
        { 
          showError: (msg: string) => console.error(msg), 
          showSuccess: (msg: string) => console.log(msg) 
        }, 
        exerciseId
      );
      
      if (res && res.data) {
        messages.value = res.data;
        nextTick(scrollToBottom);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  }
});

const inputMessage = ref('');

function renderMarkdown(text: string): string {
  return md.render(text);
}

const isThinking = ref(false);
const streamingBuffer = ref('');

async function sendMessage() {
  const content = inputMessage.value.trim();
  if (!content) return;

  // Add user's message and clear input
  messages.value.push({ 
    id: 1, // Generate a temporary ID
    role: 'user', 
    content 
  });
  
  inputMessage.value = '';
  scrollToBottom();

  // Show thinking indicator
  isThinking.value = true;
  streamingBuffer.value = '';

  try {
    // Call the streamFromApi function. This will handle chunked responses.
    await streamFromApi(
      `exercises/code/${exerciseId}/conversation:invokeAssistant`,
      (chunk: string) => {
        streamingBuffer.value += chunk;
        scrollToBottom();
      },
      {
        method: "POST",
        body: {
          content: content,
          user_solution: "" // Pass along any existing user solution if needed.
        }
      }
    );
    
    // After the stream is complete, add the full response as an assistant message.
    messages.value.push({ 
      id: 1, // Generate a temporary ID
      role: 'assistant', 
      content: streamingBuffer.value 
    });
  } catch (error) {
    // Handle any errors from the API call.
    messages.value.push({
      id: 1, // Generate a temporary ID
      role: 'assistant',
      content: "An error occurred while fetching the response. Please try again."
    });
    console.error("Error invoking API:", error);
  } finally {
    // Clear indicators regardless of success or failure.
    isThinking.value = false;
    streamingBuffer.value = '';
    scrollToBottom();
  }
}

const chatBottom = ref<null | HTMLElement>(null);
const chatContainer = ref<null | HTMLElement>(null);

function scrollToBottom() {
  nextTick(() => {
    const container = chatContainer.value;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
}

const problemDescription = ref('');

onMounted(async () => {
  try {
    const response = await axios.get<{ data: ExerciseCodeResponseForStudent }>(
      `exercises/${exerciseId}/code`
    );

    if (response.data && response.data.data) {
      const exerciseObject = response.data.data;
      problemDescription.value = exerciseObject.description;
      console.log("Exercise object:", exerciseObject);
    }
  } catch (err) {
    console.error('Failed to load exercise', err);
  }
});
</script>

<style scoped>
.problem-description {
  overflow-y: auto;
}

.chat-container {
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: "JetBrains Mono", "Fira Code", monospace;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.chat-messages-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
  max-height: 100%;
}

.chat-messages {
  display: flex;
  flex-direction: column;
}

.chat-line {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #333;
}

.chat-line:last-child {
  border-bottom: none;
}

.sender {
  font-size: 0.75rem;
  font-weight: bold;
  color: #888;
  margin-bottom: 2px;
}

.sender.user {
  color: #4fc3f7; /* Blue for user */
}

.sender.assistant {
  color: #81c784; /* Green for assistant */
}

.message-content pre {
  background-color: #2d2d2d;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin-top: 8px;
}

.message-content code {
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: #ccc;
}

.dot {
  animation: blink 1s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.chat-messages-container::-webkit-scrollbar {
  width: 8px;
}

.chat-messages-container::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages-container::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
  transition: background-color 0.3s;
}

.chat-messages-container::-webkit-scrollbar-thumb:hover {
  background-color: #888;
}

:deep(.problem-description) h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

:deep(.problem-description) ul {
  padding-left: 1.5rem;
  list-style-type: disc;
  margin-bottom: 1rem;
}

:deep(.problem-description) li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}
</style>