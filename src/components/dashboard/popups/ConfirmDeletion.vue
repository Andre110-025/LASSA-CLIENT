<script setup>
import { ref } from "vue";
import axios from "axios";
import { VueFinalModal } from "vue-final-modal";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ["single", "multiple"].includes(value),
  },
});

const emit = defineEmits(["confirm"]);

const loading = ref(false);
const error = ref("");

const handleDelete = async () => {
  loading.value = true;
  error.value = "";

  try {
    const endpoint =
      props.type === "single"
        ? `deleteonpremise/${props.id}`
        : `deletebulkonpremise/${props.id}`;

    const { status, data } = await axios.delete(endpoint);

    // console.log(response)
    if (status === 200 && data.success) {
      toast.success("Application deletion successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      router.push({ name: "RequestLists" });
      emit("confirm");
    } else {
      // error.value = "Failed to delete. Please try again.";
      toast.error("Failed to delete. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  } catch (err) {
    toast.error("An error occurred during deletion.", {
      position: toast.POSITION.TOP_CENTER,
    });
    // error.value = data?.message || "An error occurred during deletion.";
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  emit("confirm");
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:w-4/5 sm:min-w-[28.125rem] max-w-[500px] rounded-md"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="false"
  >
    <div class="p-6">
      <div class="flex flex-col items-center">
        <!-- Warning Icon -->
        <div
          class="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <!-- Confirmation Message -->
        <h3 class="text-lg font-medium text-center text-gray-900 mb-2">
          Confirm Deletion
        </h3>

        <p class="text-center text-gray-600 mb-6">
          <template v-if="type === 'single'">
            Are you sure you want to delete this application? This action cannot
            be undone.
          </template>
          <template v-else>
            Are you sure you want to delete these applications? This action
            cannot be undone.
            <br />
            <i class="text-red-600 text-xs"
              >This includes other locations uploaded as bulk with this
              application excluding locations that application fee has been
              paid.</i
            >
          </template>
        </p>

        <!-- Error Message -->
        <p v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</p>

        <!-- Action Buttons -->
        <div class="flex gap-4 w-full justify-center">
          <button
            @click="handleCancel"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            :disabled="loading"
          >
            Cancel
          </button>

          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
            <span class="text-white" v-else>
              {{
                type === "single" ? "Delete Application" : "Delete Applications"
              }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
