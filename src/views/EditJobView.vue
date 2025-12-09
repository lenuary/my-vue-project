<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useJobsStore } from "@/stores/jobs";
import { useForm } from "vee-validate";
import * as yup from "yup";

const route = useRoute();
const router = useRouter();
const jobId = route.params.id;

const store = useJobsStore();
const toast = useToast();

const isLoading = ref(true);

const schema = yup.object({
  type: yup.string().required("Job Type is required"),
  title: yup
    .string()
    .required("Job Title is required")
    .min(3, "Job Title must be at least 3 characters"),
  description: yup.string().required("Description is required"),
  salary: yup.string().required("Salary is required"),
  location: yup.string().required("Location is required"),
  company: yup.object({
    name: yup.string().required("Company Name is required"),
    description: yup.string().required("Company Description is required"),
    contactEmail: yup
      .string()
      .email("Must be a valid email")
      .required("Contact Email is required"),
    contactPhone: yup.string(),
  }),
});

const { defineField, handleSubmit, setValues, errors, isSubmitting } = useForm({
  validationSchema: schema,
});

const [type, typeAttrs] = defineField("type");
const [title, titleAttrs] = defineField("title");
const [description, descriptionAttrs] = defineField("description");
const [salary, salaryAttrs] = defineField("salary");
const [location, locationAttrs] = defineField("location");

const [companyName, companyNameAttrs] = defineField("company.name");
const [companyDesc, companyDescAttrs] = defineField("company.description");
const [companyEmail, companyEmailAttrs] = defineField("company.contactEmail");
const [companyPhone, companyPhoneAttrs] = defineField("company.contactPhone");

onMounted(async () => {
  try {
    isLoading.value = true;
    await store.fetchJob(jobId);

    setValues(store.state.job);
  } catch (error) {
    console.error("Error fetching job", error);
    toast.error("Failed to retrieve offer data");
    router.push("/jobs");
  } finally {
    isLoading.value = false;
  }
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await store.updateJob(jobId, values);

    toast.success("Offer updated successfully");
    router.push(`/jobs/${response.id}`);
  } catch (error) {
    console.error("Error updating job", error);
    toast.error("Failed to edit the offer");
  }
});
</script>

<template>
  <section class="bg-green-50">
    <div class="container m-auto max-w-2xl py-24">
      <div
        class="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
      >
        <div v-if="isLoading" class="text-center py-10">
          <span class="text-gray-500 text-xl">Loading offer data...</span>
        </div>

        <form v-else @submit="onSubmit">
          <h2 class="text-3xl text-center font-semibold mb-6">Edit Job</h2>

          <div class="mb-4">
            <label for="type" class="block text-gray-700 font-bold mb-2"
              >Job Type</label
            >
            <select
              v-model="type"
              v-bind="typeAttrs"
              id="type"
              name="type"
              class="border rounded w-full py-2 px-3"
              :class="{ 'border-red-500': errors.type }"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
            <span class="text-red-500 text-sm">{{ errors.type }}</span>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2"
              >Job Listing Name</label
            >
            <input
              type="text"
              v-model="title"
              v-bind="titleAttrs"
              id="name"
              name="name"
              class="border rounded w-full py-2 px-3 mb-2"
              :class="{ 'border-red-500': errors.title }"
              placeholder="eg. Beautiful Apartment In Miami"
            />
            <span class="text-red-500 text-sm">{{ errors.title }}</span>
          </div>

          <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2"
              >Description</label
            >
            <textarea
              id="description"
              v-model="description"
              v-bind="descriptionAttrs"
              name="description"
              class="border rounded w-full py-2 px-3"
              :class="{ 'border-red-500': errors.description }"
              rows="4"
              placeholder="Add any job duties, expectations, requirements, etc"
            ></textarea>
            <span class="text-red-500 text-sm">{{ errors.description }}</span>
          </div>

          <div class="mb-4">
            <label for="salary" class="block text-gray-700 font-bold mb-2"
              >Salary</label
            >
            <select
              id="salary"
              v-model="salary"
              v-bind="salaryAttrs"
              name="salary"
              class="border rounded w-full py-2 px-3"
              :class="{ 'border-red-500': errors.salary }"
            >
              <option value="Under $50K">under $50K</option>
              <option value="$50K - $60K">$50 - $60K</option>
              <option value="$60K - $70K">$60 - $70K</option>
              <option value="$70K - $80K">$70 - $80K</option>
              <option value="$80K - $90K">$80 - $90K</option>
              <option value="$90K - $100K">$90 - $100K</option>
              <option value="$100K - $125K">$100 - $125K</option>
              <option value="$125K - $150K">$125 - $150K</option>
              <option value="$150K - $175K">$150 - $175K</option>
              <option value="$175K - $200K">$175 - $200K</option>
              <option value="Over $200K">Over $200K</option>
            </select>
            <span class="text-red-500 text-sm">{{ errors.salary }}</span>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2">Location</label>
            <input
              type="text"
              v-model="location"
              v-bind="locationAttrs"
              id="location"
              name="location"
              class="border rounded w-full py-2 px-3 mb-2"
              :class="{ 'border-red-500': errors.location }"
              placeholder="Company Location"
            />
            <span class="text-red-500 text-sm">{{ errors.location }}</span>
          </div>

          <h3 class="text-2xl mb-5">Company Info</h3>

          <div class="mb-4">
            <label for="company" class="block text-gray-700 font-bold mb-2"
              >Company Name</label
            >
            <input
              type="text"
              v-model="companyName"
              v-bind="companyNameAttrs"
              id="company"
              name="company"
              class="border rounded w-full py-2 px-3"
              :class="{ 'border-red-500': errors['company.name'] }"
              placeholder="Company Name"
            />
            <span class="text-red-500 text-sm">{{
              errors["company.name"]
            }}</span>
          </div>

          <div class="mb-4">
            <label
              for="company_description"
              class="block text-gray-700 font-bold mb-2"
              >Company Description</label
            >
            <textarea
              id="company_description"
              v-model="companyDesc"
              v-bind="companyDescAttrs"
              name="company_description"
              class="border rounded w-full py-2 px-3"
              :class="{ 'border-red-500': errors['company.description'] }"
              rows="4"
              placeholder="What does your company do?"
            ></textarea>
            <span class="text-red-500 text-sm">{{
              errors["company.description"]
            }}</span>
          </div>

          <div class="mb-4">
            <label
              for="contact_email"
              class="block text-gray-700 font-bold mb-2"
              >Contact Email</label
            >
            <input
              type="email"
              v-model="companyEmail"
              v-bind="companyEmailAttrs"
              id="contact_email"
              name="contact_email"
              class="border rounded w-full py-2 px-3"
              :class="{ 'border-red-500': errors['company.contactEmail'] }"
              placeholder="Email address for applicants"
            />
            <span class="text-red-500 text-sm">{{
              errors["company.contactEmail"]
            }}</span>
          </div>

          <div class="mb-4">
            <label
              for="contact_phone"
              class="block text-gray-700 font-bold mb-2"
              >Contact Phone</label
            >
            <input
              type="tel"
              v-model="companyPhone"
              v-bind="companyPhoneAttrs"
              id="contact_phone"
              name="contact_phone"
              class="border rounded w-full py-2 px-3"
              placeholder="Optional phone for applicants"
            />
          </div>

          <div>
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="submit"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Updating..." : "Update Job" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
