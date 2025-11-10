<script setup>
import { reactive, ref, watch } from "vue";
import IconDelete from "../icons/IconDelete.vue";
import IconUpload from "../icons/IconUpload.vue";
import SignTypesSelector from "./SignTypesSelector.vue";

const detailType = [
  "Full Branding",
  "Partial Branding",
  "Wrap Around Branding",
];

const vehicleType = [
  "Trailer",
  "Truck",
  "Coaster",
  "Civilian",
  "Bus",
  "Pickup",
  "SUV",
  "Motorcycle",
  "Push-Cart",
  "Bicycle",
  "Tricycle",
  "Car",
];

const commaText = ref("");

const props = defineProps({
  index: Number,
  length: Number,
});

const emit = defineEmits(["updateSignData", "deleteSignData"]);

const vehicleData = reactive({
  vehicle_license: [],
  branding_details: null,
  vehicle_type: null,
  excel_file: null,
});

function updateArray() {
  const inputArray = commaText.value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  // Remove duplicates from the array
  const uniqueArray = [...new Set(inputArray)];

  vehicleData.vehicle_license = uniqueArray;
}

const fileName = ref(null);
const docChecker = ref(false);

const setDoc = async (e) => {
  const doc = e.target.files[0];

  console.log(doc);

  if (doc) {
    if (/\.xlsx?$/i.test(doc.name)) {
      const arrayBuffer = await doc.arrayBuffer();

      console.log(arrayBuffer);

      const base64String = arrayBufferToBase64(arrayBuffer);

      // Assign the base64 string to your data property
      vehicleData.excel_file = base64String;

      // Optionally, you can also access other properties like doc.name, doc.size, etc.
      fileName.value = doc.name;
    } else {
      console.error("Invalid file format. Please select a valid Excel file.");
    }
  }

  e.target.value = null;
};

// Function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

watch(
  () => vehicleData,
  () => {
    emit("updateSignData", vehicleData);
  },
  { deep: true }
);

watch(docChecker, (newX) => {
  newX ? (vehicleData.vehicle_license = []) : (vehicleData.excel_file = null);
});
</script>

<template>
  <li>
    <h6 class="font-medium text-sm px-5 my-5 flex items-center justify-between">
      <span>Vehicle Type {{ props.index + 1 }}</span>
      <button
        type="button"
        v-if="props.length > 1"
        @click="emit('deleteSignData')"
      >
        <IconDelete class="h-6 w-auto" />
      </button>
    </h6>
    <div class="flex flex-col sm:flex-row mt-5">
      <div class="inputHolder mb-0 sm:my-0 grow">
        <select
          placeholder=" "
          class="input peer"
          :id="'brandDetails' + props.index"
          v-model="vehicleData.branding_details"
          required
        >
          <option
            v-for="(item, index) in detailType"
            :key="index"
            :value="item"
            v-text="item"
          ></option>
        </select>
        <label :for="'brandDetails' + props.index" class="inputLabel"
          >Branding Details</label
        >
      </div>

      <SignTypesSelector
        :index="props.index"
        :productType="'mobile_ads'"
        v-model="vehicleData.vehicle_type"
        :label="'Type of Vehicle'"
        class="mb-0 sm:my-0 grow"
      />
    </div>

    <div class="relative flex gap-5 text-start mt-5 mb-5 px-5 text-sm">
      <label :for="'docChecker' + props.index"
        >Upload Vehicle Registration in Excel Sheet</label
      >
      <input
        type="checkbox"
        :id="'docChecker' + props.index"
        v-model="docChecker"
      />
    </div>
    <div
      class="relative flex gap-5 text-start px-5 text-sm font-medium underline"
    >
      <a
        href="/DATA-EXAMPLE-test.xlsx"
        download
        target="_blank"
        rel="noopener noreferrer"
        >Download Excel Sheet Sample</a
      >
    </div>

    <div class="inputHolder" v-if="!docChecker">
      <span
        class="text-xs mb-2.5 text-start"
        v-if="vehicleData.vehicle_license.length"
        >{{ vehicleData.vehicle_license.length }} Vehicle(s)</span
      >

      <textarea
        placeholder="Enter each car registration Number separated by comma(,)"
        v-model="commaText"
        :id="'commaText' + props.index"
        class="input placeholder:text-neutral-700/50 resize-y"
        rows="6"
        @input="updateArray"
        required
      ></textarea>
    </div>

    <div class="inputHolder" v-else>
      <label v-show="!vehicleData.excel_file" :for="'spread' + props.index">
        <span class="block text-sm text-start mb-2.5"
          >Upload a Excel Document</span
        >
        <div
          class="bg-indigo-100 bg-opacity-25 flex flex-col justify-center items-center p-5 border-2 border-dashed rounded-md"
        >
          <IconUpload class="w-6 h-6" />
          <span class="text-sm mt-2.5">Click to Select File</span>
        </div>
      </label>
      <input
        :id="'spread' + props.index"
        type="file"
        accept=".xlsx"
        class="hidden"
        :name="'spread' + props.index"
        @change="setDoc"
      />
      <div v-show="vehicleData.excel_file" class="w-full">
        <span class="text-start block underline"
          >{{ fileName }} File Selected</span
        >
      </div>
    </div>
  </li>
</template>
