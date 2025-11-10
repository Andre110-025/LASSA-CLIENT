<script setup>
import { ref } from "vue";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import { useUserStore } from "../../stores/user";
import FundWallet from "./popups/FundWallet.vue";
import { useHelpers } from "../../helper";

const userStore = useUserStore();

const { formatCurrency } = useHelpers();

const loading = ref(false);

const { open: openFund, close: closeFund } = useModal({
  component: FundWallet,
  attrs: {
    onConfirm() {
      closeFund();
    },
  },
  slots: {},
});
// hidden md:table-cell
</script>

<template>
  <div v-if="userStore.walletDetails.history.length && !loading">
    <table class="w-full mt-6 table-auto">
      <thead class="border-b-[.0938rem] border-gray-900 bg-slate-50">
        <tr>
          <th class="text-sm text-gray-700 text-left p-2.5 hidden md:table-cell">Transaction ID</th>
          <th class="text-sm text-gray-700 text-left p-2.5">Amount</th>
          <th class="text-sm text-gray-700 text-left p-2.5">Status</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="request in userStore.walletDetails.history" class="even:bg-slate-50">
          <td class="p-2.5 text-xs xs:text-sm hidden md:table-cell" v-text="request.transaction_id"></td>
          <td class="p-2.5 text-xs xs:text-sm" v-text="formatCurrency(request.transaction_amount)"></td>
          <td class="p-2.5 text-xs xs:text-sm">
            <IconAppStatus :status="request.status"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <GetData v-else-if="loading"> Getting Wallet History </GetData>

  <NoList v-else @performAction="openFund">
    <template #description> No Transaction </template>
    <template #action> Fund Wallet </template>
  </NoList>
</template>
