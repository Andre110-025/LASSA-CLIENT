<script setup>
import PhotoLoader from "./PhotoLoader.vue";
import DocumentLoader from "./DocumentLoader.vue";
import { ref, reactive, computed, inject } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";
import { toast } from "vue3-toastify";
import IconSpinner from "../icons/IconSpinner.vue";
import SignTypesSelector from "./SignTypesSelector.vue";

const props = defineProps({
  detailInfo: Object,
  index: Number,
});

const { start_date, end_date } = inject("appData");
const updateApp = inject("updateApp");

const convertToArr = (arr) => {
  if (!arr) return null;
  return arr.split(",").map((item) => item.trim());
};

const singleTypeData = reactive({
  classificationSign: props.detailInfo.class_signs.toLowerCase(),
  typeSign: props.detailInfo.type_sign.toLowerCase(),
  size: parseFloat(props.detailInfo.size_ads),
  dimension: props.detailInfo.dimension_ads,
  photo: null,
  transitSign: props.detailInfo.transit_sign,
  vehicleLicense: null, //file
  licenseNumber: convertToArr(props.detailInfo.license_number),
  durationDays: convertToArr(props.detailInfo.days_in_duration),
  number_of_days: props.detailInfo.number_of_days,
  wearableSign: props.detailInfo.wearable_sign,
  amountWearable: props.detailInfo.number_wearable,
  moveableAnimation: props.detailInfo.moveable_animation,
  trafficStatement: null, //file
});

const getSplitDimension = (pos) => {
  if (!props.detailInfo.dimension_ads) return null;

  const parts = props.detailInfo.dimension_ads.split(" by ");

  return parseFloat(parts[pos]);
};

const loading = ref(false);
const length = ref(getSplitDimension(0));
const breath = ref(getSplitDimension(1));
const commaText = ref(props.detailInfo.license_number);

// In case of a range picker, you'll receive [Date, Date]
const format = (date) => {
  console.log(`${day}/${month}/${year}`, date);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const classifications = ["movable signs", "other temporary signs"];

const checkType = () => {
  if (singleTypeData.classificationSign !== "movable signs") {
    singleTypeData.transitSign = false;
    singleTypeData.vehicleLicense = null;
    singleTypeData.moveableAnimation = false;
    singleTypeData.trafficStatement = null;
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
  if (!value) {
    singleTypeData.durationDays = null;
    singleTypeData.number_of_days = null;

    return;
  }
  // Map each date string to its formatted version
  const formattedDates = value.map(formatDate);

  singleTypeData.durationDays = formattedDates;

  singleTypeData.number_of_days = formattedDates.length;

  // console.log(formattedDates);
};

function updateArray() {
  const inputArray = commaText.value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");

  // Remove duplicates from the array
  const uniqueArray = [...new Set(inputArray)];

  singleTypeData.licenseNumber = uniqueArray;
}

const checkSignType = computed(() => {
  const needSize = [
    "banner on vehicle(car, bus)",
    "banner on a truck",
    "banner on rig",
    "banners",
    "inflatables",
  ];

  const result = needSize.includes((singleTypeData.typeSign || "").toLowerCase());

  if (!result) {
    singleTypeData.size = null;
    length.value = null;
    breath.value = null;
  }

  return result;
});

const checkIfVehicle = computed(() => {
  const needSize = ["banner on vehicle(car, bus)", "banner on a truck"];

  const result = needSize.includes((singleTypeData.typeSign || "").toLowerCase());

  return result;
});

const checkIfDays = computed(() => {
  const needSize = [
    "banner on vehicle(car, bus)",
    "banner on a truck",
    "branded t-shirt",
    "city walker/skaters",
  ];

  const result = needSize.includes((singleTypeData.typeSign || "").toLowerCase());

  if (!result) {
    singleTypeData.number_of_days = null;
    singleTypeData.durationDays = null;
  }

  return result;
});

const checkDimension = computed(() => {
  if (length.value && breath.value) {
    const product = length.value * breath.value;
    singleTypeData.size = product;
    singleTypeData.dimension = `${length.value} by ${breath.value}`;
    return product;
  } else {
    singleTypeData.dimension = null;
    singleTypeData.size = null;
    return null;
  }
});

const checkSizeType = computed(() => {
  if ((singleTypeData.typeSign || "").toLowerCase() === "inflatables") {
    return 45;
  } else {
    return null;
  }
});

const submitTemporaryEdit = async () => {
  try {
    loading.value = true;
    const { data } = await axios.post(
      `edittemporarydetails/${props.detailInfo.first_party_temporary_ads_id}/${props.detailInfo.id}`,
      singleTypeData
    );
    console.log(data);
    if (data.success) {
      // edit.value = false;
      toast.success("Update has been saved", {
        position: toast.POSITION.TOP_CENTER,
      });
      updateApp();
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
      toast.error("Application Could not be Scored", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);

    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="submitTemporaryEdit">
    <SignTypesSelector
      :index="props.index"
      :productType="'temporary_first_party'"
      v-model="singleTypeData.typeSign"
    />

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer capitalize"
        :id="'classificationSign' + index"
        v-model="singleTypeData.classificationSign"
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
          v-model="singleTypeData.size"
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
          :min-date="start_date"
          :max-date="end_date"
          multi-dates
          disable-year-select
          :model-value="singleTypeData.durationDays"
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
          v-model="singleTypeData.number_of_days"
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
        (base64Content) => (singleTypeData.photo = base64Content)
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
        v-model="singleTypeData.amountWearable"
        required
      />
      <label :for="'amountWearable' + props.index" class="inputLabel"
        >Number of {{ singleTypeData.typeSign || "Signs" }}</label
      >
    </div>

    <!-- If Vehicle -->
    <div v-if="checkIfVehicle">
      <div class="inputHolder">
        <span
          class="text-xs mb-2.5 text-start"
          v-if="singleTypeData.licenseNumber?.length"
          >{{ singleTypeData.licenseNumber?.length }} Vehicle(s)</span
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
          (base64Content) => (singleTypeData.vehicleLicense = base64Content)
        "
      >
        Upload license Image
      </PhotoLoader>
    </div>

    <!-- Movable Signs -->
    <div v-if="singleTypeData.classificationSign === 'movable signs'">
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
          v-model="singleTypeData.moveableAnimation"
        />
      </div>

      <DocumentLoader
        :label="'trafficStatement' + index"
        @update:fileEncode="
          (base64Content) => (singleTypeData.trafficStatement = base64Content)
        "
      >
        Upload Road Map
      </DocumentLoader>
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
</template>
