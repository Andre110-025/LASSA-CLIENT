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
const payData = ref(null);

const emit = defineEmits(["confirm"]);

const getPaymentInfo = async () => {
  try {
    loading.value = true;
    const response = await axios.post("getpaymentinfo", {
      type_ads: "Practitioner Application",
      paymentId: null,
    });

    console.log(response);

    if (response.data.success) {
      payData.value = response.data;
    }
  } catch (error) {
    emit("confirm");
  } finally {
    loading.value = false;
  }
};

// const props = defineProps({
//   regData: Object,
// });

const startCredoPayment = () => {
  loading.value = true;
  const channel = payData.value.chargeFee;
  const Total = payData.value.total_price + payData.value.chargeFee;
  const transRef = generateRandomRef();
  const regFee = Total * 100;

  const handler = window.CredoWidget.setup({
    key: payData.value.additionalInfoCredo,
    email: userDetails.userInfo.email,
    amount: regFee,
    channels: ["card", "bank"],
    // serviceCode: serviceCodeSelector(channel),
    currency: "NGN",
    renderSize: 0,
    reference: transRef,
    splitConfiguration: payData.value.split_settlement,
    metadata: {
      paymentFor: "Practitioner Application",
      userId: userDetails.userInfo.id,
      amountPaid: payData.value.total_price,
      // data: props.regData,
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
  const Total = payData.value.total_price + payData.value.chargeFee;
  const regFee = Total * 100;

  console.log(regFee);

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + payData.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: regFee,
    channels: channelList(regFee),
    metadata: {
      paymentFor: "Practitioner Application",
      userId: userDetails.userInfo.id,
      amountPaid: payData.value.total_price,
      // data: props.regData,
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      loading.value = true;
      setTimeout(() => window.location.reload(), 7000);

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

onMounted(() => {
  getPaymentInfo();
});
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
      <h4 class="px-5 py-8 text-center">Pay Application Fee</h4>
    </div>
    <div v-if="!loading" class="p-10">
      <div class="flex flex-col justify-center items-center gap-5 my-5">
        <h4 class="text-sm font-medium">Application Fee</h4>

        <p
          v-text="formatCurrency(parseInt(payData.total_price))"
          class="font-semibold text-2xl"
        ></p>
      </div>
      <span class="block text-center text-red-700 text-sm italic"
        >Credo charge is {{ formatCurrency(parseInt(payData.chargeFee)) }}
      </span>

      <!-- <pre>{{ payData }}</pre> -->

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
            :disabled="loading"
            @click="startCredoPayment()"
            class="blueBtn mx-auto mt-5 max-w-[200px] text-center"
          >
            <span class="text-sm font-medium text-white" v-if="!loading">
              Pay with Credo
            </span>
          </button>

          <button
            :disabled="loading"
            class="blueBtn mx-auto mt-5 max-w-[200px] text-center"
            @click="startPayment()"
          >
            <span class="text-sm font-medium text-white" v-if="!loading">
              Pay with Paystack
            </span>
          </button>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
