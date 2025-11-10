<script setup>
import { ref, reactive } from "vue";
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import { toast } from "vue3-toastify";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { useRoute } from "vue-router";
import SignTypesSelector from "../SignTypesSelector.vue";

const route = useRoute();

defineProps({
  signType: {
    type: String,
    default: "",
  },
});

const requestType = ["upgrade", "downgrade"];

const emit = defineEmits(["confirm"]);

const loading = ref(false);

const upDownGradeData = reactive({
  typeRequest: null,
  new_sign: null,
});

const submitRequest = async () => {
  if (!(upDownGradeData.new_sign && upDownGradeData.typeRequest)) {
    return;
  }
  try {
    loading.value = true;
    const { data } = await axios.post(
      `outdoorupgradeanddowngrade/${route.params.id}`,
      upDownGradeData
    );

    if (data.success) {
      toast.success("Pay Application Fee to process request", {
        position: toast.POSITION.TOP_CENTER,
      });

      emit("confirm", true);
    }
  } catch (error) {
    toast.error("Something Went Wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.error(error);
    loading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:min-w-[28.125rem] h-full sm:max-h-[24rem] max-w-[21.25rem] overflow-y-auto"
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
        <p class="text-center mt-5">Upgrade/Downgrade Permit</p>
      </div>

      <form class="py-5" @submit.prevent="submitRequest()">
        <div class="flex flex-col px-4">
          <div class="inputHolder">
            <select
              placeholder=" "
              class="input peer"
              id="typeRequest"
              v-model="upDownGradeData.typeRequest"
              required
            >
              <option
                v-for="(item, index) in requestType"
                :key="index"
                :value="item"
                v-text="item"
              ></option>
            </select>
            <label for="typeRequest" class="inputLabel">Request Type</label>
          </div>

          <SignTypesSelector
            :productType="'outdoor'"
            v-model="upDownGradeData.new_sign"
            :disableSelected="true"
            :selected-sign="signType"
          />

          <div class="px-5">
            <button
              :disabled="
                loading ||
                !(upDownGradeData.new_sign && upDownGradeData.typeRequest)
              "
              type="submit"
              class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
            >
              <IconSpinner v-if="loading" />
              <span
                class="text-xs text-center font-medium text-white tracking-wider"
                v-if="!loading"
              >
                Submit Request
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>
