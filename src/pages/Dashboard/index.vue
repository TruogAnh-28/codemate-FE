<template>
  <div class="p-6 space-y-8 bg-gray-50">
    <div class="flex space-x-6">
      <div class="flex flex-col space-y-6 w-1/2">
        <WelcomeCard />

        <FeedbackCard @open-feedback="openFeedback" type="system" />
      </div>

      <RecentActivityCard/>
    </div>

    <CourseListCard/>
  </div>
</template>

<script setup lang="ts">
const showFeedbackDialog = ref(false);

const openFeedback = () => {
  showFeedbackDialog.value = true;
};

</script>
