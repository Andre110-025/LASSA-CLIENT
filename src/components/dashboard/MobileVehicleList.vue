<script setup>
import { ref, reactive } from "vue";
import axios from "axios";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import SignTypesSelector from "./SignTypesSelector.vue";

const props = defineProps({
  dataIndex: Number,
  finalStatus: String,
  vehicleData: Array,
  appId: Number,
  status: String,
});

const emit = defineEmits(["update"]);

const vehicleData = ref(props.vehicleData);

const detailType = [
  "Full Branding",
  "Partial Branding",
  "Wrap Around Branding",
];

// const vehicleType = [
//   "Trailer",
//   "Truck",
//   "Coaster",
//   "Civilian",
//   "Bus",
//   "Pickup",
//   "SUV",
//   "Motorcycle",
//   "Push-Cart",
//   "Bicycle",
//   "Tricycle",
//   "Car",
// ];

const vehicleTypeData = reactive({
  previousbrandingtype: props.vehicleData[0].branding_details,
  previousvehicletype: props.vehicleData[0].vehicle_type,
  brandingtype: "",
  vehicletype: "",
});

const loading = ref(false);
const editVehicleType = ref(false);
const editVehicleLicense = ref(false);
const newLicense = ref("");

const updateVehicleType = async () => {
  loading.value = true;
  try {
    const response = await axios.put(
      `editmobileadslicense/${props.appId}`,
      vehicleTypeData
    );
    // console.log(response);
    if (response.status === 200) {
      toast.success("Saved! Ensure you save to Submit Application", {
        position: toast.POSITION.TOP_CENTER,
      });

      vehicleData.value[0].branding_details = vehicleTypeData.brandingtype;
      vehicleData.value[0].vehicle_type = vehicleTypeData.vehicletype;
      editVehicleType.value = false;
      vehicleData.value.push(response.data.data);

      emit("update");
    }
    loading.value = false;
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);

    loading.value = false;
  }
};

const addNewLicense = async (payload) => {
  if (!payload) {
    return;
  }

  loading.value = true;

  try {
    const data = {
      vehiclelicense: payload,
      brandingtype: vehicleData.value[0].branding_details,
      vehicletype: vehicleData.value[0].vehicle_type,
    };

    const response = await axios.put(
      `addmobileadslicense/${props.appId}`,
      data
    );
    // console.log(response);
    if (response.status === 200) {
      toast.success("Saved! Ensure you Submit Application", {
        position: toast.POSITION.TOP_CENTER,
      });

      vehicleData.value.push(response.data.data);
      newLicense.value = "";
    }

    loading.value = false;
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};

const deleteLicense = async (licenseId) => {
  try {
    const response = await axios.delete(
      `removemobilelicense/${props.appId}/${licenseId}`
    );

    console.log(response);

    if (response.status === 200) {
      toast.success("Deleted! Ensure you submit", {
        position: toast.POSITION.TOP_CENTER,
      });

      const updatedLicense = vehicleData.value.filter(
        (license) => license.id !== licenseId
      );

      vehicleData.value = updatedLicense;
      // getAppInfo();
    }
  } catch (error) {
    console.log(error);
    toast.error("Action Could not be Performed", {
      position: toast.POSITION.TOP_CENTER,
    });
  }
};
</script>

<template>
  <li class="mb-10">
    <h6 class="font-medium text-sm mb-5 flex items-center justify-between">
      Vehicle Advert Type {{ dataIndex + 1 }}
    </h6>

    <p v-if="finalStatus === 'approved'" class="py-4 text-xs font-semibold">
      Click License Number to download QrCode
    </p>

    <div v-if="!editVehicleType" class="flex flex-col pb-10 gap-4 fxfcol">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Branding Details</p>
        <p class="text-sm" v-text="vehicleData[0].branding_details"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Vehicle Type</p>
        <p class="text-sm" v-text="vehicleData[0].vehicle_type"></p>
      </div>

      <button
        class="px-5 py-3 w-fit bg-green-600 text-sm rounded-md text-white grow"
        @click="editVehicleType = true"
        v-if="status === 'declined'"
      >
        Edit Vehicle Info
      </button>
    </div>

    <form v-else class="pb-10" @submit.prevent="updateVehicleType()">
      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder mb-0 sm:my-0 grow">
          <select
            placeholder=" "
            class="input peer"
            :id="'brandDetails' + dataIndex"
            v-model="vehicleTypeData.brandingtype"
            required
          >
            <option
              v-for="(item, index) in detailType"
              :key="index"
              :value="item"
              v-text="item"
            ></option>
          </select>
          <label :for="'brandDetails' + dataIndex" class="inputLabel"
            >Branding Details</label
          >
        </div>

        <SignTypesSelector
          :index="props.dataIndex"
          :productType="'mobile_ads'"
          v-model="vehicleTypeData.vehicletype"
          :label="'Type of Vehicle'"
          class="mb-0 sm:my-0 grow"
        />
      </div>

      <div class="my-5 px-5">
        <button
          :disabled="loading"
          type="submit"
          class="blueBtn w-40 mx-auto rounded-none"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-sm font-medium text-white tracking-wider"
            v-if="!loading"
            >Update Info</span
          >
        </button>
      </div>
    </form>

    <ul v-if="!editVehicleLicense" class="flex flex-wrap gap-2.5">
      <a
        v-for="(item, index) in vehicleData"
        :href="item.qrcode_link"
        download
        target="_blank"
        class="p-1.5 bg-blue-200 text-sm rounded-md cursor-pointer"
        :key="index"
        v-text="item.vehicle_license"
      ></a>
    </ul>
    <ul v-else class="flex flex-wrap gap-x-2.5 gap-y-4">
      <li
        v-for="(item, index) in vehicleData"
        class="p-1.5 bg-blue-200 text-sm rounded-md group relative text-center"
        :key="index"
      >
        {{ item.vehicle_license }}
        <span
          class="absolute -top-2 -right-1.5 z-10 w-4 h-4 bg-red-600 flex items-center justify-center rounded-full text-white cursor-pointer text-xs"
          @click.once="deleteLicense(item.id)"
          v-if="vehicleData.length > 1"
        >
          x
        </span>
      </li>
    </ul>
    <form
      v-if="editVehicleLicense"
      @submit.prevent="addNewLicense(newLicense)"
      class="flex flex-row gap-5 mt-5"
    >
      <input
        v-model="newLicense"
        class="py-[10px] px-[12px] text-sm border-[1.5px] border-solid border-mainColor/60 outline-none focus:border-mainColor rounded-lg"
        required
        placeholder="new License"
      />
      <button
        type="submit"
        :disabled="loading"
        class="blueBtn w-40 rounded-none"
      >
        Add License
      </button>
    </form>
    <button
      class="px-5 py-3 mt-5 w-fit bg-green-600 text-sm rounded-md text-white grow"
      @click="editVehicleLicense = true"
      v-if="!editVehicleLicense && status === 'declined'"
    >
      Edit Licenses
    </button>
  </li>
</template>
