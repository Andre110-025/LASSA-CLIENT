<script setup>
import { useHelpers } from "../../helper";
const { formatCurrency } = useHelpers();
import IconAppStatus from "../icons/IconAppStatus.vue";

defineProps({
  upDownGradeData: Object,
  adsPrice: {
    default: null,
  },
  legalFee: {
    default: null,
  },
});
</script>

<template>
  <div class="flex flex-col p-6 gap-4" v-if="upDownGradeData">
    <div>
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Upgrade/Downgrade Process
      </h6>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Request ID</p>
      <p class="text-sm" v-text="upDownGradeData.application_id"></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Request Type</p>
      <p class="text-sm" v-text="upDownGradeData.type_charges"></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Sign Type</p>
      <p class="text-sm" v-text="upDownGradeData.request_outdoor_signage"></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Application Status</p>
      <p class="text-sm">
        <IconAppStatus
          :status="
            !upDownGradeData.md_approval
              ? 'pending'
              : upDownGradeData.md_approval
          "
        />
      </p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Payment Status</p>
      <p class="text-sm">

        <span
          class="block bg-green-100 text-[#00AE4E] text-xs text-center w-full py-1 px-2 rounded select-none uppercase"
          v-if="upDownGradeData.bill_payment_status === 'paid'"
          >Paid</span
        >
        <span
          class="block bg-red-100 text-[#f00] text-xs text-center w-full py-1 px-2 rounded select-none uppercase"
          v-else
          >Not Paid</span
        >
      </p>
    </div>

    <div
      v-if="upDownGradeData.bill_status === 'generated'"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Signage Cost</p>
      <p class="text-sm" v-text="formatCurrency(adsPrice)"></p>
    </div>

    <div
      v-if="upDownGradeData.bill_status === 'generated'"
      class="flex xs:flex-row align-middle"
    >
      <p class="w-2/5 text-sm font-semibold">Legal Cost</p>
      <p class="text-sm" v-text="formatCurrency(legalFee)"></p>
    </div>
  </div>
</template>
