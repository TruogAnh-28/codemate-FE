<template>
  <div class="monaco-editor-container">
    <div ref="editorContainer" style="height: 500px; width: 100%;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

const editorContainer = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: '// Type your code here\nconsole.log("Hello World!");',
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      lineNumbers: 'on',
      readOnly: false,
      cursorStyle: 'line',
      folding: true,
    })
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})

// Expose editor instance if needed
defineExpose({
  getEditor: () => editor
})
</script>

<style scoped>
.monaco-editor-container {
  padding: 1rem;
  border-radius: 4px;
  background-color: #1e1e1e;
}
</style>