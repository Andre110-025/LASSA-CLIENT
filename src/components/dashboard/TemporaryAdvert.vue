<script setup>
import { ref, reactive, computed } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import TemporaryAdInfo from "./TemporaryAdInfo.vue";
import TemporaryRegInfo from "./TemporaryRegInfo.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useRouter, useRoute } from "vue-router";
import { useModal } from "vue-final-modal";
import CompleteAppPay from "./popups/CompleteAppPay.vue";
import { useHelpers } from "../../helper";

const { todayDate, endOfYear } = useHelpers();

const loading = ref(false);
const router = useRouter();
const route = useRoute();

const temporaryData = reactive({
  appUserType: route.params.app_type,
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

const addNewVehicleType = () => {
  temporaryData.temporaryDetails.temporaryInfo.push({
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
  });
};

const removeSignData = (index) => {
  temporaryData.temporaryDetails.temporaryInfo.splice(index, 1);
};

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
    <h5 class="text-center font-medium mb-10">TEMPORARY ADVERT APPLICATION</h5>

    <form @submit.prevent="submitTemporaryData" class="max-w-md mx-auto">
      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="nameService"
          autocomplete="off"
          v-model="temporaryData.nameService"
          required
        />
        <label for="nameService" class="inputLabel"
          >Name of Service/Product</label
        >
      </div>

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

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="date"
            placeholder=" "
            class="input peer"
            id="startDate"
            autocomplete="off"
            v-model="temporaryData.startDate"
            :max="endOfYear()"
            :min="todayDate()"
            required
          />
          <label for="startDate" class="inputLabel">Start Date</label>
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <input
            type="date"
            placeholder=" "
            class="input peer"
            id="endDate"
            :min="temporaryData.startDate || todayDate()"
            :max="endOfYear()"
            autocomplete="off"
            v-model="temporaryData.endDate"
            required
          />
          <label for="endDate" class="inputLabel">End Date</label>
        </div>
      </div>

      <h5 class="font-medium px-5 my-5">Temporary Advert Information</h5>

      <transition-group v-if="route.params.app_type === 'first_party'" tag="ul" name="signs">
        <TemporaryAdInfo
          v-for="(item, index) in temporaryData.temporaryDetails.temporaryInfo"
          :key="index"
          :length="temporaryData.temporaryDetails.temporaryInfo.length"
          v-model:temporaryData="temporaryData"
          @deleteSignData="removeSignData(index)"
          :index="index"
        />
      </transition-group>

      <transition-group v-else-if="route.params.app_type === 'third_party'" tag="ul" name="signs">
        <TemporaryRegInfo
          v-for="(item, index) in temporaryData.temporaryDetails.temporaryInfo"
          :key="index"
          :length="temporaryData.temporaryDetails.temporaryInfo.length"
          v-model:temporaryData="temporaryData"
          @deleteSignData="removeSignData(index)"
          :index="index"
        />
      </transition-group>

      <div class="flex justify-between items-center px-5">
        <span class="text-sm font-semibold"
          >Click the plus button to add more sign type</span
        >
        <button
          @click="addNewVehicleType"
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
