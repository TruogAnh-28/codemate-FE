import { ref, nextTick } from 'vue';
import { streamFromApi } from '@/common/api.service';
import type { ChatMessage } from '@/types/chat';
import { llmCodeServices } from '@/services/llmCodeServices';

export function useChatAssistant(exerciseId: string) {
  const messages = ref<ChatMessage[]>([]);
  const inputMessage = ref('');
  const streamingBuffer = ref('');
  const isThinking = ref(false);

  const scrollToBottom = (container: HTMLElement | null) => {
    nextTick(() => {
      if (container) container.scrollTop = container.scrollHeight;
    });
  };

  const loadHistory = async () => {
    const res = await llmCodeServices.getMessageHistory(
      { showError: console.error, showSuccess: console.log },
      exerciseId
    );
    if (res?.data) messages.value = res.data;
  };

  const sendMessage = async (userSolution: string, languageID: number, containerRef?: HTMLElement | null) => {
    const content = inputMessage.value.trim();
    if (!content) return;

    messages.value.push({ id: 1, role: 'user', content });
    inputMessage.value = '';
    streamingBuffer.value = '';
    isThinking.value = true;

    try {
      await streamFromApi(
        `exercises/code/${exerciseId}/conversation:invokeAssistant`,
        (chunk: string) => {
          streamingBuffer.value += chunk;
          scrollToBottom(containerRef);
        },
        {
          method: "POST",
          body: {
            content,
            user_solution: userSolution || "",
            language_id: languageID
          },
        }
      );

      messages.value.push({ id: 1, role: 'assistant', content: streamingBuffer.value });
    } catch (err) {
      console.error('Assistant error:', err);
      messages.value.push({
        id: 1,
        role: 'assistant',
        content: 'An error occurred while fetching the response.',
      });
    } finally {
      isThinking.value = false;
      streamingBuffer.value = '';
      scrollToBottom(containerRef);
    }
  };

  return {
    messages,
    inputMessage,
    streamingBuffer,
    isThinking,
    loadHistory,
    sendMessage,
  };
}

