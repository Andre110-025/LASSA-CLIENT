<script setup>
import { ref, watch } from "vue";
import GetData from "./GetData.vue";
import NoList from "./NoList.vue";
import IconEye from "../icons/IconEye.vue";
import axios from "axios";
import { useRouter } from "vue-router";

const loading = ref(false);

const props = defineProps({
  status: String
});

const router = useRouter();

const headerTitles = [
  "Payment ID",
  "Sign type",
  "Actions",
];

const applicationInfo = ref([]);

async function getData(page = 1) {
  loading.value = true;
  try {
    const response = await axios.get(
      `getallmytransferoutdoorsignage`
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

getData();
</script>

<template>
  <div v-if="applicationInfo.length && !loading">
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
        <tr v-for="(app, index) in applicationInfo" :key="index" class="even:bg-slate-50">
          <td class="p-2.5 text-xs xs:text-sm" v-text="app.payment_id"></td>
          <td class="p-2.5 hidden md:table-cell text-xs xs:text-sm">
            {{ app.type_sign }}
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
  </div>

  <GetData v-else-if="loading"> Getting Application </GetData>

  <NoList v-else @performAction="router.push({ name: 'advertCategory' })">
    <template #description> No Application </template>
    <template #action> Add New Sign </template>
  </NoList>
</template>
