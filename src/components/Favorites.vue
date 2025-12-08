<script setup>
import { useJobsStore } from "@/stores/jobs";
import JobListing from "@/components/JobListing.vue";
import { computed, onMounted } from "vue";

const store = useJobsStore();

const favoriteJobs = computed(() => {
  return store.state.jobs.filter((job) =>
    store.state.favorites.includes(job.id)
  );
});

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
        My Favorite Offers
      </h2>

      <div v-if="store.state.isLoading" class="text-center text-gray-500 py-6">
        Loading your favorites...
      </div>

      <div
        v-else-if="favoriteJobs.length === 0"
        class="text-center text-gray-500 py-10"
      >
        <p class="mb-4">You don't have any favorite offers yet.</p>
        <RouterLink
          to="/jobs"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Browse Jobs
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobListing v-for="job in favoriteJobs" :key="job.id" :job="job" />
      </div>
    </div>
  </section>
</template>
