<template>
  <v-sheet class="d-flex flex-column" style="height: 100vh; overflow: hidden;">
    <v-tabs v-model="descriptionTab" bg-color="grey-darken-4">
      <v-tab value="description">Description</v-tab>
      <v-tab value="submission">Submission</v-tab>
      <v-tab value="coding-assistant">Coding assistant</v-tab>
    </v-tabs>

    <v-card-text v-if="descriptionTab === 'description'" class="problem-description pa-4 flex-grow-1 overflow-y-auto">
      <div v-html="props.problemDescription"></div>
    </v-card-text>

    <v-card-text v-else-if="descriptionTab === 'submission'" class="pa-4 flex-grow-1 overflow-y-auto">
      <!-- Use the SubmissionList component without passing submissions prop -->
      <SubmissionList
        :programmingExerciseId="exerciseId"
        @update:submissionCount="submissionCount = $event"
      />
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
        <v-textarea
          v-model="inputMessage"
          placeholder="Ask assistant (Shift+Enter to send)"
          variant="solo"
          density="comfortable"
          hide-details
          bg-color="grey-darken-3"
          color="grey-lighten-2"
          class="flex-grow-1"
          rounded
          :style="{ color: '#fff' }"
          auto-grow
          rows="1"
          @keydown="handleKeydown"
        />

        <v-btn
          @click="handleSendingMessage"
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
import SubmissionList from '@/components/Code/SubmissionList.vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { useProblemAssistant } from '@/composables/useProblemAssistant';
import { useCodeEditorStore } from '@/composables/useCodeEditor';

interface RouteParams {
  exerciseId: string;
}

interface ProblemDescriptionProps {
  initialTab?: string;
  problemDescription?: string;
  userSolution?: string;
}

const { code, selectedLanguage } = useCodeEditorStore();

const props = withDefaults(defineProps<ProblemDescriptionProps>(), {
  initialTab: 'description'
});

const route = useRoute();
const {exerciseId} = route.params as RouteParams;

const {
  messages,
  inputMessage,
  isThinking,
  streamingBuffer,
  renderMarkdown,
  sendMessage,
  fetchHistory
} = useProblemAssistant(exerciseId);

onMounted(() => {
  console.log(props.problemDescription);
});

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

const emit = defineEmits<{
  (e: 'update:tab', tab: string): void;
}>();

const descriptionTab = ref<string>(props.initialTab);
const submissionCount = ref(0);

watch(descriptionTab, async (tab) => {
  emit('update:tab', tab);
  if (tab === 'coding-assistant' && messages.value.length === 0) {
    await fetchHistory();
  }
});

const chatBottom = ref<null | HTMLElement>(null);
const chatContainer = ref<null | HTMLElement>(null);

// Watch messages array for changes and scroll to bottom
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

// Watch streaming buffer for continuous scrolling during text streaming
watch(streamingBuffer, () => {
  scrollToBottom();
});

function scrollToBottom() {
  nextTick(() => {
    const container = chatContainer.value;
    if (container) {
      const scrollOptions: ScrollToOptions = {
        top: container.scrollHeight,
        behavior: 'smooth'
      };
      container.scrollTo(scrollOptions);
    }
  });
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault();
    sendMessage(code.value, selectedLanguage.value);
  }
}

const handleSendingMessage = async () => {
console.log(code.value);
  await sendMessage(code.value, selectedLanguage.value);
}
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
  scroll-behavior: smooth;
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
