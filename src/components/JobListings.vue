<script setup>
import { RouterLink } from "vue-router";
import JobListing from "./JobListing.vue";
import { defineProps, onMounted, computed, ref } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useJobsStore } from "@/stores/jobs";

const props = defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
  showFilters: {
    type: Boolean,
    default: true,
  },
});

const store = useJobsStore();
const sortBy = ref("newest");

const sortedJobs = computed(() => {
  const jobsCopy = [...store.state.jobs];

  return jobsCopy.sort((a, b) => {
    if (sortBy.value === "az") {
      return a.title.localeCompare(b.title);
    } else if (sortBy.value === "za") {
      return b.title.localeCompare(a.title);
    } else {
      return a.isCustom === b.isCustom ? 0 : a.isCustom ? -1 : 1;
    }
  });
});

const handleRefresh = async () => {
  await store.fetchJobs();
};

onMounted(() => {
  if (store.state.jobs.length === 0) {
    store.fetchJobs();
  }
});
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        Browse Jobs
      </h2>

      <div
        v-if="showFilters && !store.state.isLoading"
        class="flex flex-col md:flex-row justify-between items-center mb-6 px-2"
      >
        <div class="flex items-center">
          <label class="mr-2 text-gray-700 text-sm font-medium">Sort by:</label>
          <select
            v-model="sortBy"
            class="border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="newest">Default, newest</option>
            <option value="az">Title (A-Z)</option>
            <option value="za">Title (Z-A)</option>
          </select>
        </div>
      </div>

      <div v-if="store.state.isLoading" class="text-center text-gray-500 py-6">
        <PulseLoader />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing
          v-for="job in sortedJobs.slice(0, limit || sortedJobs.length)"
          :key="job.id"
          :job="job"
        />
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
