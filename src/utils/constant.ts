import quizImage from "@/assets/quiz.png";
import learningPath from "@/assets/learningPath.png";
import exercises from "@/assets/exercises.png";
import EducationalIcon from "@/assets/EducationalIcon.png";
import TrainingIcon from "@/assets/TrainingIcon.png";
import IndividualIcon from "@/assets/IndividualIcon.png";

export const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const PASSWORD_PATTERN =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/;

export const NUMBER_PATTERN = /^[0-9]*$/;

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
