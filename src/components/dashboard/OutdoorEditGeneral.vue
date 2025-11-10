<script setup>
import { ref, reactive } from "vue";
import PhotoLoader from "./PhotoLoader.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import IconSpinner from "../icons/IconSpinner.vue";
import { useHelpers } from "../../helper";
import SignTypesSelector from "./SignTypesSelector.vue";

const { lagosLGAs } = useHelpers();

const emit = defineEmits(["update"]);

const loading = ref(false);

const props = defineProps({
  appInfo: Object,
});

const outdoorData = reactive({
  applicationPurpose: props.appInfo.purpose_application,
  typeSign: props.appInfo.type_sign,
  signageAddress: props.appInfo.address_proposed_site,
  lga: props.appInfo.lga,
  latitude: props.appInfo.latitude,
  longitude: props.appInfo.longitude,
  north: props.appInfo.north,
  east: props.appInfo.east,
  propertyOwnerName: props.appInfo.property_owner_name,
  propertyOwnerEmail: props.appInfo.property_owner_email,
  propertyOwnerphone: props.appInfo.property_owner_phone,
  propertyOwnerConsent: props.appInfo.property_owner_consent === "1",
  propertyOwnerSignature: null,
});

const submitOutdoorData = async () => {
  loading.value = true;
  try {
    const { data } = await axios.post(
      `editoutdoorapp/${props.appInfo.id}`,
      outdoorData
    );
    console.log(data);
    if (data.success) {
      toast.success("General Information saved", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    loading.value = false;
    emit("update");
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);

    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="submitOutdoorData" class="max-w-md mx-auto">
    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="name_of_display"
        autocomplete="off"
        v-model="outdoorData.signageAddress"
        required
      />
      <label for="name_of_display" class="inputLabel"
        >Address of Proposed Site</label
      >
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer"
        id="lga"
        v-model="outdoorData.lga"
        required
      >
        <option
          v-for="(item, index) in lagosLGAs"
          :key="index"
          :value="item.toLowerCase()"
          v-text="item"
        ></option>
      </select>
      <label for="lga" class="inputLabel">Local Government Area of Site</label>
    </div>

    <SignTypesSelector
      :productType="'outdoor'"
      v-model="outdoorData.typeSign"
    />

    <h5 class="font-medium px-5 my-5">GIS Coordinates/Records</h5>

    <div class="flex flex-col sm:flex-row mt-5">
      <div class="inputHolder my-0 grow">
        <input
          type="number"
          step="any"
          placeholder=" "
          class="input peer"
          id="latitude"
          autocomplete="off"
          v-model="outdoorData.latitude"
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
          v-model="outdoorData.longitude"
          required
        />
        <label for="longitude" class="inputLabel">Longitude</label>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row mt-5">
      <div class="inputHolder my-0 grow">
        <input
          type="number"
          step="any"
          placeholder=" "
          class="input peer"
          id="north"
          autocomplete="off"
          v-model="outdoorData.north"
          required
        />
        <label for="north" class="inputLabel">North</label>
      </div>

      <div class="inputHolder mb-0 sm:my-0 grow">
        <input
          type="number"
          step="any"
          placeholder=" "
          class="input peer"
          id="east"
          autocomplete="off"
          required
          v-model="outdoorData.east"
        />
        <label for="east" class="inputLabel">East</label>
      </div>
    </div>

    <h5 class="font-medium px-5 my-5">Property Own Info</h5>

    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="propertyOwnerName"
        autocomplete="off"
        v-model="outdoorData.propertyOwnerName"
        required
      />
      <label for="propertyOwnerName" class="inputLabel"
        >Property Owner Name</label
      >
    </div>

    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="propertyOwnerphone"
        autocomplete="off"
        v-model="outdoorData.propertyOwnerphone"
        required
      />
      <label for="propertyOwnerphone" class="inputLabel"
        >Property Owner Phone</label
      >
    </div>

    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="propertyOwnerEmail"
        autocomplete="off"
        v-model="outdoorData.propertyOwnerEmail"
        required
      />
      <label for="propertyOwnerEmail" class="inputLabel"
        >Property Owner Email</label
      >
    </div>

    <div class="flex flex-row gap-2.5 items-center px-5">
      <input
        type="checkbox"
        name="propertyOwnerConsent"
        v-model="outdoorData.propertyOwnerConsent"
        id="propertyOwnerConsent"
      />
      <label class="text-sm" for="propertyOwnerConsent"
        >check if property owner consent was obtained</label
      >
    </div>

    <PhotoLoader
      :label="'propertyOwnerSignature'"
      @update:photoEncode="
        (base64Content) => (outdoorData.propertyOwnerSignature = base64Content)
      "
    >
      Property Owner Signature
    </PhotoLoader>

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
          >Update</span
        >
      </button>
    </div>
  </form>
</template>
