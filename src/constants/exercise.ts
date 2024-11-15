import  { QuizQuestion,QuizExercise } from './../types/Exercise';

const quizQuestionsData: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)']
    },
    {
      id: 'q2',
      question: 'Which data structure is used to implement a LIFO (Last In First Out) system?',
      options: ['Queue', 'Stack', 'Linked List', 'Tree']
    },
    {
      id: 'q3',
      question: 'What is the main purpose of a cache memory?',
      options: ['To store frequently accessed data', 'To store data permanently', 'To store data temporarily', 'To store backup data']
    },
    {
      id: 'q4',
      question: 'Which sorting algorithm is known for its divide-and-conquer approach?',
      options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Insertion Sort']
    },
    {
      id: 'q5',
      question: 'What is the primary function of an operating system?',
      options: ['To manage hardware resources', 'To compile programs', 'To edit documents', 'To browse the internet']
    },
    {
      id: 'q6',
      question: 'Which of the following is a NoSQL database?',
      options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite']
    },
    {
      id: 'q7',
      question: 'What does HTTP stand for?',
      options: ['HyperText Transfer Protocol', 'HyperText Transmission Protocol', 'HyperText Transfer Package', 'HyperText Transmission Package']
    },
    {
      id: 'q8',
      question: 'Which programming language is primarily used for Android app development?',
      options: ['Swift', 'Kotlin', 'JavaScript', 'Python']
    },
    {
      id: 'q9',
      question: 'What is the purpose of a DNS (Domain Name System)?',
      options: ['To translate domain names to IP addresses', 'To secure websites', 'To store website data', 'To manage email servers']
    },
    {
      id: 'q10',
      question: 'Which of the following is a version control system?',
      options: ['Git', 'Docker', 'Kubernetes', 'Jenkins']
    }
  ];
  const quizExercisesData: QuizExercise[] = [
    {
        id: 'exercise1',
        status: 'new',
        name: 'Introduction to Computer Science',
        quizList: quizQuestionsData.slice(0, 3),
        difficulty: 'easy'
      },
      {
        id: 'exercise2',
        status: 'on going',
        name: 'Data Structures and Algorithms',
        quizList: quizQuestionsData.slice(3, 6),
        difficulty: 'medium'
      },
      {
        id: 'exercise3',
        status: 'completed',
        name: 'Operating Systems',
        quizList: quizQuestionsData.slice(6, 9),
        difficulty: 'hard',
        score: 85
      },
      {
        id: 'exercise4',
        status: 'completed',
        name: 'Database Systems',
        quizList: quizQuestionsData.slice(0, 3),
        difficulty: 'medium',
        score: 90
      },
      {
        id: 'exercise5',
        status: 'new',
        name: 'Networking',
        quizList: quizQuestionsData.slice(3, 6),
        difficulty: 'easy'
      },
      {
        id: 'exercise6',
        status: 'on going',
        name: 'Software Engineering',
        quizList: quizQuestionsData.slice(6, 9),
        difficulty: 'hard'
      },
      {
        id: 'exercise7',
        status: 'completed',
        name: 'Artificial Intelligence',
        quizList: quizQuestionsData.slice(0, 3),
        difficulty: 'hard',
        score: 95
      },
      {
        id: 'exercise8',
        status: 'new',
        name: 'Machine Learning',
        quizList: quizQuestionsData.slice(3, 6),
        difficulty: 'medium'
      },
      {
        id: 'exercise9',
        status: 'on going',
        name: 'Cyber Security',
        quizList: quizQuestionsData.slice(6, 9),
        difficulty: 'hard'
      },
      {
        id: 'exercise10',
        status: 'completed',
        name: 'Cloud Computing',
        quizList: quizQuestionsData.slice(0, 3),
        difficulty: 'easy',
        score: 88
      }
    ];
  export { quizQuestionsData, quizExercisesData };