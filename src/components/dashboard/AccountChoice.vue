<script setup>
import { ref } from "vue";
import IconCheckMark from "../icons/IconCheckMark.vue";
import axios from "axios";
import IconSpinner from "../icons/IconSpinner.vue";
import { useUserStore } from "../../stores/user";
import { useRouter } from "vue-router";
import { toast } from 'vue3-toastify';

const router = useRouter();

const loading = ref(false);
const userStore = useUserStore();

const setUserType = async (choice) => {
  loading.value = true;
  try {
    const response = await axios.patch("setusertype", {
      usertype: choice,
    });

    if (response.status === 200) {
      toast.success("Account Type Saved", {
        position: toast.POSITION.TOP_CENTER,
      });
      await userStore.getUserData();
      router.push({ name: "Dashboard" });
      loading.value = false;
    }
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};
</script>

<template>
  <div class=" bg-slate-200 min-h-[100dvh] flex items-center">
    <div class="container mx-auto p-5 bg-white max-w-3xl">
      <h4>Select Account Type</h4>

      <div class="flex flex-wrap gap-5 mt-5 justify-center">
        <div
          class="w-[350px] flex flex-col justify-between rounded overflow-hidden border border-gray-500"
        >
          <div class="w-full">
            <img
              src="/authImg.jpg"
              class="w-full h-[200px] object-cover"
              alt=""
            />
            <p class="text-center font-semibold text-lg my-2.5">
              First Party Permit (business owners and individuals)
            </p>
            <ul class="w-[300px] mx-auto mb-2.5">
              <li class="checkPoints">
                <IconCheckMark />
                Business Signs
              </li>
              <li class="checkPoints">
                <IconCheckMark />
                Directional Signs
              </li>
              <li class="checkPoints">
                <IconCheckMark />
                Branded Vehicles and Bikes
              </li>
            </ul>
          </div>

          <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
            <button class="grow whiteBtn max-w-[150px]">Learn More</button>
            <button
              class="grow blueBtn max-w-[150px]"
              @click="setUserType('first_party')"
              :disabled="loading"
            >
              <IconSpinner v-if="loading" />
              <span
                class="text-sm font-medium text-white tracking-wider"
                v-if="!loading"
                >Select</span
              >
            </button>
          </div>
        </div>
        <div
          class="w-[350px] flex flex-col rounded overflow-hidden border border-gray-500"
        >
          <div class="w-full">
            <img
              src="/authImg.jpg"
              class="w-full h-[200px] object-cover"
              alt=""
            />
            <p class="text-center font-semibold text-lg my-2.5">
              Third Party Permit (OUTDOOR Practitioner)
            </p>
            <ul class="w-[300px] mx-auto mb-2.5">
              <li class="checkPoints">
                <IconCheckMark />
                Static Billboard
              </li>
              <li class="checkPoints">
                <IconCheckMark />
                LED Billboard
              </li>
              <li class="checkPoints">
                <IconCheckMark />
                Street Lamp Post Advertisement
              </li>
              <li class="checkPoints">
                <IconCheckMark />
                Temporary Advertisement
              </li>
            </ul>
          </div>

          <div class="px-2.5 mt-10 mb-5 flex gap-4 justify-center items-center">
            <button class="grow whiteBtn max-w-[150px]">Learn More</button>
            <button
              class="grow blueBtn max-w-[150px]"
              @click="setUserType('third_party')"
              :disabled="loading"
            >
              <IconSpinner v-if="loading" />
              <span
                class="text-sm font-medium text-white tracking-wider"
                v-if="!loading"
                >Select</span
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
