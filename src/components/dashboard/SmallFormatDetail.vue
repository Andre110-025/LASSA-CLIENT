<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import { useModal } from "vue-final-modal";
import CompleteAppPay from "./popups/CompleteAppPay.vue";
import { useHelpers } from "../../helper";
import SmallAdvertItem from "./SmallAdvertItem.vue";

const route = useRoute();

const { dateToSlash } = useHelpers();

const url = import.meta.env.VITE_API_URL;

const pageData = ref(null);
const loading = ref(false);
const loadingAction = ref(false);
const paymentUID = ref(null)
const pageId = ref(null)

const getAppInfo = async () => {
  loading.value = true;

  try {
    const { data } = await axios.get(`getsmallformatad/${route.params.id}`);

    if (data.success) {
      pageData.value = data.data;
      paymentUID.value = data.data.payment_id
      loading.value = false;
    }
  } catch (error) {}
};

getAppInfo();

function completePayment(FeeType) {
  const { open, close } = useModal({
    component: CompleteAppPay,
    attrs: {
      onConfirm() {
        close();
        getAppInfo();
      },
      paymentID: pageData.value.payment_id,
      formType: FeeType,
    },
    slots: {},
  });

  open();
}

</script>

<template>
  <span
    v-if="pageData?.application_status === 'disapproved'"
    class="fixed bg-red-100 w-fit py-1 px-2 rounded select-none text-sm font-medium text-[#f00] top-24 right-3"
    >This is a Draft</span
  >
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">
      SMALL FORMAT ADVERT APPLICATION DETAILS
    </h4>

    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Address of Sign</p>
        <p class="text-sm" v-text="pageData.address_site"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">LGA</p>
        <p class="text-sm capitalize" v-text="pageData.lga"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.property_owner_phone"
      >
        <p class="w-2/5 text-sm font-semibold">Property Owner Phone</p>
        <p
          class="text-sm capitalize"
          v-text="pageData.property_owner_phone"
        ></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.property_owner_email"
      >
        <p class="w-2/5 text-sm font-semibold">Property Owner Email</p>
        <p
          class="text-sm capitalize"
          v-text="pageData.property_owner_email"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Fee Status</p>
        <p class="text-sm">
          <span
            class="block bg-green-100 text-[#00AE4E] text-xs text-center w-fit py-1 px-2 rounded select-none"
            v-if="pageData.application_pay_status === 'paid'"
            >Paid</span
          >
          <span
            class="block bg-red-100 text-[#f00] text-xs text-center w-fit py-1 px-2 rounded select-none"
            v-else
            >Not Paid</span
          >
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.inspection_fee">
        <p class="w-2/5 text-sm font-semibold">Inspection Fee Status</p>
        <p class="text-sm">
          <span
            class="block bg-green-100 text-[#00AE4E] text-xs text-center w-fit py-1 px-2 rounded select-none"
            v-if="pageData.application_site_inspection_status === 'paid'"
            >Paid</span
          >
          <span
            class="block bg-red-100 text-[#f00] text-xs text-center w-fit py-1 px-2 rounded select-none"
            v-else
            >Not Paid</span
          >
        </p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Payment ID</p>
        <p class="text-sm" v-text="pageData.payment_id"></p>
      </div>

      <div>
        <RouterLink
          class="italic font-semibold text-sm underline"
          :to="{
            name: 'ViewDownloads',
            params: { id: pageData.id, app_type: 'getsmallformatdownloadables' },
          }"
          >Click to view LASAA Issued Documents</RouterLink
        >
      </div>
    </div>

    <!-- Advert Details -->
    <div class="flex flex-col p-6 gap-4 fxfcol">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Advert Details
      </h6>

      <ul class="space-y-10">
        <SmallAdvertItem
          v-for="(item, index) in pageData.small_format_details"
          :key="index"
          :item="item"
          :paymentUID="paymentUID"
          :index="index"
          @getUpdate="getAppInfo"
        />
      </ul>
    </div>

    <div class="flex flex-row justify-center gap-4 pb-4 px-6">
      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="completePayment('SmallFormat Application')"
        v-if="pageData.application_pay_status === 'not_paid'"
      >
        Pay Application Fee
      </button>

      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="completePayment('SmallFormat Inspection')"
        v-if="
          pageData.inspection_fee &&
          pageData.application_site_inspection_status === 'not_paid'
        "
      >
        Pay Inspection Fee
      </button>
    </div>
  </div>
</template>

<style scoped>
div.fxfcol > div.flex {
  @apply gap-2 2md:flex-row flex-col;
}
div.fxfcol > div > p:nth-of-type(1) {
  @apply 2md:w-[40%] w-full;
}
div.fxfcol > div > p:nth-of-type(2) {
  @apply 2md:w-[60%] w-full;
}
</style>
