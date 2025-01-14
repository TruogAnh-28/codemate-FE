<template>
  <v-dialog
    v-model="dialogModel"
    persistent
    max-width="400"
    content-class="rounded-lg"
  >
    <v-card class="pa-4">
      <v-card-title class="d-flex align-center gap-2 text-heading-4 mb-6">
        <v-icon icon="mdi-help-circle" color="secondary" size="32" />
        Team member details
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-card
              v-for="(team, index) in teams"
              :key="index"
              class="d-flex align-center p-4 mb-4 rounded-lg border bg-on-primary hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex justify-start items-center">
                <v-img
                  :src="team.avatar"
                  height="80"
                  width="80"
                  contain
                  class="rounded-lg"
                ></v-img>
              </div>
              <div class="ml-4">
                <v-card-title class="text-body-base-bold">{{
                  team.name
                }}</v-card-title>
                <v-card-subtitle class="text-body-small-regular">{{
                  team.email
                }}</v-card-subtitle>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="mt-6 justify-end">
        <v-btn
          color="primary"
          size="large"
          variant="elevated"
          class="px-6 text-on-primary"
          @click="closeModal"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
interface Teams {
  avatar: string;
  name: string;
  email: string;
}
import codemateAvatar from "@/assets/codemate.png";

const teams: Teams[] = [
  {
    avatar: codemateAvatar,
    name: "PT",
    email: "codemate@gmail.com",
  },
  {
    avatar: codemateAvatar,
    name: "TA",
    email: "codemate@gmail.com",
  },
  {
    avatar: codemateAvatar,
    name: "PN",
    email: "codemate@gmail.com",
  },
];

const props = defineProps(["teamsValue"]);
const emit = defineEmits(["update:teamsValue"]);

const dialogModel = computed({
  get: () => props.teamsValue,
  set: (value: boolean) => emit("update:teamsValue", value),
});

const closeModal = () => {
  emit("update:teamsValue", false);
};
</script>
