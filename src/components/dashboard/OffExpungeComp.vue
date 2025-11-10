<script setup>
import { useHelpers } from "../../helper";
const { formatCurrency } = useHelpers();
import IconAppStatus from "../icons/IconAppStatus.vue";

defineProps({
  offExpungeData: Object,
});
</script>

<template>
  <div class="flex flex-col p-6 gap-4">
    <div>
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Off-Charge / Expunge Process
      </h6>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Request Type</p>
      <p class="text-sm" v-text="offExpungeData.type_charges"></p>
    </div>

    <div v-if="offExpungeData.type_charges !== 'expunction'" class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Start Date</p>
      <p class="text-sm" v-text="offExpungeData.off_charge_start"></p>
    </div>

    <div v-if="offExpungeData.type_charges !== 'expunction'" class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">End Date</p>
      <p class="text-sm" v-text="offExpungeData.off_charge_end"></p>
    </div>

    <div v-if="offExpungeData.type_charges === 'expunction'" class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Expunge Date</p>
      <p class="text-sm" v-text="offExpungeData.expunge_date"></p>
    </div>
    
    <div
      class="flex xs:flex-row align-middle"
      v-if="offExpungeData?.md_approval"
    >
      <p class="w-2/5 text-sm font-semibold">MD Approval</p>
      <p class="text-sm">
        <IconAppStatus :status="offExpungeData.md_approval" />
      </p>
    </div>

    <div
      class="flex flex-col gap-2"
      v-if="offExpungeData?.letter_offcharge"
    >
      <p class="w-2/5 text-sm font-semibold">Off-Charge Letter</p>
      <embed
        :src="offExpungeData?.letter_offcharge"
        width="100%"
        height="100%"
        type="application/pdf"
      />
    </div>

    <div class="flex flex-col gap-2" v-if="offExpungeData?.off_charge_picture">
      <p class="w-2/5 text-sm font-semibold">Off-Charge Image</p>
      <img
        :src="offExpungeData?.off_charge_picture"
        alt=""
        class="w-full bg-gray-600"
      />
    </div>
  </div>
</template>
