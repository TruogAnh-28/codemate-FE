import { CourseDetail, CourseRecent, CourseReview } from "@/types/Course"
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
    status: "In Progress",
    image: "../../../../assets/course-images/cs101.png",
    percentageComplete: "60"
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
    status: "In Progress",
    image: "../../../../assets/course-images/cs201.png",
    percentageComplete: "30"
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
    image: "../../../../assets/course-images/cs301.png",
    percentageComplete: "70"
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
    image: "../../../../assets/course-images/cs401.png",
    percentageComplete: "100"
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
    status: "New",
    image: "../../../../assets/course-images/cs501.png",
    percentageComplete: "60"
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
    status: "In Progress"
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
    status: "In Progress"
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
    status: "New"
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
    status: "In Progress"
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
    status: "In Progress"
  }
]

export const CourseDetailData: CourseDetail = {
  "id": "CS101",
  "name": "Introduction to Computer Science",
  "learningOutcomes": [
    "Understand fundamental programming concepts",
    "Develop problem-solving skills",
    "Familiarity with algorithms and data structures",
    "Ability to write and debug code in Python",
    "Understanding of computer systems and software engineering principles"
  ],
  "professor": "Dr. Alice Johnson",
  "startDate": "2024-01-10",
  "endDate": "2024-06-10",
  "status": "In Progress",
  "percentageComplete": "75",
  "image": "https://example.com/images/cs101.png",
  "lastAccessed": "2024-11-05T18:00:00Z",
  "studentList": [
    {
      "studentId": "s001",
      "name": "John Doe",
      "email": "johndoe@gmail.com",
      "avatar": "https://example.com/avatars/johndoe.png"
    },
    {
      "studentId": "s002",
      "name": "Jane Smith",
      "email": "janesmith@gmail.com",
      "avatar": "https://example.com/avatars/janesmith.png"
    }
  ],
  "lessons": [
    {
      "id": "CS101_LS1",
      "name": "Introduction to Programming",
      "description": "An overview of programming basics and syntax.",
      "documents": [
        {
          "id": "doc1",
          "name": "Python Basics",
          "type": "PDF",
          "documentUrl": "https://assets.cambridge.org/97811084/72449/frontmatter/9781108472449_frontmatter.pdf"
        },
        {
          "id": "doc2",
          "name": "Setting Up Python",
          "type": "MP4",
          "documentUrl": "https://example.com/videos/setup_python.mp4"
        }
      ],
      "bookmarked": true
    },
    {
      "id": "CS101_LS2",
      "name": "Data Types and Variables",
      "description": "Understanding data types and variables in Python.",
      "documents": [
        {
          "id": "doc3",
          "name": "Data Types Overview",
          "type": "PDF",
          "documentUrl": "https://example.com/docs/data_types.pdf"
        }
      ],
      "bookmarked": false
    },
    {
      "id": "CS101_LS3",
      "name": "Control Structures",
      "description": "Learning about conditional statements and loops.",
      "documents": [
        {
          "id": "doc4",
          "name": "Control Structures in Python",
          "type": "PDF",
          "documentUrl": "https://example.com/docs/control_structures.pdf"
        },
        {
          "id": "doc5",
          "name": "Looping Tutorial",
          "type": "MP4",
          "documentUrl": "https://example.com/videos/loops.mp4"
        }
      ],
      bookmarked: false
    },
    {
      "id": "CS101_LS4",
      "name": "Functions",
      "description": "An introduction to defining and using functions.",
      "documents": [
        {
          "id": "doc6",
          "name": "Functions in Python",
          "type": "PDF",
          "documentUrl": "https://example.com/docs/functions.pdf"
        }
      ],
      bookmarked: true
    },
    {
      "id": "CS101_LS5",
      "name": "Data Structures",
      "description": "Exploring lists, tuples, and dictionaries in Python.",
      "documents": [
        {
          "id": "doc7",
          "name": "Introduction to Lists",
          "type": "PDF",
          "documentUrl": "https://example.com/docs/lists.pdf"
        }
      ],
      bookmarked: false
    }
  ],
  "exercises": [
    {
      "id": "CS101_EX1",
      "name": "Python Basics Quiz",
      "description": "A quiz covering basic Python concepts.",
      "questions": [
        {
          "id": "q1",
          "question": "What is the correct syntax for a Python function?",
          "options": ["def functionName():", "function functionName()", "def functionName[]", "function() functionName"],
          "correctAnswer": "def functionName():"
        },
        {
          "id": "q2",
          "question": "What is the output of print(2 + 2)?",
          "options": ["22", "4", "None", "Error"],
          "correctAnswer": "4"
        },
        {
          "id": "q3",
          "question": "Which keyword is used to start a loop in Python?",
          "options": ["if", "def", "while", "return"],
          "correctAnswer": "while"
        }
      ],
      status: "Completed"
    },
    {
      "id": "CS101_EX2",
      "name": "Data Types and Variables Quiz",
      "description": "A quiz on data types and variable handling.",
      "questions": [
        {
          "id": "q4",
          "question": "Which of these is a valid variable name in Python?",
          "options": ["2var", "var_1", "var-name", "var name"],
          "correctAnswer": "var_1"
        },
        {
          "id": "q5",
          "question": "What is the data type of 3.14 in Python?",
          "options": ["int", "float", "str", "bool"],
          "correctAnswer": "float"
        },
        {
          "id": "q6",
          "question": "Which of the following is a mutable data type?",
          "options": ["tuple", "str", "int", "list"],
          "correctAnswer": "list"
        }
      ],
      status: "In Progress"
    },
    {
      "id": "CS101_EX3",
      "name": "Control Structures Quiz",
      "description": "A quiz covering control structures like if statements and loops.",
      "questions": [
        {
          "id": "q7",
          "question": "What is the purpose of an if statement?",
          "options": ["To define a function", "To repeat code", "To execute code conditionally", "To store data"],
          "correctAnswer": "To execute code conditionally"
        },
        {
          "id": "q8",
          "question": "Which keyword is used to skip an iteration in a loop?",
          "options": ["skip", "continue", "pass", "break"],
          "correctAnswer": "continue"
        }
      ],
      status: "New"
    },
    {
      "id": "CS101_EX4",
      "name": "Functions Quiz",
      "description": "A quiz on defining and using functions.",
      "questions": [
        {
          "id": "q9",
          "question": "How do you call a function named myFunction in Python?",
          "options": ["call myFunction()", "execute myFunction()", "myFunction()", "function myFunction()"],
          "correctAnswer": "myFunction()"
        },
        {
          "id": "q10",
          "question": "What keyword is used to define a function in Python?",
          "options": ["func", "define", "def", "function"],
          "correctAnswer": "def"
        }
      ],
      status: "In Progress"
    },
    {
      "id": "CS101_EX5",
      "name": "Data Structures Quiz",
      "description": "A quiz on data structures like lists, tuples, and dictionaries.",
      "questions": [
        {
          "id": "q11",
          "question": "Which data structure is ordered and mutable?",
          "options": ["tuple", "set", "list", "dictionary"],
          "correctAnswer": "list"
        },
        {
          "id": "q12",
          "question": "How do you access the value associated with a key in a dictionary?",
          "options": ["dict.key", "dict[key]", "dict(key)", "dict->key"],
          "correctAnswer": "dict[key]"
        }
      ],
      status: "In Progress"
    }
  ],
  "recommendedLessons": [
    {
      "id": "r1",
      "lessonId": "CS101_LS3",
      bookmarked: false
    },
    {
      "id": "r2",
      "lessonId": "CS101_LS4",
      bookmarked: true
    }
  ],
  "completedLessons": "1",
  "timeSpent": "24h 30m",
  "assignmentsDone": "1",
}
