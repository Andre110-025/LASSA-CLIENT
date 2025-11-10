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
  evidenceoffinance: null,
  director_bank_statement: null,
  cacfile: null,
  taxcertificate: null,
  companyprofile: null,
  bankreference: null,
});

const submitUpdate = async () => {
  loading.value = true;
  try {
    const { data } = await axios.post(
      `editthirdpartykyc/${userDetails.userInfo.kyc_third_party.id}/account`,
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
      label="companyprofile"
      @update:fileEncode="
        (base64Content) => (interestData.companyprofile = base64Content)
      "
    >
      Company Profile(Including Ownership Structure and Management Team)
    </DocumentLoader>

    <!-- <h5 class="font-medium px-5 my-5">
      Evidence of registration for the following authority
    </h5> -->

    <DocumentLoader
      label="cacfile"
      @update:fileEncode="
        (base64Content) => (interestData.cacfile = base64Content)
      "
    >
      Corporate Affair Commission.
    </DocumentLoader>

    <!-- <h5 class="font-medium px-5 my-5">
      Relevant Government Clearance(s) Certificate
    </h5> -->

    <DocumentLoader
      label="taxcertificate"
      @update:fileEncode="
        (base64Content) => (interestData.taxcertificate = base64Content)
      "
    >
      3 years Tax clearance Certificate of the company ( or of the Principal
      Director in case of new company)
    </DocumentLoader>

    <DocumentLoader
      label="evidenceoffinance"
      @update:fileEncode="
        (base64Content) => (interestData.evidenceoffinance = base64Content)
      "
    >
      Evidence of good source of Finance. (Minimum of 25 Million Naira e.g.
      Share Certificate, Fixed Deposit, Treasury bill e.t.c)
    </DocumentLoader>

    <DocumentLoader
      label="director_bank_statement"
      @update:fileEncode="
        (base64Content) =>
          (interestData.director_bank_statement = base64Content)
      "
    >
      Bank Statement of the Principal Director of the company certified by the
      bank (In case of New Company)
    </DocumentLoader>

    <DocumentLoader
      label="bankreference"
      @update:fileEncode="
        (base64Content) => (interestData.bankreference = base64Content)
      "
    >
      Bank Reference and Corporate Organization Reference
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
