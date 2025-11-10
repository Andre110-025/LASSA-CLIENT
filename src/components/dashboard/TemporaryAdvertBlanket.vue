<script setup>
import { ref, reactive } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useRouter, useRoute } from "vue-router";
import { useModal } from "vue-final-modal";
import CompleteAppPay from "./popups/CompleteAppPay.vue";
import { useHelpers } from "../../helper";
import SignTypesSelector from "./SignTypesSelector.vue";

const { formatCurrency, todayDate, endOfYear } = useHelpers();

const loading = ref(false);
const router = useRouter();
const route = useRoute();

const signType = {
  Standard: {
    materials:
      "Branded T-shirts, Banners on rig/vehicle, Feather Signs and City Walkers (STATIC)",
    prices: {
      Monthly: 1500000,
      Quarterly: 3000000,
      Biannual: 5000000,
      Annually: 9000000,
    },
  },
  Intermediate: {
    materials:
      "Branded T-shirts, Banners on rig/vehicle, Feather Signs and City Walkers (STATIC), POS and Push Carts",
    prices: {
      Monthly: 3000000,
      Quarterly: 5000000,
      Biannual: 8000000,
      Annually: 12000000,
    },
  },
  Premium: {
    materials:
      "Branded T-shirts, Banners on rig/vehicle, Feather Signs and City Walkers (STATIC), POS and Push Carts and Character Balloons",
    prices: {
      Monthly: 3000000,
      Quarterly: 5000000,
      Biannual: 9000000,
      Annually: 15000000,
    },
  },
};

const durationType = [
  { type: "One Month", value: "Monthly" },
  { type: "Three Month", value: "Quarterly" },
  { type: "Six Month", value: "Biannual" },
  { type: "One Year", value: "Annually" },
];

const temporaryData = reactive({
  appUserType: "first_party",
  nameService: null,
  location: null,
  startDate: null,
  endDate: null,
  durationType: null,
  temporaryDetails: {
    temporaryInfo: [
      {
        classificationSign: null,
        typeSign: null,
        size: null,
        dimension: null,
        photo: null,
        transitSign: false,
        vehicleLicense: null, //file
        licenseNumber: null,
        durationDays: null,
        number_of_days: null,
        wearableSign: false,
        amountWearable: null,
        moveableAnimation: false,
        trafficStatement: null, //file
      },
    ],
  },
});

const submitTemporaryData = async () => {
  try {
    loading.value = true;
    const { data } = await axios.post(
      "createfirstpartytemporaryads",
      temporaryData
    );
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
          formType: "Firstparty TemporaryAds",
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
    <h5 class="text-center font-medium mb-10">
      TEMPORARY ADVERT BLANKET APPLICATION
    </h5>

    <form @submit.prevent="submitTemporaryData" class="max-w-md mx-auto">
      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="location"
          autocomplete="off"
          v-model="temporaryData.location"
          required
        />
        <label for="location" class="inputLabel">Site Location</label>
      </div>

      <SignTypesSelector
        :productType="'temporary_blanket'"
        v-model="temporaryData.temporaryDetails.temporaryInfo[0].typeSign"
        :label="'Blanket Category'"
      />

      <div class="inputHolder">
        <textarea
          type="text"
          placeholder=" "
          class="input peer"
          id="nameService"
          autocomplete="off"
          v-model="temporaryData.nameService"
          cols="30"
          rows="5"
          required
        ></textarea>
        <label for="nameService" class="inputLabel">Name of Products</label>
      </div>

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="date"
            placeholder=" "
            class="input peer"
            id="startDate"
            autocomplete="off"
            :min="todayDate()"
            :max="endOfYear()"
            v-model="temporaryData.startDate"
            required
          />
          <label for="startDate" class="inputLabel">Start Date</label>
        </div>
      </div>

      <div class="inputHolder">
        <select
          v-model="temporaryData.durationType"
          placeholder=" "
          class="input peer"
          id="durationType"
          required
        >
          <option
            v-for="(item, index) in durationType"
            :key="index"
            :value="item.value"
            v-text="item.type"
          ></option>
        </select>
        <label for="durationType" class="inputLabel">Duration</label>
      </div>

      <!-- <div
        v-if="temporaryData.temporaryDetails.temporaryInfo[0].typeSign"
        class="px-5 my-5 space-y-4"
      >
        <h5 class="font-medium">Campaign Materials</h5>

        <p>
          {{
            signType[
              `${temporaryData.temporaryDetails.temporaryInfo[0].typeSign}`
            ].materials
          }}
        </p>
      </div> -->

      <!-- <div
        v-if="
          temporaryData.temporaryDetails.temporaryInfo[0].typeSign &&
          temporaryData.durationType 
        "
        class="px-5 my-5 space-y-4"
      >
        <h5 class="font-medium">Campaign Price</h5>

        <p>
          {{
            formatCurrency(
              signType[
                `${temporaryData.temporaryDetails.temporaryInfo[0].typeSign}`
              ].prices[`${temporaryData.durationType}`]
            )
          }}
        </p>
      </div> -->

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
