import { CourseRecent, CourseReview } from "@/types/Course"
export const CourseReviewData: CourseReview[] = [
  {
    id: "CS101",
    name: "Introduction to Programming",
    startDate: "2024-09-01",
    endDate: "2024-12-15",
    studentList: [
      { name: "Alice Smith", email: "alice@example.com", studentId: "S101", avatar: "../../../../assets/avatars/avatar1.png" },
      { name: "Bob Johnson", email: "bob@example.com", studentId: "S102", avatar: "../../../../assets/avatars/avatar2.png" },
      { name: "Charlie Brown", email: "charlie@example.com", studentId: "S103", avatar: "../../../../assets/avatars/avatar3.png" }
    ],
    learningOutcomes: [
      "Understand basic programming concepts",
      "Write simple programs using Python",
      "Develop problem-solving skills in programming",
      "Develop problem-solving skills in programming",
    ],
    professor: "Dr. Jane Doe",
    status: "Ongoing",
    image: "../../../../assets/course-images/cs101.png"
  },
  {
    id: "CS201",
    name: "Data Structures and Algorithms",
    startDate: "2024-09-01",
    endDate: "2024-12-15",
    studentList: [
      { name: "David Wilson", email: "david@example.com", studentId: "S201", avatar: "../../../../assets/avatars/avatar4.png" },
      { name: "Evelyn Garcia", email: "evelyn@example.com", studentId: "S202", avatar: "../../../../assets/avatars/avatar5.png" },
      { name: "Frank Thompson", email: "frank@example.com", studentId: "S203", avatar: "../../../../assets/avatars/avatar6.png" }
    ],
    learningOutcomes: [
      "Understand basic programming concepts",
      "Write simple programs using Python",
      "Develop problem-solving skills in programming",
      "Develop problem-solving skills in programming",
    ],
    professor: "Dr. Alan Turing",
    status: "Ongoing",
    image: "../../../../assets/course-images/cs201.png"
  },
  {
    id: "CS301",
    name: "Artificial Intelligence",
    startDate: "2024-09-01",
    endDate: "2024-12-15",
    studentList: [
      { name: "Grace Lee", email: "grace@example.com", studentId: "S301", avatar: "../../../../assets/avatars/avatar7.png" },
      { name: "Henry Martin", email: "henry@example.com", studentId: "S302", avatar: "../../../../assets/avatars/avatar8.png" },
      { name: "Isabella Clark", email: "isabella@example.com", studentId: "S303", avatar: "../../../../assets/avatars/avatar9.png" }
    ],
    learningOutcomes: [
      "Understand basic programming concepts",
      "Write simple programs using Python",
      "Develop problem-solving skills in programming",
      "Develop problem-solving skills in programming",
    ],
    professor: "Dr. Andrew Ng",
    status: "Completed",
    image: "../../../../assets/course-images/cs301.png"
  },
  {
    id: "CS401",
    name: "Machine Learning",
    startDate: "2024-09-01",
    endDate: "2024-12-15",
    studentList: [
      { name: "Jack White", email: "jack@example.com", studentId: "S401", avatar: "../../../../assets/avatars/avatar10.png" },
      { name: "Lily Adams", email: "lily@example.com", studentId: "S402", avatar: "../../../../assets/avatars/avatar11.png" },
      { name: "Michael King", email: "michael@example.com", studentId: "S403", avatar: "../../../../assets/avatars/avatar12.png" }
    ],
    learningOutcomes: [
      "Understand basic programming concepts",
      "Write simple programs using Python",
      "Develop problem-solving skills in programming",
      "Develop problem-solving skills in programming",
    ],
    professor: "Dr. Fei-Fei Li",
    status: "Completed",
    image: "../../../../assets/course-images/cs401.png"
  },
  {
    id: "CS501",
    name: "Computer Vision",
    startDate: "2024-09-01",
    endDate: "2024-12-15",
    studentList: [
      { name: "Nora Scott", email: "nora@example.com", studentId: "S501", avatar: "../../../../assets/avatars/avatar13.png" },
      { name: "Oliver Hall", email: "oliver@example.com", studentId: "S502", avatar: "../../../../assets/avatars/avatar14.png" },
      { name: "Paul Wright", email: "paul@example.com", studentId: "S503", avatar: "../../../../assets/avatars/avatar15.png" }
    ],
    learningOutcomes: [
      "Understand basic programming concepts",
      "Write simple programs using Python",
      "Develop problem-solving skills in programming",
      "Develop problem-solving skills in programming",
    ],
    professor: "Dr. Yann LeCun",
    status: "Ongoing",
    image: "../../../../assets/course-images/cs501.png"
  }
];

export const CourseRecentData: CourseRecent[] = [
  {
    id: "CS101",
    name: "Introduction to Programming",
    learningOutcomes: [
      "Understand basic programming concepts",
      "Write simple programs using Python",
      "Develop problem-solving skills in programming",
      "Develop problem-solving skills in programming",
    ],
    lastAccessed: "2024-11-10T15:30:00Z",
    percentageComplete: "75",
    status: "active"
  },
  {
    id: "CS201",
    name: "Data Structures and Algorithms",
    "learningOutcomes": [
      "Understand and implement various data structures",
      "Analyze the time and space complexity of algorithms",
      "Solve algorithmic problems using appropriate data structures"
    ],
    lastAccessed: "2024-11-08T10:45:00Z",
    percentageComplete: "90",
    status: "active"
  },
  {
    id: "CS301",
    name: "Computer Networks",
    "learningOutcomes": [
      "Understand the basic principles of computer networking",
      "Configure and troubleshoot network devices",
      "Learn about protocols such as TCP/IP, DNS, HTTP, etc."
    ],
    lastAccessed: "2024-11-05T18:00:00Z",
    percentageComplete: "80",
    status: "inactive"
  },
  {
    id: "CS401",
    name: "Operating Systems",
    "learningOutcomes": [
      "Understand the key concepts of modern operating systems",
      "Learn process management, memory management, and file systems",
      "Perform system-level programming tasks"
    ],
    lastAccessed: "2024-11-12T08:20:00Z",
    percentageComplete: "30",
    status: "active"
  },
  {
    id: "CS501",
    name: "Software Engineering",
    "learningOutcomes": [
      "Understand software development life cycle (SDLC)",
      "Learn about agile methodologies",
      "Develop and test software solutions in a team environment"
    ],
    lastAccessed: "2024-11-01T12:00:00Z",
    percentageComplete: "40",
    status: "active"
  }
]
