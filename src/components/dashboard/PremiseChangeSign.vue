<script setup>
import { ref, reactive } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import IconDelete from "../icons/IconDelete.vue";
import { toast } from "vue3-toastify";
import axios from "axios";
import PhotoLoader from "./PhotoLoader.vue";
import PayAdvertDialog from "./popups/PayAdvertApplication.vue";
import { useModal } from "vue-final-modal";
import SignTypesSelector from "./SignTypesSelector.vue";

const props = defineProps({
  appId: {
    required: true,
  },
  selectSign: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["getUpdate"]);

const loading = ref(false);
const appInfo = ref(null);
const maxNumber = props.selectSign.number_of_sign;

const changeData = reactive({
  purpose: "Change of Sign",
  onpremiseform: {
    onpremiseinfo: [props.selectSign],
  },
});

changeData.onpremiseform.onpremiseinfo[0].photo_montage = null;

const submitChangeData = async () => {
  loading.value = true;
  try {
    const response = await axios.post(
      `changeonpremisesign/${props.appId}`,
      changeData
    );
    console.log(response);
    if (response.status === 200) {
      appInfo.value = response.data;

      toast.success("Application Sign Saved", {
        position: toast.POSITION.TOP_CENTER,
      });

      const { open, close } = useModal({
        component: PayAdvertDialog,
        attrs: {
          onConfirm() {
            close();
            emits("getUpdate");
          },
          appDetails: appInfo.value,
          formType: "Onpremise",
          appPurpose: "Change of Sign",
        },
        slots: {},
      });

      open();
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
  <form @submit.prevent="submitChangeData" class="scroll-mt-24">
    <h5 class="font-medium px-5 mb-5 flex items-center justify-between">
      <span>Change Sign</span>
    </h5>

    <SignTypesSelector
      :productType="'on_premise'"
      v-model="changeData.onpremiseform.onpremiseinfo[0].type_of_sign"
      :label="'Change Sign Type'"
    />

    <div class="">
      <div class="inputHolder">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          :id="'signNumber' + 0"
          v-model="changeData.onpremiseform.onpremiseinfo[0].number_of_sign"
          autocomplete="off"
          min="1"
          :max="maxNumber"
          required
        />
        <label :for="'signNumber' + 0" class="inputLabel"
          >Number of Signs to change</label
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
            v-model="changeData.onpremiseform.onpremiseinfo[0].width_in_meter"
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
            v-model="changeData.onpremiseform.onpremiseinfo[0].length_in_meter"
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
          (changeData.onpremiseform.onpremiseinfo[0].photo_montage =
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
        @click="submitPremiseData"
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
