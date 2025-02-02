<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h3>Feedback Statistics</h3>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title>Feedback Status Trends</v-card-title>
          <v-card-text>
            <v-sparkline
              :value="feedbackData.new"
              color="blue"
              fill
              smooth
              line-width="2"
              :gradient="['blue', 'lightblue']"
            ></v-sparkline>
            <!-- 
            <v-sparkline
              :value="feedbackData.pending"
              color="orange"
              fill
              smooth
              line-width="2"
              :gradient="['orange', 'yellow']"
            ></v-sparkline>

            <v-sparkline
              :value="feedbackData.resolved"
              color="green"
              fill
              smooth
              line-width="2"
              :gradient="['green', 'lightgreen']"
            ></v-sparkline> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const feedbackData = {
  new: [5, 10, 15, 7, 12, 18, 20], // Example data for "New"
  pending: [3, 7, 9, 5, 10, 12, 14], // Example data for "Pending"
  resolved: [1, 4, 6, 8, 10, 14, 16], // Example data for "Resolved"
};
</script>
