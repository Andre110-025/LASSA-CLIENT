<script setup>
import IconDashboard from '../icons/IconDashboard.vue'
import IconRequest from '../icons/IconRequest.vue'
import IconSite from '../icons/IconSignage.vue'
import IconPayment from '../icons/IconPayment.vue'
import IconReport from '../icons/IconReport.vue'
import IconSettings from '../icons/IconSettings.vue'
import IconSupport from '../icons/IconSupport.vue'
import IconLogOut from '../icons/IconLogOut.vue'
import { useUserStore } from '../../stores/user'
import IconImgUpload from '../icons/IconImgUpload.vue'

const { logOut, userDetails } = useUserStore()
</script>

<template>
  <aside
    class="bg-mainColor text-gray-100 fixed top-20 left-0 bottom-0 w-64 overflow-y-auto z-50 border-t border-t-[#DEE7FF]"
  >
    <!-- Your sidebar content here -->
    <nav class="mt-5 mx-4">
      <span class="block text-sm text-white mb-2.5 uppercase">Main Menu</span>
      <RouterLink :to="{ name: 'Overview' }" class="dashNav">
        <IconDashboard />
        Dashboard
      </RouterLink>
      <RouterLink :to="{ name: 'RequestLists' }" class="dashNav">
        <IconRequest />
        My Request
      </RouterLink>
      <!-- <a href="#" class="dashNav">
        <IconSite />
        My Signage
      </a> -->
      <RouterLink :to="{ name: 'Payments' }" class="dashNav">
        <IconPayment />
        Payments
      </RouterLink>
      <!-- <a href="#" class="dashNav">
        <IconReport />
        Report
      </a> -->

      <span class="block text-sm text-white my-2.5 pt-4 uppercase border-t border-t-[#DEE7FF]">Others</span>
      <RouterLink :to="{ name: 'ImageUpload' }" class="dashNav">
        <IconImgUpload />
        Image Upload
      </RouterLink>
      <!-- <a href="#" class="dashNav">
        <IconSettings />
        Settings
      </a> -->
      <RouterLink :to="{ name: 'UserSettings' }" class="dashNav">
        <IconSettings />
        Settings
      </RouterLink>
      <RouterLink v-if="userDetails.userInfo.user_type === 'third_party'" :to="{ name: 'Interest-Expression' }" class="dashNav">
        <IconSupport />
        KYC Details
      </RouterLink>

      <div class="my-2.5 pt-4 border-t border-t-[#DEE7FF]">
        <span @click="logOut" href="#" class="dashNav select-none cursor-pointer">
          <IconLogOut />
          Log Out
        </span>
      </div>
    </nav>
  </aside>
</template>
