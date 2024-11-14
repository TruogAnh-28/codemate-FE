<template>
  <v-dialog v-model="internalShowModal" max-width="600">
    <v-card>
      <v-card-title class="text-heading-4">Documents</v-card-title>
      <v-card-subtitle class="pb-4">
        The following documents are available for this lesson:
      </v-card-subtitle>

      <v-divider></v-divider>

      <!-- Document List -->
      <v-list v-if="documents.length">
        <v-list-item
          v-for="document in documents"
          :key="document.id"
          :value="document.id"
          class="my-2"
        >
          <template v-slot:prepend>
            <v-avatar class="mr-3" rounded="0" size="64">
              <component
                :is="renderFileTypeIcon(document.type)"
                class="w-full h-full object-contain"
              />
            </v-avatar>
          </template>

          <v-list-item-title class="text-body-large-1 font-semibold">
            {{ document.name }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-body-base-1 text-blue-600">
            <a
              :href="document.documentUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ document.documentUrl }}
            </a>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <!-- No Documents Available -->
      <v-list v-else>
        <v-list-item>
          <v-list-item-title>
            No documents available for this lesson.
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="primary" @click="closeModal">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { renderFileTypeIcon } from "@/utils/functions/render";
import { Document } from "@/types/Course";

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
  documents: {
    type: Array as () => Document[],
    required: true,
  },
});

const emit = defineEmits(["update:showModal"]);

const internalShowModal = ref(props.showModal);

// Watch for changes in the showModal prop
watch(
  () => props.showModal,
  (newValue: boolean) => {
    internalShowModal.value = newValue;
  }
);

// Watch for changes in the internal value
watch(internalShowModal, (newValue: boolean) => {
  if (newValue !== props.showModal) {
    emit("update:showModal", newValue);
  }
});

const closeModal = () => {
  emit("update:showModal", false);
};
</script>
