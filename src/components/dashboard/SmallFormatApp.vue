<script setup>
import axios from "axios";
import { ref, reactive } from "vue";
import { useHelpers } from "../../helper";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import IconSpinner from "../icons/IconSpinner.vue";
import SmallFormatSingle from "./SmallFormatSingle.vue";
import { useModal } from "vue-final-modal";
import CompleteAppPay from "./popups/CompleteAppPay.vue";

const { lagosLGAs } = useHelpers();
const router = useRouter();
const loading = ref(false);

const smallFormatTestData = reactive({
  purpose: "New Application",
  signAddress: "Obafemi Awolowo road ikeja",
  lga: "Ikeja",
  propertyOwnerPhone: "08022466859",
  propertyOwnerEmail: "judethaddeus@gmail.com",
  longitude: -79.9,
  latitude: 76,
  smallFormatDetails: {
    smallFormatInfo: [
      {
        typeSign: "kiosk",
        dimensionSign: 6,
        setbackDistance: 3,
        length: 2,
        breadth: 3,
        signFormat: "Portrait",
        signSite: "Onpremise",
        illumination: "None",
        interactivity: "Changing",
        electricitySource: "Phcn",
        photoMontage: null,
      },
      {
        typeSign: "round-about",
        dimensionSign: 6,
        setbackDistance: 3,
        length: 2,
        breadth: 3,
        signFormat: "Landscape",
        signSite: "Offpremise",
        illumination: "Internal",
        interactivity: "Flashing",
        electricitySource: "Generator",
        photoMontage: null,
      },
    ],
  },
});

const smallFormatData = reactive({
  purpose: "New Application",
  signAddress: null,
  lga: null,
  propertyOwnerPhone: null,
  propertyOwnerEmail: null,
  longitude: null,
  latitude: null,
  smallFormatDetails: {
    smallFormatInfo: [
      {
        typeSign: null,
        dimensionSign: null,
        setbackDistance: null,
        length: null,
        breadth: null,
        signFormat: null,
        signSite: null,
        illumination: null,
        interactivity: null,
        electricitySource: null,
        photoMontage: null,
      }
    ],
  },
});

const addNewFormatType = () => {
  smallFormatData.smallFormatDetails.smallFormatInfo.push({
    typeSign: null,
    dimensionSign: null,
    setbackDistance: null,
    length: null,
    breadth: null,
    signFormat: null,
    signSite: null,
    illumination: null,
    interactivity: null,
    electricitySource: null,
    photoMontage: null,
  });
};

const removeSignData = (index) => {
  smallFormatData.smallFormatDetails.smallFormatInfo.splice(index, 1);
};

const submitStreetData = async () => {
  try {
    loading.value = true;
    const { data } = await axios.post("createsmallformatads", smallFormatData);
    console.log(data);
    if (data.success) {

      toast.success("Application Created", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly Pay Application Fee", {
        position: toast.POSITION.TOP_CENTER,
      });

      const { open, close } = useModal({
        component: CompleteAppPay,
        attrs: {
          onConfirm() {
            close();
            router.push({ name: "RequestLists" });
          },
          paymentID: data.data[0].payment_id,
          formType: "SmallFormat Application",
        },
        slots: {},
      });

      open();
    }
    loading.value = false;
  } catch (error) {
    if (!error.response.data.success && error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (error.response.status == 500) {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (error.response.data.errors.length) {
      error.response.data.errors.forEach((element) => {
        toast.error(element, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      toast.error("Application Could not be Processed", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);

    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h5 class="text-center font-medium mb-10">SMALL FORMAT STRUCTURE</h5>

    <form @submit.prevent="submitStreetData" class="max-w-md mx-auto">
      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="signAddress"
          autocomplete="off"
          v-model="smallFormatData.signAddress"
          required
        />
        <label for="signAddress" class="inputLabel">Address of Sign</label>
      </div>

      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer"
          id="signLga"
          v-model="smallFormatData.lga"
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

      <div class="inputHolder">
        <input
          type="tel"
          placeholder=" "
          class="input peer"
          id="propertyOwnerPhone"
          autocomplete="off"
          v-model="smallFormatData.propertyOwnerPhone"
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
          id="propertyOwnerEmail"
          autocomplete="off"
          v-model="smallFormatData.propertyOwnerEmail"
          required
        />
        <label for="propertyOwnerEmail" class="inputLabel"
          >Property Owner Email</label
        >
      </div>

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="number"
            step="any"
            placeholder=" "
            class="input peer"
            id="latitude"
            autocomplete="off"
            v-model="smallFormatData.latitude"
            required
          />
          <label for="latitude" class="inputLabel">Latitude</label>
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <input
            type="number"
            step="any"
            placeholder=" "
            class="input peer"
            id="longitude"
            autocomplete="off"
            v-model="smallFormatData.longitude"
            required
          />
          <label for="longitude" class="inputLabel">Longitude</label>
        </div>
      </div>

      <h5 class="font-medium px-5 my-5">Small Advert Information</h5>

      <transition-group tag="ul" name="signs">
        <SmallFormatSingle
          v-for="(item, index) in smallFormatData.smallFormatDetails
            .smallFormatInfo"
          :key="index"
          :length="smallFormatData.smallFormatDetails.smallFormatInfo.length"
          v-model:smallFormatData="smallFormatData"
          @deleteSignData="removeSignData(index)"
          :index="index"
        />
      </transition-group>

      <div class="flex justify-between items-center px-5">
        <span class="text-sm font-semibold"
          >Click the plus button to add more sign type</span
        >
        <button
          @click="addNewFormatType"
          type="button"
          class="p-2 border-2 border-mainColor leading-none h-9 w-9"
        >
          +
        </button>
      </div>

      <div class="mt-5 px-5 text-xs text-justify">
        <p>
          By Submitting the form, I declare that I am the duly authorized agent
          or owner of the business/company that has submitted this application
          to erect a sign. I verify that all information provided above are true
          and accurate and understand that false or misleading information
          provided by me in the course of this application will result in the
          automatic disqualification and attract a penalty which I undertake to
          pay. I also undertake to obtain the Agency's approval before I
          implement any changes to any sign approved by the Agency. I agree to
          notify the Agency of any change in my mailing address, status and/or
          telephone number.
        </p>
      </div>

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
