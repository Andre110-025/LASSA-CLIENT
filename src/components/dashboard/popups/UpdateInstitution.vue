<script setup>
import { VueFinalModal } from "vue-final-modal";
import { ref, onMounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

const loading = ref(false);
const isInstitution =  ref(null);
const emit = defineEmits(["confirm"]);

const saveInstitution = async () => {
  try {
    loading.value = true;
    const { data } = await axios.get(`saveinstitution/${isInstitution.value}`)

    if (data.success) {
      toast.success("Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit('confirm');
    }
  } catch (error) {
    if (error.response.data.error) {
      toast.error(error.response.data.error, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loading.value = false;
  }
}
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border rounded-lg space-y-2 w-full sm:min-w-[28.125rem] sm:w-4/5 min-h-[350px] max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="false"
  >
    <div class="border-b-2 border-dashed">
      <h4 class="px-5 py-8 text-center">Are you an Institution?</h4>
    </div>
    <div class="p-10">
      <div>
        <p class="text-sm text-center italic">
          Institutions are businesses that manages the accounting of any on
          premise signs summing up or more than 15 in their branches. Check yes
          if this applies
        </p>

        <div class="flex gap-5 justify-center mt-5">
          <div class="flex gap-2.5">
            <input
              type="radio"
              v-model="isInstitution"
              class="peer"
              id="Yes"
              value="1"
            />
            <label for="Yes" class="">Yes</label>
          </div>
          <div class="flex gap-2.5">
            <input
              type="radio"
              v-model="isInstitution"
              class="peer"
              id="No"
              value="0"
            />
            <label for="No" class="">No</label>
          </div>
        </div>
      </div>

      <button
        @click="saveInstitution"
        :disabled="loading || !isInstitution"
        class="blueBtn mx-auto mt-5 max-w-[200px] text-center"
      >
        Submit
      </button>
    </div>
  </VueFinalModal>
</template>
