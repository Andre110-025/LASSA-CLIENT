<script setup>
import { ref, watch } from "vue";
import { VueFinalModal } from "vue-final-modal";
import IconSearch from "../../icons/IconSearch.vue";
import axios from "axios";
import { TailwindPagination } from "laravel-vue-pagination";

const loading = ref(false);
const emit = defineEmits(["confirm"]);

const usersInfo = ref([]);
const searchQuery = ref("");

async function getUserData(page = 1) {
  loading.value = true;

  try {
    const response = await axios.get(
      `getthirdpartyuser?search=${searchQuery.value}&page=${page}`
    );
    // console.log(response);
    if (response.status === 200) {
      usersInfo.value = response.data.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
}

let delaySearch = null;
watch(searchQuery, async (newVal) => {
  if (delaySearch) {
    clearTimeout(delaySearch);
  }

  if (newVal) {
    delaySearch = setTimeout(() => {
      // Call the function or perform actions that should happen after the delay
      getUserData();
    }, 1000); // Adjust the delay time in milliseconds as needed
  }
});
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="flex flex-col relative bg-white border rounded-lg space-y-2 w-full sm:w-full sm:max-w-lg sm:min-w-[28.125rem] min-h-[350px] max-w-[340px] max-h-[100dvh]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="relative mx-5 my-8 h-fit">
      <input
        class="bg-slate-100 py-[10px] pl-3.5 pr-7 text-lg border-solid outline-none focus:border-mainColor rounded-full w-full"
        type="text"
        placeholder="Email, Name, Business name"
        name=""
        v-model="searchQuery"
        id=""
      />
      <IconSearch class="absolute top-1.5 right-2 w-8" />
    </div>
    <transition-group
      tag="ul"
      class="block mb-8 px-6 py-2.5 space-y-5 overflow-y-auto"
    >
      <li
        v-for="(user, index) in usersInfo.data"
        :key="index"
        class="p-2.5 rounded-md shadow-md flex gap-2 justify-between cursor-pointer"
        @click="$emit('confirm', user)"
      >
        <div class="flex flex-col">
          <span class="text-xs">{{
            user.first_name + " " + user.last_name
          }}</span>
          <!-- <span class="mt-2.5 text-xs italic" v-text="user.id"></span> -->
        </div>
        <div class="flex flex-col items-end">
          <span
            class="text-xs"
            v-text="user.kyc_third_party?.company_name"
          ></span>
          <span class="mt-2.5 text-xs italic" v-text="user.user_type"></span>
        </div>
      </li>
    </transition-group>

    <div class="flex justify-center pb-5">
      <TailwindPagination
        :data="usersInfo"
        @pagination-change-page="getUserData"
        class="vue-pagination"
      />
    </div>
  </VueFinalModal>
</template>
