<script setup>
import { ref } from "vue";
import CardOverviewMain from "../components/CardOverviewMain.vue";
import { useModal } from "vue-final-modal";
import WalletHistory from "../components/dashboard/WalletHistory.vue";
import FundWallet from "../components/dashboard/popups/FundWallet.vue";
import { useUserStore } from "@/stores/user";
import PaymentHistoryTable from "../components/dashboard/PaymentHistoryTable.vue";

const userStore = useUserStore();

const historyType = ref("payment");

const { open: openFund, close: closeFund } = useModal({
  component: FundWallet,
  attrs: {
    onConfirm() {
      closeFund();
    },
  },
  slots: {},
});

userStore.getWalletData();
</script>

<template>
  <div class="container mx-auto p-2.5">
    <div class="bg-white p-5 mb-5 rounded-xl">
      <h5 class="text-xl mb-5">Payments and Wallet</h5>
      <div class="flex gap-5 flex-wrap">
        <CardOverviewMain />

        <!-- <div class="bg-indigo-100 bg-opacity-25 py-2.5 px-3.5 border border-blue-300 rounded-xl"></div> -->
        <div
          class="bg-mainColor text-white py-2.5 rounded-xl max-w-[320px] w-full"
          v-if="true"
        >
          <p
            class="text-center uppercase px-5 tracking-wide pb-2.5 border-b border-b-white text-white font-medium"
          >
            Fund Wallet
          </p>
          <div class="mt-2.5 px-2.5 pb-2.5">
            <p class="text-center text-sm text-white">Have you paid to Bank!</p>
            <button class="whiteBtn max-w-[200px] mt-2" @click="openFund">
              Click Here!
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 p-5 bg-white rounded-lg">
      <div class="flex flex-row flex-wrap gap-5 xs:gap-14 mt-6 mb-10">
        <div>
          <input
            type="radio"
            v-model="historyType"
            class="logInput checked:border-b-2 peer"
            id="tab1"
            value="payment"
          />
          <label
            for="tab1"
            class="peer-checked:border-b-2 peer-checked:shadow-lg border-b-mainColor p-2 text-xs xs:text-base"
            >Payment History</label
          >
        </div>

        <div v-if="false">
          <input
            type="radio"
            v-model="historyType"
            class="logInput peer"
            id="tab2"
            value="wallet"
          />
          <label
            for="tab2"
            class="peer-checked:border-b-2 peer-checked:shadow-lg border-b-mainColor p-2 text-xs xs:text-base"
            >Wallet History</label
          >
        </div>
      </div>

      <!-- Table goes Here -->
      <div class="w-full">
        <PaymentHistoryTable :user-type="userStore.userDetails.userInfo.user_type" v-if="historyType === 'payment'"/>
        <WalletHistory v-if="historyType === 'wallet'" />
      </div>
    </div>
  </div>
</template>
