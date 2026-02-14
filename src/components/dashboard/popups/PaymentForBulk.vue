<script setup>
import { VueFinalModal } from "vue-final-modal";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";
import { useUserStore } from "../../../stores/user";
import { ref, onMounted } from "vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import PaystackPop from "@paystack/inline-js";

const { formatCurrency, channelList, generateRandomRef, serviceCodeSelector } = useHelpers();
const { userDetails } = useUserStore();
const userStore = useUserStore();
const loading = ref(false);
const emit = defineEmits(["confirm"]);

const props = defineProps({
  type: String,
  amount: Number,
  chargeFee: Number,
  cKey: String,
  pKey: String,
  appID: Number,
  split: {
    type: Array,
    default: () => [],
  },
});

// console.log(props.appID)

const startCredoPayment = () => {
  const channel = props.chargeFee;
  const amount = props.amount + props.chargeFee;
  const transRef = generateRandomRef();
  loading.value = true;

  const simpleMeta = {
    paymentFor: "Permit Bill",
    appType: props.type,
    appPurpose: "Bulk Payment",
    permitFee: props.amount,
  };

  if (Array.isArray(props.appID)) {
    simpleMeta.customFields = [
      {
        variable_name: "applicationId",
        display_name: "application Id",
        value: Array.isArray(props.appID)
          ? props.appID.join(", ")
          : props.appID,
      },
    ];
  }

  console.log(simpleMeta);
  // return;

  const handler = window.CredoWidget.setup({
    key: props.cKey,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    // serviceCode: serviceCodeSelector(channel),
    reference: transRef,
    splitConfiguration: props.split,
    metadata: simpleMeta,
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
      setTimeout(() => emit("confirm"), 5000);

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });
    },
  });

  handler.openIframe();
};

function startPayment() {
  const paystack = new PaystackPop();
  loading.value = true;
  const amount = props.amount + props.chargeFee;

  // const simpleMeta = {
  //   paymentFor: "Permit Bill",
  //   appType: props.type,
  //   appPurpose: "Bulk Payment",
  //   permitFee: props.amount,
  // };

  // if (Array.isArray(props.appID)) {
  //   simpleMeta.customFields = [
  //     {
  //       variable_name: "applicationId",
  //       display_name: "applicationId",
  //       value: Array.isArray(props.appID)
  //         ? props.appID.join(", ")
  //         : props.appID,
  //     },
  //   ];
  // }

  // console.log(simpleMeta)

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + props.pKey,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
    paymentFor: "Permit Bill",
    appType: props.type,
    appPurpose: "Bulk Payment",
    permitFee: props.amount,
    applicationId: props.appID
  },
    onSuccess: (transaction) => {
      console.log(transaction);
      setTimeout(() => emit("confirm"), 10000);

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });
    },
    onCancel: () => {
      toast.error("Payment Cancelled", {
        position: toast.POSITION.TOP_CENTER,
      });
      loading.value = false;
    },
  });
}

const gateway = ref("");

const getPaymentGateway = async () => {
  try {
    const { data } = await axios.get("getuser");

    const gatewayMethod = data.settings.gateway;

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
    startPayment();
  } else if (gateway.value === "credo") {
    startCredoPayment();
  } else if (gateway.value === "both") {
    startCredoPayment();
    startPayment();
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
      <h4
        class="px-5 py-6 text-center text-lg font-semibold"
        v-text="props.type"
      ></h4>
    </div>

    <span
      class="font-semibold text-red-700 text-center text-xl mt-2"
      v-text="formatCurrency(parseInt(props.amount))"
    ></span>

    <div
      class="flex flex-col items-center justify-center gap-3 w-full mt-auto mb-4"
    >
      <button
        v-if="gateway === 'credo'"
        :disabled="loading"
        class="p-4 w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
        @click="handlePayment()"
      >
        <IconSpinner v-if="loading" />
        <span class="text-sm font-medium text-white" v-if="!loading">
          Pay with Credo
        </span>
      </button>

      <button
        v-if="gateway === 'paystack'"
        :disabled="loading"
        class="p-4 w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
        @click="handlePayment()"
      >
        <IconSpinner v-if="loading" />
        <span class="text-sm font-medium text-white" v-if="!loading">
          Pay with Paystack
        </span>
      </button>

      <div
        v-if="gateway === 'both'"
        class="flex items-center justify-center gap-4"
      >
        <button
          :disabled="loading"
          class="p-4 w-44 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
          @click="startCredoPayment()"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay with Credo
          </span>
        </button>

        <button
          :disabled="loading"
          class="p-4 w-40 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
          @click="startPayment()"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay with Paystack
          </span>
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
