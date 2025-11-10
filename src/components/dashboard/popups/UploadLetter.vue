<script setup>
import { ref, reactive, computed } from "vue";
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import PhotoLoader from "../PhotoLoader.vue";
import DocumentLoader from "../DocumentLoader.vue";
import { toast } from "vue3-toastify";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { requiredIf, helpers } from "@vuelidate/validators";
import { useHelpers } from "../../../helper";

const { todayDate, endOfYear } = useHelpers();
const route = useRoute();

const props = defineProps({
  action: {
    default: "Off Charge",
    type: String,
  },
});

const emit = defineEmits(["confirm"]);

const loading = ref(false);
const uploadData = reactive({
  typeCharges: props.action,
  OffchargeLetter: null,
  off_charge_picture: null,
  off_charge_start: null,
  off_charge_end: null,
  expunge_date: null,
});

const rules = computed(() => ({
  OffchargeLetter: {
    requiredIfAction: helpers.withMessage(
      "Field is required",
      requiredIf(props.action === "Off Charge")
    ),
  },
  off_charge_picture: {
    requiredIfAction: helpers.withMessage(
      "Field is required",
      requiredIf(props.action === "Off Charge")
    ),
  },
  off_charge_start: {
    requiredIfAction: helpers.withMessage(
      "Field is required",
      requiredIf(props.action === "Off Charge")
    ),
  },
  off_charge_end: {
    requiredIfAction: helpers.withMessage(
      "Field is required",
      requiredIf(props.action === "Off Charge")
    ),
  },
  expunge_date: {
    requiredIfAction: helpers.withMessage(
      "Field is required",
      requiredIf(props.action === "Expunction")
    ),
  },
}));

const v$ = useVuelidate(rules, uploadData);

const uploadLetter = async () => {
  if (props.action === 'Off Charge' && !uploadData.OffchargeLetter) {
    return;
  }
  try {
    loading.value = true;
    const { data } = await axios.post(
      `outdoorsignagerequest/${route.params.id}`,
      uploadData
    );

    if (data.success) {
      toast.success("Your request is been processed", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
    }
  } catch (error) {
    if (!error.response.data.success) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm");
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    loading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:min-w-[28.125rem] h-fit max-h-dvh max-w-[21.25rem] overflow-y-auto"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="false"
  >
    <div class="flex flex-col">
      <button
        class="absolute right-6 top-5 cursor-pointer"
        @click="emit('confirm')"
      >
        <IconCloseLight class="w-4 h-auto" />
      </button>

      <div class="flex flex-col justify-center my-2.5 pt-2.5">
        <p class="text-center mt-5">Fill {{ props.action }} Details</p>
      </div>

      <form class="py-5" @submit.prevent="uploadLetter()">
        <div v-if="action === 'Expunction'" class="inputHolder">
          <input
            type="date"
            placeholder=" "
            class="input peer"
            id="installation_date"
            autocomplete="off"
            v-model="uploadData.expunge_date"
            :min="todayDate()"
            required
          />
          <label for="installation_date" class="inputLabel"
            >Expunction Date</label
          >
        </div>
        <div v-else>
          <div class="inputHolder">
            <input
              type="date"
              placeholder=" "
              class="input peer"
              id="installation_date"
              autocomplete="off"
              :min="todayDate()"
              :max="endOfYear()"
              v-model="uploadData.off_charge_start"
              required
            />
            <label for="installation_date" class="inputLabel">Start Date</label>
          </div>
          <div class="inputHolder">
            <input
              type="date"
              placeholder=" "
              class="input peer"
              id="installation_date"
              :min="uploadData.off_charge_start || todayDate()"
              :max="endOfYear()"
              autocomplete="off"
              v-model="uploadData.off_charge_end"
              required
            />
            <label for="installation_date" class="inputLabel">End Date</label>
          </div>
          <PhotoLoader
            :label="'off_charge_picture'"
            @update:photoEncode="
              (base64Content) =>
                (uploadData.off_charge_picture = base64Content)
            "
          >
            Site Image
          </PhotoLoader>

          <DocumentLoader
            label="reportDoc"
            @update:fileEncode="
              (base64Content) => (uploadData.OffchargeLetter = base64Content)
            "
          >
            Click to add Letter file
          </DocumentLoader>
        </div>

        <div class="flex items-center px-4">
          <button
            :disabled="v$.$invalid || loading"
            type="submit"
            class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Submit
            </span>
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
