import { Lesson, Module } from "@/types/Lesson"

export const ModulesData: Module[] = [
    {
      id: 'module1',
      introduction: 'Check for type compatibility',
      objectives: [
        'Understand the basics of Module 1',
        'Learn the key concepts of Module 1',
        'Apply the knowledge of Module 1 in practical scenarios'
      ]
    },
    {
      id: 'module2',
      introduction: 'Verify variable declarations',
      objectives: [
        'Understand the basics of Module 2',
        'Learn the key concepts of Module 2',
        'Apply the knowledge of Module 2 in practical scenarios'
      ]
    },
    {
      id: 'module3',
      introduction: 'Ensure followed scope rules',
      objectives: [
        'Understand the basics of Module 3',
        'Learn the key concepts of Module 3',
        'Apply the knowledge of Module 3 in practical scenarios'
      ]
    },
    {
      id: 'module4',
      introduction: 'Create and manage symbol tables',
      objectives: [
        'Understand the basics of Module 4',
        'Learn the key concepts of Module 4',
        'Apply the knowledge of Module 4 in practical scenarios'
      ]
    }
  ];
  
 export const LessonData: Lesson = {
    id: 'lesson1',
    name: 'Chapter 1: Introduction to Data Science',
    learningOutcomes: [
      'Explain the process of semantic analysis.',
      'Perform type checking and type inference.',
      'Implement symbol tables and manage variable scopes.',
      'Handle errors that arise during semantic analysis.'
    ],
    content: 'This is the content of the lesson.',
    description: 'This lesson focuses on the basics of data science.',
    recommendTime: '1.5 hours',
    progress: 65,
    status: 'In Progress',
    recommendContent: 'This lesson focuses on semantic analysis, a crucial step in compilation that ensures the meaning and consistency of your source code\.You\'ll learn how to check for type compatibility, verify variable declarations, and ensure proper scope rules are followed.We\'ll also cover the creation and management of symbol tables, which store information about variables and functions, and discuss error handling techniques.',
    explain: 'Based on your profile, you have a strong foundation in lexical and syntax analysis. Now, it\'s time to understand semantic analysis,which adds meaning to the parsed program. By learning this, you\'ll be able to ensure your compiler understands the logic of your code and can catch potential errors before they reach the code generation phase.',
    modules: ModulesData
  };