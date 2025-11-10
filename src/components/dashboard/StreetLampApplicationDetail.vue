<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import CompleteAppPay from "./popups/CompleteAppPay.vue";
import PayPermitBill from "./popups/PayStreetLampPermit.vue";
import ConfirmDialog from "./popups/ConfirmDialog.vue";
import IconDelete from "../icons/IconDelete.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import IconSpinner from "../icons/IconSpinner.vue";

const route = useRoute();

const { dateToSlash } = useHelpers();

const url = import.meta.env.VITE_API_URL;

const pageData = ref(null);
const loading = ref(false);

const getAppInfo = async () => {
  loading.value = true;

  try {
    const response = await axios.get(`getstreetlampdetails/${route.params.id}`);

    if (response.status === 200) {
      pageData.value = response.data.data[0];
      loading.value = false;
    }
  } catch (error) {}
};

const declineSign = async () => {
  loading.value = true;

  try {
    const response = await axios.post(
      `userdeclinestreetlampsads/${route.params.id}`
    );

    if (response.status === 200) {
      pageData.value = response.data.data[0];
      toast.success("Application Successfully Declined", {
        position: toast.POSITION.TOP_CENTER,
      });
      loading.value = false;
    }
  } catch (error) {
    toast.error("Action Could not be Performed", {
      position: toast.POSITION.TOP_CENTER,
    });
    loading.value = false;
  }
};

const removeStreetData = async (streetId) => {
  try {
    const response = await axios.get(`deletestreetlampInfo/${streetId}`);

    console.log(response);

    if (response.status === 200) {
      toast.success("Street Lamp Info Successfully deleted", {
        position: toast.POSITION.TOP_CENTER,
      });

      const updatedStreet = pageData.value.street_lamp_info.filter(
        (street) => street.id !== streetId
      );

      pageData.value.street_lamp_info = updatedStreet;
      // getAppInfo();
    }
  } catch (error) {
    console.log(error);
    toast.error("Action Could not be Performed", {
      position: toast.POSITION.TOP_CENTER,
    });
  }
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
      formType: "StreetLamp",
    },
    slots: {},
  });

  open();
}

const { open: openSignDecline, close: closeSignDecline } = useModal({
  component: ConfirmDialog,
  attrs: {
    onConfirm(bol) {
      if (bol) {
        declineSign()
      }
      closeSignDecline();
      // getAppInfo();
    },
  },
  slots: {},
});

function payPermit() {
  const { open, close } = useModal({
    component: PayPermitBill,
    attrs: {
      onConfirm() {
        close();
        getAppInfo();
      },
      appID: pageData.value.id,
      adType: "StreetLamp",
      paymentID: pageData.value.payment_id,
    },
    slots: {},
  });

  open();
}
</script>

<template>
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">
      STREET LAMP POLE APPLICATION DETAILS
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
        <p class="w-2/5 text-sm font-semibold">Name of Display</p>
        <p class="text-sm" v-text="pageData.name_of_display"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Expression of Interest</p>
        <p class="text-sm"><IconAppStatus :status="pageData.eoi_status" /></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Status</p>
        <p class="text-sm"><IconAppStatus :status="pageData.status" /></p>
      </div>

      <div v-if="false" class="flex xs:flex-row align-middle">
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

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.source_of_electricity"
      >
        <p class="w-2/5 text-sm font-semibold">Source of Electricity</p>
        <p class="text-sm" v-text="pageData.source_of_electricity"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.location_of_generator"
      >
        <p class="w-2/5 text-sm font-semibold">Generator Address/Location</p>
        <p class="text-sm" v-text="pageData.location_of_generator"></p>
      </div>
    </div>

    <div class="flex flex-col px-6 gap-4">
      <div
        class="flex flex-col gap-2"
        v-if="pageData.authorization_letter_lseb"
      >
        <p class="text-sm font-semibold">
          Authorization Letter from Electricity Supplier
        </p>
        <embed
          :src="pageData.authorization_letter_lseb"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
    </div>

    <!-- Street info and Imagery -->
    <ul>
      <li
        class="flex flex-col p-6 gap-4"
        v-for="(item, index) in pageData.street_lamp_info"
        :key="index"
      >
        <div>
          <h6
            class="flex justify-between border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
          >
            <span>Street {{ index + 1 }}</span>
            <button
              type="button"
              v-if="
                pageData.street_lamp_info.length > 1 &&
                !pageData.hod_permit_status
              "
              @click.once="removeStreetData(item.id)"
            >
              <IconDelete class="h-6 w-auto" />
            </button>
          </h6>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
          <p class="text-sm" v-text="item.type_of_sign"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Street Name</p>
          <p class="text-sm" v-text="item.site_address"></p>
        </div>

        <div class="flex xs:flex-row align-middle" v-if="item.street_category">
          <p class="w-2/5 text-sm font-semibold">Street Category</p>
          <p class="text-sm" v-text="item.street_category"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Number of Poles</p>
          <p class="text-sm" v-text="item.number_poles"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Weight</p>
          <p class="text-sm" v-text="item.weight_sign"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Height</p>
          <p class="text-sm" v-text="item.height_sign"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Width</p>
          <p class="text-sm" v-text="item.width_sign"></p>
        </div>

        <div class="flex flex-col gap-2">
          <p class="w-2/5 text-sm font-semibold">Photomontage</p>
          <img :src="item.photo_montage" alt="" class="w-full bg-gray-600" />
        </div>

        <div class="flex flex-col gap-2" v-if="item.owner_consent">
          <p class="text-sm font-semibold">Street Owner Consent</p>
          <embed
            :src="item.owner_consent"
            width="100%"
            height="100%"
            type="application/pdf"
          />
        </div>
      </li>
    </ul>

    <div class="flex flex-row justify-center gap-4 pb-4 px-6">
      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="completePayment()"
        v-if="
          pageData.eoi_status === 'approved' &&
          pageData.Application_pay_status === 'not_paid'
        "
      >
        Pay Application Fee
      </button>

      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="payPermit()"
        v-if="
          pageData.status === 'approved' &&
          pageData.Application_pay_status === 'paid' &&
          pageData.hod_permit_status === 'approved' &&
          !pageData.legal_status
        "
      >
        Pay Permit Fee
      </button>

      <button
        :disabled="loading"
        class="blueBtn bg-red-600 min-w-[200px]"
        @click="openSignDecline()"
        v-if="
          !pageData.permit_payment_status &&
          pageData.status === 'approved' &&
          pageData.Application_pay_status === 'paid'
        "
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loading"
          >Decline Sign</span
        >
      </button>
      <a
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        :href="`${url}generatestreetlampqrcode/${pageData.id}`"
        target="_blank"
        rel="noopener noreferrer"
        v-if="pageData.final_status === 'approved'"
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
