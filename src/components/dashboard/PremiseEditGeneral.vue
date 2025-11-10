<script setup>
import { ref, reactive } from "vue";
import { useHelpers } from "../../helper";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import axios from "axios";

const { lagosLGAs } = useHelpers();

const propertyTypes = ["Single Business Unit", "Multi-tenanted Business"];

const props = defineProps({
  appID: {
    required: true,
  },
  appInfo: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['getUpdate']);

const loading = ref(false);

const outDoorData = reactive({
  sign_address: props.appInfo.sign_address,
  business_name: props.appInfo.business_name,
  lga: props.appInfo.lga,
  name_of_owner: props.appInfo.name_of_owner,
  phone_number: props.appInfo.phone_number,
  email: props.appInfo.email
})

const submitUpdateData = async () => {
  loading.value = true;
  try {
    const response = await axios.post(
      `editonpremise/${props.appID}`,
      outDoorData
    );
    console.log(response);
    if (response.status === 200) {

      toast.success("Update Saved", {
        position: toast.POSITION.TOP_CENTER,
      });

      emits("getUpdate");
    }
    loading.value = false;
  } catch (error) {
    if (error.response.data.errors?.length >= 1) {
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

    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="submitUpdateData" class="scroll-mt-24">
    <h5 class="font-medium px-5 mb-5 flex items-center justify-between">
      <span>Edit General Info</span>
    </h5>

    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="business_name"
        v-model="outDoorData.business_name"
        required
      />
      <label for="business_name" class="inputLabel">Business Name</label>
    </div>

    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="signAddress"
        v-model="outDoorData.sign_address"
        required
      />
      <label for="signAddress" class="inputLabel">Sign Address</label>
    </div>

    <div class="inputHolder">
      <select
        placeholder=" "
        class="input peer"
        id="signLga"
        v-model="outDoorData.lga"
        required
      >
        <option
          v-for="(item, index) in lagosLGAs"
          :key="index"
          :value="item"
          v-text="item"
        ></option>
      </select>

      <label for="signLga" class="inputLabel">LGA</label>
    </div>

    <!-- Property Details -->
    <div class="inputHolder">
      <input
        type="text"
        placeholder=" "
        class="input peer"
        id="propertyOwner"
        v-model="outDoorData.name_of_owner"
      />
      <label for="propertyOwner" class="inputLabel"
        >Name of Property Owner</label
      >
    </div>

    <div class="inputHolder">
      <input
        type="tel"
        placeholder=" "
        class="input peer"
        id="propertyOwnerPhone"
        v-model="outDoorData.phone_number"
        required
      />
      <label for="propertyOwnerPhone" class="inputLabel"
        >Property Owner Phone</label
      >
    </div>

    <div class="inputHolder">
      <input
        type="email"
        placeholder=" "
        class="input peer"
        id="propertyOwnerMail"
        v-model="outDoorData.email"
      />
      <label for="propertyOwnerMail" class="inputLabel"
        >Property Owner Email(optional)</label
      >
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
