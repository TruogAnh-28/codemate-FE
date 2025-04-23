import quizImage from "@/assets/quiz.png";
import learningPath from "@/assets/learningPath.png";
import exercises from "@/assets/exercises.png";
import EducationalIcon from "@/assets/EducationalIcon.png";
import TrainingIcon from "@/assets/TrainingIcon.png";
import IndividualIcon from "@/assets/IndividualIcon.png";
import { GetListFeedbackResponse } from "@/types/Feedback";
import { UserLoginResponse } from "@/types/User";

export const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const PASSWORD_PATTERN =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/;

export const NUMBER_PATTERN = /^[0-9]*$/;

// constant.ts
interface WebVitalTooltip {
  title: string;
  description: string;
  thresholds: string[];
}

export const WEB_VITALS_TOOLTIPS: Record<string, WebVitalTooltip> = {
  FCP: {
    title: 'FCP (First Contentful Paint)',
    description: 'Measures the time from when the page starts loading to when any part of the page\'s content is rendered on the screen.',
    thresholds: [
      'Good: ≤ 1.8 seconds',
      'Needs Improvement: ≤ 3.0 seconds',
      'Poor: > 3.0 seconds'
    ]
  },
  LCP: {
    title: 'LCP (Largest Contentful Paint)',
    description: 'Measures loading performance. Marks the time at which the largest text or image element is rendered in the viewport.',
    thresholds: [
      'Good: ≤ 2.5 seconds',
      'Needs Improvement: ≤ 4.0 seconds',
      'Poor: > 4.0 seconds'
    ]
  },
  INP: {
    title: 'INP (Interaction to Next Paint)',
    description: 'Measures responsiveness to user interactions. Quantifies the latency of all interactions a user has made with the page.',
    thresholds: [
      'Good: ≤ 200 milliseconds',
      'Needs Improvement: ≤ 500 milliseconds',
      'Poor: > 500 milliseconds'
    ]
  }
}


export const features = [
  {
    icon: "mdi-lightbulb",
    title: "Interactive Quiz",
    imgSrc: quizImage,
    imgAlt: "Quiz Image",
    text: "Engage with real-time assessments to enhance understanding and track your progress seamlessly.",
  },
  {
    icon: "mdi-map",
    title: "Guided Learning Paths",
    imgSrc: learningPath,
    imgAlt: "Learning Path Image",
    text: "Follow structured milestones to stay on track with your goals.",
  },
  {
    icon: "mdi-code-tags",
    title: "Hands-on Exercises",
    imgSrc: exercises,
    imgAlt: "Exercises Image",
    text: "Apply what you learn with practical coding challenges.",
  },
];
export const featuresSummary = [
  "Interactive Quizzes",
  "Guided Learning Paths",
  "Hands-on Exercises",
  "AI-Generated Recommendations",
];
export const courseCards = [
  {
    title: "Educational Institutions",
    imgSrc: EducationalIcon,
    imgAlt: "Educational Icon",
    text: "Simplify course management and track student progress effortlessly.",
  },
  {
    title: "Corporate Training Programs",
    imgSrc: TrainingIcon,
    imgAlt: "Training Icon",
    text: "Offer structured, flexible learning pathways for workforce development.",
  },
  {
    title: "Individual Learners",
    imgSrc: IndividualIcon,
    imgAlt: "Individual Icon",
    text: "Enjoy personalized learning experiences and track your progress.",
  },
];

export type ExcelFileHeaderToAddCourses = [
  "Course ID",
  "Course Name",
  "Credit",
  "Semester",
  "Professor Email",
  "Student Email List"
];

export const expectedHeaders: ExcelFileHeaderToAddCourses = [
  "Course ID",
  "Course Name",
  "Credit",
  "Semester",
  "Professor Email",
  "Student Email List",
];

export type FeedbackType = "system" | "course";

export type FeedbackCategory =
  | "user_interface"
  | "performance"
  | "feature_request"
  | "bug_report"
  | "other";

export type FeedbackStatusType = "pending" | "in_progress" | "resolved";

export type ActivityType =
  | "view_course"
  | "resume_activity"
  | "complete_lesson"
  | "complete_assignment"
  | "enroll_course"
  | "badge_earned"
  | "add_feedback";

export const chartDataa = {
  labels: ["Module 1", "Module 2", "Module 3"],
  datasets: [
    {
      borderColor: "#f87979",
      backgroundColor: "#FFC0CB",
      label: "Lesson 3",
      data: [75, 80, 65],
      showLine: true,
    },
    {
      borderColor: "#191970",
      backgroundColor: "#FFA07A",
      label: "Lesson 5",
      data: [50, 70, 60],
      showLine: true,
    },
    {
      borderColor: "#6200EE",
      backgroundColor: "#FFD700",
      label: "Lesson 7",
      data: [90, 85, 70],
      showLine: true,
    },
  ],
};

export const chartOptionss = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        stepSize: 10,
        callback: function (value: number) {
          return value + "%";
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Module Name",
      },
    },
  },
};

export const barChartData = {
  labels: ["Lesson 1", "Lesson 2", "Lesson 3"],
  datasets: [
    {
      label: "Help Requests",
      data: [5, 8, 3],
      backgroundColor: "#4CAF50",
      borderColor: "#388E3C",
      borderWidth: 1,
      barThickness: 24,
    },
  ],
};

export const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        callback: function (value: number) {
          return value + " times";
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Lesson",
      },
    },
  },
};

export const mockFeedbacks: GetListFeedbackResponse[] = [
  {
    id: "f1",
    type: "course",
    title: "Course Content Quality",
    category: "Content",
    description: "The course material was very engaging!",
    rate: 5,
    status: "resolved",
    created_at: "2025-01-15T10:00:00Z",
    resolved_at: "2025-01-16T12:00:00Z",
    student_id: "s1",
  },
  {
    id: "f2",
    type: "system",
    title: "Login Issue",
    category: "Technical",
    description: "Had trouble logging in today.",
    rate: 2,
    status: "pending",
    created_at: "2025-02-01T14:30:00Z",
    resolved_at: "",
    student_id: "s2",
  },
  {
    id: "f3",
    type: "course",
    title: "Assignment Clarity",
    category: "Content",
    description: "Assignments need clearer instructions.",
    rate: 3,
    status: "resolved",
    created_at: "2025-02-20T09:15:00Z",
    resolved_at: "2025-02-21T11:00:00Z",
    student_id: "s3",
  },
  {
    id: "f4",
    type: "system",
    title: "Page Load Speed",
    category: "Performance",
    description: "Pages load too slowly.",
    rate: 4,
    status: "pending",
    created_at: "2025-03-10T16:45:00Z",
    resolved_at: "",
    student_id: "s4",
  },
  {
    id: "f5",
    type: "course",
    title: "Video Quality",
    category: "Content",
    description: "Videos are pixelated.",
    rate: 1,
    status: "resolved",
    created_at: "2025-03-25T13:20:00Z",
    resolved_at: "2025-03-26T15:00:00Z",
    student_id: "s5",
  },
];

export const mockUserLogins: UserLoginResponse[] = [
  // January 2025
  { id: "l1", user_id: "u1", user_role: "student", login_timestamp: "2025-01-05T08:00:00Z" },
  { id: "l2", user_id: "u2", user_role: "teacher", login_timestamp: "2025-01-10T14:00:00Z" },
  { id: "l3", user_id: "u3", user_role: "admin", login_timestamp: "2025-01-15T09:30:00Z" },
  // February 2025
  { id: "l4", user_id: "u4", user_role: "student", login_timestamp: "2025-02-01T10:00:00Z" },
  { id: "l5", user_id: "u5", user_role: "student", login_timestamp: "2025-02-20T15:45:00Z" },
  // March 2025
  { id: "l6", user_id: "u6", user_role: "teacher", login_timestamp: "2025-03-05T11:00:00Z" },
  { id: "l7", user_id: "u7", user_role: "student", login_timestamp: "2025-03-15T13:00:00Z" },
  { id: "l8", user_id: "u8", user_role: "admin", login_timestamp: "2025-03-20T16:30:00Z" },
  { id: "l9", user_id: "u9", user_role: "student", login_timestamp: "2025-03-25T09:15:00Z" },
];