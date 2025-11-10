<script setup>
import { VueFinalModal } from "vue-final-modal";
import { useHelpers } from "../../../helper";
import { useUserStore } from "../../../stores/user";

const userStore = useUserStore();
const { formatCurrency } = useHelpers();

const props = defineProps({
  walletData: Object,
});
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 min-w-[450px] min-h-[350px] max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed">
      <h4 class="px-5 py-8 text-center">Wallet Break Down</h4>
    </div>
    <div class="flex flex-col p-6 gap-4 fxfcol">
      <div class="flex xs:flex-row align-middle">
        <p class="w-fit text-sm font-semibold">Onpremise Permit Balance</p>
        <p
          class="text-sm"
          v-text="formatCurrency(props.walletData.onpremise_wallet)"
        ></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-fit text-sm font-semibold">Temopary Advert Balance</p>
        <p
          class="text-sm"
          v-text="formatCurrency(props.walletData.temporary_wallet)"
        ></p>
      </div>
      <div
        v-if="userStore.userDetails.userInfo.user_type === 'third_party'"
        class="flex xs:flex-row align-middle"
      >
        <p class="w-fit text-sm font-semibold">Outdoor Balance</p>
        <p
          class="text-sm"
          v-text="formatCurrency(props.walletData.outdoor_wallet)"
        ></p>
      </div>
      <div class="flex xs:flex-row align-middle">
        <p class="w-fit text-sm font-semibold">Small Format Balance</p>
        <p
          class="text-sm"
          v-text="formatCurrency(props.walletData.small_format_wallet)"
        ></p>
      </div>
      <div class="flex xs:flex-row align-middle" v-if="false">
        <p class="w-fit text-sm font-semibold">SLP Administrative Balance</p>
        <p
          class="text-sm"
          v-text="
            formatCurrency(props.walletData.streetlamp_administrative_balance)
          "
        ></p>
      </div>
    </div>
  </VueFinalModal>
</template>

<style scoped>
div.fxfcol > div.flex {
  @apply gap-2 2md:flex-row flex-col;
}
div.fxfcol > div > p:nth-of-type(1) {
  @apply 2md:w-[40%] w-full;
}
div.fxfcol > div > p:nth-of-type(2) {
  @apply 2md:w-[60%] w-full;
}
</style>
