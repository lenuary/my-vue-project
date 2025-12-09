import { defineStore } from "pinia";
import { reactive, watch } from "vue";

export const useJobsStore = defineStore("jobs", () => {
  const state = reactive({
    jobs: [],
    job: null,
    isLoading: false,
    favorites: [],
  });

  if (localStorage.getItem("favorites")) {
    state.favorites = JSON.parse(localStorage.getItem("favorites"));
  }

  watch(
    () => state.favorites,
    (newFavorites) => {
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    },
    { deep: true }
  );

  const toggleFavorite = (jobId) => {
    if (state.favorites.includes(jobId)) {
      state.favorites = state.favorites.filter((id) => id !== jobId);
    } else {
      state.favorites.push(jobId);
    }
  };

  const fetchJobs = async () => {
    state.isLoading = true;
    try {
      const response = await fetch(
        "https://api.joinrise.io/api/v1/jobs/public?limit=10"
      );
      const data = await response.json();

      const apiJobsList =
        data.result && data.result.jobs ? data.result.jobs : [];

      const mappedApiJobs = apiJobsList.map((apiJob) => {
        return {
          id: String(apiJob._id) || Math.random().toString(36).substr(2, 9),
          title: apiJob.title || "No Title",
          type: apiJob.type || "Full-Time",
          location: apiJob.locationAddress || "Remote",
          description:
            (apiJob.department || "") + " - " + (apiJob.seniority || ""),
          salary: "Undisclosed",
          company: {
            name: apiJob.owner?.companyName || "Unknown Company",
            description: apiJob.owner?.sector || "Company description.",
            contactEmail: "apply@joinrise.io",
            contactPhone: "N/A",
          },
          isCustom: false,
        };
      });

      const localCustomJobs =
        JSON.parse(localStorage.getItem("my_custom_jobs")) || [];

      state.jobs = [...mappedApiJobs, ...localCustomJobs];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      state.jobs = JSON.parse(localStorage.getItem("my_custom_jobs")) || [];
    } finally {
      state.isLoading = false;
    }
  };

  const fetchJob = async (id) => {
    state.isLoading = true;
    state.job = null;

    try {
      if (state.jobs.length === 0) {
        await fetchJobs();
      }

      const foundJob = state.jobs.find((j) => String(j.id) === String(id));

      if (foundJob) {
        state.job = foundJob;
      } else {
        state.job = null;
      }
    } catch (error) {
      console.error("Error fetching single job:", error);
      state.job = null;
    } finally {
      state.isLoading = false;
    }
  };

  const addJob = async (newJob) => {
    newJob.id = Math.random().toString(36).substr(2, 9);
    newJob.isCustom = true;

    state.jobs.push(newJob);

    const currentCustomJobs =
      JSON.parse(localStorage.getItem("my_custom_jobs")) || [];
    currentCustomJobs.push(newJob);
    localStorage.setItem("my_custom_jobs", JSON.stringify(currentCustomJobs));

    return newJob;
  };

  const deleteJob = async (id) => {
    state.jobs = state.jobs.filter((j) => j.id !== id);

    const currentCustomJobs =
      JSON.parse(localStorage.getItem("my_custom_jobs")) || [];
    const updatedCustomJobs = currentCustomJobs.filter((j) => j.id !== id);
    localStorage.setItem("my_custom_jobs", JSON.stringify(updatedCustomJobs));
  };

  const updateJob = async (id, updatedJob) => {
    const index = state.jobs.findIndex((j) => j.id === id);
    if (index !== -1) {
      state.jobs[index] = { ...state.jobs[index], ...updatedJob };

      if (state.jobs[index].isCustom) {
        const currentCustomJobs =
          JSON.parse(localStorage.getItem("my_custom_jobs")) || [];
        const customIndex = currentCustomJobs.findIndex((j) => j.id === id);
        if (customIndex !== -1) {
          currentCustomJobs[customIndex] = {
            ...currentCustomJobs[customIndex],
            ...updatedJob,
          };
          localStorage.setItem(
            "my_custom_jobs",
            JSON.stringify(currentCustomJobs)
          );
        }
      }
    }
    return state.jobs[index];
  };

  return {
    state,
    fetchJobs,
    fetchJob,
    addJob,
    deleteJob,
    updateJob,
    toggleFavorite,
  };
});
