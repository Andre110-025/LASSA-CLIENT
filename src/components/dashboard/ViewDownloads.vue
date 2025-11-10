<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useHelpers } from "../../helper";
import GetData from "./GetData.vue";
import { useRoute } from "vue-router";
import NoList from "./NoList.vue";

const route = useRoute();

const { timeFormat } = useHelpers()

const loading = ref(false);
const items = ref([]);

const getData = async () => {
  loading.value = true;
  items.value = [];

  try {
    const response = await axios.get(`${route.params.app_type}/${route.params.id}`);
    if (response.status === 200) {
      items.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  } finally {
    loading.value = false
  }
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="container mx-auto p-2.5">
    <div class="bg-white p-5 mb-5 rounded-xl">
      <h4 class="text-xl mb-5">Bills, Receipts, Letters, Debit/Credit Note</h4>
    </div>

    <div class="mt-4 p-5 bg-white rounded-lg">
      <div v-if="items.length && !loading" class="w-full">
        <table class="w-full">
          <thead>
            <tr class="border-b-[.0938rem] border-gray-900 bg-slate-50 *:whitespace-nowrap">
              <th
                scope="col"
                class="text-sm text-gray-700 text-left p-2.5"
              >
                Document Type
              </th>
              <th
                scope="col"
                class="text-sm text-gray-700 text-left p-2.5"
              >
                Generate on
              </th>
              <th
                scope="col"
                class="text-sm text-gray-700 text-left p-2.5"
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="even:bg-slate-50">
              <td class="p-2.5 text-xs xs:text-sm">{{ item.type }}</td>
              <td class="p-2.5 text-xs xs:text-sm">
                {{ timeFormat(item.created_at) }}
              </td>
              <td class="p-2.5 text-xs xs:text-sm">
                <a
                  :href="item.link"
                  target="_blank"
                  :download="item.type"
                  rel="noopener noreferrer"
                  >Download</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <GetData v-else-if="loading"> Getting Issued Docs </GetData>

      <NoList :showBtn="false" v-else>
        <template #description> No Documents </template>
      </NoList>
    </div>
  </div>
</template>
