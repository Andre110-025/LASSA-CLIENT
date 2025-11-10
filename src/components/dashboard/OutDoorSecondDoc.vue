<script setup>
import { ref, reactive } from "vue";
import DocumentLoader from "./DocumentLoader.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import IconSpinner from "../icons/IconSpinner.vue";

const props = defineProps({
  id: {
    required: true,
    type: String
  }
});

const emits = defineEmits(['updateApp']);

const loading = ref(false);
const outdoorData = reactive({ structuralDrawings: null, EIA: null });

const submitOutdoorData = async () => {
  loading.value = true;
  try {
    const { data } = await axios.post(`secondphaseoutdoorsignage/${props.id}`, outdoorData);
    console.log(data);
    if (data.success) {
      toast.success("Documents Uploaded", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    emits('updateApp');
    loading.value = false;
  } catch (error) {
    if (error.response.data.errors.length) {
      error.response.data.errors.forEach((element) => {
        toast.error(element, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);

    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="submitOutdoorData" class="max-w-md mx-auto">
    <h5 class="text-center font-medium mb-10">
      Upload Second Phase Document
    </h5>

    <DocumentLoader
      :label="'Structural Drawings'"
      @update:fileEncode="
        (base64Content) => (outdoorData.structuralDrawings = base64Content)
      "
    >
      Upload Sign Structural Drawings
    </DocumentLoader>

    <DocumentLoader
      :label="'EIA'"
      @update:fileEncode="(base64Content) => (outdoorData.EIA = base64Content)"
    >
      Upload EIA
    </DocumentLoader>

    <div class="mt-5 px-5 text-xs text-justify">
      <p>
        By Submitting the form, I declare that I am the duly authorized agent or
        owner of the business/company that has submitted this application to
        erect a sign. I verify that all information provided above are true and
        accurate and understand that false or misleading information provided by
        me in the course of this application will result in the automatic
        disqualification and attract a penalty which I undertake to pay. I also
        undertake to obtain the Agency's approval before I implement any changes
        to any sign approved by the Agency. I agree to notify the Agency of any
        change in my mailing address, status and/or telephone number.
      </p>
    </div>

    <div class="my-5 px-5">
      <button
        :disabled="loading"
        type="submit"
        class="blueBtn w-full mx-auto rounded-none"
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loading"
          >Submit Document</span
        >
      </button>
    </div>
  </form>
</template>
