<script setup>
import { ref } from "vue";
import { useUserStore } from "../../../stores/user";
import InterestForm from "./InterestForm.vue";
import ThirdPartyAppDetail from "../ThirdPartyAppDetail.vue";
import AccountEdit from "./AccountEdit.vue";
import LegalEdit from "./LegalEdit.vue";
import RegistryEdit from "./RegistryEdit.vue";

const userStore = useUserStore();
const editAll = ref(false);
const editAccount = ref(false);
const editLegal = ref(false);
const editRegistry = ref(false);
</script>

<template>
  <InterestForm
    v-if="
      !userStore.userDetails.userInfo.kyc_third_party ||
      (userStore.userDetails.userInfo.kyc_third_party.operation_status !==
        'approved' &&
        editAll)
    "
    :editable="editAll"
    @changeEdit="editAll = false"
  />
  <AccountEdit
    @changeEdit="editAccount = false"
    v-else-if="
      userStore.userDetails.userInfo.kyc_third_party.account_status ===
        'disapproved' && editAccount
    "
  />
  <LegalEdit
    @changeEdit="editLegal = false"
    v-else-if="
      userStore.userDetails.userInfo.kyc_third_party.legal_status ===
        'disapproved' && editLegal
    "
  />
  <RegistryEdit
    @changeEdit="editRegistry = false"
    v-else-if="
      userStore.userDetails.userInfo.kyc_third_party.registry_status ===
        'disapproved' && editRegistry
    "
  />
  <ThirdPartyAppDetail
    @edit="editAll = true"
    @editA="editAccount = true"
    @editL="editLegal = true"
    @editR="editRegistry = true"
    v-else
  />
</template>
