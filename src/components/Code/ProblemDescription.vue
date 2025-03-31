<template>
  <v-sheet class="d-flex flex-column fill-height">
    <v-tabs v-model="descriptionTab" bg-color="grey-darken-4">
      <v-tab value="description">Description</v-tab>
      <v-tab value="submission">Submission</v-tab>
      <v-tab value="coding-assistant">Coding assistant</v-tab>
    </v-tabs>

    <v-card-text v-if="descriptionTab === 'description'" class="problem-description pa-4 flex-grow-1 overflow-y-auto">
      <h2>Two sum</h2>
      <div class="problem-tags mb-4">
        <v-chip size="small" color="grey" class="mr-2">Easy</v-chip>
        <v-chip size="small" color="grey" class="mr-2">Array</v-chip>
        <v-chip size="small" color="grey">Hash table</v-chip>
      </div>

      <p>{{ problemDescription }}</p>

      <div v-for="(example, index) in examples" :key="index" class="examples mt-4">
        <h3>{{ example.title }}</h3>
        <v-sheet color="grey-darken-3" class="pa-2 rounded">
          <p><strong>Input:</strong> nums = {{ example.input.nums }}, target = {{ example.input.target }}</p>
          <p><strong>Output:</strong> {{ example.output }}</p>
          <p v-if="example.explanation"><strong>Explanation:</strong> {{ example.explanation }}</p>
        </v-sheet>
      </div>

      <div class="constraints mt-4">
        <h3>Constraints:</h3>
        <ul>
          <li v-for="(constraint, index) in constraints" :key="index">{{ constraint }}</li>
        </ul>
      </div>
    </v-card-text>

    <v-card-text v-else class="chat-container d-flex flex-column flex-grow-1 pa-0">

    <div class="chat-messages-container flex-grow-1 overflow-y-auto px-4 py-2">
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
    </div>


    <div class="chat-input d-flex align-center pa-2 rounded-lg">
      <v-text-field
        v-model="inputMessage"
        placeholder="Ask Copilot..."
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
import { ref, watch } from 'vue';
import { PROBLEM_DESCRIPTION, PROBLEM_EXAMPLES, PROBLEM_CONSTRAINTS } from '@/constants/templateProblem';

import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight(code, lang) {
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

const props = withDefaults(defineProps<ProblemDescriptionProps>(), {
  initialTab: 'description'
});

const emit = defineEmits<{
  (e: 'update:tab', tab: string): void;
}>();

const descriptionTab = ref<string>(props.initialTab);
const problemDescription = ref<string>(PROBLEM_DESCRIPTION);
const examples = ref<ProblemExample[]>(PROBLEM_EXAMPLES);
const constraints = ref<string[]>(PROBLEM_CONSTRAINTS);

// Watch for tab changes and emit event
watch(descriptionTab, (newValue) => {
  emit('update:tab', newValue);
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const messages = ref<ChatMessage[]>([
  { role: 'assistant', content: 'Hi! How can I help you solve this problem?' },
  { role: 'user', content: 'Can you explain the two sum algorithm?' },
  { role: 'assistant', content: '## Description Sure! The idea is to use a hash map to track the numbers you’ve seen and their indices...' }
]);

const inputMessage = ref('');

function renderMarkdown(text: string) {
  return md.render(text);
}

const isThinking = ref(false);
const streamingBuffer = ref('');

async function sendMessage() {
  const content = inputMessage.value.trim();
  if (!content) return;

  // Add user's message
  messages.value.push({ role: 'user', content });
  inputMessage.value = '';

  // Show thinking indicator
  isThinking.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate "thinking..."

  isThinking.value = false;
  streamingBuffer.value = '';

  const fullResponse = `
Sure! Here's how **Two Sum** works:

\`\`\`ts
const map = new Map();
for (let i = 0; i < nums.length; i++) {
  const complement = target - nums[i];
  if (map.has(complement)) {
    return [map.get(complement), i];
  }
  map.set(nums[i], i);
}
\`\`\`

This solution runs in **O(n)** time using a hash map.
`;

  // Stream response character by character
  let current = '';
  for (let i = 0; i < fullResponse.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 15));
    current += fullResponse[i];
    streamingBuffer.value = current;
  }

  messages.value.push({ role: 'assistant', content: current });
  streamingBuffer.value = '';
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
}

.chat-messages-container {
  flex-grow: 1;
  overflow-y: auto;
  min-height: 0;
  max-height: 100%;
  display: flex;
  flex-direction: column;
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

</style>

