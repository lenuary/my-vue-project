import { defineStore } from "pinia";
import axios from "axios";
import { reactive } from "vue";

export const useJobsStore = defineStore("jobs", () => {
  const state = reactive({
    jobs: [],
    job: {},
    isLoading: false,
  });

  const fetchJobs = async () => {
    state.isLoading = true;
    try {
      const response = await axios.get("/api/jobs");
      state.jobs = response.data;
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      state.isLoading = false;
    }
  };

  const fetchJob = async (id) => {
    state.isLoading = true;
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      state.job = response.data;
    } catch (error) {
      console.error("Error fetching job", error);
    } finally {
      state.isLoading = false;
    }
  };

  const addJob = async (newJob) => {
    const response = await axios.post("/api/jobs", newJob);
    return response.data;
  };

  const deleteJob = async (id) => {
    await axios.delete(`/api/jobs/${id}`);
    state.jobs = state.jobs.filter((j) => j.id !== id);
  };

  const updateJob = async (id, updatedJob) => {
    const response = await axios.put(`/api/jobs/${id}`, updatedJob);
    return response.data;
  };

  return { state, fetchJobs, fetchJob, addJob, deleteJob, updateJob };
});
