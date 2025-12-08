<script setup>
import { useJobsStore } from "@/stores/jobs";
import JobListing from "@/components/JobListing.vue";
import { computed } from "vue";

const store = useJobsStore();

const favoriteJobs = computed(() => {
  return store.state.jobs.filter((job) =>
    store.state.favorites.includes(job.id)
  );
});
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        My favorite offers
      </h2>

      <div v-if="favoriteJobs.length === 0" class="text-center text-gray-500">
        You don't have any favorite offers yet.
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing v-for="job in favoriteJobs" :key="job.id" :job="job" />
      </div>
    </div>
  </section>
</template>
