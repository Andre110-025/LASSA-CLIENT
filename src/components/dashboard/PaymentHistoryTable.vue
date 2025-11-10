<script setup>
import { ref, watch } from "vue";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import axios from "axios";
import { TailwindPagination } from "laravel-vue-pagination";
import { useHelpers } from "../../helper";
import FilterButton from "./buttons/request/FilterButton.vue";

const props = defineProps({
  userType: {
    type: String,
    required: true
  }
})

const getCat = () => {
  if (props.userType === "first_party") {
    return ["On Premise", "Temopary Advert Wallet", "Small Format Wallet"];
  } else {
    return [
      // "Expression of Interest", incase of fuckup revert 
      "On Premise",
      "Temopary Advert Wallet",
      "Outdoor Wallet",
      "Small Format Wallet",
    ];
  }
};

const { dateToSlash, formatCurrency } = useHelpers();

const loading = ref(false);
const advertType = ref(getCat()[0]);

const paymentInfo = ref({});

async function getData(page = 1) {
  loading.value = true;
  paymentInfo.value = {};

  const getEndPoint = () => {
    if (advertType.value === 'On Premise') return 'getonpremisepayment'
    else if (advertType.value === 'Temopary Advert Wallet') return 'gettemporarypayment'
    else if (advertType.value === 'Outdoor Wallet') return 'getoutdoorpayment'
    else if (advertType.value === 'Small Format Wallet') return 'getsmallformatpayment'
  }
  // console.log(applicationInfo.value);
  try {
    const response = await axios.get(
      `${getEndPoint()}?page=${page}`
    );
    console.log(response);
    if (response.status === 200) {
      paymentInfo.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

const changeAd = (val) => {
  advertType.value = val;
  // status.value = '';
  getData()
} 

// watch(
//   () => props.status,
//   () => {
//     getData(1);
//   }
// );

getData();
</script>

<template>
  <div class="mt-4 p-5 bg-white rounded-lg">
    <FilterButton :options="getCat()" @change-cat="changeAd" />
  </div>

  <div v-if="paymentInfo.data?.length && !loading">
    <table class="w-full mt-6 table-auto">
      <thead class="border-b-[.0938rem] border-gray-900 bg-slate-50">
        <tr>
          <th
            class="text-sm text-gray-700 text-left p-2.5 hidden sm:table-cell"
          >
            Payment ID
          </th>
          <th class="text-sm text-gray-700 text-left p-2.5">Payment Purpose</th>
          <th class="text-sm text-gray-700 text-left p-2.5">Amount</th>
          <th
            class="text-sm text-gray-700 text-left p-2.5 hidden md:table-cell"
          >
            Date
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="app in paymentInfo.data" class="even:bg-slate-50">
          <td class="p-2.5 text-xs xs:text-sm" v-text="app.payment_id"></td>
          <td
            class="p-2.5 hidden sm:table-cell text-xs xs:text-sm"
            v-text="app.application_purpose"
          ></td>
          <td
            class="p-2.5 text-xs xs:text-sm"
            v-text="formatCurrency(app.amount_paid)"
          ></td>
          <td
            class="p-2.5 text-xs xs:text-sm"
            v-text="dateToSlash(app.created_at)"
          ></td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-8">
      <TailwindPagination
        :data="paymentInfo"
        @pagination-change-page="getData"
        class="vue-pagination"
      />
    </div>
  </div>

  <GetData v-else-if="loading"> Getting Application </GetData>

  <NoList :showBtn="false" v-else>
    <template #description> No Payment Record </template>
  </NoList>
</template>
