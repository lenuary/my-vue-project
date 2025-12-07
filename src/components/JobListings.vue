<script setup>
import { RouterLink } from "vue-router";
import JobListing from "./JobListing.vue";
import { defineProps, onMounted } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useJobsStore } from "@/stores/jobs";

defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
});

const store = useJobsStore();

onMounted(() => {
  store.fetchJobs();
});
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        Browse Jobs
      </h2>

      <div v-if="store.state.isLoading" class="text-center text-gray-500 py-6">
        <PulseLoader />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing
          v-for="job in store.state.jobs.slice(
            0,
            limit || store.state.jobs.length
          )"
          :key="job.id"
          :job="job"
        >
          {{ job.title }}
        </JobListing>
      </div>
    </div>
  </section>

  <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
    <RouterLink
      to="/jobs"
      class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
      >View All Jobs</RouterLink
    >
  </section>
</template>
