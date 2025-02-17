<template>
  <div class="relative">
    <input
      ref="fileInput"
      type="file"
      multiple
      accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
      @change="handleFileSelect"
      class="hidden"
    />
    
    <div
      @click="openFileDialog"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      class="border-2 border-dashed rounded-lg p-12 transition-colors cursor-pointer"
      :class="isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-400 hover:border-gray-600'"
    >
      <div class="flex flex-col items-center">
        <svg class="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="text-lg text-gray-600">{{ isDragging ? 'Drop files here' : 'Drag and drop files here' }}</p>
        <p class="text-sm text-gray-500">or click to browse</p>
        <p class="text-xs text-gray-400 mt-2">Accepted: PDF, Word, Excel, PowerPoint, Text</p>
      </div>
    </div>
    
    <ul v-if="files.length" class="mt-4 space-y-2">
      <li 
        v-for="(file, index) in files" 
        :key="index"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" :class="getFileIconColor(file)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span 
            class="text-blue-600 cursor-pointer hover:underline"
            @click="previewFile(file)"
          >
            {{ file.name }}
            <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
          </span>
        </div>
        <button
          @click.stop="removeFile(index)"
          class="text-gray-500 hover:text-red-500"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </li>
    </ul>

    <!-- File Preview Modal -->
    <div 
      v-if="showPreview" 
      class="fixed inset-0 bg-black z-50 flex flex-col"
    >
      <!-- Preview Header -->
      <div class="bg-white p-4 flex justify-between items-center shadow-lg">
        <h3 class="text-lg font-medium">{{ currentFile?.name }}</h3>
        <div class="flex items-center space-x-4">
          <button
            v-if="canPreviewInBrowser"
            @click="toggleFullscreen"
            class="text-gray-600 hover:text-gray-800"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="isFullscreen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20h6M4 9v6m16-6v6" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14h6m-6-4h6m6 0h4m-4 4h4" />
            </svg>
          </button>
          <button
            @click="closePreview"
            class="text-gray-600 hover:text-gray-800"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Preview Content -->
      <div class="flex-1 bg-gray-800 relative">
        <div v-if="!canPreviewInBrowser" class="flex flex-col items-center justify-center h-full bg-white">
          <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <p class="text-lg text-gray-600">Preview not available</p>
          <a 
            :href="previewUrl" 
            download
            class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Download File
          </a>
        </div>
        <iframe
          v-else
          ref="previewFrame"
          :src="previewUrl"
          class="w-full h-full"
          :class="{ 'fullscreen': isFullscreen }"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref(null);
const previewFrame = ref(null);
const isDragging = ref(false);
const files = ref([]);
const showPreview = ref(false);
const previewUrl = ref('');
const canPreviewInBrowser = ref(true);
const isFullscreen = ref(false);
const currentFile = ref(null);

// Allowed file types and their extensions
const allowedTypes = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/plain': 'txt'
};

watch(files, (newFiles) => {
  emit('update:modelValue', newFiles);
}, { deep: true });

const handleFileSelect = (event) => {
  const newFiles = Array.from(event.target.files);
  addFiles(newFiles);
};

const handleDrop = (event) => {
  isDragging.value = false;
  const newFiles = Array.from(event.dataTransfer.files);
  addFiles(newFiles);
};

const addFiles = (newFiles) => {
  const validFiles = newFiles.filter(file => {
    const isValidType = Object.keys(allowedTypes).includes(file.type);
    if (!isValidType) {
      console.warn(`File type not allowed: ${file.type}`);
    }
    return isValidType;
  });
  
  if (validFiles.length !== newFiles.length) {
    alert('Some files are not accepted. Only PDF, Word, Excel, PowerPoint and Text files are allowed.');
  }
  
  files.value = [...files.value, ...validFiles];
};

const removeFile = (index) => {
  files.value = files.value.filter((_, i) => i !== index);
};

const getFileIconColor = (file) => {
  const extension = file.name.split('.').pop().toLowerCase();
  const colors = {
    pdf: 'text-red-500',
    doc: 'text-blue-500',
    docx: 'text-blue-500',
    txt: 'text-gray-500',
    ppt: 'text-orange-500',
    pptx: 'text-orange-500',
    xls: 'text-green-500',
    xlsx: 'text-green-500'
  };
  return colors[extension] || 'text-gray-500';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const previewFile = (file) => {
  currentFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
  canPreviewInBrowser.value = file.type === 'application/pdf' || file.type === 'text/plain';
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
  isFullscreen.value = false;
  URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = '';
  currentFile.value = null;
};

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await previewFrame.value.requestFullscreen();
    isFullscreen.value = true;
  } else {
    await document.exitFullscreen();
    isFullscreen.value = false;
  }
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

const openFileDialog = () => {
  fileInput.value.click();
};
</script>

<style scoped>
.hidden {
  display: none;
}

.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}
</style>