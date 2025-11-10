<script setup>
// import logo from "../icons/IconLogo.vue";
import { useUserStore } from "../../stores/user";
import IconHamburger from "../icons/IconHamburger.vue";

import IconDashboard from "../icons/IconDashboard.vue";
import IconRequest from "../icons/IconRequest.vue";
import IconSite from "../icons/IconSignage.vue";
import IconPayment from "../icons/IconPayment.vue";
import IconReport from "../icons/IconReport.vue";
import IconSettings from "../icons/IconSettings.vue";
import IconSupport from "../icons/IconSupport.vue";
import IconLogOut from "../icons/IconLogOut.vue";
import IconImgUpload from "../icons/IconImgUpload.vue";

import { ref } from "vue";

import { onClickOutside } from "@vueuse/core";

const { logOut, userDetails } = useUserStore();
const userInfo = userDetails.userInfo;
const openNav = ref(false);

const navTrigger = ref(null);
onClickOutside(navTrigger, (event) => (openNav.value = false));
</script>

<template>
  <header class="bg-white shadow-md fixed w-full z-50">
    <div class="flex mx-auto h-full">
      <RouterLink
        :to="{ name: 'Overview' }"
        class="w-64 min-w-[16rem] lg:bg-mainColor bg-white h-20 flex items-center lg:justify-center"
      >
        <img src="/lasaa-web-logo.png" class="max-h-14 w-auto px-4" />
      </RouterLink>
      <!-- Your header content here -->
      <div class="py-4 px-5 w-full h-20">
        <div class="flex flex-row lg:justify-between justify-end w-full h-full">
          <div class="lg:flex h-auto my-auto hidden">
            <!-- <img class="h-10 w-10 rounded-full" src="/authImg.jpg" alt="" /> -->
            <div class="ml-3 overflow-hidden flex items-center">
              <p
                class="text-sm font-medium text-slate-900 capitalize my-auto"
                v-text="userInfo.business_name"
                v-if="userInfo.business_name"
              ></p>
            </div>
          </div>

          <div
            class="lg:hidden block my-auto scale-150 cursor-pointer"
            @click="openNav = !openNav"
          >
            <IconHamburger :icon-close="openNav" />
          </div>
        </div>
      </div>
      <!-- Other header elements -->
    </div>

    <div
      @click="openNav = false"
      class="lg:hidden absolute w-[100dvw] h-[88dvh] lg:bg-mainColor bg-white transition-transform ease-in-out"
      :class="{ 'translate-x-[-100dvw]': !openNav }"
    >
      <nav class="mt-1">
        <span class="block text-sm lg:text-white px-4 mb-2.5 uppercase"
          >Main Menu</span
        >
        <RouterLink :to="{ name: 'Overview' }" class="dashNav text-gray-700">
          <IconDashboard strokeCol="currentColor" />
          Dashboard
        </RouterLink>
        <RouterLink
          :to="{ name: 'RequestLists' }"
          class="dashNav text-gray-700"
        >
          <IconRequest strokeCol="currentColor" />
          My Request
        </RouterLink>
        <!-- <a href="#" class="dashNav text-gray-700">
        <IconSite strokeCol="currentColor" />
        My Signage
      </a> -->
        <RouterLink :to="{ name: 'Payments' }" class="dashNav text-gray-700">
          <IconPayment strokeCol="currentColor" />
          Payments
        </RouterLink>
        <!-- <a href="#" class="dashNav text-gray-700">
        <IconReport strokeCol="currentColor" />
        Report
      </a> -->

        <span
          class="block text-sm lg:text-white my-2.5 pt-4 uppercase border-t border-t-[#DEE7FF] px-4"
          >Others</span
        >
        <RouterLink :to="{ name: 'ImageUpload' }" class="dashNav text-gray-700">
          <IconImgUpload strokeCol="currentColor" />
          Image Upload
        </RouterLink>
        <!-- <a href="#" class="dashNav text-gray-700">
        <IconSettings strokeCol="currentColor" />
        Settings
      </a> -->
        <RouterLink
          v-if="userDetails.userInfo.user_type === 'third_party'"
          :to="{ name: 'Interest-Expression' }"
          class="dashNav text-gray-700"
        >
          <IconSupport strokeCol="currentColor" />
          KYC Details
        </RouterLink>
        <RouterLink
          :to="{ name: 'UserSettings' }"
          class="dashNav text-gray-700"
        >
          <IconSettings strokeCol="currentColor" />
          Settings
        </RouterLink>

        <div class="my-2.5 pt-4 border-t border-t-[#DEE7FF]">
          <span
            @click="logOut"
            href="#"
            class="dashNav text-gray-700 select-none cursor-pointer"
          >
            <IconLogOut strokeCol="currentColor" />
            Log Out
          </span>
        </div>
      </nav>
    </div>
  </header>
</template>
