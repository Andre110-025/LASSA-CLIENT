<script setup>
import { ref, reactive } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import axios from "axios";
import PhotoLoader from "./PhotoLoader.vue";
import SignTypesSelector from "./SignTypesSelector.vue";

const props = defineProps({
  appId: {
    required: true,
  },
  selectSign: {
    type: Object,
    required: true,
  },
  type: String,
});

const loading = ref(false);
const appInfo = ref(null);

const emits = defineEmits(["getUpdate"]);

const editData = reactive({
  onpremiseform: {
    onpremiseinfo: [props.selectSign],
  },
});

editData.onpremiseform.onpremiseinfo[0].photo_montage = null;

const submitAddData = async () => {
  loading.value = true;
  try {
    const response = await axios.post(`editadditionalinfoonpremise`, editData);

    console.log(response);
    if (response.status === 200) {
      appInfo.value = response.data;

      toast.success("Sign Update Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      emits("getUpdate");
    }
    loading.value = false;
  } catch (error) {
    if (error.response.data.errors?.length >= 1) {
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

    loading.value = false;
  }
};

const submitEditData = async () => {
  loading.value = true;

  try {
    const response = await axios.post(`editinfoonpremise`, editData);
    console.log(response);
    if (response.status === 200) {
      toast.success("Sign Update Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      emits("getUpdate");
    }
    loading.value = false;
  } catch (error) {
    if (error.response.data.errors?.length >= 1) {
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

    loading.value = false;
  }
};

const submitEditChange = async () => {
  loading.value = true;

  try {
    const response = await axios.post(`editchangeonpremise`, editData);
    console.log(response);
    if (response.status === 200) {
      toast.success("Sign Update Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      emits("getUpdate");
    }
    loading.value = false;
  } catch (error) {
    if (error.response.data.errors?.length >= 1) {
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

    loading.value = false;
  }
};
</script>

<template>
  <form class="scroll-mt-24">
    <h5 class="font-medium px-5 mb-5 flex items-center justify-between">
      <span>Edit Sign</span>
    </h5>

    <SignTypesSelector
      :productType="'on_premise'"
      v-model="editData.onpremiseform.onpremiseinfo[0].type_of_sign"
    />

    <div class="">
      <div v-if="type === 'edit'" class="inputHolder">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          :id="'signNumber' + 0"
          v-model="editData.onpremiseform.onpremiseinfo[0].number_of_sign"
          autocomplete="off"
          min="1"
          required
        />
        <label :for="'signNumber' + 0" class="inputLabel"
          >Number of Signs</label
        >
      </div>

      <div v-else-if="type === 'additional'" class="inputHolder">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          :id="'signNumber' + 0"
          v-model="editData.onpremiseform.onpremiseinfo[0].sign_to_add"
          autocomplete="off"
          min="1"
          required
        />
        <label :for="'signNumber' + 0" class="inputLabel"
          >Number of Signs</label
        >
      </div>

      <div class="flex flex-row gap-2.5 items-center px-5">
        <input
          type="checkbox"
          :name="'product_on_sign' + index"
          :id="'product_on_sign' + index"
          v-model="editData.onpremiseform.onpremiseinfo[0].product_on_sign"
        /><label class="text-sm" :for="'product_on_sign' + index"
          >check if Product is on Sign</label
        >
      </div>

      <h5 class="font-medium px-5 my-5">Dimension of Sign</h5>

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            :id="'length_sign' + 0"
            min="1"
            autocomplete="off"
            v-model="editData.onpremiseform.onpremiseinfo[0].width_in_meter"
            required
          />
          <label :for="'length_sign' + 0" class="inputLabel"
            >length(meter)</label
          >
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            :id="'width_sign' + 0"
            autocomplete="off"
            v-model="editData.onpremiseform.onpremiseinfo[0].length_in_meter"
            required
          />
          <label :for="'width_sign' + 0" class="inputLabel">Width(meter)</label>
        </div>
      </div>
    </div>

    <PhotoLoader
      :label="'Photomontage' + 0"
      @update:photoEncode="
        (base64Content) =>
          (editData.onpremiseform.onpremiseinfo[0].photo_montage =
            base64Content)
      "
    >
      Upload a Photomontage
    </PhotoLoader>

    <div class="my-5 px-5">
      <button
        :disabled="loading"
        type="submit"
        class="blueBtn w-full mx-auto rounded-none"
        @click="submitEditData"
        v-if="type === 'edit'"
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loading"
          >Submit</span
        >
      </button>

      <button
        :disabled="loading"
        type="submit"
        class="blueBtn w-full mx-auto rounded-none"
        @click="submitEditChange"
        v-else-if="type === 'change'"
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loading"
          >Submit</span
        >
      </button>

      <button
        :disabled="loading"
        type="submit"
        class="blueBtn w-full mx-auto rounded-none"
        @click="submitAddData"
        v-else
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loading"
          >Submit</span
        >
      </button>
    </div>
  </form>
</template>
