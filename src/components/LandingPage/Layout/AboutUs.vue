<template>
  <v-dialog v-model="dialog" max-width="800px" scrollable>
    <v-card>
      <v-card-title class="bg-primary text-white pa-4">
        <h2 class="text-h4">About Us</h2>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-6">
        <div class="about-us-content">
          <!-- Hero Section -->
          <div class="text-center mb-8">
            <h3 class="text-h5 font-weight-bold text-primary mb-4">
              Empowering Learning Through Intelligent Online Systems
            </h3>
            <p class="text-body-1 text-grey-darken-1">
              Developed at Ho Chi Minh City University of Technology, Faculty of Computer
              Science and Engineering, our intelligent online learning system is designed
              to provide personalized learning experiences for computer science students.
            </p>
          </div>

          <!-- Team Section with Photos -->
          <div class="mb-10">
            <h3 class="text-h5 mb-6 text-primary font-weight-bold">Our Team</h3>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="(member, index) in teamMembers"
                :key="index"
              >
                <v-card class="team-card" flat>
                  <v-img
                    :src="'/api/placeholder/180/180'"
                    alt="Team member"
                    aspect-ratio="1"
                    class="rounded-circle mx-auto mb-3"
                    width="150"
                    height="150"
                  ></v-img>
                  <div class="text-center">
                    <h4 class="text-h6 mb-1">{{ member.name }}</h4>
                    <p class="text-subtitle-1 text-primary mb-2">{{ member.position }}</p>
                    <p class="text-body-2 text-grey-darken-1 px-2">{{ member.bio }}</p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Company History Timeline -->
          <div class="mb-10">
            <h3 class="text-h5 mb-6 text-primary font-weight-bold">Project Timeline</h3>
            <v-timeline align="start" line-thickness="3" line-color="primary">
              <v-timeline-item
                v-for="(event, index) in historyTimeline"
                :key="index"
                dot-color="primary"
                size="small"
              >
                <template v-slot:opposite>
                  <div class="text-h6 font-weight-bold">{{ event.year }}</div>
                </template>
                <v-card class="elevation-1 mb-4">
                  <v-card-title class="text-subtitle-1 font-weight-bold">{{
                    event.title
                  }}</v-card-title>
                  <v-card-text>{{ event.description }}</v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </div>

          <!-- Mission & Vision -->
          <div class="mb-10">
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="rounded-lg pa-4 h-100" color="primary" dark>
                  <v-card-title>
                    <v-icon size="large" class="mr-2">mdi-eye</v-icon>
                    Our Vision
                  </v-card-title>
                  <v-card-text class="text-body-1">
                    To create an intelligent online learning system that optimizes the
                    learning experience, making it personalized, adaptive, and efficient,
                    helping learners enhance their programming skills and access knowledge
                    flexibly and effectively.
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="rounded-lg pa-4 h-100" color="secondary" dark>
                  <v-card-title>
                    <v-icon size="large" class="mr-2">mdi-flag</v-icon>
                    Our Mission
                  </v-card-title>
                  <v-card-text class="text-body-1">
                    To provide a smart learning environment through AI integration,
                    enhancing interaction between learners and artificial intelligence to
                    create a personalized learning experience that adapts to the specific
                    needs of each individual student.
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Our Commitment -->
          <div class="mb-10">
            <h3 class="text-h5 mb-6 text-primary font-weight-bold">Our Commitment</h3>
            <v-card outlined class="pa-4">
              <v-card-text class="text-body-1">
                We are committed to the research and development of an intelligent online
                learning system that meets personalized learning needs and optimizes the
                learning process for users, especially Computer Science students at the
                Faculty of Computer Science & Engineering, Ho Chi Minh City University of
                Technology - Vietnam National University.
                <br /><br />
                Throughout our development process, we have faced numerous challenges,
                from researching large language models (LLM) to implementing AI-assisted
                features in the system. However, with dedication and support from many
                parties, we have successfully achieved our research and development goals.
                <br /><br />
                We acknowledge that limitations and challenges remain, particularly in
                optimizing certain AI features and generating automated exercises. These
                challenges will serve as a foundation for us to continue improving the
                system in subsequent development phases. We hope that our contributions
                will bring practical value to programming learning and teaching, while
                opening up opportunities for broader applications in the educational
                environment.
              </v-card-text>
            </v-card>
          </div>

          <!-- Core Features Section -->
          <div class="mb-10">
            <h3 class="text-h5 mb-6 text-primary font-weight-bold">Key Features</h3>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="(value, index) in coreFeatures"
                :key="index"
              >
                <v-card class="rounded-lg h-100 pa-4" outlined>
                  <v-card-title class="text-h6">
                    <v-icon color="primary" size="x-large" class="mb-2">{{
                      value.icon
                    }}</v-icon>
                    <div class="d-block text-subtitle-1">{{ value.title }}</div>
                  </v-card-title>
                  <v-card-text class="text-body-2">{{ value.description }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="closeDialog" class="px-6">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from "vue";

const dialog = ref(true);
const emit = defineEmits(["close"]);

const teamMembers = [
  {
    name: "Đỗ Phương Nam",
    position: "Team Member",
    bio: "Computer Science researcher focusing on AI integration in educational systems.",
  },
  {
    name: "Phan Phạm Thi",
    position: "Team Member",
    bio:
      "Specialized in developing adaptive learning technologies for programming education.",
  },
  {
    name: "Nguyễn Trường Tuấn Anh",
    position: "Team Member",
    bio:
      "Expert in educational technology with a focus on personalized learning experiences.",
  },
];

const historyTimeline = [
  {
    year: "2023",
    title: "Project Initiation",
    description:
      "Initial research on large language models (LLM) and their application in educational systems.",
  },
  {
    year: "2023",
    title: "System Design",
    description:
      "Designing the intelligent online learning system with personalized learning features.",
  },
  {
    year: "2024",
    title: "AI Tutor Implementation",
    description:
      "Development of the AI tutor feature to support programming learning and real-time feedback.",
  },
  {
    year: "2024",
    title: "Automated Exercise Generator",
    description:
      "Implementation of the automatic exercise generation system with adaptive difficulty levels.",
  },
];

const coreFeatures = [
  {
    icon: "mdi-book-open-variant",
    title: "Course Management",
    description:
      "Instructors can create, edit, and manage courses with detailed learning outcomes and structured content.",
  },
  {
    icon: "mdi-map-marker-path",
    title: "Personalized Learning Path",
    description:
      "Customized learning routes based on learning goals, knowledge base, and learning behavior.",
  },
  {
    icon: "mdi-robot",
    title: "AI Programming Tutor",
    description:
      "Intelligent assistant providing code explanations, optimization suggestions, debugging help, and real-time feedback.",
  },
  {
    icon: "mdi-code-braces",
    title: "Automated Exercise Generation",
    description:
      "System automatically creates programming exercises with appropriate test cases based on difficulty and requirements.",
  },
  {
    icon: "mdi-chart-timeline-variant",
    title: "Progress Tracking",
    description:
      "Detailed tracking of learning progress, including time spent, completed exercises, and test results.",
  },
  {
    icon: "mdi-sync",
    title: "Adaptive Learning",
    description:
      "Exercises and content that adjust flexibly to match the learner's abilities and progress.",
  },
];

const closeDialog = () => {
  dialog.value = false;
  emit("close");
};
</script>

<style scoped>
.team-card {
  transition: transform 0.3s;
}

.team-card:hover {
  transform: translateY(-10px);
}

/* Make timeline responsive */
@media (max-width: 600px) {
  .v-timeline {
    padding-left: 0;
  }
}
</style>
