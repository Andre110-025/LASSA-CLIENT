<script setup>
import { ref, reactive, watch } from "vue";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import IconEye from "../icons/IconEye.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import CompleteAppPay from "./popups/CompleteAppPay.vue";
import { useModal } from "vue-final-modal";

const loading = ref(false);

const props = defineProps({
  status: String
});

const router = useRouter();

const headerTitles = [
  "Payment ID",
  "Sign type",
  "Status",
  // "LGA",
  "App Fee",
  "Actions",
];

const getEndPoint = () => {
  if(props.outdoorType === 'Outdoor Transfer') {
    return 'getallmytransferoutdoorsignage';
  } else {
    return 'getallmyoutdoorsignage';
  }
}

const applicationInfo = ref({});

async function getData(page = 1) {
  loading.value = true;
  try {
    const response = await axios.get(
      `getallmyoutdoorsignage?status=${props.status}&page=${page}`
    );
    // console.log(response);
    if (response.status === 200) {
      applicationInfo.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

watch(
  () => props.status,
  () => {
    getData(1);
  }
);


function completePayment(pId, status) {
  if (status === "pending") {
    return;
  }
  const { open, close } = useModal({
    component: CompleteAppPay,
    attrs: {
      onConfirm() {
        close();
        getData();
      },
      paymentID: pId,
      formType: "OutdoorSite",
    },
    slots: {},
  });

  open();
}

getData();
</script>

<template>
  <div v-if="applicationInfo.data?.length && !loading">
    <table class="w-full mt-6">
      <thead class="border-b-[.0938rem] border-gray-900 bg-slate-50">
        <tr>
          <th
            v-for="(header, index) in headerTitles"
            :key="index"
            class="text-sm text-gray-700 text-left p-2.5"
            :class="{
              'hidden md:table-cell': header === 'Sign type',
              'hidden sm:table-cell':
                header === 'App Fee' || header === 'Status',
            }"
          >
            {{ header }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(app, index) in applicationInfo.data" :key="index" class="even:bg-slate-50">
          <td class="p-2.5 text-xs xs:text-sm" v-text="app.payment_id"></td>
          <td class="p-2.5 hidden md:table-cell text-xs xs:text-sm">
            {{ app.type_sign }}
          </td>
          <td class="p-2.5 hidden sm:table-cell text-xs xs:text-sm">
            <IconAppStatus :status="app.application_certify_status" />
          </td>
          <!-- <td class="p-2.5 text-xs xs:text-sm" v-text="app.lga"></td> -->
          <td class="p-2.5 text-xs xs:text-sm hidden sm:table-cell">
            <span
              class="block bg-green-100 text-[#00AE4E] text-xs text-center w-full py-1 px-2 rounded select-none"
              v-if="app.application_pay_status === 'paid'"
              >Paid</span
            >
            <button
              class="block bg-red-100 text-[#f00] text-xs text-center border-2 border-[#f00] w-full py-1 px-2 rounded select-none"
              @click="completePayment(app.payment_id)"
              :disabled="app.application_pay_status !== 'not_paid'"
              v-else
            >
              Pay Now
            </button>
          </td>
          <td class="p-2.5 text-xs xs:text-sm">
            <a
              target="_blank"
              :href="`request/outdoor-app-detail/${app.id}`"
              class="flex gap-2.5 w-fit"
            >
              <IconEye class="w-4 my-auto" />
              <span class="my-auto w-full">View Details</span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-8">
      <TailwindPagination
        :data="applicationInfo"
        @pagination-change-page="getData"
        class="vue-pagination"
        :limit="2"
      />
    </div>
  </div>

  <GetData v-else-if="loading"> Getting Application </GetData>

  <NoList v-else @performAction="router.push({ name: 'advertCategory' })">
    <template #description> No Application </template>
    <template #action> Add New Sign </template>
  </NoList>
</template>
