<script setup>
import CompleteKyc from "./popups/CompleteKyc.vue";
import OverViewChart from "./OverViewChart.vue";
import { useModal } from "vue-final-modal";
import { useUserStore } from "../../stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";
import ProductBulkItem from "./ProductBulkItem.vue";
import axios from "axios";

const router = useRouter();

const { userDetails } = useUserStore();
const userInfo = userDetails.userInfo;

const hasData = ref(true);

const userMetric = ref({
  total: 0,
  total_pending: 0,
  total_completed: 0,
  total_declined: 0,
  chartData: null
});

const getUserMetrics = async () => {
  try {
    const { data, status } = await axios.get("customerreport");

    console.log(data, status);

    if (status === 200) {
      userMetric.value = data;
      userMetric.value.chartData = {
        labels: ["Pending", "Completed", "Declined"],
        datasets: [
          {
            label: "Total Signs",
            data: [
              data.total_pending,
              data.total_completed,
              data.total_declined,
            ],
            backgroundColor: ["#FFBB11", "#00C49F", "#FF8042"],
            hoverOffset: 4,
            cutout: "60%",
          },
        ],
      };
    }
  } catch (error) {
    console.error("Error fetching user metrics:", error);
  }
};

const { open: openKyc, close: closeKyc } = useModal({
  component: CompleteKyc,
  attrs: {
    onConfirm() {
      closeKyc();
    },
  },
  slots: {},
});

const checkKyc = () => {
  if (userDetails.userInfo.kyc_status) {
    router.push({ name: "Advert Category" });
  } else {
    openKyc();
  }
};

getUserMetrics();
</script>

<template>
  <div class="container mx-auto p-2.5">
    <div class="bg-white p-5 mb-5 rounded-xl">
      <h5 class="text-xl mb-5">
        Welcome
        <span class="font-medium" v-text="userInfo.business_name"></span>
      </h5>

      <div class="flex gap-5 flex-wrap justify-center">
        <div
          class="bg-indigo-100 grow bg-opacity-25 py-2.5 px-3.5 border border-blue-300 rounded-xl max-w-[320px]"
        >
          <p class="mb-3.5 font-medium">My Applications</p>

          <ul class="space-y-1.5">
            <li class="flex items-center justify-between">
              <div>
                <span
                  class="bg-yellow-500 mr-5 inline-block h-2 w-2 rounded-full"
                ></span>
                <span class="text-sm font-light">Pending Applications</span>
              </div>
              <span
                class="text-sm font-medium"
                v-text="userMetric.total_pending"
              ></span>
            </li>
            <li class="flex items-center justify-between">
              <div>
                <span
                  class="bg-green-500 mr-5 inline-block h-2 w-2 rounded-full"
                ></span>
                <span class="text-sm font-light">Completed Applications</span>
              </div>
              <span
                class="text-sm font-medium"
                v-text="userMetric.total_completed"
              ></span>
            </li>
            <li class="flex items-center justify-between">
              <div>
                <span
                  class="bg-red-500 mr-5 inline-block h-2 w-2 rounded-full"
                ></span>
                <span class="text-sm font-light">Declined Applications</span>
              </div>
              <span
                class="text-sm font-medium"
                v-text="userMetric.total_declined"
              ></span>
            </li>
          </ul>
        </div>

        <div
          class="bg-indigo-100 grow bg-opacity-25 py-2.5 px-3.5 border border-blue-300 rounded-xl max-w-[320px]"
        >
          <p class="mb-3.5 font-medium">Total Signs</p>

          <div class="flex gap-5">
            <ul class="space-y-1.5">
              <li>
                <span
                  class="text-2xl font-semibold"
                  v-text="userMetric.total"
                ></span>
              </li>
              <li class="flex items-center justify-between gap-2.5">
                <div>
                  <span
                    class="bg-yellow-500 mr-5 inline-block h-2 w-2 rounded-full"
                  ></span>
                  <span class="text-sm font-light">Pending</span>
                </div>
                <span
                  class="text-sm font-medium"
                  v-text="userMetric.total_pending"
                ></span>
              </li>
              <li class="flex items-center justify-between gap-2.5">
                <div>
                  <span
                    class="bg-green-500 mr-5 inline-block h-2 w-2 rounded-full"
                  ></span>
                  <span class="text-sm font-light">Completed</span>
                </div>
                <span
                  class="text-sm font-medium"
                  v-text="userMetric.total_completed"
                ></span>
              </li>
            </ul>

            <div class="w-[100px]">
              <OverViewChart v-if="userMetric.chartData" :DoughnutData="userMetric.chartData" />
            </div>
          </div>
        </div>

        <!-- <div class="bg-indigo-100 bg-opacity-25 py-2.5 px-3.5 border border-blue-300 rounded-xl"></div> -->
        <div
          v-if="hasData"
          class="bg-mainColor text-white py-2.5 rounded-xl max-w-[320px]"
        >
          <p
            class="text-center uppercase px-5 tracking-wide pb-2.5 border-b border-b-white text-white font-medium"
          >
            Start Advertising Today!
          </p>
          <div class="mt-2.5 px-2.5 pb-2.5">
            <p class="text-center text-sm text-white">
              Apply now and start advertising in Lagos seamlessly without stress
            </p>
            <button class="whiteBtn max-w-[200px] mt-2" @click="checkKyc">
              Add New Sign
            </button>
          </div>
        </div>

        <div
          v-if="!hasData"
          class="py-2.5 pl-5 pr-12 rounded-xl max-w-[320px] border-2 border-blue-200"
        >
          <p class="uppercase px-3 text-left text-xs font-medium">
            Next Permit Cycle
          </p>

          <p class="text-2xl px-3 my-2 font-semibold">190 Days</p>
          <div class="flex items-center">
            <span class="bg-mainColor mr-1 inline-block h-2 w-2 rounded-full">
            </span>
            <P class="text-xs"> Next permit payment </P>
          </div>
          <P class="text-xs px-3"> Due Date January 2024 </P>
        </div>
      </div>
    </div>

    <div v-if="hasData" class="bg-white p-5 mb-5 rounded-xl">
      <h4 class="font-medium mb-5">Bulk Payments</h4>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <ProductBulkItem
          key="Onpremise"
          :title="'On premise Permit'"
          :type="'Onpremise'"
        />
        <ProductBulkItem
          key="OutDoor Site"
          :title="'Outdoor Permit'"
          :type="'OutDoor Site'"
        />
        <ProductBulkItem
          key="SmallFormat Details"
          :title="'Small Format Permit'"
          :type="'SmallFormat Details'"
        />
      </div>
    </div>

    <!-- <div v-if="!hasData" class="flex xl:flex-row flex-col justify-between gap-4">
      <div class=" w-full xl:w-2/3">
        <OvMySignsList />
      </div>
      <div class=" w-full xl:w-1/3">
        <OvPhotoMontageList />
      </div>
    </div> -->
  </div>
</template>
