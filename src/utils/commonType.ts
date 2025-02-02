export type DateTimeString = string;
export type DateString = string;
export type UUID = string;
export type DocumentType =
  | "CSV"
  | "PDF"
  | "DOC"
  | "DOCX"
  | "PPT"
  | "PPTX"
  | "XLS"
  | "XLSX"
  | "TXT"
  | "MP4"
  | "MP3"
  | "JPG"
  | "PNG"
  | "OTHER";
export type Status = "New" | "In Progress" | "Completed";
export enum ActivityType {
  view_course = "View Course",
  resume_activity = "Resume Activity",
  complete_lesson = "Complete Lesson",
  complete_assignment = "Complete Assignment",
  enroll_course = "Enroll Course",
  badge_earned = "Badge Earned",
}
