<script setup>
import axios from "axios";
import { ref } from "vue";
import { useHelpers } from "../../helper";
import { useUserStore } from "../../stores/user";
const { formatCurrency } = useHelpers();
import IconAppStatus from "../icons/IconAppStatus.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";

const { userDetails } = useUserStore();

const router = useRouter();

const loadingAction = ref(false);

const emits = defineEmits(['updateApp'])

const props = defineProps({
  transferData: Object,
  adsPrice: {
    default: null,
  },
  legalFee: {
    default: null,
  },
});

const transferAction = async (str) => {
  try {
    loadingAction.value = true;

    const { data } = await axios.post(`acceptoutdoortransferrequest/${str}/${props.transferData.id}`);

    if (data.success) {
      if (str === "accept") {
        toast.success(data.data, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.success("Signage Transfer rejected", {
          position: toast.POSITION.TOP_CENTER,
        });
      }

      emits('updateApp');

      router.push({ name: "RequestLists" });
      loadingAction.value = false;
    }
  } catch (error) {
    if (!error.response.data.success && error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });

      emits('updateApp');
    } else {
      toast.error("Something Went Wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loadingAction.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col p-6 gap-4" v-if="transferData">
    <div>
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Site Transfer Process
      </h6>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Request ID</p>
      <p class="text-sm" v-text="transferData.application_id"></p>
    </div>

    <div class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Application Status</p>
      <p class="text-sm">
        <IconAppStatus
          :status="
            !transferData.md_approval ? 'pending' : transferData.md_approval
          "
        />
      </p>
    </div>

    <div v-if="false" class="flex xs:flex-row align-middle">
      <p class="w-2/5 text-sm font-semibold">Arrears Payer</p>
      <p
        class="text-sm"
        v-text="transferData.transfer_outstanding ? 'New User' : 'Old User'"
      ></p>
    </div>

    <div class="flex flex-col gap-2">
      <p class="w-2/5 text-sm font-semibold">Transfer Letter</p>
      <embed
        :src="transferData.letter_transfer"
        width="100%"
        height="100%"
        type="application/pdf"
      />
    </div>

    <div
      class="flex flex-col sm:flex-row justify-center px-6 gap-4 my-10"
      v-if="userDetails.userInfo.id === transferData.new_owner_id && transferData.rm_recommendation === 'waiting'"
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="transferAction('reject')"
        class="w-full blueBtn border-2 bg-red-600 text-white mx-auto"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Decline Signage
        </span>
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-green-600 text-white mx-auto"
        @click="transferAction('accept')"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Accept Signage
        </span>
      </button>
    </div>
  </div>
</template>
