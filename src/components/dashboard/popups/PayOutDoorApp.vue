<script setup>
import { ref, onMounted } from "vue";
import { VueFinalModal } from "vue-final-modal";
import { useHelpers } from "../../../helper";
import { useUserStore } from "../../../stores/user";
import PaystackPop from "@paystack/inline-js";
import { toast } from "vue3-toastify";
import axios from "axios";
import { useRouter } from "vue-router";
import IconSpinner from "../../icons/IconSpinner.vue";

const { userDetails } = useUserStore();

const router = useRouter();

const { formatCurrency, channelList, generateRandomRef } = useHelpers();
const props = defineProps({
  appDetails: Object,
  formType: String,
  appPurpose: {
    type: String,
    default: "Application for New Sign",
  },
});

const emit = defineEmits(["confirm"]);

const loading = ref(false);

// const payID = props.appDetails.payment_id;
// const appTotal = props.appDetails.total_price;
// const chargeFee = props.appDetails.charge_fee;
const credoKey = props.appDetails.additionalInfoCredo;
const {
  payment_id: payID,
  total_price: appTotal,
  charge_fee: chargeFee,
  split_settlement,
} = props.appDetails;
const pKiss = import.meta.env.VITE_ENV_STRING + props.appDetails.public_key;

const infoWallet = {
  reference_id: `wa${payID}`,
  payment_id: payID,
  form_type: "Outdoor Site Application",
  payment_type: "Wallet",
};

const startCredoPayment = () => {
  loading.value = true;
  const transRef = generateRandomRef();
  const amount = appTotal + chargeFee;

  const handler = window.CredoWidget.setup({
    key: credoKey,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    reference: transRef,
    splitConfiguration: split_settlement,
    metadata: {
      paymentFor: "Application Fee",
      paymentId: payID,
      appType: `OutdoorSite`,
      appPurpose: props.appPurpose,
      amountPaid: props.appDetails.total_price,
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
      setTimeout(() => emit("confirm", true), 7000);

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
  loading.value = true;
  const paystack = new PaystackPop();
  const amount = appTotal + chargeFee;

  console.log({
    paymentFor: "Application Fee",
    paymentId: payID,
    appType: `OutdoorSite`,
    appPurpose: props.appPurpose,
  });

  paystack.newTransaction({
    key: pKiss,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
      paymentFor: "Application Fee",
      paymentId: payID,
      appType: `OutdoorSite`,
      appPurpose: props.appPurpose,
      amountPaid: props.appDetails.total_price,
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      toast.success("Your Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      loading.value = true;
      router.push({ name: "RequestLists" });
      setTimeout(() => emit("confirm"), 7000);
    },
    onCancel: () => {
      loading.value = false;
      toast.error("You cancelled your Payment", {
        position: toast.POSITION.TOP_CENTER,
      });
    },
  });
}

const submitPayInfo = async (data) => {
  loading.value = true;

  console.log(data);
  try {
    const response = await axios.post("confirmpayment", data);

    if (response.status === 200) {
      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Your Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });

      router.push({ name: "Overview" });
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

    router.push({ name: "Overview" });

    emit("confirm");
  }
};

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
    content-class="relative bg-white border space-y-2 w-full sm:w-4/5 sm:min-w-[28.125rem] min-h-[350px] max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="false"
  >
    <div class="border-b-2 border-dashed">
      <h4 class="px-5 py-8 text-center">Application Fee Breakdown</h4>
    </div>
    <div class="p-10">
      <div class="flex flex-col justify-center mt-5">
        <span class="font-semibold text-red-700 text-center"
          >Total <i class="text-xs">(Inspection Fee inclusive)</i></span
        >
        <span
          class="font-semibold text-red-700 text-center my-5"
          v-text="formatCurrency(parseInt(appTotal))"
        ></span>
      </div>
      <div
        v-if="chargeFee"
        class="flex flex-col justify-center items-center gap-5 mb-5"
      >
        <h4 class="text-sm font-medium">Credo Charge</h4>

        <p v-text="formatCurrency(chargeFee)" class="font-semibold text-xl"></p>
      </div>
      <div>
        <button
          v-if="gateway === 'credo'"
          :disabled="loading"
          @click="handlePayment()"
          class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay with Credo
          </span>
        </button>

        <button
          v-if="gateway === 'paystack'"
          :disabled="loading"
          @click="handlePayment()"
          class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay with Paystack
          </span>
        </button>

        <div v-if="gateway === 'both'">
          <button
            :disabled="loading"
            @click="startCredoPayment()"
            class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
          >
            <IconSpinner v-if="loading" />
            <span class="text-sm font-medium text-white" v-if="!loading">
              Pay with Credo
            </span>
          </button>

          <button
            :disabled="loading"
            @click="startPayment()"
            class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
          >
            <IconSpinner v-if="loading" />
            <span class="text-sm font-medium text-white" v-if="!loading">
              Pay with Paystack
            </span>
          </button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
