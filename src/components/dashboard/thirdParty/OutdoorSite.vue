<script setup>
import { ref, reactive } from "vue";
import PhotoLoader from "../PhotoLoader.vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import { useModal } from "vue-final-modal";
import axios from "axios";
import { toast } from "vue3-toastify";
import DocumentLoader from "../DocumentLoader.vue";
import { useRouter } from "vue-router";
import { useHelpers } from "../../../helper";
import PayOutDoorApp from "../popups/PayOutDoorApp.vue";
import SignTypesSelector from "../SignTypesSelector.vue";

const router = useRouter();
const { lagosLGAs } = useHelpers();

const signFormat = ["Landscape", "Portrait"];
const lightOpt = ["None", "Internal", "External", "L.E.D"];
const intOpt = ["None/Static", "Changing", "Flashing", "Others"];

const loading = ref(false);

const outdoorData = reactive({
  applicationPurpose: "Application for new Site",
  typeSign: null,
  signageAddress: null,
  lga: null,
  latitude: null,
  longitude: null,
  north: null,
  east: null,
  propertyOwnerName: null,
  propertyOwnerEmail: null,
  propertyOwnerphone: null,
  propertyOwnerConsent: false,
  propertyOwnerSignature: null,
  structureHeight: null,
  lengthSign: null,
  breadthSign: null,
  setbackDistance: null,
  signageFormat: null,
  numberFaces: null,
  signLighten: null,
  signInteraction: null,
  photoMontage: null,
  locationMap: null,
});

const submitOutdoorData = async () => {
  loading.value = true;
  try {
    const { data } = await axios.post("applyforoutdoorsignage", outdoorData);
    console.log(data);
    if (data.success) {
      const appInfo = {
        payment_id: data.data[0].payment_id,
        total_price: data.total_price,
        charge_fee: data.chargeFee,
        additionalInfoCredo: data.additionalInfoCredo,
        public_key: data.public_key,
      };

      toast.success("Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });

      const { open, close } = useModal({
        component: PayOutDoorApp,
        attrs: {
          onConfirm() {
            close();
            router.push({ name: "RequestLists" });
          },
          appDetails: appInfo,
          formType: "OutdoorSite",
        },
        slots: {},
      });

      open();
    }
    loading.value = false;
  } catch (error) {
    if (!error.response.success) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (error.response.data.errors.length) {
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
    console.log(error);

    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h5 class="text-center font-medium mb-10">
      OUTDOOR ADVERTISING STRUCTURE APPLICATION
      <i class="text-red-600">(THIRD PARTY)</i>
    </h5>

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
            :value="item"
            v-text="item"
          ></option>
        </select>
        <label for="lga" class="inputLabel"
          >Local Government Area of Site</label
        >
      </div>

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

      <h5 class="font-medium px-5 my-5">Sign Specifications</h5>

      <SignTypesSelector
        :productType="'outdoor'"
        v-model="outdoorData.typeSign"
      />

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="structureHeight"
            autocomplete="off"
            min="1"
            v-model="outdoorData.structureHeight"
            required
          />
          <label for="structureHeight" class="inputLabel"
            >Structure Height(meter)</label
          >
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="lengthSign"
            autocomplete="off"
            min="1"
            v-model="outdoorData.lengthSign"
          />
          <label for="lengthSign" class="inputLabel">Length(meter)</label>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="breadthSign"
            autocomplete="off"
            min="1"
            v-model="outdoorData.breadthSign"
            required
          />
          <label for="breadthSign" class="inputLabel">Breadth(meter)</label>
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="setbackDistance"
            autocomplete="off"
            min="1"
            v-model="outdoorData.setbackDistance"
          />
          <label for="setbackDistance" class="inputLabel"
            >Setback Distance(meter)</label
          >
        </div>
      </div>

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder w-1/2 my-0 grow">
          <select
            placeholder=" "
            class="input peer"
            id="signageFormat"
            name="signageFormat"
            v-model="outdoorData.signageFormat"
            required
          >
            <option selected="true" disabled value="">Select a format</option>
            <option
              v-for="(item, index) in signFormat"
              :key="index"
              :value="item"
              v-text="item"
            ></option>
          </select>
          <label for="signageFormat" class="inputLabel">Site Format</label>
        </div>

        <div class="inputHolder w-1/2 mb-0 sm:my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="numberFaces"
            autocomplete="off"
            min="1"
            v-model="outdoorData.numberFaces"
            required
          />
          <label for="numberFaces" class="inputLabel">No. of Faces</label>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder w-1/2 my-0 grow">
          <select
            placeholder=" "
            class="input peer"
            id="signLighten"
            name="signLighten"
            v-model="outdoorData.signLighten"
            required
          >
            <option selected="true" disabled value="">Select one</option>
            <option
              v-for="(item, index) in lightOpt"
              :key="index"
              :value="item"
              v-text="item"
            ></option>
          </select>
          <label for="signLighten" class="inputLabel">Illumination</label>
        </div>

        <div class="inputHolder w-1/2 mb-0 sm:my-0 grow">
          <select
            placeholder=" "
            class="input peer"
            id="signInteraction"
            name="signInteraction"
            v-model="outdoorData.signInteraction"
            required
          >
            <option selected="true" disabled value="">Select one</option>
            <option
              v-for="(item, index) in intOpt"
              :key="index"
              :value="item"
              v-text="item"
            ></option>
          </select>
          <label for="signInteraction" class="inputLabel">Site Format</label>
        </div>
      </div>

      <!-- PhotoMontage -->

      <PhotoLoader
        :label="'Photomontage'"
        @update:photoEncode="
          (base64Content) => (outdoorData.photoMontage = base64Content)
        "
      >
        Upload Photomontage
      </PhotoLoader>

      <DocumentLoader
        :label="'locationMap'"
        @update:fileEncode="
          (base64Content) => (outdoorData.locationMap = base64Content)
        "
      >
        Upload Sign Location Map
      </DocumentLoader>

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
          (base64Content) =>
            (outdoorData.propertyOwnerSignature = base64Content)
        "
      >
        Property Owner Signature
      </PhotoLoader>

      <div class="mt-5 px-5 text-xs text-justify">
        <p>
          By Submitting the form, I declare that I am the duly authorized agent
          or owner of the business/company that has submitted this application
          to erect a sign. I verify that all information provided above are true
          and accurate and understand that false or misleading information
          provided by me in the course of this application will result in the
          automatic disqualification and attract a penalty which I undertake to
          pay. I also undertake to obtain the Agency’s approval before I
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
