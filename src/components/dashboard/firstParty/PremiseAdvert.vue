<script setup>
import { ref, reactive, onMounted } from "vue";
import { useHelpers } from "../../../helper";
import IconSpinner from "../../icons/IconSpinner.vue";
import SignType from "./SignType.vue";
import PayAdvertDialog from "../popups/PayAdvertApplication.vue";
import { useModal } from "vue-final-modal";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { useUserStore } from "../../../stores/user";
import UpdateInstitution from "../popups/UpdateInstitution.vue";
import DisclaimerInfo from "../DisclaimerInfo.vue";
import ExcelHandler from "../ExcelHandler.vue"

const router = useRouter();

const { userDetails } = useUserStore();

const appInfo = ref(null);

const { lagosLGAs } = useHelpers();

const loading = ref(false);
const enableBulk = ref(false);

// const applicationPurposes = [
//   "Application for New Sign",
//   "Redesigning of unapproved sign",
//   "Change of sign/size",
//   "Additional sign",
//   "Relocation of sign/business",
// ];

const addNewSign = () => {
  outDoorData.onpremiseform.onpremiseinfo.push({
    type_of_sign: null,
    number_of_sign: null,
    length_in_meter: null,
    width_in_meter: null,
    product_on_sign: false,
    photo_montage: null,
  });
};

const propertyTypes = ["Single Business Unit", "Multi-tenanted Business"];

const outDoorData = reactive({
  purpose: "Application for New Sign",
  sign_address: null,
  business_name: null,
  lga: null,
  property_type: null,
  name_of_owner: null,
  phone_number: null,
  email: null,
  onpremiseform: {
    onpremiseinfo: [
      {
        type_of_sign: null,
        number_of_sign: 1,
        length_in_meter: null,
        width_in_meter: null,
        product_on_sign: false,
        photo_montage: null,
      },
    ],
  },
});

const premiseBulkData = reactive({
  purpose: "Application for New Sign",
  business_name: null,
  email: null,
  excel_file: null,
});

const updateSignData = (index, updatedData) => {
  // console.log(updatedData);
  outDoorData.onpremiseform.onpremiseinfo[index] = updatedData;
};

const removeSignData = (index) => {
  outDoorData.onpremiseform.onpremiseinfo.splice(index, 1);
};

const submitPremiseData = async () => {
  loading.value = true;
  try {
    const response = await axios.post("onpremise", outDoorData);
    console.log(response);
    if (response.status === 200) {
      appInfo.value = response.data;

      toast.success("Application Saved", {
        position: toast.POSITION.TOP_CENTER,
      });

      const { open, close } = useModal({
        component: PayAdvertDialog,
        attrs: {
          onConfirm() {
            router.push({ name: "RequestLists" });
            close();
          },
          appDetails: appInfo.value,
          formType: "Onpremise",
        },
        slots: {},
      });

      open();
    }
    loading.value = false;
  } catch (error) {
    if (error.response.data.errors?.length >= 1) {
      error.response.data.errors.forEach((element) => {
        toast.error(element, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loading.value = false;
  }
};

const submitPremiseBulkData = async () => {
  loading.value = true;
  try {
    const response = await axios.post("onpremisebulk", premiseBulkData);
    console.log(response);
    if (response.status === 200) {
      appInfo.value = response.data;

      toast.success("Application Saved", {
        position: toast.POSITION.TOP_CENTER,
      });

      const { open, close } = useModal({
        component: PayAdvertDialog,
        attrs: {
          onConfirm() {
            router.push({ name: "RequestLists" });
            close();
          },
          appDetails: appInfo.value,
          formType: "Onpremise",
        },
        slots: {},
      });

      open();
    }
    loading.value = false;
  } catch (error) {
    if (error.response.data.errors?.length >= 1) {
      error.response.data.errors.forEach((element) => {
        toast.error(element, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loading.value = false;
  }
};

onMounted(() => {
  if (userDetails.userInfo.is_institution == null) {
    const { open, close } = useModal({
      component: UpdateInstitution,
      attrs: {
        onConfirm() {
          close();
        },
      },
      slots: {},
    });

    open();
  }
});
</script>

<template>
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h5 class="text-center font-medium mb-10">
      OUTDOOR ADVERTISING STRUCTURE APPLICATION
      <i class="text-red-600">(FIRST PARTY)</i>
    </h5>

    <form
      @submit.prevent="submitPremiseData"
      v-if="!enableBulk"
      class="max-w-md mx-auto"
    >
      <div class="relative flex gap-5 text-start mt-5 mb-5 px-5 text-sm">
        <label for="docChecker0">Do you want to upload bulk Data?</label
        ><input v-model="enableBulk" type="checkbox" id="docChecker0" />
      </div>
      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="business_name"
          v-model="outDoorData.business_name"
          required
        />
        <label for="business_name" class="inputLabel">Business Name</label>
      </div>

      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="signAddress"
          v-model="outDoorData.sign_address"
          required
        />
        <label for="signAddress" class="inputLabel">Sign Address</label>
      </div>

      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer"
          id="signLga"
          v-model="outDoorData.lga"
          required
        >
          <option
            v-for="(item, index) in lagosLGAs"
            :key="index"
            :value="item"
            v-text="item"
          ></option>
        </select>

        <label for="signLga" class="inputLabel">LGA</label>
      </div>

      <!-- Property Details -->
      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer"
          id="propertyType"
          v-model="outDoorData.property_type"
          required
        >
          <option
            v-for="(item, index) in propertyTypes"
            :key="index"
            :value="item"
            v-text="item"
          ></option>
        </select>

        <label for="propertyType" class="inputLabel">Property Type</label>
      </div>

      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="propertyOwner"
          v-model="outDoorData.name_of_owner"
        />
        <label for="propertyOwner" class="inputLabel"
          >Name of Property Owner</label
        >
      </div>

      <div class="inputHolder">
        <input
          type="tel"
          placeholder=" "
          class="input peer"
          id="propertyOwnerPhone"
          v-model="outDoorData.phone_number"
          required
        />
        <label for="propertyOwnerPhone" class="inputLabel"
          >Property Owner Phone</label
        >
      </div>

      <div class="inputHolder">
        <input
          type="email"
          placeholder=" "
          class="input peer"
          id="propertyOwnerMail"
          v-model="outDoorData.email"
        />
        <label for="propertyOwnerMail" class="inputLabel"
          >Property Owner Email(optional)</label
        >
      </div>

      <!-- Signage -->

      <transition-group tag="ul" name="signs">
        <SignType
          v-for="(item, index) in outDoorData.onpremiseform.onpremiseinfo"
          :key="index"
          :signData="item"
          :length="outDoorData.onpremiseform.onpremiseinfo.length"
          @updateSignData="updateSignData(index, $event)"
          @deleteSignData="removeSignData(index)"
          :index="index"
        />
      </transition-group>

      <div class="flex justify-between items-center px-5">
        <span class="text-sm font-semibold"
          >Click the plus button to add more sign</span
        >
        <button
          @click="addNewSign"
          type="button"
          class="p-2 border-2 border-mainColor leading-none h-9 w-9"
        >
          +
        </button>
      </div>

      <DisclaimerInfo />

      <div class="my-5 px-5">
        <button
          :disabled="loading"
          type="submit"
          class="blueBtn w-full mx-auto rounded-none"
          @click="submitPremiseData"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-sm font-medium text-white tracking-wider"
            v-if="!loading"
            >Submit</span
          >
        </button>
      </div>
    </form>
    <form @submit.prevent="submitPremiseBulkData" v-else class="max-w-md mx-auto">
      <div class="relative flex gap-5 text-start mt-5 mb-5 px-5 text-sm">
        <label for="docChecker0">Uncheck if you don't want to upload bulk Data</label
        ><input v-model="enableBulk" type="checkbox" id="docChecker0" />
      </div>
      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="business_name"
          v-model="premiseBulkData.business_name"
          required
        />
        <label for="business_name" class="inputLabel">Business Name</label>
      </div>

      <div
        class="relative flex gap-5 text-start px-5 text-sm font-medium underline"
      >
        <a
          href="/premise-signage_data-EXAMPLE.xlsx"
          download
          target="_blank"
          rel="noopener noreferrer"
          >Download Excel Sheet Sample</a
        >
      </div>

      <ExcelHandler v-model="premiseBulkData.excel_file" />

      <DisclaimerInfo />

      <div class="my-5 px-5">
        <button
          :disabled="loading"
          type="submit"
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
    </form>
  </div>
</template>
