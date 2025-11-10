<script setup>
import { ref, reactive } from "vue";
import { VueFinalModal, useModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import DocumentLoader from "../DocumentLoader.vue";
import { toast } from "vue3-toastify";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { useRoute } from "vue-router";
import SelectUser from "./SelectUser.vue";

const route = useRoute();

const props = defineProps({});

const emit = defineEmits(["confirm"]);

const selectedBiz = ref(null);

const loading = ref(false);
const uploadData = reactive({
  NewOwner: null,
  // TransferOutstanding: false,
  StartDate: null,
  TransferLetter: null,
});

const { open: openSelection, close: closeSelection } = useModal({
  component: SelectUser,
  attrs: {
    onConfirm(info) {
      closeSelection();
      console.log(info);
      selectedBiz.value = info.business_name;
      uploadData.NewOwner = info.id;
    },
  },
  slots: {},
});

const uploadLetter = async () => {
  if (!uploadData.TransferLetter) {
    return;
  }
  try {
    loading.value = true;
    const { data } = await axios.post(
      `outdoortransferrequest/${route.params.id}`,
      uploadData
    );

    if (data.success) {
      toast.success("Your request is been processed", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
    }
  } catch (error) {
    if (error.response.status == 500) {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (!error.response.data.success && error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (!error.response.data.success) {
      error.response.data.errors.forEach((item) => {
        toast.error(item, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
    loading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:min-w-[28.125rem] max-h-[100dvh] sm:max-h-[30rem] max-w-[21.25rem] overflow-y-auto"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="flex flex-col">
      <button
        class="absolute right-6 top-5 cursor-pointer"
        @click="emit('confirm')"
      >
        <IconCloseLight class="w-4 h-auto" />
      </button>

      <div class="flex flex-col justify-center my-2.5 pt-2.5">
        <p class="text-center font-bold mt-5">Ownership Transfer</p>
      </div>

      <form class="py-5" @submit.prevent="uploadLetter()">
        <div class="inputHolder">
          <input
            type="text"
            placeholder="Click to select user"
            class="input placeholder:text-black"
            id="user_id"
            autocomplete="off"
            readonly
            v-model="selectedBiz"
            required
            @click="openSelection"
          />
        </div>

        <div v-if="false" class="relative flex gap-5 text-start mt-5 mb-5 px-5 text-sm">
          <label class="font-semibold" for="TransferOutstanding"
            >Check to Transfer Outstanding to New Owner</label
          >
          <input
            type="checkbox"
            id="TransferOutstanding"
            v-model="uploadData.TransferOutstanding"
          />
        </div>

        <div class="inputHolder">
          <input
            type="date"
            placeholder=" "
            class="input peer"
            id="start_date"
            autocomplete="off"
            v-model="uploadData.StartDate"
            required
          />
          <label for="start_date" class="inputLabel">Start Date</label>
        </div>
        <DocumentLoader
          label="reportDoc"
          @update:fileEncode="
            (base64Content) => (uploadData.TransferLetter = base64Content)
          "
        >
          Click to add Letter file
        </DocumentLoader>

        <div class="flex items-center px-4">
          <button
            :disabled="loading || !uploadData.TransferLetter"
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
