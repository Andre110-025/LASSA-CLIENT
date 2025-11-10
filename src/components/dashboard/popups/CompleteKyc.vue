<script setup>
import { VueFinalModal } from "vue-final-modal";
import { useUserStore } from "../../../stores/user";
import { useRouter } from "vue-router";
const router = useRouter();

const { userDetails } = useUserStore();

const emit = defineEmits(["confirm"]);

const goToKyc = () => {
  if (userDetails.userInfo.user_type === "third_party") {
    router.push({ name: "Interest-Expression" });
  } else {
    router.push({ name: "Kyc-Form" });
  }
  emit("confirm");
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[28.125rem] min-h-[350px] max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed">
      <h4 class="px-5 py-8 text-center">Complete KYC</h4>
    </div>
    <div class="p-10">
      <p class="text-center">
        Update your personal information and business information for proper
        documentation and verifications
      </p>
      <button
        @click="goToKyc()"
        class="blueBtn mx-auto mt-5 max-w-[200px] text-center"
        >Continue</button
      >
    </div>
  </VueFinalModal>
</template>
