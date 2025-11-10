<script setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import PayPermitBill from "./popups/PayPermitBill.vue";
import CompleteAppPay from "./popups/CompleteAppPay.vue";
import { useHelpers } from "../../helper";
import MobileMontageList from "./MobileMontageList.vue";
import MobileVehicleList from "./MobileVehicleList.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";

const { dateToSlash } = useHelpers();

const route = useRoute();

const pageData = ref(null);
// Create an object to store grouped data
const groupedData = ref({});
const groupedArray = ref(null);
const loading = ref(false);
const loadingAction = ref(false);

const getAppInfo = async () => {
  loading.value = true;

  try {
    const response = await axios.get(`getmobileadsdetails/${route.params.id}`);
    console.log(response)
    if (response.status === 200) {
      pageData.value = response.data.data[0];
      loading.value = false;
      sortVehicle(pageData.value.mobile_ads_vehicle_license);
    }
  } catch (error) {}
};

const sortVehicle = (data) => {
  // Iterate through the array and group objects
  groupedData.value = {};
  groupedArray.value = null;
  data.forEach((item) => {
    const key = `${item.branding_details}_${item.vehicle_type}`;

    // Check if the key exists, if not, create an empty array
    if (!groupedData.value[key]) {
      groupedData.value[key] = [];
    }

    // Push the current object to the array corresponding to the key
    groupedData.value[key].push(item);
  });

  // Convert the grouped data object to an array if needed
  groupedArray.value = Object.values(groupedData.value);

  // console.log(groupedArray.value);
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
      formType: "MobileAds",
      appPurpose: "Application for New Sign",
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
      adType: "Mobile",
      paymentID: pageData.value.payment_id,
    },
    slots: {},
  });

  open();
}

const brandData = reactive({
  brandname: null,
});

const editBrandName = ref(false);

const updateBrandName = async () => {
  if (!brandData.brandname) {
    return;
  }

  loadingAction.value = true;

  try {
    const response = await axios.put(
      `editbrandingname/${pageData.value.id}`,
      brandData
    );
    console.log(response);
    if (response.status === 200) {
      toast.success("Saved! Ensure you Submit Application", {
        position: toast.POSITION.TOP_CENTER,
      });

      pageData.value.brand_name = brandData.brandname;
      brandData.brandname = null;
      editBrandName.value = false;
    }

    loadingAction.value = false;
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loadingAction.value = false;
  }
};

const submitUpdate = async () => {
  try {
    loadingAction.value = true;

    const response = await axios.post(`submiteditmobile/${pageData.value.id}`);
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
</script>

<template>
  <span
    v-if="pageData?.status === 'declined'"
    class="fixed bg-red-100 w-fit py-1 px-2 rounded select-none text-sm font-medium text-[#f00] top-24 right-3"
    >This is a Draft</span
  >
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">MOBILE ADVERT APPLICATION DETAILS</h4>

    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Purpose of Application</p>
        <p
          class="text-sm"
          v-text="
            pageData.purpose_of_application || 'Application for a new sign'
          "
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Brand Name</p>
        <div>
          <p
            v-if="!editBrandName"
            class="text-sm"
            v-text="pageData.brand_name"
          ></p>
          <span
            v-if="!editBrandName && pageData?.status === 'declined'"
            @click="editBrandName = true"
            class="italic text-xs cursor-pointer"
            >Edit Name</span
          >
          <form
            v-if="editBrandName"
            class="flex gap-2.5"
            @submit.prevent="updateBrandName()"
          >
            <input
              class="text-xs px-1.5 py-2 rounded-md border-2 border-opacity-40 focus:border-opacity-100 border-mainColor outline-none"
              type="text"
              name="brand_name"
              id="brand_name"
              placeholder="Enter Brand Name"
              v-model="brandData.brandname"
            />
            <button :disabled="loadingAction" class="text-xs" type="submit">
              Update
            </button>
          </form>
        </div>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Duration</p>
        <p class="text-sm" v-text="pageData.duration"></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.due_date">
        <p class="w-2/5 text-sm font-semibold">Due Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.due_date)"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Payment ID</p>
        <p class="text-sm" v-text="pageData.payment_id"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Status</p>
        <p class="text-sm"><IconAppStatus :status="pageData.status" /></p>
      </div>
    </div>

    <!-- Vehicle Licenses -->
    <div class="flex flex-col p-6 gap-4 fxfcol">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Vehicle Information
      </h6>

      <ul class="">
        <MobileVehicleList
          v-for="(vehicleGroup, index) in groupedArray"
          :key="index"
          :finalStatus="pageData.final_status"
          :vehicleData="vehicleGroup"
          :dataIndex="index"
          :appId="pageData.id"
          :status="pageData.status"
          @update="getAppInfo()"
        />
      </ul>
    </div>

    <!-- Signage Imagery -->
    <div class="flex flex-col p-6 gap-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Signage Imagery
      </h6>
      <MobileMontageList
        :montages="pageData.vehicle_mobile"
        :appId="pageData.id"
        :status="pageData.status"
        @update="getAppInfo()"
      />
    </div>

    <div class="flex flex-row justify-center gap-4 pb-5">
      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="completePayment()"
        v-if="pageData.Application_pay_status === 'not_paid'"
      >
        Pay Application Fee
      </button>

      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="payPermit()"
        v-if="pageData.status === 'approved' && !pageData.legal_status"
      >
        Pay Permit Fee
      </button>

      <button
        class="p-3 bg-mainColor text-sm rounded-md text-white w-44"
        @click="submitUpdate()"
        :disabled="loadingAction"
        v-if="pageData.status === 'declined'"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Submit Update
        </span>
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
