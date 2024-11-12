<template>
  <div class="relative flex items-center z-0">
    <div class="flex -space-x-2 ">
      <template v-for="(student, index) in visibleStudents" :key="student.studentId">
        <div
          class="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
          :style="{ zIndex: students.length - index }"
        >
          <v-img
            :src="student.avatar"
            :alt="student.name"
            class="w-full h-full"
          >
            <template v-slot:error>
              <div class="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-medium">
                {{ getInitials(student.name) }}
              </div>
            </template>
          </v-img>
        </div>
      </template>
    </div>

    <div
      v-if="remainingCount > 0"
      class="relative -ml-1 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-xs font-medium text-gray-600"
    >
      +{{ remainingCount }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { StudentReview } from '@/types/Course'

// Define component options and props
export default {
  name: 'AvatarStack',
  props: {
    students: {
      type: Array as () => StudentReview[],
      required: true,
      default: () => []
    },
    maxVisible: {
      type: Number,
      default: 3
    }
  },
  setup(props) {
    // Computed properties
    const visibleStudents = computed(() => {
      return props.students.slice(0, props.maxVisible)
    })

    const remainingCount = computed(() => {
      return Math.max(0, props.students.length - props.maxVisible)
    })

    // Helper function
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    return {
      visibleStudents,
      remainingCount,
      getInitials
    }
  }
}
</script>
