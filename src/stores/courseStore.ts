import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CourseDetailResponse, CoursesListResponse } from "@/types/Course";

// Định nghĩa kiểu dữ liệu
interface CourseStore {
  courseDetails: CoursesListResponse | CourseDetailResponse | null;
  getCourseDetails: () => CoursesListResponse | CourseDetailResponse | null;
  setCourseDetails: (course: CoursesListResponse | CourseDetailResponse) => void;
  loadCourseDetails: () => void;
}

// Tạo store với Zustand
export const useCourseStore = create<CourseStore, [["zustand/persist", unknown]]>(
  persist(
    (set, get) => ({
      courseDetails: null,

      // Getter
      getCourseDetails: () => get().courseDetails,

      // Action để cập nhật thông tin course
      setCourseDetails: (course: CoursesListResponse | CourseDetailResponse) => {
        set({ courseDetails: course });
      },

      // Tải thông tin khóa học từ localStorage
      loadCourseDetails: () => {
        const savedCourseDetails = localStorage.getItem('courseDetails');
        if (savedCourseDetails) {
          try {
            const parsedCourseDetails = JSON.parse(savedCourseDetails);
            set({ courseDetails: parsedCourseDetails });
          } catch (e) {
            set({ courseDetails: null });
          }
        }
      }
    }),
    {
      name: 'course-storage', // Tên lưu trữ trong localStorage
      storage: createJSONStorage(() => localStorage), // Sử dụng createJSONStorage để lưu trữ JSON
    }
  )
);
