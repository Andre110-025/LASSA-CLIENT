<script setup>
import { ref } from 'vue'
import IconEye from "./icons/IconEye.vue";
import IconHidden from "./icons/IconHidden.vue";
import bgCardOverview from "./bgCardOverview.vue";
import IconNaira from "./icons/IconNaira.vue";
import IconWallet from "./icons/IconWallet.vue";
import { useUserStore } from "@/stores/user";
import { useModal } from "vue-final-modal";
import walletBreak from './dashboard/popups/WalletBreak.vue'

const userStore = useUserStore();

const shown = ref(false);

function viewBreakDown() {
  const { open, close } = useModal({
    component: walletBreak,
    attrs: {
      onConfirm() {
        close();
      },
      walletData: userStore.walletDetails
    },
    slots: {},
  });

  open();
}
</script>

<template>
  <div
    class="w-80 h-40 rounded-lg bg-blue-950 saturate-150 text-white relative p-6 select-none"
  >
    <bgCardOverview class="left-0 top-0 w-full h-auto opacity-35 absolute" />
    <p class="text-white relative">Cash Wallet</p>

    <div class="flex gap-1 justify-between items-center mt-4 *:text-xl relative">
      <div class="*:w-8 *:h-auto mx-2">
        <IconWallet />
      </div>
      <div class="flex gap-2 items-center justify-center grow">
        <IconNaira class="w-5" />
        <p class="relative text-white" :class="{ 'blur-sm': !shown }">
          {{ userStore.walletDetails.balance }}
          <span class="absolute left-0 blur-sm" :class="{ 'hidden': shown }">
            {{ userStore.walletDetails.balance }}
          </span>
        </p>
      </div>
      <div
        class="cursor-pointer *:w-6 *:stroke-[10px] *:stroke-white"
        @click="shown = !shown"
      >
        <IconEye v-if="shown" :color="'white'" class="cursor-pointer" />
        <IconHidden v-if="!shown" :color="'white'" class="cursor-pointer" />
      </div>
    </div>
    <span @click="viewBreakDown()" class="block relative text-white text-xs xs:text-sm italic text-center mt-4 underline w-full cursor-pointer underline-offset-2">View Breakdown</span>
  </div>
</template>
