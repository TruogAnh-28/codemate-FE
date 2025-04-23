<template>
  <v-row no-gutters align="center" class="p-6">
    <v-col cols="4" md="4" class="flex justify-center items-center pr-4">
      <div class="image-container">
        <template v-if="courseImage">
        <v-img
            class="flex-shrink-0 course-image"
           
            height="200px"
            :src="courseImage"
            cover
            @click="openImageUpload"
            :class="{ 'cursor-pointer': canEditImage }"
         >
          <template v-slot:error>
            <CourseInitialAvatar 
              :course-name="course.course_name" 
              @click.stop="openImageUpload" 
              :class="{ 'cursor-pointer': canEditImage }"
            />
          </template>
        </v-img>
      </template>
      <template v-else>
          <CourseInitialAvatar :course-name="course.course_name"
          @click.stop="openImageUpload" 
          :class="{ 'cursor-pointer': canEditImage }" />
      </template>
        
        <!-- Image Upload Dialog -->
        <v-dialog v-if="isProfessor" v-model="showImageUpload" max-width="500px">
          <v-card>
            <v-card-title class="d-flex align-center bg-primary text-white py-3 mb-4">
              <v-icon class="mr-2">mdi-image</v-icon>
              Upload Course Image</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="imageFile"
                accept="image/*"
                label="Select Image"
                prepend-icon="mdi-camera"
                show-size
                truncate-length="15"
              ></v-file-input>
              
              <v-img
                v-if="imagePreview"
                :src="imagePreview"
                max-height="200"
                contain
                class="mt-4"
              ></v-img>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="showImageUpload = false">Cancel</v-btn>
              <v-btn 
                color="primary" 
                @click="uploadImage" 
                :disabled="!imageFile"
                :loading="isUploading"
              >
                Upload
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-col>

    <v-col cols="8" md="8">
      <div class="text-heading-3 font-weight-bold mb-2">
        [{{ course.course_nSemester }}]
        {{ course.course_name }}
        ({{ course.course_courseID }})
      </div>

      <v-row v-if="course" class="d-flex align-center">
        <CourseProgress v-if="isCourseDetail" :course="course as CourseDetailResponse" />
        <CourseDetails :course="course" />
      </v-row>
      <v-row v-else>
        <v-col>No course information available</v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { CourseDetailResponse, GetCourseDetailProfessorResponse } from "@/types/Course"
import { coursesService } from "@/services/Professor/CourseServices"
import { useAuthStore } from "@/stores/auth";
const props = defineProps<{
  course: CourseDetailResponse | GetCourseDetailProfessorResponse,
  canEditImage?: boolean
}>()

const authStore = useAuthStore;
const { user } = authStore.getState();
const role = computed(() => user?.role);
const isProfessor = computed(() => role.value === "professor");
// Set default value for canEditImage if not provided
const canEditImage = computed(() => props.canEditImage !== undefined ? props.canEditImage : false)

const isCourseDetail = computed(() => props.course !== null && 'course_percentage_complete' in props.course)

// Image upload functionality
const showImageUpload = ref(false)
const imageFile = ref(null)
const imagePreview = ref('')
const isUploading = ref(false)

const showError = inject("showError") as (message: string) => void;
const showSuccess = inject("showSuccess") as (message: string) => void;
// Open image upload dialog
const openImageUpload = () => {
  if (!canEditImage.value) return
  showImageUpload.value = true
}
const courseImage = computed(()=>{
  return ('course_image' in props.course) ? props.course.course_image : props.course.course_image_url
})
// Generate image preview when file is selected
watch(imageFile, (newFile) => {
  if (newFile) {
    imagePreview.value = URL.createObjectURL(newFile)
  } else {
    imagePreview.value = ''
  }
})

// Define emit for parent component to handle the image upload
const emit = defineEmits(['update-image'])

const uploadImage = async () => {
  if (!imageFile.value) return
  
  isUploading.value = true
  
  try {
    const file = imageFile.value
    
    const response = await coursesService.changImageCourse(
      { showError, showSuccess },
      props.course.course_id,
      file
    )
    
    if (response && response.data) {
      // Update the course image URL if needed
      // If the parent component needs to handle this, you can pass the new URL
      emit('update-image', response.data.image_url)
    }
    
    // Close dialog after successful upload
    showImageUpload.value = false
    imageFile.value = null
    imagePreview.value = ''
    
  } catch (error) {
    console.error('Error uploading image:', error)
    showError('Failed to upload course image')
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
.image-container {
  width: 300px;
  height: 200px;
  border-radius: 8px;
}
.image-container:hover .course-image {
  transform: scale(1.05);
}
.cursor-pointer {
  cursor: pointer;
}
</style>