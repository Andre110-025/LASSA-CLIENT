<script setup>
import { ref, reactive } from "vue";
import PhotoLoader from "./PhotoLoader.vue";
import DocumentLoader from "./DocumentLoader.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import IconSpinner from "../icons/IconSpinner.vue";
import { useHelpers } from "../../helper";

const signFormat = ["Landscape", "Portrait"];
const lightOpt = ["None", "Internal", "External", "L.E.D"];
const intOpt = ["None/Static", "Changing", "Flashing", "Others"];

const emit = defineEmits(["update"]);

const loading = ref(false);

const props = defineProps({
  appInfo: Object,
  appId: Number,
});

const outdoorData = reactive({
  structureHeight: props.appInfo.height_structure,
  lengthSign: props.appInfo.length_sign,
  breadthSign: props.appInfo.breadth_sign,
  setbackDistance: props.appInfo.setback_distance,
  signageFormat: props.appInfo.signage_format,
  numberFaces: props.appInfo.number_faces,
  signLighten: props.appInfo.sign_illumination,
  signInteraction: props.appInfo.sign_interaction,
  photoMontage: null,
  structuralDrawings: null,
});

const submitOutdoorData = async () => {
  loading.value = true;
  try {
    const { data } = await axios.post(
      `editoutdoorappdetails/${props.appId}`,
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
          required
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
          required
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
            :value="item.toLowerCase()"
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
            :value="item.toLowerCase()"
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
            :value="item.toLowerCase()"
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
      :label="'Structural Drawings'"
      @update:fileEncode="
        (base64Content) => (outdoorData.structuralDrawings = base64Content)
      "
    >
      Upload Sign Structural Drawings
    </DocumentLoader>

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
