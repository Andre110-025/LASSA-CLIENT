<script setup>
import { ref, computed } from "vue";
import IconDelete from "../icons/IconDelete.vue";
import PhotoLoader from "./PhotoLoader.vue";
import DocumentLoader from "./DocumentLoader.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import SignTypesSelector from "./SignTypesSelector.vue";

const props = defineProps({
  index: Number,
  length: Number,
});

const length = ref(null);
const breath = ref(null);
const commaText = ref(null);

// const date = ref(new Date());

// const format = (date) => {

//   const day = date.getDate();
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();

//   console.log(`${day}/${month}/${year}`);

//   return `${day}/${month}/${year}`;
// };

const emit = defineEmits(["deleteSignData"]);

const temporaryData = defineModel("temporaryData");

const classifications = ["movable signs", "other temporary signs"];

const checkType = () => {
  if (
    temporaryData.value.temporaryDetails.temporaryInfo[props.index]
      .classificationSign !== "movable signs"
  ) {
    temporaryData.value.temporaryDetails.temporaryInfo[
      props.index
    ].transitSign = false;
    temporaryData.value.temporaryDetails.temporaryInfo[
      props.index
    ].vehicleLicense = null;
    temporaryData.value.temporaryDetails.temporaryInfo[
      props.index
    ].moveableAnimation = false;
    temporaryData.value.temporaryDetails.temporaryInfo[
      props.index
    ].trafficStatement = null;
  }
};

// Function to format a date string into "Day Month Day Year" format
function formatDate(dateString) {
  const date = new Date(dateString);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${days[date.getDay()]} ${
    months[date.getMonth()]
  } ${date.getDate()} ${date.getFullYear()}`;
}

const setDate = (value) => {
  // Map each date string to its formatted version
  if (!value) {
    singleTypeData.durationDays = null;
    singleTypeData.number_of_days = null;

    return;
  }

  const formattedDates = value.map(formatDate);

  temporaryData.value.temporaryDetails.temporaryInfo[props.index].durationDays =
    formattedDates;

  temporaryData.value.temporaryDetails.temporaryInfo[
    props.index
  ].number_of_days = formattedDates.length;

  // console.log(formattedDates);
};

function updateArray() {
  const inputArray = commaText.value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  // Remove duplicates from the array
  const uniqueArray = [...new Set(inputArray)];

  temporaryData.value.temporaryDetails.temporaryInfo[
    props.index
  ].licenseNumber = uniqueArray;
}

const checkSignType = computed(() => {
  const needSize = [
    "banner on vehicle(car, bus)",
    "banner on a truck",
    "banner on rig",
    "banners",
    "inflatables",
  ];

  const result = needSize.includes(
    (
      temporaryData.value.temporaryDetails.temporaryInfo[props.index]
        .typeSign || ""
    ).toLowerCase()
  );

  if (!result) {
    temporaryData.value.temporaryDetails.temporaryInfo[props.index].size = null;
    length.value = null;
    breath.value = null;
  }

  return result;
});

const checkIfVehicle = computed(() => {
  const needSize = ["banner on vehicle(car, bus)", "banner on a truck"];

  const result = needSize.includes(
    (
      temporaryData.value.temporaryDetails.temporaryInfo[props.index]
        .typeSign || ""
    ).toLowerCase()
  );

  return result;
});

const checkIfDays = computed(() => {
  const needSize = [
    "banner on vehicle(car, bus)",
    "banner on a truck",
    "branded t-shirt",
    "banner on rig",
    "city walker/skaters",
    "3D city walker/skaters",
    "Static Branding on Car",
    "Static Branding on Tricycle",
    "Static Branding on Truck",
    "Static Branding on Bus",
    "3D Branding on Car",
    "3D Branding on Tricycle",
    "3D Branding on Truck",
    "3D Branding on Bus",
  ];

  const result = needSize.includes(
    (
      temporaryData.value.temporaryDetails.temporaryInfo[props.index]
        .typeSign || ""
    ).toLowerCase()
  );

  if (!result) {
    temporaryData.value.temporaryDetails.temporaryInfo[
      props.index
    ].number_of_days = null;
    temporaryData.value.temporaryDetails.temporaryInfo[
      props.index
    ].durationDays = null;
  }

  return result;
});

const checkDimension = computed(() => {
  if (length.value && breath.value) {
    const product = length.value * breath.value;
    temporaryData.value.temporaryDetails.temporaryInfo[props.index].size =
      product;
    temporaryData.value.temporaryDetails.temporaryInfo[
      props.index
    ].dimension = `${length.value} by ${breath.value}`;
    return product;
  } else {
    temporaryData.value.temporaryDetails.temporaryInfo[props.index].dimension =
      null;
    temporaryData.value.temporaryDetails.temporaryInfo[props.index].size = null;
    return null;
  }
});

const checkSizeType = computed(() => {
  if (
    (
      temporaryData.value.temporaryDetails.temporaryInfo[props.index]
        .typeSign || ""
    ).toLowerCase() === "inflatables"
  ) {
    return 45;
  } else {
    return null;
  }
});
</script>

<template>
  <li>
    <h6 class="font-medium text-sm px-5 my-5 flex items-center justify-between">
      <span>Temporary Advert Type {{ props.index + 1 }}</span>
      <button
        type="button"
        v-if="props.length > 1"
        @click="emit('deleteSignData')"
      >
        <IconDelete class="h-6 w-auto" />
      </button>
    </h6>

    <SignTypesSelector
      :index="props.index"
      :productType="'temporary_first_party'"
      v-model="
        temporaryData.temporaryDetails.temporaryInfo[props.index].typeSign
      "
    />

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer capitalize"
        :id="'classificationSign' + index"
        v-model="
          temporaryData.temporaryDetails.temporaryInfo[index].classificationSign
        "
        required
        @change="checkType()"
      >
        <option
          v-for="(item, index) in classifications"
          class="capitalize"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label :for="'classificationSign' + index" class="inputLabel"
        >Classification of Sign</label
      >
    </div>

    <!-- For Sign That require sizes -->
    <div v-if="checkSignType">
      <i class="text-start text-red-600 px-5 text-sm"
        >Please ensure sizes are in Meters</i
      >
      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            :id="'Length' + props.index"
            autocomplete="off"
            v-model="length"
            min="1"
            step=".10"
            required
          />
          <label :for="'Length' + props.index" class="inputLabel">Length</label>
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            :id="'Breath' + props.index"
            min="1"
            step=".10"
            autocomplete="off"
            v-model="breath"
            required
          />
          <label :for="'Breath' + props.index" class="inputLabel">Breath</label>
        </div>
      </div>

      <div v-if="checkDimension" class="inputHolder">
        <input
          placeholder=" "
          class="input peer"
          :id="'size' + props.index"
          type="number"
          v-model="temporaryData.temporaryDetails.temporaryInfo[index].size"
          disabled
          required
        />
        <label :for="'size' + props.index" class="inputLabel"
          >Sign Size (Square meter)</label
        >
      </div>
    </div>

    <!-- For Sign That require days -->
    <div v-if="checkIfDays">
      <div class="inputHolder">
        <label class="text-start mb-2.5">Select Days</label>
        <VueDatePicker
          :min-date="temporaryData.startDate"
          :max-date="temporaryData.endDate"
          multi-dates
          disable-year-select
          :model-value="
            temporaryData.temporaryDetails.temporaryInfo[index].durationDays
          "
          @update:model-value="setDate"
          required
        />
      </div>

      <div class="inputHolder">
        <input
          placeholder=" "
          class="input peer"
          :id="'number_of_days' + props.index"
          type="number"
          v-model="
            temporaryData.temporaryDetails.temporaryInfo[index].number_of_days
          "
          readonly
          required
        />
        <label :for="'number_of_days' + props.index" class="inputLabel"
          >Number Of Days</label
        >
      </div>
    </div>

    <PhotoLoader
      :label="'Photomontage' + index"
      @update:photoEncode="
        (base64Content) =>
          (temporaryData.temporaryDetails.temporaryInfo[index].photo =
            base64Content)
      "
    >
      Upload Photomontage
    </PhotoLoader>

    <div
      v-if="false"
      class="relative flex gap-5 text-start mt-5 mb-5 px-5 text-sm"
    >
      <label :for="'wearableSign' + props.index"
        >Are you Using Branded Clothes/Wears</label
      >
      <input
        type="checkbox"
        :id="'wearableSign' + props.index"
        v-model="
          temporaryData.temporaryDetails.temporaryInfo[index].wearableSign
        "
      />
    </div>

    <div class="inputHolder">
      <input
        placeholder=" "
        class="input peer"
        :id="'amountWearable' + props.index"
        type="number"
        step="1"
        v-model="
          temporaryData.temporaryDetails.temporaryInfo[index].amountWearable
        "
        required
      />
      <label :for="'amountWearable' + props.index" class="inputLabel"
        >Number of
        {{
          temporaryData.temporaryDetails.temporaryInfo[index].typeSign ||
          "Signs"
        }}</label
      >
    </div>

    <!-- If Vehicle -->
    <div v-if="checkIfVehicle">
      <div class="inputHolder">
        <span
          class="text-xs mb-2.5 text-start"
          v-if="
            temporaryData.temporaryDetails.temporaryInfo[index].licenseNumber
              ?.length
          "
          >{{
            temporaryData.temporaryDetails.temporaryInfo[index].licenseNumber
              ?.length
          }}
          Vehicle(s)</span
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

      <PhotoLoader
        :label="'vehicleLicense' + index"
        @update:photoEncode="
          (base64Content) =>
            (temporaryData.temporaryDetails.temporaryInfo[
              index
            ].vehicleLicense = base64Content)
        "
      >
        Upload license Image
      </PhotoLoader>
    </div>

    <!-- Movable Signs -->
    <div
      v-if="
        temporaryData.temporaryDetails.temporaryInfo[index]
          .classificationSign === 'movable signs'
      "
    >
      <div
        v-if="false"
        class="relative flex gap-5 text-start mt-5 mb-5 px-5 text-sm"
      >
        <label :for="'moveableAnimation' + props.index"
          >Sign has movable part animation, make use of a generator, motor or
          air pump for its display</label
        >
        <input
          type="checkbox"
          :id="'moveableAnimation' + props.index"
          v-model="
            temporaryData.temporaryDetails.temporaryInfo[index]
              .moveableAnimation
          "
        />
      </div>

      <DocumentLoader
        :label="'trafficStatement' + index"
        @update:fileEncode="
          (base64Content) =>
            (temporaryData.temporaryDetails.temporaryInfo[
              index
            ].trafficStatement = base64Content)
        "
      >
        Upload Road Map
      </DocumentLoader>
    </div>
  </li>
</template>
