import { defineStore } from "pinia";
import { CoursesListResponse } from "@/types/Course";

export const useCourseStore = defineStore("course", {
  state: () => ({
    courseDetails: null as CoursesListResponse | null,
  }),

  actions: {
    setCourseDetails(course: CoursesListResponse) {
      this.courseDetails = course;
      localStorage.setItem("courseDetails", JSON.stringify(course));
    },

    loadCourseDetails() {
      const savedCourseDetails = localStorage.getItem("courseDetails");
      if (savedCourseDetails) {
        const courseDetails = JSON.parse(savedCourseDetails);
        this.setCourseDetails(courseDetails);
      }
    },
  },

  getters: {
    getCourseDetails: (state) => state.courseDetails,
  },
});

