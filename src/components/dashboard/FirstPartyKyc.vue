<!-- Route will be protected -->
<script setup>
import { ref, reactive, computed } from "vue";
import BizInfoKyc from "./firstParty/BizInfoKyc.vue";
import BizAddressKyc from "./firstParty/BizAddressKyc.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { toast } from 'vue3-toastify';

const router = useRouter();
const userStore = useUserStore();

const kycData = reactive({
  "website" : null,
  "full_address" : null,
  "building_number" : null,
  "lga" : null,
  "bustop" : null,
  "business_category" : null
});

const kycStep = ref(1);

const loading = ref(false);

const progressPercent = computed(() => {
  if (kycStep.value === 2) return 50;
  else if (kycStep.value === 3) return 100;
  else return 0;
});


const submitKyc = async () => {
  try {
    loading.value = true;
    const response = await axios.post("registerkyc", kycData);
    console.log(response);
    if (response.status === 200) {
      toast.success("KYC updated successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
      await userStore.getUserData();
      router.push({name: 'Dashboard'});
    }

    loading.value = false;
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h4 class="text-center font-medium mb-10">Complete Business Information</h4>

    <!-- Progress bar -->
    <div class="progressbar max-w-md mx-auto">
      <div
        :style="{ width: progressPercent + '%' }"
        class="progress"
        id="progress"
      ></div>

      <div
        class="progress-step progress-step-active"
        data-title="Information"
      ></div>
      <div
        class="progress-step"
        :class="{ 'progress-step-active': kycStep >= 2 }"
        data-title="Contact"
      ></div>
      <div
        class="progress-step"
        :class="{ 'progress-step-active': kycStep === 3 }"
        data-title="Overview"
      ></div>
    </div>

    <form novalidate class="max-w-md mx-auto space-y-10">
      <BizInfoKyc
        :kyc-step="kycStep"
        v-if="kycStep === 1 || kycStep === 3"
        @moveNext="kycStep++"
        v-model:business-category="kycData.business_category"
      />

      <BizAddressKyc
        :kyc-step="kycStep"
        v-if="kycStep === 2 || kycStep === 3"
        @move-next="kycStep++"
        v-model:building-number="kycData.building_number"
        v-model:business-website="kycData.website"
        v-model:bus-stop="kycData.bustop"
        v-model:business-lga="kycData.lga"
        v-model:business-address="kycData.full_address"
      />

      <div class="mt-5">
        <button
          :disabled="loading"
          type="button"
          class="blueBtn min-w-[200px] mx-auto"
          @click="submitKyc"
          v-if="kycStep === 3"
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
  </div>
</template>

<style scoped>
/* Progressbar */
.progressbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  counter-reset: step;
  margin-block: 2rem 4rem;
  --primary-color: #020f54;
  isolation: isolate;
}

.progressbar::before,
.progress {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  width: 100%;
  background-color: #dcdcdc;
  z-index: -1;
}

.progress {
  background-color: var(--primary-color);
  width: 0%;
  transition: 0.3s;
}

.progress-step {
  width: 2.1875rem;
  height: 2.1875rem;
  background-color: #dcdcdc;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-step::before {
  counter-increment: step;
  content: counter(step);
}

.progress-step::after {
  content: attr(data-title);
  position: absolute;
  top: calc(100% + 0.5rem);
  font-size: 0.85rem;
  color: #666;
}

.progress-step-active {
  background-color: var(--primary-color);
  color: #f3f3f3;
}
</style>
