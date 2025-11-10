<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
import IconSpinner from "../../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import { VueFinalModal, useModal } from "vue-final-modal";
import { useRoute } from "vue-router";
import PayOutDoorApp from "./PayOutDoorApp.vue";
import IconCloseLight from "../../icons/IconCloseLight.vue";

const route = useRoute();

const emit = defineEmits(["confirm"]);
const loading = ref(false);
const uploadData = reactive({
  appealReason: '',
});

const SubmitAppeal = async () => {
  if (!uploadData.appealReason) {
    return;
  }
  try {
    loading.value = true;
    const { data } = await axios.post(
      `appealoutdoorsignage/${route.params.id}`,
      uploadData
    );

    if (data.success) {
      const appInfo = {
        payment_id: data.data[0].payment_id,
        total_price: data.total_price,
        charge_fee: data.chargeFee,
        public_key: data.public_key,
      };

      toast.success("Your request has been submitted", {
        position: toast.POSITION.TOP_CENTER,
      });

      toast.warn("Kindly pay Application Fee", {
        position: toast.POSITION.TOP_CENTER,
      });

      const { open, close } = useModal({
        component: PayOutDoorApp,
        attrs: {
          onConfirm() {
            close();
            emit("confirm", true);
          },
          appDetails: appInfo,
          formType: "OutdoorSite",
          appPurpose: "Appeal Application"
        },
        slots: {},
      });

      open();
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
        <p class="text-center font-bold mt-5">Application Appeal</p>
      </div>

      <form class="py-5" @submit.prevent="SubmitAppeal()">
        <div class="inputHolder">
          <label class="text-start mb-2.5 text-sm" for="appealReason"
            >Give Reason for Appeal</label
          >
          <textarea
            name="appealReason"
            id="appealReason"
            cols="3"
            class="input resize-none"
            placeholder="Minimum of 10 Characters"
            required
            v-model="uploadData.appealReason"
          ></textarea>
        </div>

        <div class="flex items-center px-4">
          <button
            :disabled="loading || uploadData.appealReason.length < 10"
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

        <i class="block text-center my-5">Application Fee Applies</i>
      </form>
    </div>
  </VueFinalModal>
</template>
