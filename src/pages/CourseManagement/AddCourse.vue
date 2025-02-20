<script lang="ts" setup>
import { ref } from 'vue'

interface Course {
  id: number
  name: string
  professorEmail: string
  creditNumber: number
  studentEmails: string[]
}

// State
const courses = ref<Course[]>([{
  id: 1,
  name: '',
  professorEmail: '',
  creditNumber: 0,
  studentEmails: []
}])

// Methods
const addNewCourse = () => {
  courses.value.push({
    id: courses.value.length + 1,
    name: '',
    professorEmail: '',
    creditNumber: 0,
    studentEmails: []
  })
}

const addStudentEmail = (courseIndex: number, email: string) => {
  if (email && !courses.value[courseIndex].studentEmails.includes(email)) {
    courses.value[courseIndex].studentEmails.push(email)
  }
}

const removeStudentEmail = (courseIndex: number, emailIndex: number) => {
  courses.value[courseIndex].studentEmails.splice(emailIndex, 1)
}

const handleConfirm = async () => {
  try {
    // Validate data
    const isValid = courses.value.every(course => 
      course.name && 
      course.professorEmail && 
      course.creditNumber > 0
    )

    if (!isValid) {
      alert('Please fill in all required fields')
      return
    }

    // TODO: Add your API call here
    console.log('Submitting courses:', courses.value)
    
    // Reset form after successful submission
    courses.value = [{
      id: 1,
      name: '',
      professorEmail: '',
      creditNumber: 0,
      studentEmails: []
    }]
  } catch (error) {
    console.error('Error submitting courses:', error)
    alert('Failed to submit courses')
  }
}

const handleImportExcel = () => {
  // TODO: Implement Excel import functionality
  console.log('Import Excel clicked')
}
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Add New Courses</h1>
      <button
        @click="handleImportExcel"
        class="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors"
      >
        Import Excel
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Table Header -->
      <div class="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b border-gray-200">
        <div class="font-semibold">ID</div>
        <div class="font-semibold">NAME</div>
        <div class="font-semibold">PROFESSOR EMAIL</div>
        <div class="font-semibold">CREDIT NUMBER</div>
        <div class="font-semibold">STUDENT EMAILS</div>
      </div>

      <!-- Table Body -->
      <div class="divide-y divide-gray-200">
        <div
          v-for="(course, index) in courses"
          :key="course.id"
          class="grid grid-cols-5 gap-4 p-4 items-center"
        >
          <div>{{ course.id }}</div>
          <input
            v-model="course.name"
            type="text"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-violet-500"
            placeholder="Course name"
          />
          <input
            v-model="course.professorEmail"
            type="email"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-violet-500"
            placeholder="professor@email.com"
          />
          <input
            v-model.number="course.creditNumber"
            type="number"
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-violet-500"
            min="0"
          />
          <div class="relative">
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(email, emailIndex) in course.studentEmails"
                :key="emailIndex"
                class="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {{ email }}
                <button
                  @click="removeStudentEmail(index, emailIndex)"
                  class="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            </div>
            <input
              type="email"
              @keydown.enter="(e) => addStudentEmail(index, (e.target as HTMLInputElement).value)"
              class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-violet-500"
              placeholder="Press Enter to add email"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 mt-6">
      <button
        @click="addNewCourse"
        class="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Add more
      </button>
      <button
        @click="handleConfirm"
        class="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Confirm
      </button>
    </div>
  </div>
</template>