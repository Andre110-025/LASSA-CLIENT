<script setup>
import { VueFinalModal } from "vue-final-modal";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";
import { useUserStore } from "../../../stores/user";
import { ref, onMounted } from "vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import PaystackPop from "@paystack/inline-js";

const { formatCurrency, channelList, generateRandomRef } = useHelpers();
const { userDetails } = useUserStore();
const userStore = useUserStore();
const loading = ref(false);
const emit = defineEmits(["confirm"]);

const props = defineProps({
  appID: Number,
  paymentID: String,
  ownerId: String,
  arrearProp: Object,
  amount: Number,
  chargeFee: Number,
  amountPermit: Number,
  chargeFeePermit: Number,
  cKey: String,
  pKey: String,
  split: {
    type: Array,
    default: () => [],
  },
});

console.log("Full arrear data:", props.chargeFee);

const getAmount = () => {
  if (props.arrearProp) {
    return props.amount;
  } else {
    console.log(props.amountPermit);
    return props.amountPermit;
  }
};

const startFullCredoPayment = () => {
  loading.value = true;
  const transRef = generateRandomRef();

  // const simpleMeta = {
  //   paymentFor: "Permit Bill",
  //   paymentId: props.paymentID,
  //   appType: "OutDoor Site",
  //   permitFee: props.amount || props.amountPermit,
  // };

  // if (props.appID) {
  //   simpleMeta.customFields = [
  //     {
  //       variable_name: "applicationId",
  //       display_name: "application Id",
  //       value: Array.isArray(props.appID)
  //         ? props.appID.join(", ")
  //         : props.appID,
  //     },
  //   ];
  // }

  // console.log(simpleMeta);

  const handler = window.CredoWidget.setup({
    key: props.cKey,
    email: userDetails.userInfo.email,
    amount: Math.round(getAmount() * 100),
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    reference: transRef,
    splitConfiguration: props.split,
    metadata: {
    paymentFor: "Permit Bill",
    paymentId: props.paymentID,
    appType: "OutDoor Site",
    permitFee: props.amount || props.amountPermit,
    applicationId: props.appID
  },
    callbackUrl: "https://merchant-test-line.netlify.app/successful",
    onClose: () => {
      console.log("Widget Closed");
      toast.error("Payment Cancelled", {
        position: toast.POSITION.TOP_CENTER,
      });
      loading.value = false;
    },
    callBack: (response) => {
      console.log("Successful Payment", response);
      // window.location.href = response.callbackUrl
      setTimeout(() => emit("confirm"), 15000);

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });

      setTimeout(getPaymentInfo, 7000);
    },
  });

  handler.openIframe();
};

function payFull() {
  loading.value = true;
  const paystack = new PaystackPop();

  // const simpleMeta = {
  //   paymentFor: "Permit Bill",
  //   paymentId: props.paymentID,
  //   appType: "OutDoor Site",
  //   permitFee: props.amount || props.amountPermit,
  // };

  // if (props.appID) {
  //   simpleMeta.customFields = [
  //     {
  //       variable_name: "applicationId",
  //       display_name: "application Id",
  //       value: Array.isArray(props.appID)
  //         ? props.appID.join(", ")
  //         : props.appID,
  //     },
  //   ];
  // }

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + props.pKey,
    email: userDetails.userInfo.email,
    amount: Math.round(getAmount() * 100),
    channels: channelList(getAmount()),
    metadata: {
    paymentFor: "Permit Bill",
    paymentId: props.paymentID,
    appType: "OutDoor Site",
    permitFee: props.amount || props.amountPermit,
    applicationId: props.appID
  },
    onSuccess: (transaction) => {
      console.log(transaction);
      setTimeout(() => emit("confirm"), 7000);

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });

      setTimeout(getPaymentInfo, 7000);
    },
    onCancel: () => {
      toast.error("Payment Cancelled", {
        position: toast.POSITION.TOP_CENTER,
      });
      loading.value = false;
    },
  });
}

const showBtn = ref(false);

const handleFullWalletPayment = async () => {
  showBtn.value = false;

  try {
    const balance = Number(userStore.walletDetails.outdoor_wallet);
    const amountPaid = getAmount();

    console.log("Mybalance:", balance);

    if (balance >= amountPaid) {
      showBtn.value = true;
    } else {
      showBtn.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

onMounted(async () => {
  await userStore.getWalletData();
  await handleFullWalletPayment();
});

const submitFullWalletPayInfo = async () => {
  loading.value = true;

  const infoWallet = {
    reference_id: `wa${props.paymentID}`,
    payment_id: props.paymentID,
    form_type: "Outdoor Wallet",
    payment_type: "Wallet",
    amount_paid: getAmount()
  };

  try {
    const response = await axios.post("confirmpayment", infoWallet);

    console.log(response);
    if (response.status === 200) {
      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Your Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });

      // router.push({ name: "Overview" });
      emit("confirm");
    }
  } catch (error) {
    if (error.response.data.data) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Your Payment Could not be confirmed", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    // router.push({ name: "RequestLists" });
    emit("confirm");
  }
};

const gateway = ref("");
const showWalletBtn = ref(false);

const getPaymentGateway = async () => {
  try {
    const { data } = await axios.get("getuser");
    console.log(data);

    const gatewayMethod = data.settings.gateway;
    const showWallet = data.settings.wallet_on;

    if (showWallet == true) {
      showWalletBtn.value = true;
    } else if (showWallet == false) {
      showWalletBtn.value = false;
    }

    if (gatewayMethod === "paystack") {
      gateway.value = "paystack";
    } else if (gatewayMethod === "credo") {
      gateway.value = "credo";
    } else if (gatewayMethod === "both") {
      gateway.value = "both";
    }

    console.log("gateway:", gateway.value);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getPaymentGateway();
});

const handlePayment = () => {
  if (gateway.value === "paystack") {
    payFull();
  } else if (gateway.value === "credo") {
    startFullCredoPayment();
  } else if (gateway.value === "both") {
    startFullCredoPayment();
    payFull();
  }
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-4 w-full sm:w-4/5 sm:min-w-[28.125rem] min-h-[350px] max-w-[340px] flex flex-col justify-between items-center py-6"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed w-full mb-2">
      <h4 class="px-5 py-6 text-center text-lg font-semibold">
        Out door Permit Bill
      </h4>
    </div>

    <span
      class="font-semibold text-red-700 text-center text-xl mt-2"
      v-text="formatCurrency(parseInt(props.amount || props.amountPermit))"
    ></span>

    <div
      class="flex flex-col items-center justify-center gap-3 w-full mt-auto mb-4"
    >
      <!-- Single Gateway: Credo -->
      <button
        v-if="gateway === 'credo'"
        :disabled="loading"
        class="p-4 w-44 sm:w-3/4 md:w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
        @click="handlePayment()"
      >
        <IconSpinner v-if="loading" />
        <span class="text-sm font-medium text-white" v-if="!loading">
          Pay with Credo
        </span>
      </button>

      <!-- Single Gateway: Paystack -->
      <button
        v-if="gateway === 'paystack'"
        :disabled="loading"
        class="p-4 w-44 sm:w-3/4 md:w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
        @click="handlePayment()"
      >
        <IconSpinner v-if="loading" />
        <span class="text-sm font-medium text-white" v-if="!loading">
          Pay with Paystack
        </span>
      </button>

      <!-- Both Gateways -->
      <div
        v-if="gateway === 'both'"
        class="flex flex-col md:flex-row items-center justify-center gap-3 w-full md:w-3/4"
      >
        <button
          :disabled="loading"
          class="p-4 w-44 md:w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
          @click="startFullCredoPayment()"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay with Credo
          </span>
        </button>

        <button
          :disabled="loading"
          class="p-4 w-44 md:w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
          @click="payFull()"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay with Paystack
          </span>
        </button>
      </div>

      <!-- Wallet Button -->
      <button
        v-if="showBtn && showWalletBtn"
        :disabled="loading"
        @click="submitFullWalletPayInfo()"
        class="p-4 w-44 sm:w-3/4 md:w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
      >
        <IconSpinner v-if="loading" />
        <span class="text-sm font-medium text-white" v-if="!loading">
          Pay From Wallet
        </span>
      </button>
    </div>
  </VueFinalModal>
</template>
