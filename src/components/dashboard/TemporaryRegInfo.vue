<script setup>
import { ref, computed } from "vue";
import IconDelete from "../icons/IconDelete.vue";
import PhotoLoader from "./PhotoLoader.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import SignTypesSelector from "./SignTypesSelector.vue";

const props = defineProps({
  index: Number,
  length: Number,
});

const length = ref(null);
const breath = ref(null);

const emit = defineEmits(["deleteSignData"]);

const temporaryData = defineModel("temporaryData");

const phaseLabel = computed(() => {
  // FIXED: Always fallback to empty string before .toLowerCase()
  const typeSign =
    (temporaryData.value.temporaryDetails.temporaryInfo[props.index].typeSign || "").toLowerCase();
  return typeSign === "wrap around(construction site)"
    ? "Phases"
    : typeSign || "Signs";
});

const checkSignType = computed(() => {
  const needSize = [
    "banner on premise",
    "wall drape for non-practitioner",
    "wall drape for practitioner",
    "development boards",
    "development boards for government contractor",
    "inflatables",
    "water tank",
    "water tank for airport",
    "water tank ultra wave",
    "water tank ultra wave for airport",
  ];
  // FIXED: Always fallback to empty string before .toLowerCase()
  const result = needSize.includes(
    (temporaryData.value.temporaryDetails.temporaryInfo[props.index].typeSign || "").toLowerCase()
  );

  if (!result) {
    temporaryData.value.temporaryDetails.temporaryInfo[props.index].size = null;
    length.value = null;
    breath.value = null;
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
  // FIXED: Always fallback to empty string before .toLowerCase()
  if (
    (temporaryData.value.temporaryDetails.temporaryInfo[props.index].typeSign || "").toLowerCase() ===
    "inflatables"
  ) {
    return 45;
  } else {
    return null;
  }
});

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

const checkIfDays = computed(() => {
  // FIXED: Always fallback to empty string before .toLowerCase()
  const result =
    (temporaryData.value.temporaryDetails.temporaryInfo[props.index].typeSign || "").toLowerCase() ===
    "blimp";

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
      :productType="'temporary_third_party'"
      v-model="temporaryData.temporaryDetails.temporaryInfo[props.index].typeSign"
    />

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
          :min="checkSizeType"
          disabled
          required
        />
        <label :for="'size' + props.index" class="inputLabel"
          >Sign Size (Square meter)</label
        >
        <span
          class="text-start italic text-sm mt-2.5 block"
          v-if="checkSizeType"
          ><strong>Note: </strong>Inflatables Sign dimension must be greater
          than or equal to {{ checkSizeType }}</span
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
        >Number of {{ phaseLabel }}</label
      >
    </div>
  </li>
</template>
