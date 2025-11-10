<script setup>
import IconDelete from "../icons/IconDelete.vue";
import PhotoLoader from "./PhotoLoader.vue";
import { useHelpers } from "../../helper";

const { smallFormatTypes: signType } = useHelpers();

const props = defineProps({
  index: Number,
  length: Number,
});

const emit = defineEmits(["deleteSignData"]);

const smallFormatData = defineModel("smallFormatData");

const signFormat = ["Portrait", "Landscape"];
const signSite = ["Onpremise", "Offpremise"];
const signIllumination = [
  "None",
  "Internal",
  "External",
  "Backlit",
  "Frontlit",
];
const signInteractivity = ["None/Static", "Changing", "Flashing", "Others"];
const signElectricity = ["Phcn", "Solar", "Generator", "Inverter", "Other"];
</script>

<template>
  <li>
    <h6 class="font-medium text-sm px-5 my-5 flex items-center justify-between">
      <span>Small Format Type {{ index + 1 }}</span>
      <button type="button" v-if="length > 1" @click="emit('deleteSignData')">
        <IconDelete class="h-6 w-auto" />
      </button>
    </h6>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer capitalize"
        :id="'typeSign' + index"
        v-model="
          smallFormatData.smallFormatDetails.smallFormatInfo[index].typeSign
        "
        required
      >
        <option
          v-for="(item, index) in signType"
          class="capitalize"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label :for="'typeSign' + index" class="inputLabel">Type of Sign</label>
    </div>

    <div class="flex flex-col sm:flex-row mt-5">
      <div class="inputHolder my-0 grow">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          :id="'length' + index"
          autocomplete="off"
          v-model="
            smallFormatData.smallFormatDetails.smallFormatInfo[index].length
          "
          required
        />
        <label :for="'length' + index" class="inputLabel">Length</label>
      </div>

      <div class="inputHolder mb-0 sm:my-0 grow">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          :id="'breadth' + index"
          autocomplete="off"
          v-model="
            smallFormatData.smallFormatDetails.smallFormatInfo[index].breadth
          "
          required
        />
        <label :for="'breadth' + index" class="inputLabel">Breadth</label>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row mt-5">
      <div class="inputHolder my-0 grow">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          :id="'dimensionSign' + index"
          autocomplete="off"
          v-model="
            smallFormatData.smallFormatDetails.smallFormatInfo[index]
              .dimensionSign
          "
          required
        />
        <label :for="'dimensionSign' + index" class="inputLabel"
          >Sign Dimension</label
        >
      </div>

      <div class="inputHolder mb-0 sm:my-0 grow">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          :id="'setbackDistance' + index"
          autocomplete="off"
          v-model="
            smallFormatData.smallFormatDetails.smallFormatInfo[index]
              .setbackDistance
          "
          required
        />
        <label :for="'setbackDistance' + index" class="inputLabel"
          >Setback Distance</label
        >
      </div>
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer capitalize"
        :id="'signFormat' + index"
        v-model="
          smallFormatData.smallFormatDetails.smallFormatInfo[index].signFormat
        "
        required
      >
        <option
          v-for="(item, index) in signFormat"
          class="capitalize"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label :for="'signFormat' + index" class="inputLabel">Sign Format</label>
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer capitalize"
        :id="'signSite' + index"
        v-model="
          smallFormatData.smallFormatDetails.smallFormatInfo[index].signSite
        "
        required
      >
        <option
          v-for="(item, index) in signSite"
          class="capitalize"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label :for="'signSite' + index" class="inputLabel">Sign Site</label>
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer capitalize"
        :id="'illumination' + index"
        v-model="
          smallFormatData.smallFormatDetails.smallFormatInfo[index].illumination
        "
        required
      >
        <option
          v-for="(item, index) in signIllumination"
          class="capitalize"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label :for="'illumination' + index" class="inputLabel"
        >Sign Illumination</label
      >
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer capitalize"
        :id="'interactivity' + index"
        v-model="
          smallFormatData.smallFormatDetails.smallFormatInfo[index]
            .interactivity
        "
        required
      >
        <option
          v-for="(item, index) in signInteractivity"
          class="capitalize"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label :for="'interactivity' + index" class="inputLabel"
        >Sign Interactivity</label
      >
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer capitalize"
        :id="'electricitySource' + index"
        v-model="
          smallFormatData.smallFormatDetails.smallFormatInfo[index]
            .electricitySource
        "
        required
      >
        <option
          v-for="(item, index) in signElectricity"
          class="capitalize"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label :for="'electricitySource' + index" class="inputLabel"
        >Electricity Source</label
      >
    </div>

    <PhotoLoader
      :label="'Photomontage' + index"
      @update:photoEncode="
        (base64Content) =>
          (smallFormatData.smallFormatDetails.smallFormatInfo[
            index
          ].photoMontage = base64Content)
      "
    >
      Upload Photomontage
    </PhotoLoader>
  </li>
</template>
