<script setup>
import { useUserStore } from "../../../stores/user";

defineProps({
  kycStep: {
    require: true,
    type: Number
  },
  businessCategory: String
});

defineEmits(['update:businessCategory', 'moveNext'])

const userStore = useUserStore();

const bizCatOpt = [
  "Trading",
  "services",
  "Manufacturing",
  "Construction",
  "Transportation",
  "Agriculture",
  "Real Estate",
  "Hospitality",
  "Financial Services",
  "Education",
  "Others",
];
</script>

<template>
  <div>
    <h5>Business Information</h5>

    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="bizName"
        v-model="userStore.userDetails.userInfo.business_name"
        autocomplete="off"
        disabled
      />
      <label for="bizName" class="inputLabel">Business Name</label>
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer"
        id="bizCat"
        :value="businessCategory"
        @input="$emit('update:businessCategory', $event.target.value)"
      >
        <option
          v-for="(item, index) in bizCatOpt"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label for="bizCat" class="inputLabel">Business Category</label>
    </div>

    <div class="mt-5">
      <button
        :disabled="!businessCategory"
        type="button"
        class="blueBtn min-w-[200px] mx-auto"
        @click="$emit('moveNext')"
        v-if="kycStep <= 2"
      >
        <span
          class="text-sm font-medium text-white tracking-wider"
          >Next</span
        >
      </button>
    </div>
  </div>
</template>
