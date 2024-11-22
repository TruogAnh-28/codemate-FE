export interface Document {
    id: string;
    name: string;
    theoryContent: TheoryContent[];
    practicalGuide: PracticalGuide[];
    references: Reference[];
    summaryAndReview: SummaryAndReview;
  }
  
  
  export interface TheoryContent {
    title: string;                   // Tiêu đề của phần nội dung lý thuyết
    prerequisites: string[];         // Các kiến thức cần có trước khi học phần lý thuyết này
    description: string[];             // Mô tả chi tiết hoặc lý thuyết cần học
    examples?: Example[];            // Các ví dụ minh họa cho phần lý thuyết này
  }
  
  export interface Example {
    title: string;                   // Tiêu đề của ví dụ
    codeSnippet?: string;            // Đoạn mã minh họa (nếu có)
    explanation: string;             // Giải thích chi tiết về ví dụ
  }
  
  export interface PracticalGuide {
    title: string;                   // Tiêu đề của bài hướng dẫn
    steps: string[];                 // Các bước để thực hành phần lý thuyết
    commonErrors?: string[];         // Các lỗi thường gặp và cách khắc phục
  }
  
  export interface Reference {
    title: string;                   // Tiêu đề tài liệu tham khảo
    link: string;                    // Liên kết đến tài liệu (URL hoặc nguồn tham khảo)
    description?: string;            // Mô tả ngắn về tài liệu
  }
  
  export interface SummaryAndReview {
    keyPoints: string[];             // Các điểm chính của module
    reviewQuestions: ReviewQuestion[];       // Các câu hỏi ôn tập hoặc câu hỏi tự luận ngắn
    quizLink?: string;               // Link đến bài kiểm tra trắc nghiệm nếu có
  }
  export interface ReviewQuestion {
    id: string;
    question: string;
    answer: string;
    maxscore: number;
    score?: number;
    inputUser?: string;
  }