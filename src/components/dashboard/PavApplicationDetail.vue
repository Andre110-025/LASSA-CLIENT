<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios';
import GetData from './GetData.vue';
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import PayPermitBill from './popups/PayPermitBill.vue';
import { useHelpers } from '../../helper';

const { dateToSlash } = useHelpers();

const url = import.meta.env.VITE_API_URL;

const route = useRoute();

const pageData = ref(null);
const loading = ref(false);
const groupedData = ref({});

const sortVehicle = (data) => {

  console.log(data);
  // Iterate through the array and group objects
  data.forEach((item) => {
    const key = `${item.vehicle_type}`;

    // Check if the key exists, if not, create an empty array
    if (!groupedData.value[key]) {
      groupedData.value[key] = [];
    }

    // Push the current object to the array corresponding to the key
    groupedData.value[key].push(item);
  });

  // Convert the grouped data object to an array if needed
  // groupedArray.value = Object.values(groupedData.value);

  // console.log(groupedArray.value);
};


const getAppInfo = async () => {
  loading.value = true;

  try {
    const response = await axios.get(`getthirdpartymobiledetails/${route.params.id}`);

    if (response.status === 200) {
      pageData.value = response.data.data[0];

      sortVehicle(pageData.value.third_party_mobile_vehicle_lincense);
      loading.value = false;
    }
  } catch (error) {
    
  }
}

getAppInfo();

function payPermit() {
  const { open, close } = useModal({
    component: PayPermitBill,
    attrs: {
      onConfirm() {
        close();
        getAppInfo();
      },
      appID: pageData.value.id,
      adType: "ThirdPartyMobile",
      paymentID: pageData.value.payment_id
    },
    slots: {},
  });

  open();
}
</script>

<template>
  <GetData v-if="loading">Getting Application Details</GetData>
  <div v-else-if="pageData" class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto">
    <h4 class="text-sm text-center mb-5" >
      PROMOTIONAL ADVERT VEHICLE APPLICATION DETAILS
    </h4>
    

    <!-- Image and address -->
    <div
      class="flex 2md:flex-row flex-col w-full p-6 border-t-2 border-gray-300 border-b-2 mt-4"
      v-if="false"
    >
      <!-- <img class="block w-14 h-14 bg-gray-500 rounded-full m-auto" src="" alt="" /> -->
      <div class="flex flex-col justify-between w-4/5 h-fit gap-1">
        <div class="flex 2md:flex-row 2md:text-left text-center flex-col">
          <p class="2md:w-1/2 w-full">Tola Beauty</p>
          <p class="text-xs my-auto">2 Toyin street Surulere</p>
        </div>
        <div class="flex 2md:flex-row 2md:text-left text-center flex-col">
          <p class="text-xs 2md:w-1/2 w-full" v-text="pageData.payment_id"></p>
          <p class="text-xs">0801 234 5678</p>
        </div>
      </div>
    </div>

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
        <p class="text-sm" v-text="pageData.brand_name"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Duration</p>
        <p class="text-sm" v-text="pageData.duration"></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.start_date">
        <p class="w-2/5 text-sm font-semibold">Start Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.start_date)"></p>
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
        Vehicle Licenses
      </h6>

      <div class="block mb-4" v-for="(item, type) in groupedData" :key="type">
        <h6 class="text-sm font-semibold pb-2 mb-3" v-text="type"></h6>
        <ul class="flex flex-wrap gap-2.5 list-none">
          <li v-for="(carReg, index) in item" class="p-1.5 bg-blue-200 text-sm rounded-md" :key="index" v-text="carReg.vehicle_license"></li>
        </ul>     
      </div>
    </div>

    <!-- Signage Imagery -->
    <div class="flex flex-col p-6 gap-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Signage Imagery
      </h6>
      <div class="flex flex-col gap-4">
        <img v-for="(img, index) in pageData.vehicle_third_party_mobile" :key="index" :src="img.image_montage" alt="" class="w-full h-auto bg-gray-600" />
      </div>
    </div>

    <div class="flex flex-row justify-center gap-4 pb-5">
      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white text-center"
        @click="payPermit()"
        v-if="pageData.status === 'approved' && !pageData.legal_status"
      >
        Pay Permit Fee
      </button>
      <a
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white text-center"
        :href="`${url}generatethirdpartymobile/${pageData.id}`"
        target="_blank" rel="noopener noreferrer"        
        v-if="
          pageData.final_status === 'approved'
        "
      >
        Download Permit Letter
      </a>
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
