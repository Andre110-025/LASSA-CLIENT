<script setup>
import { ref } from "vue";
import TabButton from "./buttons/TabButton.vue";
import IconUploadVue from "../icons/IconUpload.vue";
import IconLock from "../icons/IconLock.vue";
import IconArrowL from "../icons/IconArrowL.vue";
import { useModal } from "vue-final-modal";
import ChangePassword from "./popups/ChangePassword.vue";
import { useUserStore } from "../../stores/user";

const { userDetails } = useUserStore();

const { userInfo } = userDetails;

function openChangePasswordPopup() {
  const { open, close } = useModal({
    component: ChangePassword,
    attrs: {
      onConfirm() {
        close();
      },
    },
    slots: {},
  });
  open();
}

const pageTabs = ref(["Profile", "Security"]);
// const pageTabs = ref(["Profile", "KYC Files", "Security"]);

const currentPageTab = ref(pageTabs.value[0]);

const currentUser = {
  name: `${userInfo.first_name} ${userInfo.last_name}`,
  email: `${userInfo.email}`,
  tel: `${userInfo.phone_number}`,
  businessProfile: {
    name: "Bayo Media",
    email: "info@bayomedia.com",
    tel: "0801 234 5678",
    address: "No 8 Williams Street GRA Ikeja, Lagos",
  }
};

const onRadioSelected = (value) => {
  currentPageTab.value = value;
};
</script>

<template>
  <div class="p-4 bg-white">
    <div class="border-b-2 border-b-gray-100">
      <TabButton :tabs="pageTabs" :gap="8" @radio-selected="onRadioSelected" />
    </div>

    <!-- Profile Tab Here -->
    <div
      v-if="currentPageTab === pageTabs[0]"
      class="tabContainer flex my-4 md:flex-row flex-col md:my-0"
    >
      <div class="md:w-1/2 w-full">
        <div class="my-0 md:my-4"></div>
        <h4>Your Profile</h4>

        <div class="inputHolder">
          <input
            type="text"
            class="input peer"
            id="pNum"
            disabled
            :value="`${userInfo.first_name} ${userInfo.last_name}`"
          />
          <label for="pNum" class="inputLabel bg-gray-100">Name</label>
        </div>

        <div class="inputHolder">
          <input
            type="text"
            class="input peer"
            id="pNum"
            disabled
            :value="`${userInfo.email}`"
          />
          <label for="pNum" class="inputLabel bg-gray-100">Email</label>
        </div>

        <div class="inputHolder">
          <input
            type="text"
            class="input peer"
            id="pNum"
            disabled
            :value="`${userInfo.phone_number}`"
          />
          <label for="pNum" class="inputLabel bg-gray-100">Phone Number</label>
        </div>

        <!-- <div class="inputHolder mb-10">
          <input
            type="text"
            class="input peer"
            id="pNum"
            disabled
            :value="currentUser.address"
          />
          <label for="pNum" class="inputLabel bg-gray-100">My Address</label>
        </div> -->
      </div>

      <div
        class="md:w-1/2 w-full pt-4 md:px-4 md:pt-0 md:border-t-0 md:border-l-2 border-t-2 border-gray-100"
        v-if="userInfo.kyc_status"
      >
        <div class="my-0 md:my-4"></div>

        <h4>Business Profile</h4>

        <div class="inputHolder">
          <input
            type="text"
            class="input peer"
            id="pNum"
            disabled
            :value="userInfo.kyc_third_party?.company_name || userInfo.business_name"
          />
          <label for="pNum" class="inputLabel bg-gray-100">Name</label>
        </div>

        <!-- <div class="inputHolder">
          <input
            type="text"
            class="input peer"
            id="pNum"
            disabled
            :value="currentUser.businessProfile.email"
          />
          <label for="pNum" class="inputLabel bg-gray-100">Email</label>
        </div> -->

        <div class="inputHolder">
          <input
            type="text"
            class="input peer"
            id="pNum"
            disabled
            :value="userInfo.kyc_third_party?.office_address || userInfo.kycdetail?.full_address"
          />
          <label for="pNum" class="inputLabel bg-gray-100"
            >Business Address</label
          >
        </div>

        <div class="inputHolder">
          <input
            type="text"
            class="input peer"
            id="pNum"
            disabled
            :value="userInfo.is_institution ? 'Yes' : 'No'"
          />
          <label for="pNum" class="inputLabel bg-gray-100">Is Institution?</label>
        </div>
      </div>
    </div>

    <!-- KYC Files Tab Here -->
    <div v-if="currentPageTab === pageTabs[2]" class="tabContainer my-4">
      <h4>Business Files</h4>

      <div class="flex flex-col gap-4 bizfiles">
        <div>
          <p>CAC</p>
          <div>
            <IconUploadVue />
            <p>{{ currentUser.cac }}</p>
          </div>
        </div>
        <div>
          <p>Tax Clearance</p>
          <div>
            <IconUploadVue />
            <p>{{ currentUser.taxClearance }}</p>
          </div>
        </div>
        <div>
          <p>APCON Certificate</p>
          <div>
            <IconUploadVue />
            <p>{{ currentUser.APCONCertificate }}</p>
          </div>
        </div>
        <div>
          <p>OAAN Certificate</p>
          <div>
            <IconUploadVue />
            <p>{{ currentUser.OAANCertificate }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Tab Here -->
    <div v-if="currentPageTab === pageTabs[1]" class="tabContainer my-4">
      <h4>Security</h4>
      <a href="#" class="mt-4 cursor-pointer" @click="openChangePasswordPopup">
        <div
          class="flex flex-row py-5 px-10 bg-white rounded-lg justify-between items-center"
        >
          <div class="flex flex-row gap-5 items-center">
            <IconLock />
            <p>Change Password</p>
          </div>
          <IconArrowL class="scale-x-[-1]" />
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.tabContainer h4 {
  @apply font-medium;
}

div.bizfiles > div {
  @apply flex flex-row w-3/4 min-w-['250px'] justify-between items-center;
}
div.bizfiles > div > div {
  @apply flex gap-10 items-center w-4/5 border-dashed border-2 border-gray-400 p-4 rounded-lg;
}
</style>
