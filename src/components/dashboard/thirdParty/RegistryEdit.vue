<script setup>
import { ref, reactive, onMounted } from "vue";
import DocumentLoader from "../DocumentLoader.vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useUserStore } from "../../../stores/user";

const { getUserData, userDetails } = useUserStore();

defineProps({});

const loading = ref(false);
const emit = defineEmits(["changeEdit"]);
const kycData = userDetails.userInfo.kyc_third_party;

const interestData = reactive({
  officeaddress: null,
  employeecount: null,
  companyname: null,
  nearestbustop: null,
  listpastproject: null,
  preliminarydesign: null,
  technicalreference: null,
});

const submitUpdate = async () => {
  loading.value = true;
  try {
    const { data } = await axios.post(
      `editthirdpartykyc/${userDetails.userInfo.kyc_third_party.id}/registry`,
      interestData
    );
    console.log(data);
    if (data.success) {
      toast.success("Update Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getUserData();
      emit("changeEdit");
    }
  } catch (error) {
    if (!error.response.data.success) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loading.value = false;
  }
};

onMounted(() => {
  interestData.companyname = kycData.company_name
  interestData.nearestbustop = kycData.nearest_bustop
  interestData.employeecount = kycData.employee_count
  interestData.officeaddress = kycData.office_address
})
</script>

<template>
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h5>Supporting Document</h5>

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
    </div>

    <DocumentLoader
      label="preliminarydesign"
      @update:fileEncode="
        (base64Content) => (interestData.preliminarydesign = base64Content)
      "
    >
      Preliminary Samples or Technical Designs.
    </DocumentLoader>

    <DocumentLoader
      label="technicalreference"
      @update:fileEncode="
        (base64Content) => (interestData.technicalreference = base64Content)
      "
    >
      Technical Reference (Must be COREN Registered).
    </DocumentLoader>

    <div class="mt-5">
      <button
        :disabled="loading"
        @click="submitUpdate()"
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
  </div>
</template>
