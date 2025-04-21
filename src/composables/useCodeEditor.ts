import { ref } from 'vue';

const code = ref('');
const selectedLanguage = ref<number>(54);

export const useCodeEditorStore = () => {
  return { code, selectedLanguage }
};
