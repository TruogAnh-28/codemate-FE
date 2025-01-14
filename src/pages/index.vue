<template>
  <v-layout>
    <v-app-bar color="secondary" density="comfortable" elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>CODEMATE</v-app-bar-title>

      <v-app-bar-title v-for="(item, index) in navItems" :key="index">
        <v-btn variant="text" @click="scrollToSection(item.to)">
          {{ item.title }}
        </v-btn>
      </v-app-bar-title>

      <v-app-bar-title>
        <v-btn
          variant="elevated"
          color="on-primary"
          :to="`/login`"
          class="min-w-[100px]"
        >
          Log In
        </v-btn>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <div id="home" class="bg-gradient-to-br from-primary/10 to-secondary/10">
        <v-container class="fill-height">
          <v-main class="pt-0">
            <div class="flex w-full">
              <div class="flex-1 p-20">
                <h2 class="text-heading-4 mb-4">Learn with us</h2>
                <p>
                  Empower your learning journey with our support, helping you
                  achieve better academic success effortlessly!
                </p>
                <div class="flex flex-col items-center mt-8">
                  <loginAssets />
                  <v-btn
                    variant="elevated"
                    color="primary"
                    :to="`/login`"
                    class="min-w-[100px] text-on-primary mt-4"
                  >
                    Get Started
                  </v-btn>
                </div>
              </div>
              <div class="flex-1 p-4">
                <v-img
                  src="../assets/home.png"
                  alt="Technology background vector"
                  class="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </v-main>
        </v-container>
      </div>
      <div id="features">
        <v-lazy
          v-model="isVisible.features"
          :options="{ threshold: 1, rootMargin: '50px' }"
          :min-height="200"
        >
          <div
            class="observe-section bg-gray-50 py-16"
            v-intersect="{
              handler: onIntersectFeatures,
              options: { threshold: 1 },
            }"
            :class="{
              'slide-up-enter': isVisible.features,
              'slide-up-hidden': !isVisible.features,
            }"
          >
            <h1 class="text-heading-4 text-center">Key Features</h1>
            <div class="p-16 flex flex-row justify-around">
              <FeatureCard
                v-for="(feature, index) in features"
                :key="index"
                :iconTitle="feature.icon"
                :title="feature.title"
                :imgSrc="feature.imgSrc"
                :imgAlt="feature.imgAlt"
                :text="feature.text"
                class="transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </v-lazy>
      </div>
      <div id="courses">
        <v-lazy
          v-model="isVisible.courses"
          :options="{ threshold: 1, rootMargin: '50px' }"
          :min-height="200"
        >
          <div
            class="observe-section bg-gradient-to-br from-secondary/5 to-primary/5 py-16"
            v-intersect="{
              handler: onIntersectCourses,
              options: { threshold: 1 },
            }"
            :class="{
              'slide-up-enter': isVisible.courses,
              'slide-up-hidden': !isVisible.courses,
            }"
          >
            <h1 class="text-heading-4 text-center">
              Streamline and Enhance Your Learning Journey with CodeMate
            </h1>
            <p class="text-center text-gray-700 mt-4">
              Who is CodeMate suitable for?
            </p>
            <div class="flex flex-row justify-around p-16">
              <CoursesCard
                v-for="(course, index) in courseCards"
                :key="index"
                :title="course.title"
                :imgSrc="course.imgSrc"
                :imgAlt="course.imgAlt"
                :text="course.text"
                class="transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div class="flex flex-row justify-around p-16">
              <div class="flex-1">
                <coursesIcon />
              </div>
              <div class="flex-1">
                <div class="p-20 bg-white rounded-lg shadow-lg">
                  <h2 class="text-heading-4 mb-4">
                    Unlock Your Potential with CodeMate
                  </h2>
                  <p>
                    Discover a world of flexible, personalized learning. Our
                    platform empowers you to navigate courses at your own pace,
                    track your progress, and gain valuable insights with
                    interactive exercises and guided milestones.
                  </p>
                  <div class="flex flex-col items-center mt-8">
                    <v-btn
                      variant="elevated"
                      color="primary"
                      :to="`/login`"
                      class="min-w-[100px] text-on-primary mt-4"
                    >
                      Learn More
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-lazy>
      </div>
      <Suspense v-if="selectedComponent">
        <component
          :is="getComponent(selectedComponent)"
          v-if="isComponentVisible"
          :modelValue="isOpenFAQs"
          :teamsValue="isOpenTeams"
          @update:modelValue="updateFAQsModal"
          @update:teamsValue="updateTeamsModal"
        />
      </Suspense>
      <div id="aboutus">
        <v-lazy
          v-model="isVisible.aboutus"
          :options="{ threshold: 1, rootMargin: '50px' }"
          :min-height="200"
        >
          <div
            class="observe-section bg-gray-50 min-h-screen py-16"
            v-intersect="{
              handler: onIntersectAboutUs,
              options: { threshold: 1 },
            }"
            :class="{
              'slide-up-enter': isVisible,
              'slide-up-hidden': !isVisible,
            }"
          >
            <v-container class="py-16">
              <div class="text-center mb-16">
                <h2
                  class="text-4xl font-bold text-primary mb-4 animate-title"
                  :class="{ 'title-visible': isVisible }"
                >
                  About CodeMate
                </h2>
                <div
                  class="w-24 h-1 bg-secondary mx-auto rounded-full animate-line"
                  :class="{ 'line-visible': isVisible }"
                ></div>
              </div>

              <v-expansion-panels
                v-model="panel"
                class="mb-16 bg-transparent"
                multiple
              >
                <v-expansion-panel
                  v-for="(section, i) in sections"
                  :key="i"
                  class="mb-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                  :elevation="0"
                >
                  <v-expansion-panel-title class="py-4">
                    <div class="flex items-center gap-4">
                      <v-icon
                        :icon="section.icon"
                        :color="section.iconColor"
                        size="32"
                      ></v-icon>
                      <div>
                        <h3 class="text-xl font-bold text-primary">
                          {{ section.title }}
                        </h3>
                        <p class="text-sm text-gray-600 mt-1">
                          {{ section.shortDesc }}
                        </p>
                      </div>
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text
                    class="bg-gradient-to-br from-primary/5 to-secondary/5"
                  >
                    <div class="py-4">
                      <p class="text-gray-800 leading-relaxed">
                        {{ section.longDesc }}
                      </p>
                      <div class="mt-6 flex gap-4">
                        <v-btn
                          v-if="section.action"
                          variant="outlined"
                          color="secondary"
                          class="hover:scale-105 transition-transform"
                          :to="`/login`"
                        >
                          {{ section.action }}
                        </v-btn>
                        <v-chip
                          v-for="(tag, index) in section.tags"
                          :key="index"
                          color="primary"
                          variant="outlined"
                          class="mr-2"
                        >
                          {{ tag }}
                        </v-chip>
                      </div>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <div class="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div
                  v-for="stat in stats"
                  :key="stat.id"
                  class="stat-card bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
                  :class="{ 'stat-visible': isVisible }"
                >
                  <v-icon
                    :icon="stat.icon"
                    size="36"
                    color="primary"
                    class="mb-4"
                  ></v-icon>
                  <h4 class="text-3xl font-bold text-primary mb-2">
                    {{ stat.value }}
                  </h4>
                  <p class="text-gray-600">{{ stat.label }}</p>
                </div>
              </div>
            </v-container>
          </div>
        </v-lazy>
      </div>
      <div v-if="selectedComponent === 'About Us'"><AboutUs /></div>
      <div v-if="selectedComponent === 'FAQs'">
        <FAQs :modelValue="isOpenFAQs" @update:modelValue="updateFAQsModal" />
      </div>
      <div v-if="selectedComponent === 'Teams'">
        <Teams
          :teamsValue="isOpenTeams"
          @update:teamsValue="updateTeamsModal"
        />
      </div>
      <div v-if="selectedComponent === 'Contact Us'"><ContactUs /></div>
      <div id="contactus">
        <v-lazy
          v-model="isVisible.contactus"
          :options="{ threshold: 1, rootMargin: '50px' }"
          :min-height="200"
        >
          <div
            class="observe-section bg-gradient-to-b from-gray-50 to-gray-100"
            v-intersect="{
              handler: onIntersectContactUs,
              options: { threshold: 1 },
            }"
            :class="{
              'slide-up-enter': isVisible.contactus,
              'slide-up-hidden': !isVisible.contactus,
            }"
          >
            <v-footer class="bg-on-primary px-4 py-8 border shadow-lg">
              <v-container>
                <v-row>
                  <v-col cols="12" md="3" class="mb-6 md:mb-0">
                    <div class="flex flex-col gap-4">
                      <codemateWithName />
                      <p class="text-body-base-regular text-secondary-darker">
                        © 2024 All Rights Reserved
                      </p>
                    </div>
                  </v-col>
                  <v-col cols="12" md="3">
                    <h3 class="text-body-large-bold mb-4 text-primary">
                      Features
                    </h3>
                    <v-list class="bg-transparent pa-0">
                      <v-list-item
                        v-for="(item, index) in featuresSummary"
                        :key="index"
                        class="px-0 min-h-0 mb-2"
                        density="compact"
                      >
                        <v-list-item-title
                          class="text-secondary-darker text-body-base-regular"
                          >{{ item }}</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" md="3">
                    <h3 class="text-body-large-bold mb-4 text-primary">
                      Contact Us
                    </h3>
                    <v-list class="bg-transparent pa-0">
                      <v-list-item
                        v-for="(item, index) in company"
                        :key="index"
                        class="px-0 min-h-0 mb-2"
                        density="compact"
                        @click="selectComponent(item)"
                      >
                        <v-list-item-title
                          class="text-secondary-darker text-body-base-regular"
                          >{{ item }}</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col cols="12" md="3">
                    <div class="flex flex-col gap-4">
                      <div class="flex items-center gap-2">
                        <v-icon
                          icon="mdi-map-marker-outline"
                          color="primary"
                          medium
                        />
                        <span
                          class="text-body-base-regular text-secondary-darker"
                          >Ho Chi Minh City, Vietnam</span
                        >
                      </div>
                      <div class="flex items-center gap-2">
                        <v-icon
                          icon="mdi-email-outline"
                          color="primary"
                          medium
                        />
                        <span
                          class="text-body-base-regular text-secondary-darker"
                          >group6.gr2003@gmail.com</span
                        >
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <v-divider class="my-6" />
                <v-row class="justify-end md:justify-end">
                  <v-col cols="12" md="auto">
                    <div
                      class="flex flex-wrap gap-6 justify-center md:justify-end"
                    >
                      <a
                        v-for="(link, index) in bottomLinks"
                        :key="index"
                        href="#"
                        class="text-body-base-regular text-secondary-darker hover:text-primary"
                      >
                        {{ link }}
                      </a>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-footer>
          </div>
        </v-lazy>
      </div>
    </v-main>
  </v-layout>
</template>

<style scoped>
.v-list-item--density-compact {
  min-height: 32px;
}

.slide-up-hidden {
  opacity: 0;
  transform: translateY(50px);
}

.slide-up-enter {
  opacity: 1;
  transform: translateY(0);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.observe-section {
  min-height: 100px;
  will-change: transform, opacity;
  position: relative;
}
.observe-section::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 0, 0, 0.1),
    transparent
  );
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#features,
#courses,
#aboutus,
#contactus {
  transition: background-color 0.5s ease;
}
</style>
<script lang="ts" setup>
import loginAssets from "@/assets/login/loginAssets.vue";
import quizImage from "@/assets/quiz.png";
import learningPath from "@/assets/learningPath.png";
import exercises from "@/assets/exercises.png";
import EducationalIcon from "@/assets/EducationalIcon.png";
import TrainingIcon from "@/assets/TrainingIcon.png";
import IndividualIcon from "@/assets/IndividualIcon.png";
import coursesIcon from "@/assets/login/coursesIcon.vue";
import codemateWithName from "@/assets/codemateWithName.vue";
const FAQs = defineAsyncComponent(() => import("@/components/Login/FAQs.vue"));
const Teams = defineAsyncComponent(
  () => import("@/components/Login/Teams.vue")
);

const selectedComponent = ref<string>("");
const isOpenFAQs = ref(false);
const isOpenTeams = ref(false);
const isComponentVisible = ref(false);

const isVisible = ref({
  features: false,
  courses: false,
  aboutus: false,
  contactus: false,
});
interface Section {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: string;
  iconColor: string;
  action?: string;
  tags?: string[];
}

interface Stat {
  id: string;
  value: string;
  label: string;
  icon: string;
}

const panel = ref<number[]>([]);

const sections: Section[] = [
  {
    id: "vision",
    title: "Our Vision",
    shortDesc:
      "Revolutionizing programming education through AI-driven personalized learning.",
    longDesc:
      "We envision a future where learning to code is accessible, engaging, and tailored to each individual's needs. Through innovative AI technology, we're making this vision a reality by creating adaptive learning paths and intelligent feedback systems that respond to each student's unique learning style and pace.",
    icon: "mdi-eye-outline",
    iconColor: "primary",
    action: "Learn More",
    tags: ["AI-Driven", "Personalized", "Innovative"],
  },
  {
    id: "mission",
    title: "Our Mission",
    shortDesc:
      "Empowering students with cutting-edge learning tools and personalized guidance.",
    longDesc:
      "CodeMate is committed to providing an adaptive learning environment that responds to each student's unique needs, making programming education more effective and enjoyable. We strive to break down complex concepts into manageable steps and provide real-time feedback to ensure successful learning outcomes.",
    icon: "mdi-flag-outline",
    iconColor: "secondary",
    action: "Join Us",
    tags: ["Adaptive Learning", "Real-time Feedback", "Student-Centered"],
  },
  {
    id: "values",
    title: "Our Values",
    shortDesc:
      "Innovation, excellence, and student success drive everything we do.",
    longDesc:
      "We believe in continuous innovation, maintaining high standards of excellence, and putting student success at the forefront of all our decisions. Our platform is built on the principles of accessibility, engagement, and community support, ensuring that every student has the opportunity to excel in their programming journey.",
    icon: "mdi-heart-outline",
    iconColor: "error",
    action: "Read More",
    tags: ["Excellence", "Innovation", "Community"],
  },
];

const stats: Stat[] = [
  {
    id: "students",
    value: "5000+",
    label: "Active Students",
    icon: "mdi-account-group",
  },
  {
    id: "courses",
    value: "50+",
    label: "Courses",
    icon: "mdi-book-open-page-variant",
  },
  {
    id: "satisfaction",
    value: "95%",
    label: "Satisfaction Rate",
    icon: "mdi-thumb-up",
  },
  {
    id: "completion",
    value: "89%",
    label: "Completion Rate",
    icon: "mdi-certificate",
  },
];

const onIntersectAboutUs = (entries: IntersectionObserverEntry[]) => {
  if (entries[0].isIntersecting) {
    isVisible.value.aboutus = true;
  }
};
const onIntersectFeatures = (entries: IntersectionObserverEntry[]) => {
  if (entries[0].isIntersecting) {
    isVisible.value.features = true;
  }
};

const onIntersectCourses = (entries: IntersectionObserverEntry[]) => {
  if (entries[0].isIntersecting) {
    isVisible.value.courses = true;
  }
};

const onIntersectContactUs = (entries: IntersectionObserverEntry[]) => {
  if (entries[0].isIntersecting) {
    isVisible.value.contactus = true;
  }
};

const getComponent = (componentName: string) => {
  switch (componentName) {
    case "FAQs":
      return FAQs;
    case "Teams":
      return Teams;
    default:
      return null;
  }
};

const navItems = [
  {
    title: "Home",
    to: "home",
  },
  {
    title: "Features",
    to: "features",
  },
  {
    title: "Courses",
    to: "courses",
  },
  {
    title: "About Us",
    to: "aboutus",
  },
  {
    title: "Contact Us",
    to: "contactus",
  },
];

const features = [
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
const featuresSummary = [
  "Interactive Quizzes",
  "Guided Learning Paths",
  "Hands-on Exercises",
  "AI-Generated Recommendations",
];
const courseCards = [
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

const company = ["FAQs", "Teams", "Contact Us"];
const bottomLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Sales and Refunds",
  "Legal",
  "Site Map",
];

const updateTeamsModal = (value: boolean) => {
  isOpenTeams.value = value;
};

const updateFAQsModal = (value: boolean) => {
  isOpenFAQs.value = value;
};
const scrollToSection = (sectionId: string) => {
  const id = sectionId.replace("#", "");
  const element = document.getElementById(id);
  if (element) {
    const offset = 0;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};
function selectComponent(component: string) {
  selectedComponent.value = component;
  if (component === "FAQs") {
    isOpenFAQs.value = true;
  }
  if (component === "Teams") {
    isOpenTeams.value = true;
  }
}
</script>
