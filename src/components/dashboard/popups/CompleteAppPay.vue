<script setup>
import { ref, onMounted, computed, watchEffect, watch } from "vue";
import { VueFinalModal } from "vue-final-modal";
import { useHelpers } from "../../../helper";
import { useUserStore } from "../../../stores/user";
import { toast } from "vue3-toastify";
import axios from "axios";
import { useRouter } from "vue-router";
import IconSpinner from "../../icons/IconSpinner.vue";
import PaystackPop from '@paystack/inline-js'
// import { useUserStore } from "../../stores/user";

const { userDetails } = useUserStore();
const userStore = useUserStore();
const router = useRouter();

const { formatCurrency, channelList, generateRandomRef, serviceCodeSelector } = useHelpers();
const props = defineProps({
  paymentID: String,
  formType: String,
  appPurpose: {
    default: "Application for New Sign",
    type: String,
  },
});

const emit = defineEmits(["confirm"]);

const loading = ref(false);

const payData = ref(null);

const getPaymentInfo = async () => {
  try {
    const response = await axios.post("getpaymentinfo", {
      type_ads: props.formType,
      paymentId: props.paymentID,
    });

    console.log(response);

    if (response.data.success) {
      payData.value = response.data;
    }
  } catch (error) {
    emit("confirm");
  }
};

const adsType = () => {
  if (props.formType === "OutdoorRequest") {
    return "OutdoorSite";
  } else {
    return props.formType;
  }
};

watchEffect(() => {
  if (props.formType) {
    console.log("🔍 formType detected:", `"${props.formType}"`);
  }
});

// console.log()

const startCredoPay = () => {
  loading.value = true;

  const channel = payData.value.chargeFee || payData.value.ChargeFee

  const transRef = generateRandomRef();
  const amount =
    payData.value.total_price +
    (payData.value.chargeFee || payData.value.ChargeFee);

  // console.log("code:", transRef)

  // console.log("Amount", amount * 100, amount, payData.value.total_price, payData.value.ChargeFee);
  // return
  const handler = window.CredoWidget.setup({
    key: payData.value.additionalInfoCredo,
    // customerFirstName: 'Ciroma',
    // customerLastName: 'Chukwuma',
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    // serviceCode: serviceCodeSelector(channel),
    reference: transRef,
    // customerPhoneNumber: '08032698425',
    splitConfiguration: payData.value.split_settlement,
    metadata: {
      paymentFor: "Application Fee",
      paymentId: props.paymentID,
      // applicationId: payData.value.applicationId,
      appType: adsType(),
      appPurpose: props.appPurpose,
      amountPaid: payData.value.total_price,
      // permitFee: payData.value.total_price,
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
  loading.value = true;
  const paystack = new PaystackPop();

  const amount =
    payData.value.total_price +
    (payData.value.chargeFee || payData.value.ChargeFee);

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + payData.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
      paymentFor: "Application Fee",
      paymentId: props.paymentID,
      appType: props.formType,
      appPurpose: props.appPurpose,
      amountPaid: payData.value.total_price,
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      setTimeout(() => emit("confirm"), 7000);
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

// function startPayment() {
//   loading.value = true;
//   const paystack = new PaystackPop();

//   const amount =
//     payData.value.total_price +
//     (payData.value.chargeFee || payData.value.ChargeFee);

//   paystack.newTransaction({
//     key: import.meta.env.VITE_ENV_STRING + payData.value.additionalInfo,
//     email: userDetails.userInfo.email,
//     amount: amount * 100,
//     channels: channelList(amount),
//     metadata: {
//       paymentFor: "Application Fee",
//       paymentId: props.paymentID,
//       appType: adsType(),
//       appPurpose: props.appPurpose,
//     },
//     onSuccess: (transaction) => {
//       console.log(transaction);
//       const data = {
//         reference_id: transaction.reference,
//         payment_id: props.paymentID,
//         form_type: props.formType,
//         payment_type: "Paystack",
//       };

//       setTimeout(() => emit("confirm"), 7000);

//       toast.success("Your Application is being Processed", {
//         position: toast.POSITION.TOP_CENTER,
//       });
//     },
//     onCancel: () => {
//       toast.error("Payment Cancelled", {
//         position: toast.POSITION.TOP_CENTER,
//       });
//       loading.value = false;
//     },
//   });
// }

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

    console.log('gateway:', gateway.value);

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
    startCredoPay();
  } else if (gateway.value === "both") {
    startCredoPay();
    startPayment();
  }
};

// pay from wallet button logic

const showBtn = ref(false);
const allowedWallet = [
  "Onpremise",
  "Temporary Advert",
  "Outdoor Site",
  "Small Format",
];
const canPayFromWallet = computed(() => allowedWallet.includes(props.formType));
const handleWallet = async () => {
  showBtn.value = false;

  try {
    let balance = 0;
    // const wallets = userStore.walletDetails;
    const amountPaid = Number(payData.value.total_price) || 0;

    // console.log("props.formType:", props.formType);
    // console.log("amountPaid:", amountPaid);

    if (props.formType === "Onpremise") {
      balance = Number(userStore.walletDetails.onpremise_wallet);
    } else if (props.formType === "Temporary Advert") {
      balance = Number(userStore.walletDetails.temporary_wallet);
    } else if (props.formType === "Outdoor Site") {
      balance = Number(userStore.walletDetails.outdoor_wallet);
    } else if (props.formType === "Small Format") {
      balance = Number(userStore.walletDetails.small_format_wallet);
    } else {
      balance = 0;
    }

    // console.log("balance:", balance);
    // console.log("canPayFromWallet:", canPayFromWallet.value);
    // console.log("formType raw:", JSON.stringify(props.formType));

    if (canPayFromWallet.value && amountPaid >= balance) {
      showBtn.value = true;
    } else {
      showBtn.value = false;
    }
  } catch (error) {
    console.log(error);
  }
};

const submitWalletPayInfo = async () => {
  loading.value = true;
  payData.value = null;

  const infoWallet = {
    reference_id: `wa${props.paymentID}`,
    payment_id: props.paymentID,
    form_type: "Onpremise Wallet",
    payment_type: "Wallet",
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

    router.push({ name: "RequestLists" });
    emit("confirm");
  }
};

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

    router.push({ name: "RequestLists" });
    emit("confirm");
  }
};

const walletPay = () => {
  if (
    props.formType === "Firstparty TemporaryAds" ||
    props.formType === "OutdoorRequest" ||
    props.formType === "SmallFormat Application" ||
    props.formType === "SmallFormat Inspection" ||
    props.formType === "OutdoorSite"
  ) {
    return false;
  } else return true;
};

onMounted(() => {
  getPaymentInfo();
});
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
      <h4
        v-if="formType === 'SmallFormat Inspection'"
        class="px-5 py-8 text-center"
      >
        Inspection Fee
      </h4>
      <h4 v-else class="px-5 py-8 text-center">Application Fee</h4>
    </div>
    <div class="p-10" v-if="payData">
      <div class="flex flex-col justify-center mt-5">
        <span class="font-semibold text-red-700 text-center"
          >Total
          <i v-if="formType === 'OutdoorSite'" class="text-xs"
            >(Inspection Fee inclusive)</i
          ></span
        >
        <span
          class="font-semibold text-red-700 text-center my-5"
          v-text="formatCurrency(parseInt(payData.total_price))"
        ></span>
      </div>
      <div
        v-if="payData.chargeFee && gateway === 'credo'"
        class="flex flex-col justify-center items-center gap-5 mb-5"
      >
        <h4 class="text-sm font-medium">Credo Charge</h4>

        <p
          v-text="formatCurrency(payData.chargeFee)"
          class="font-semibold text-xl"
        ></p>
      </div>

      <!-- <p v-else class="text-center italic mt-10">
        Getting Your Application Fee
      </p> -->
      <div v-if="payData">
        <button
          v-if="gateway === 'credo'"
          :disabled="loading"
          class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
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
            class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
            @click="startCredoPay()"
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
  </VueFinalModal>
</template>
