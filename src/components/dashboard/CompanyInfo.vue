<script setup>
import { useHelpers } from "../../helper";

const { lagosLGAs } = useHelpers();

defineProps({
  kycStep: {
    require: true,
    type: Number,
  },
  checker: Boolean,
});

defineEmits(["moveNext"]);

const interestData = defineModel("interestData");
</script>

<template>
  <div>
    <h5>Business Information</h5>

    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="companyname"
        v-model="interestData.companyname"
        autocomplete="off"
      />
      <label for="companyname" class="inputLabel">Company Name</label>
    </div>

    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="officeaddress"
        autocomplete="off"
        v-model="interestData.officeaddress"
      />
      <label for="officeaddress" class="inputLabel">Office Address</label>
    </div>

    <div class="flex flex-col sm:flex-row mt-5">
      <div class="inputHolder my-0">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="nearestbustop"
          v-model="interestData.nearestbustop"
          autocomplete="off"
        />
        <label for="nearestbustop" class="inputLabel">Nearest Bus-stop</label>
      </div>

      <div class="inputHolder mb-0 sm:my-0">
        <select
          placeholder=" "
          class="input peer"
          id="bizLga"
          v-model="interestData.lga"
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
    </div>

    <div class="inputHolder">
      <input
        type="number"
        placeholder=" "
        class="input peer"
        id="employeecount"
        v-model="interestData.employeecount"
        autocomplete="off"
      />
      <label for="employeecount" class="inputLabel"
        >Approximate Employee Count</label
      >
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer"
        id="companytype"
        v-model="interestData.companytype"
      >
        <option value="existing company" v-text="'Yes'"></option>
        <option value="new company" v-text="'No'"></option>
      </select>

      <label for="companytype" class="inputLabel">Company is 3+ Old</label>
    </div>

    <div class="mt-5">
      <button
        type="button"
        class="blueBtn min-w-[200px] mx-auto"
        @click="$emit('moveNext')"
        :disabled="checker"
      >
        <span class="text-sm font-medium text-white tracking-wider">Next</span>
      </button>
    </div>
  </div>
</template>
