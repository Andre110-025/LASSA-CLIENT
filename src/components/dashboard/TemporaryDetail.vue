<script setup>
import { ref, provide } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import CompleteAppPay from "./popups/CompleteAppPay.vue";
import PayPermitBill from "./popups/PayPermitBill.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import IconSpinner from "../icons/IconSpinner.vue";
import TemporaryAdvertItem from "./TemporaryAdvertItem.vue";

const route = useRoute();

const { dateToSlash } = useHelpers();

const url = import.meta.env.VITE_API_URL;

const pageData = ref(null);
provide("appData", pageData);
const loading = ref(false);
const loadingAction = ref(false);

const getAppInfo = async () => {
  loading.value = true;

  try {
    const response = await axios.get(
      `getmyfirstpartytemporaryads/${route.params.id}`
    );
    console.log(response)

    if (response.status === 200) {
      pageData.value = response.data.data[0];
      loading.value = false;
    }
  } catch (error) {}
};

getAppInfo();

function completePayment() {
  const { open, close } = useModal({
    component: CompleteAppPay,
    attrs: {
      onConfirm() {
        close();
        getAppInfo();
      },
      paymentID: pageData.value.payment_id,
      formType: "Firstparty TemporaryAds",
    },
    slots: {},
  });

  open();
}

function payPermit() {
  const { open, close } = useModal({
    component: PayPermitBill,
    attrs: {
      onConfirm() {
        close();
        getAppInfo();
      },
      appID: pageData.value.id,
      adType: "Firstparty TemporaryAds",
      paymentID: pageData.value.payment_id,
    },
    slots: {},
  });

  open();
}

const submitUpdate = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `submiteditfirstpartytemporary/${pageData.value.id}`
    );
    console.log(response);

    if (response.status === 200) {
      toast.success("Application Updated", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    if (error.response.data.error) {
      toast.error(error.response.data.error, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Update Could not be submitted", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loadingAction.value = false;
  }
};

const getPermit = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(
      `sendtemporaryadsapproveletter/${pageData.value.id}`
    );
    console.log(response);

    if (response.status === 200) {
      toast.success("permit set", {
        position: toast.POSITION.TOP_CENTER,
      });

      // await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    if (error.response.data.error) {
      toast.error(error.response.data.error, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loadingAction.value = false;
  }
};

provide("updateApp", getAppInfo);
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
      TEMPORARY ADVERT APPLICATION DETAILS
    </h4>

    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Name of Applicant(Company)</p>
        <p class="text-sm" v-text="pageData.name_of_company"></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Address of Company</p>
        <p class="text-sm" v-text="pageData.company_address"></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">LGA Of Company</p>
        <p class="text-sm" v-text="pageData.lga"></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">
          Name of Service/Product(Brand)
        </p>
        <p class="text-sm" v-text="pageData.name_of_service"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Location</p>
        <p class="text-sm capitalize" v-text="pageData.site_location"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Fee</p>
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

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Permit Fee</p>
        <p class="text-sm">
          <span
            class="block bg-green-100 text-[#00AE4E] text-xs text-center w-fit py-1 px-2 rounded select-none"
            v-if="pageData.pay_status === 'paid'"
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
        <p class="w-2/5 text-sm font-semibold">Application Status</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.application_status" />
        </p>
      </div>

      <div v-if="pageData.duration" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Type</p>
        <p class="text-sm">Blanket</p>
      </div>

      <div v-if="pageData.duration" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Duration</p>
        <p class="text-sm">
          {{ pageData.duration }}
        </p>
      </div>

      <div v-if="pageData.duration" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Blanket Category</p>
        <p class="text-sm">
          {{ pageData.first_party_temporary_ads_details[0].type_sign }}
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.start_date">
        <p class="w-2/5 text-sm font-semibold">Start Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.start_date)"></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.end_date">
        <p class="w-2/5 text-sm font-semibold">End Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.end_date)"></p>
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
            params: { id: pageData.id, app_type: 'gettemporarydownloadables' },
          }"
          >Click to view LASAA Issued Documents</RouterLink
        >
      </div>
    </div>

    <!-- Advert Details -->
    <div v-if="!pageData.duration" class="flex flex-col p-6 gap-4 fxfcol">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Advert Details
      </h6>

      <ul class="space-y-10">
        <TemporaryAdvertItem
          v-for="(item, index) in pageData.first_party_temporary_ads_details"
          :key="index"
          :item="item"
          :index="index"
          :editable="
            pageData.application_status === 'disapproved' ||
            pageData.rm_recommendation === 'pending'
          "
        />
      </ul>
    </div>

    <div class="flex flex-row justify-center gap-4 pb-4 px-6">
      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="completePayment()"
        v-if="pageData.application_pay_status === 'not_paid'"
      >
        Pay Application Fee
      </button>

      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="payPermit()"
        v-if="
          ((pageData.hod_recommendation === 'approved' &&
            pageData.assigned_department === 'Mobile_advert') ||
            (pageData.md_approval === 'approved' &&
              pageData.assigned_department === 'Registry')) &&
          pageData.pay_status === 'not_paid'
        "
      >
        Pay Permit Fee
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="blueBtn w-full mx-auto rounded-none"
        @click="submitUpdate"
        v-if="pageData?.application_status === 'disapproved'"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loadingAction"
          >Submit Application</span
        >
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
