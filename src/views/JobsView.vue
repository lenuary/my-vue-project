<script setup>
import { onMounted } from "vue";
import JobListings from "@/components/JobListings.vue";
import { useJobsStore } from "@/stores/jobs";

const store = useJobsStore();

onMounted(() => {
  store.fetchJobs();
});
</script>

<template>
  <JobListings />
</template>
