import { ref } from 'vue';
import { streamFromApi } from '@/common/api.service';
import type { ChatMessage } from '@/types/chat';
import { llmCodeServices } from '@/services/llmCodeServices';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

export function useProblemAssistant(exerciseId: string, userSolution: string) {
  const messages = ref<ChatMessage[]>([]);
  const inputMessage = ref('');
  const isThinking = ref(false);
  const streamingBuffer = ref('');

  const md: MarkdownIt = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    highlight(code, lang) {
      return hljs.getLanguage(lang)
        ? `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`
        : `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
    }
  });

  const renderMarkdown = (text: string): string => md.render(text);

  const fetchHistory = async () => {
    const res = await llmCodeServices.getMessageHistory({ showError: console.error }, exerciseId);
    if (res?.data) messages.value = res.data;
  };

  const sendMessage = async () => {
    const content = inputMessage.value.trim();
    if (!content) return;

    messages.value.push({ id: 1, role: 'user', content });
    inputMessage.value = '';
    isThinking.value = true;
    streamingBuffer.value = '';

    try {
      await streamFromApi(
        `exercises/code/${exerciseId}/conversation:invokeAssistant`,
        (chunk: string) => (streamingBuffer.value += chunk),
        {
          method: "POST",
          body: {
            content,
            user_solution: userSolution
          }
        }
      );

      messages.value.push({ id: 1, role: 'assistant', content: streamingBuffer.value });
    } catch (error) {
      messages.value.push({
        id: 1,
        role: 'assistant',
        content: "An error occurred. Please try again."
      });
      console.error(error);
    } finally {
      isThinking.value = false;
      streamingBuffer.value = '';
    }
  };

  return {
    messages,
    inputMessage,
    isThinking,
    streamingBuffer,
    renderMarkdown,
    sendMessage,
    fetchHistory
  };
}

