<script setup>
import { VueFinalModal } from "vue-final-modal";
import { ref, onMounted } from "vue";
import PaystackPop from "@paystack/inline-js";
import { useUserStore } from "../../../stores/user";
import { useHelpers } from "../../../helper";
import axios from "axios";
import { toast } from "vue3-toastify";

const { userDetails } = useUserStore();
const { formatCurrency, channelList, generateRandomRef, serviceCodeSelector } = useHelpers();
const loading = ref(false);
const licenseCost = ref(null);

const renewalCost = 300000;

const props = defineProps({
  kycId: Number,
});

const emit = defineEmits(["confirm"]);

const getPaymentInfo = async () => {
  try {
    const response = await axios.get(`kycthirdpartypayment/${props.kycId}`);

    console.log(response);

    if (response.status === 200) {
      licenseCost.value = response.data;
    }
  } catch (error) {
    // emit('confirm')
  }
};

onMounted(() => {
  getPaymentInfo();
});

const startCredoPayment = () => {
  loading.value = true;
  const total = licenseCost.value.totalFee + licenseCost.value.ChargeFee;
  const regFee = total * 100;
  const transRef = generateRandomRef();
  const channel = licenseCost.value.ChargeFee;

  // const simpleMeta = {
  //   paymentFor: "Practitioner License Fee",
  //   userId: userDetails.userInfo.id,
  //   // appId: props.kycId,
  // };

  // if (props.kycId) {
  //   simpleMeta.customFields = [
  //     {
  //       variable_name: "kycId",
  //       display_name: "kyc Id",
  //       value: Array.isArray(props.kycId)
  //         ? props.kycId.join(", ")
  //         : props.kycId,
  //     },
  //   ];
  // }

  const handler = window.CredoWidget.setup({
    key: licenseCost.value.additionalInfoCredo,
    email: userDetails.userInfo.email,
    amount: regFee,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    // serviceCode: serviceCodeSelector(channel),
    reference: transRef,
    splitConfiguration: licenseCost.value.split_settlement,
    metadata: {
      paymentFor: "Practitioner License Fee",
      userId: userDetails.userInfo.id,
      appId: props.kycId,
      amountPaid: licenseCost.value.totalFee,
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
      // console.log("Metadata:", metadata);
      // window.location.href = response.callbackUrl
      setTimeout(() => emit("confirm"), 15000);

      toast.success("Your Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      setTimeout(() => emit("confirm", true), 15000);
    },
  });

  handler.openIframe();
};

function startPayment() {
  loading.value = true;
  const paystack = new PaystackPop();
  const total = licenseCost.value.totalFee + licenseCost.value.ChargeFee;
  const regFee = total * 100;

  // console.log(regFee);

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + licenseCost.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: regFee,
    channels: channelList(total),
    metadata: {
      paymentFor: "Practitioner License Fee",
      userId: userDetails.userInfo.id,
      appId: props.kycId,
      amountPaid: licenseCost.value.totalFee
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      loading.value = true;
      // console.log(data);
      setTimeout(() => emit("confirm", true), 7000);

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });
    },
    onCancel: () => {
      loading.value = false;
      toast.error("Payment Cancelled", {
        position: toast.POSITION.TOP_CENTER,
      });
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
    content-class="relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[28.125rem] min-h-[350px] max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="false"
  >
    <div class="border-b-2 border-dashed">
      <h4 class="px-5 py-8 text-center">Pay License Fee</h4>
    </div>
    <div class="p-10" v-if="licenseCost">
      <div class="flex flex-col justify-center items-center gap-5 my-5">
        <h4 class="text-sm font-medium">License Fee</h4>

        <p
          v-text="formatCurrency(parseInt(licenseCost.totalFee))"
          class="font-semibold text-2xl"
        ></p>
      </div>
      <span class="block text-center text-red-700 text-sm italic"
        >Credo charge is
        {{ formatCurrency(parseInt(licenseCost.ChargeFee)) }}
      </span>

      <span class="block text-center italic text-xs font-bold mt-5"
        >Yearly Renewal is {{ formatCurrency(renewalCost) }}</span
      >
      <div>
        <button
          v-if="gateway === 'credo'"
          @click="handlePayment()"
          :disabled="loading"
          class="blueBtn mx-auto mt-5 max-w-[200px] text-center"
        >
          Pay with Credo
        </button>
        <button
          v-if="gateway === 'paystack'"
          @click="handlePayment()"
          :disabled="loading"
          class="blueBtn mx-auto mt-5 max-w-[200px] text-center"
        >
          Pay with Paystack
        </button>

        <div v-if="gateway === 'both'">
          <button
            @click="startCredoPayment()"
            :disabled="loading"
            class="blueBtn mx-auto mt-5 max-w-[200px] text-center"
          >
            Pay with Credo
          </button>
          <button
            @click="startPayment()"
            :disabled="loading"
            class="blueBtn mx-auto mt-5 max-w-[200px] text-center"
          >
            Pay with Paystack
          </button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
