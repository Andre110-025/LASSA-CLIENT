<script setup>
import { ref, reactive } from "vue";
import DocumentLoader from "../DocumentLoader.vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useUserStore } from "../../../stores/user";

const { getUserData, userDetails } = useUserStore();

defineProps({});

const loading = ref(false);
const emit = defineEmits(["changeEdit"]);

const interestData = reactive({
  companyprofile: null,
  cacfile: null,
  apconfile: null,
});

const submitUpdate = async () => {
  loading.value = true;
  try {
    const { data } = await axios.post(
      `editthirdpartykyc/${userDetails.userInfo.kyc_third_party.id}/legal`,
      interestData
    );
    console.log(data);
    if (data.success) {
      toast.success("Update Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getUserData();
      emit("changeEdit");
    }
  } catch (error) {
    if (!error.response.data.success) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
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
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h5>Supporting Document</h5>

    <DocumentLoader
      label="cacfile"
      @update:fileEncode="
        (base64Content) => (interestData.companyprofile = base64Content)
      "
    >
      Company Profile(Including Ownership Structure and Management Team)
    </DocumentLoader>

    <DocumentLoader
      label="cacfile"
      @update:fileEncode="
        (base64Content) => (interestData.cacfile = base64Content)
      "
    >
      Corporate Affair Commission.
    </DocumentLoader>

    <DocumentLoader
      label="apconfile"
      @update:fileEncode="
        (base64Content) => (interestData.apconfile = base64Content)
      "
    >
      Advertising Practitioner Council of Nigeria.
    </DocumentLoader>

    <div class="mt-5">
      <button
        :disabled="loading"
        @click="submitUpdate()"
        class="blueBtn w-full mx-auto rounded-none"
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loading"
          >Submit</span
        >
      </button>
    </div>
  </div>
</template>
