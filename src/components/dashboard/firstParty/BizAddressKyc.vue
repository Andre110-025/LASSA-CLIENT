<script setup>
import { useUserStore } from "../../../stores/user";
import { useHelpers } from "../../../helper";

const userStore = useUserStore();
defineProps({
  kycStep: {
    require: true,
    type: Number
  },
  buildingNumber: String,
  businessWebsite: String,
  busStop: String,
  businessLga: String,
  businessAddress: String,
});

defineEmits([
  "update:buildingNumber",
  "update:businessWebsite",
  "update:busStop",
  "update:businessLga",
  "update:businessAddress",
  'moveNext'
]);

const { lagosLGAs } = useHelpers();
</script>

<template>
  <div>
    <h5>Business Contact Information</h5>

    <div class="inputHolder">
      <input
        type="email"
        placeholder=" "
        class="input peer"
        id="bizMail"
        v-model="userStore.userDetails.userInfo.email"
        autocomplete="off"
        disabled
      />
      <label for="bizMail" class="inputLabel">Email</label>
    </div>

    <div class="inputHolder">
      <input
        type="tel"
        placeholder=" "
        class="input peer"
        id="bizNum"
        v-model="userStore.userDetails.userInfo.phone_number"
        autocomplete="off"
        disabled
      />
      <label for="bizNum" class="inputLabel">Contact Phone</label>
    </div>

    <div class="inputHolder">
      <input
        type="url"
        placeholder=" "
        class="input peer"
        id="bizWebsite"
        :value="businessWebsite"
        @input="$emit('update:businessWebsite', $event.target.value)"
        autocomplete="off"
      />
      <label for="bizWebsite" class="inputLabel">Website(Optional)</label>
    </div>

    <div class="flex flex-col sm:flex-row">
      <div class="inputHolder my-0">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="bizBuildName"
          :value="buildingNumber"
          @input="$emit('update:buildingNumber', $event.target.value)"
          autocomplete="off"
        />
        <label for="bizBuildName" class="inputLabel">Building Number</label>
      </div>

      <div class="inputHolder mb-0 sm:my-0">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="bizBusStop"
          :value="busStop"
          @input="$emit('update:busStop', $event.target.value)"
          autocomplete="off"
        />
        <label for="bizBusStop" class="inputLabel">Nearest Bus-stop</label>
      </div>
    </div>

    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="bizAddress"
        :value="businessAddress"
        @input="$emit('update:businessAddress', $event.target.value)"
        autocomplete="off"
      />
      <label for="bizAddress" class="inputLabel">Full Address</label>
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer"
        id="bizLga"
        :value="businessLga"
        @input="$emit('update:businessLga', $event.target.value)"
      >
        <option
          v-for="(item, index) in lagosLGAs"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label for="bizLga" class="inputLabel">LGA</label>
    </div>
    <div class="mt-5">
      <button
        :disabled="
          !(buildingNumber && busStop && businessAddress && businessLga)
        "
        type="button"
        class="blueBtn min-w-[200px] mx-auto"
        @click="$emit('moveNext')"
        v-if="kycStep <= 2"
      >
        <span class="text-sm font-medium text-white tracking-wider">Next</span>
      </button>
    </div>
  </div>
</template>
