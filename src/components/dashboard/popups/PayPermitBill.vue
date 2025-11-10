<script setup>
import { ref, onMounted, computed } from "vue";
import { VueFinalModal } from "vue-final-modal";
import { useHelpers } from "../../../helper";
import { useUserStore } from "../../../stores/user";
import PaystackPop from "@paystack/inline-js";
import { toast } from "vue3-toastify";
import axios from "axios";
import IconSpinner from "../../icons/IconSpinner.vue";

const { userDetails } = useUserStore();
const userStore = useUserStore();
const { formatCurrency, channelList, generateRandomRef } = useHelpers();
const props = defineProps({
  appID: Number,
  adType: String,
  paymentID: String,
});

const emit = defineEmits(["confirm"]);

const getEndPoint = () => {
  if (props.adType === "Onpremise") return "onpremisepayment";
  else if (props.adType === "Mobile") return "mobileadspayment";
  else if (props.adType === "ThirdPartyMobile")
    return "thirdpartymobilepayment";
  else if (props.adType === "OutDoor Site") return "outdoorsignagepayment";
  else if (props.adType === "Firstparty TemporaryAds")
    return "firstpartytemporarypayment";
};

const loading = ref(false);

const permitCost = ref(null);

const getPaymentInfo = async () => {
  try {
    const response = await axios.get(`${getEndPoint()}/${props.appID}`);

    if (response.status === 200) {
      permitCost.value = response.data;
    }
  } catch (error) {
    // emit('confirm')
  }
};

const startCredoPayment = () => {
  loading.value = true;

  const transRef = generateRandomRef();
  const amount =
    (permitCost.value.Total || permitCost.value["Total Fee"]) +
    permitCost.value.ChargeFee;
  const checkTotal = permitCost.value.Total || permitCost.value["Total Fee"];

  const handler = window.CredoWidget.setup({
    key: permitCost.value.additionalInfoCredo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    reference: transRef,
    splitConfiguration: permitCost.value.split_settlement,
    metadata: {
      paymentFor: "Permit Bill",
      applicationId: props.appID,
      appType: props.adType,
      amountPaid: checkTotal,
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
      setTimeout(() => emit("confirm", true), 15000);

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

const showBtn = ref(false);
let balance = ref(0);
let formType = ref("");
let amountPaid = ref(0);

const handleWalletPayment = async () => {
  showBtn.value = false;

  try {
    balance.value = Number(userStore.walletDetails.temporary_wallet);
    amountPaid.value = Number(
      permitCost.value.Total || permitCost.value["Total Fee"]
    );

    if (props.adType == "Firstparty TemporaryAds") {
      balance.value = Number(userStore.walletDetails.temporary_wallet);
      formType.value = "Temopary Advert Wallet";
    }

    console.log("Mybalance:", balance.value);
    console.log("amount paid:", amountPaid.value);

    if (balance.value >= amountPaid.value) {
      showBtn.value = true;
    } else {
      showBtn.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

// const formType = ref("");
// const balance = ref(0);

// const handleWallet = async () => {
//   showBtn.value = false;

//   try {
//     const amountPaid = Number(
//       permitCost.value.Total || permitCost.value["Total Fee"]
//     );

//     if (props.adType == "Firstparty TemporaryAds") {
//       balance.value = Number(userStore.walletDetails.temporary_wallet);
//       formType.value = "Temopary Advert Wallet";
//     }

//     console.log("balance:", balance.value);
//     console.log("formType raw:", JSON.stringify(props.adType));

//     if (amountPaid >= balance.value) {
//       showBtn.value = true;
//     } else {
//       showBtn.value = false;
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// onMounted(async () => {
//   await userStore.getWalletData();
//   await getPaymentInfo();
//   await handleWallet();
// });

const submitWalletPayInfo = async () => {
  loading.value = true;
  permitCost.value = null;

  const infoWallet = {
    reference_id: `wa${props.paymentID}`,
    payment_id: props.paymentID,
    form_type: formType.value,
    payment_type: "Wallet",
    amount_paid: amountPaid.value,
  };

  // console.log('formType:', form_type)

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

function startPayment() {
  loading.value = true;
  const paystack = new PaystackPop();

  const amount =
    (permitCost.value.Total || permitCost.value["Total Fee"]) +
    permitCost.value.ChargeFee;
  const checkTotal = permitCost.value.Total || permitCost.value["Total Fee"];

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + permitCost.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
      paymentFor: "Permit Bill",
      applicationId: props.appID,
      appType: props.adType,
      amountPaid: checkTotal,
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });

      setTimeout(() => emit("confirm", true), 7000);
      // submitPayInfo(data);
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
    const response = await axios.post("setadspaymentinfo", data);

    if (response.status === 200) {
      toast.success("Permit Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });

      // router.push({ name: "Overview" });
      emit("confirm", true);
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
    // error.response.data

    // router.push({ name: "Overview" });
    emit("confirm");
  }
};

onMounted(async () => {
  await getPaymentInfo();
  await userStore.getWalletData();
  handleWalletPayment();
});

const gateway = ref("");
const showWalletBtn = ref(false);

const getPaymentGateway = async () => {
  try {
    const { data } = await axios.get("getuser");

    const gatewayMethod = data.settings.gateway;
    const showWallet = data.settings.wallet_on;
    console.log(showWallet);

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
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed">
      <h4 class="px-5 py-8 text-center">Signage Fee</h4>
    </div>
    <div class="p-10">
      <div v-if="permitCost">
        <div
          v-if="permitCost.AdmininstrativeFee"
          class="flex flex-col justify-center items-center gap-5 mb-5"
        >
          <h4 class="text-sm font-medium">Administrative Fee</h4>

          <p
            v-text="formatCurrency(parseInt(permitCost.AdmininstrativeFee))"
            class="font-semibold text-2xl"
          ></p>
        </div>

        <div
          v-if="permitCost.PermitFee"
          class="flex flex-col justify-center items-center gap-5 mb-5"
        >
          <h4 class="text-sm font-medium">Permit Bill</h4>

          <p
            v-text="formatCurrency(parseInt(permitCost.PermitFee))"
            class="font-semibold text-2xl"
          ></p>
        </div>

        <div
          v-if="permitCost.LegalFee"
          class="flex flex-col justify-center items-center gap-5 mb-5"
        >
          <h4 class="text-sm font-medium">Legal Fee</h4>

          <p
            v-text="formatCurrency(parseInt(permitCost.LegalFee))"
            class="font-semibold text-2xl"
          ></p>
        </div>

        <div
          v-if="permitCost.ChargeFee && gateway === 'credo'"
          class="flex flex-col justify-center items-center gap-5 mb-5"
        >
          <h4 class="text-sm font-medium">Credo Charge</h4>

          <p
            v-text="formatCurrency(permitCost.ChargeFee)"
            class="font-semibold text-2xl"
          ></p>
        </div>

        <div class="flex flex-col justify-center items-center gap-5 mb-5">
          <h4 class="text-sm font-medium" v-if="permitCost.PermitFee">
            Total Fee
          </h4>
          <h4 class="text-sm font-medium" v-else>Permit Bill</h4>

          <p
            v-text="formatCurrency(permitCost.Total || permitCost['Total Fee'])"
            class="font-semibold text-2xl"
          ></p>
        </div>
      </div>

      <!-- <p v-else class="text-center italic mt-10">
        Getting Your Application Fee
      </p> -->

      <div v-if="permitCost">
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
            @click="startCredoPayment()"
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

        <button
          v-if="showBtn && showWalletBtn"
          :disabled="loading"
          @click="submitWalletPayInfo()"
          class="blueBtn max-w-[200px] w-full mt-5 mx-auto rounded-none"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay From Wallet
          </span>
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
