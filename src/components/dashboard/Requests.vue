<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import RequestTypeButton from "./buttons/request/RequestTypeButton.vue";
import FilterButton from "./buttons/request/FilterButton.vue";
// import RequestFormTab from "./buttons/request/RequestFormTab.vue";
import CompleteKyc from "./popups/CompleteKyc.vue";
import { useRouter } from "vue-router";
import PremiseAppDataTable from "./PremiseAppDataTable.vue";
import MobileAppDataTable from "./MobileAppDataTable.vue";
import StreetAppDataTable from "./StreetAppDataTable.vue";
import OutDoorAppDataTable from "./OutDoorAppDataTable.vue"
import OutDoorTransferDataTable from "./OutDoorTransferDataTable.vue"
import TemporaryTable from "./TemporaryTable.vue";
import SmallFormatTable from "./SmallFormatTable.vue"
import { useModal } from "vue-final-modal";

const router = useRouter();

const userStore = useUserStore();

const getCat = () => {
  if (userStore.userDetails.userInfo.user_type === "first_party") {
    return [
      "On Premise",
      "Mobile Branding",
      "Temporary Advert",
      "Small Format"
    ];
  } else {
    return [
      // "Expression of Interest",
      'On Premise',
      "Street Lamp Pole",
      "Mobile Branding",
      "Promotional Vehicle",
      "Outdoor Site",
      "Outdoor Transfer",
      "Temporary Advert",
      "Small Format"
    ];
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
  if (userStore.userDetails.userInfo.kyc_status) {
    router.push({ name: "Advert Category" });
  } else {
    openKyc();
  }
};

const changeAd = (val) => {
  advertType.value = val;
  status.value = '';
} 

const status = ref('');
const advertType = ref(getCat()[0]);
</script>

<template>
  <div class="container mx-auto p-2.5">
    <div class="flex flex-row justify-between px-2.5">
      <h4 class="text-2xl">All Requests</h4>
    </div>
    <div class="mt-4 p-5 bg-white rounded-lg">
      <div class="flex flex-col justify-between gap-5 items-start xs:flex-row xs:items-center">
        <button @click="checkKyc" class="blueBtn max-w-[200px] mx-0 mt-2">
          + Add New Sign
        </button>
        <FilterButton :options="getCat()" @change-cat="changeAd" />
      </div>

      <!-- <RequestFormTab v-if="userStore.userDetails.userInfo.user_type !== 'first_party'" /> -->
      <RequestTypeButton :choice="status" @change-state="(val) => status = val" />
    </div>

    <div class="mt-4 p-5 bg-white rounded-lg">
      <h4 class="text-gray-700">{{ advertType }} Requests</h4>

      <!-- Form goes Here -->
      <div class="w-full">
        <PremiseAppDataTable v-if="advertType === 'On Premise'" :status="status" />
        <MobileAppDataTable v-else-if="advertType === 'Mobile Branding'" :mobile-type="'Mobile First Party'" :status="status" />
        <TemporaryTable v-else-if="advertType === 'Temporary Advert'" :status="status" />
        <MobileAppDataTable v-else-if="advertType === 'Promotional Vehicle'" :mobile-type="'Promotional Vehicle'" :status="status" />
        <StreetAppDataTable v-else-if="advertType === 'Street Lamp Pole'" :status="status" />
        <OutDoorAppDataTable v-else-if="advertType === 'Outdoor Site'" :status="status" />
        <OutDoorTransferDataTable v-else-if="advertType === 'Outdoor Transfer'" :status="status" />
        <SmallFormatTable v-else-if="advertType === 'Small Format'" :status="status" />
      </div>
    </div>
  </div>
</template>
