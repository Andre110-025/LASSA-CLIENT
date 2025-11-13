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

// const payID = props.appDetails.paymentID;
// const appTotal = props.appDetails.total_price;
// const chargeFee = props.appDetails.ChargeFee;
const {
  paymentID: payID,
  total_price: appTotal,
  ChargeFee: chargeFee,
  additionalInfoCredo: myKey,
  split_settlement,
} = props.appDetails;
const pKiss = import.meta.env.VITE_ENV_STRING + props.appDetails.additionalInfo;

const infoWallet = {
  reference_id: `wa${payID}`,
  payment_id: payID,
  form_type: props.formType,
  payment_type: "Wallet",
};

const startCredoPayment = () => {
  loading.value = true;

  const transRef = generateRandomRef();
  const amount = appTotal + chargeFee;

  // const simpleMeta = {
  //   paymentFor: "Application Fee",
  //   appType: props.formType,
  //   appPurpose: props.appPurpose,
  //   amountPaid: props.appDetails.total_price,
  //   paymentId: payID,
  // };

  // if (Array.isArray(payID)) {
  //   simpleMeta.customFields = [
  //     {
  //       variable_name: "paymentId",
  //       display_name: "Payment Id",
  //       value: Array.isArray(payID) ? payID.join(", ") : payID,
  //     },
  //   ];
  // } else {
  //   paymentId: payID;
  // }
  // const metadataCheck = {
  //   customFields: [
  //     {
  //       variable_name: "paymentId",
  //       display_name: "Payment Id",
  //       value: Array.isArray(payID) ? payID.join(", ") : payID,
  //     },
  //   ],
  // };

  // const check = () => {
  //   if (props.appDetails.value.onpremise_multiple_id) {
  //     return metadataCheck;
  //   }
  //   return {}
  // };

  // console.log("simpleMeta:", simpleMeta);
  // return;

  const handler = window.CredoWidget.setup({
    key: myKey,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: ["card", "bank"],
    currency: "NGN",
    renderSize: 0,
    reference: transRef,
    splitConfiguration: split_settlement,
    metadata: {
      paymentFor: "Application Fee",
      appType: props.formType,
      appPurpose: props.appPurpose,
      amountPaid: props.appDetails.total_price,
      paymentId: payID,
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
      setTimeout(() => emit("confirm", true), 10000);

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

  console.log(channelList(amount));

  paystack.newTransaction({
    key: pKiss,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
      paymentFor: "Application Fee",
      paymentId: payID,
      appType: props.formType,
      appPurpose: props.appPurpose,
      amountPaid: props.appDetails.total_price,
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      setTimeout(() => emit("confirm", true), 7000);
      loading.value = true;

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
    if (error.response.data.error) {
      toast.error(error.response.data.error, {
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
      <h4 class="px-5 py-5 text-center">Application Fee Breakdown</h4>
    </div>
    <div class="px-10 py-5">
      <div v-if="appDetails.location" class="flex justify-between mt-5">
        <span class="font-semibold text-red-700">Total Locations</span>
        <span
          class="font-semibold text-red-700"
          v-text="appDetails.location"
        ></span>
      </div>
      <div v-if="appDetails.application" class="flex justify-between mt-5">
        <span class="font-semibold text-red-700">Total Signs</span>
        <span
          class="font-semibold text-red-700"
          v-text="appDetails.application"
        ></span>
      </div>
      <div class="flex justify-between mt-5">
        <span class="font-semibold text-red-700">Total</span>
        <span
          class="font-semibold text-red-700"
          v-text="formatCurrency(parseInt(appTotal))"
        ></span>
      </div>
      <div
        v-if="chargeFee"
        class="flex flex-col justify-center items-center gap-5 mb-5"
      >
        <span class="italic text-red-500 text-xs block mt-2"
          >{{ formatCurrency(chargeFee) }} Credo charge applies</span
        >
        <!-- <h4 class="text-sm font-medium">Paystack Charge</h4>

        <p
          v-text="formatCurrency(chargeFee)"
          class="font-semibold text-2xl"
        ></p> -->
      </div>
      <div>
        <RouterLink
          :to="{ name: 'RequestLists' }"
          class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
          v-if="appDetails.location"
          @click="emit('confirm')"
        >
          View Application List
        </RouterLink>

        <span
          v-if="appDetails.location"
          class="block text-center mt-5 italic text-xs"
          >Or proceed to pay</span
        >

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
            class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
            @click="handlePayment()"
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
              class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
              @click="startPayment()"
            >
              <IconSpinner v-if="loading" />
              <span class="text-sm font-medium text-white" v-if="!loading">
                Pay with Paystack
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
