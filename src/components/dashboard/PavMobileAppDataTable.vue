<script setup>
import { ref, watch } from "vue";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { TailwindPagination } from "laravel-vue-pagination";
import IconEye from "../icons/IconEye.vue";
// import { useModal } from "vue-final-modal";
import { useUserStore } from "../../stores/user";

const userStore = useUserStore();

const loading = ref(false);

const props = defineProps({
  status: String,
  mobileType: String
})

const router = useRouter();

const headerTitles = [
  "Payment ID",
  "Vehicle Type",
  "Status",
  "Action",
];

const applicationInfo = ref({});


const getEndURL = () => props.mobileType === 'Mobile First Party' ? 'first_party' : 'third_party';

async function getData(page = 1) {
  loading.value = true;
  applicationInfo.value = {};

  const getEndPoint = () => props.mobileType === 'Mobile First Party' ? 'getusermobileads' : 'getuserthirdpartyads';
  // console.log(applicationInfo.value);
  try {
    const response = await axios.get(
      `${getEndPoint()}?status=${props.status}&page=${page}`
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
    getData(1)
  }
)

getData()
</script>

<template>
  <div v-if="applicationInfo.data?.length && !loading">
    <table class="w-full mt-6 table-auto">
      <thead class="border-b-[.0938rem] border-gray-900 bg-slate-50">
        <tr>
          <th
            v-for="header in headerTitles"
            class="text-sm text-gray-700 text-left p-2.5"
            :class="{
              'hidden md:table-cell': header === 'Vehicle Type',
              'hidden sm:table-cell': header === 'Status',
            }"
          >
            {{ header }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="app in applicationInfo.data" class="even:bg-slate-50">
          <td class="p-2.5 text-xs xs:text-sm" v-text="app.payment_id"></td>
          <td class="p-2.5 text-xs xs:text-sm hidden md:table-cell" v-text="app.vehicle_type"></td>
          <td class="p-2.5 hidden sm:table-cell text-xs xs:text-sm">
            <IconAppStatus :status="app.status"/>
          </td>
          <td class="p-2.5 text-xs xs:text-sm">
            <a target="_blank" :href="`request/mobile-app-detail/${getEndURL()}/${app.id}`" class="flex gap-2.5 w-fit">
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
