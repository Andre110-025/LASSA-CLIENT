<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import GetData from "./GetData.vue";
import PaystackPop from "@paystack/inline-js";
import { useUserStore } from "../../stores/user";
import { useHelpers } from "../../helper";
import { toast } from "vue3-toastify";
import { useModal } from "vue-final-modal";
import PremiseWallet from "./popups/PremiseWallet.vue";
import IconSpinner from "../icons/IconSpinner.vue";

const { formatCurrency, channelList, generateRandomRef } = useHelpers();
const { userDetails } = useUserStore();
const userStore = useUserStore();

const props = defineProps({
  appID: Number,
  paymentID: String,
});

const arrearData = ref(null);
const loading = ref(false);
const showPart = ref(false);
const partAmount = ref(null);

const getArrears = async () => {
  try {
    // loading.value = true;
    const response = await axios.get(`onpremisepayment/${props.appID}`);

    console.log(response);

    if (response.status === 200) {
      partAmount.value = null;
      arrearData.value = response.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

const startCredoFullPayment = () => {
  loading.value = true;
  const amount = arrearData.value["Total Fee"] + arrearData.value.ChargeFee;
  const transRef = generateRandomRef();

  // const simpleMeta = {
  //   paymentFor: "Permit Bill",
  //   permitFee: arrearData.value["Total Fee"],
  //   appType: "Onpremise",
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

  const handler = window.CredoWidget.setup({
    key: arrearData.value.additionalInfoCredo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    reference: transRef,
    splitConfiguration: arrearData.value.split_settlement,
    metadata: {
    paymentFor: "Permit Bill",
    permitFee: arrearData.value["Total Fee"],
    applicationId: props.appID,
    appType: "Onpremise",
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
      setTimeout(() => emit("confirm"), 10000);

      toast.success("Your Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      setTimeout(getArrears, 10000);
    },
  });

  handler.openIframe();
};

function payFull() {
  loading.value = true;
  const paystack = new PaystackPop();

  const amount = arrearData.value["Total Fee"] + arrearData.value.ChargeFee;

  // console.log(channelList(amount));

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + arrearData.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
      paymentFor: "Permit Bill",
      applicationId: props.appID,
      permitFee: arrearData.value["Total Fee"],
      appType: "Onpremise",
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      const data = {
        reference_id: transaction.reference,
        payment_id: props.paymentID,
        type_ads: "Onpremise",
        payment_type: "Paystack",
      };

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });

      setTimeout(getArrears, 7000);
    },
    onCancel: () => {
      toast.error("Payment Cancelled", {
        position: toast.POSITION.TOP_CENTER,
      });
      loading.value = false;
    },
  });
}

const getCharge = () => {
  if (partAmount.value < 130000) {
    return partAmount.value * (2 / 100);
  } else {
    return 2000;
  }
};

const startCredoPartPayment = () => {
  if (partAmount.value > arrearData.value["Total Fee"]) {
    toast.error("Amount Greater than arrears", {
      position: toast.POSITION.TOP_CENTER,
    });

    return;
  }
  loading.value = true;
  console.log(getCharge());

  const amount = partAmount.value + getCharge();
  const transRef = generateRandomRef();
  const channel = getCharge();

  // const simpleMeta = {
  //   paymentFor: "Permit Bill",
  //   appType: "Onpremise",
  //   permitFee: partAmount.value,
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

  const handler = window.CredoWidget.setup({
    key: arrearData.value.additionalInfoCredo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    // serviceCode: serviceCodeSelector(channel),
    reference: transRef,
    splitConfiguration: arrearData.value.split_settlement,
    metadata: {
    paymentFor: "Permit Bill",
    appType: "Onpremise",
    permitFee: partAmount.value,
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
      // console.log("Metadata:", metadata);
      // window.location.href = response.callbackUrl
      setTimeout(() => emit("confirm"), 10000);

      toast.success("Your Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      showPart.value = false;
      setTimeout(getArrears, 7000);
    },
  });

  handler.openIframe();
};

const showBtn = ref(false);
const amountPaid = ref(0)

const handlePartWalletPayment = async () => {
  showBtn.value = false;
  amountPaid.value = 0;

  try {
    const balance = Number(userStore.walletDetails.onpremise_wallet);
    const amountPaid = partAmount.value;

    console.log("balance:", balance, "amountPaid:", amountPaid);

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
  await getArrears();
  // await handlePartWalletPayment();
});

watch(partAmount, handlePartWalletPayment);

const submitPartWalletPayInfo = async () => {
  loading.value = true;

  const infoWallet = {
    reference_id: `wa${props.paymentID}`,
    payment_id: props.paymentID,
    form_type: "Onpremise Wallet",
    payment_type: "Wallet",
    amount_paid: partAmount.value
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
      // emit("confirm");
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
    // emit("confirm");
  }
};

function payPart() {
  if (partAmount.value > arrearData.value["Total Fee"]) {
    toast.error("Amount Greater than arrears", {
      position: toast.POSITION.TOP_CENTER,
    });

    return;
  }
  loading.value = true;
  const paystack = new PaystackPop();

  console.log(getCharge());

  const amount = partAmount.value + getCharge();

  // const simpleMeta = {
  //   paymentFor: "Permit Bill",
  //   appType: "Onpremise",
  //   permitFee: partAmount.value,
  //   applicationId: props.appID
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
  // console.log(metadata)
  // return

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + arrearData.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
    paymentFor: "Permit Bill",
    appType: "Onpremise",
    permitFee: partAmount.value,
    applicationId: props.appID
    },
    onSuccess: (transaction) => {
      console.log(transaction);

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });

      showPart.value = false;
      setTimeout(getArrears, 7000);
    },
    onCancel: () => {
      toast.error("Payment Cancelled", {
        position: toast.POSITION.TOP_CENTER,
      });
      loading.value = false;
    },
  });
}

getArrears();

function premiseWalletPayment() {
  const { open, close } = useModal({
    component: PremiseWallet,
    attrs: {
      onConfirm() {
        close();
        getArrears();
      },
      paymentID: props.paymentID,
      amount: arrearData.value["Total Fee"],
      chargeFee: arrearData.value.ChargeFee,
      appID: props.appID,
      cKey: arrearData.value.additionalInfoCredo,
      pKey: arrearData.value.additionalInfo,
      split: arrearData.value.split_settlement,
    },
  });

  open();
}

const gateway = ref("");
const showWalletBtn = ref(false);

const getPaymentGateway = async () => {
  try {
    const { data } = await axios.get("getuser");

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
    console.log(showWalletBtn.value)
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getPaymentGateway();
});

const handlePayment = () => {
  if (gateway.value === "paystack") {
    payPart();
  } else if (gateway.value === "credo") {
    startCredoPartPayment();
  } else if (gateway.value === "both") {
    startCredoPartPayment();
    payPart();
  }
};
</script>

<template>
  <GetData v-if="loading || !arrearData">Getting Arrears</GetData>
  <div v-else>
    <div class="flex py-6 gap-2" style="flex-direction: column">
      <div>
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          On-Premise Permit Cost/Arrears
        </h6>
      </div>

      <div class="flex xs:flex-row items-center" v-if="arrearData">
        <p class="w-2/5 text-sm font-semibold">Permit Arrears</p>
        <p
          class="text-lg font-bold"
          v-text="formatCurrency(arrearData['Total Fee'])"
        ></p>
      </div>

      <div class="inputHolder px-0" v-if="showPart">
        <label
          class="text-base text-start mb-2.5 font-semibold text-mainColor"
          for="payableAmount"
          >Enter Amount
          <i class="text-xs font-normal">(not less NGN 10,000)</i></label
        >

        <input
          v-model="partAmount"
          :max="arrearData['Total Fee']"
          class="input max-w-xs"
          type="number"
          name="payableAmount"
          id="payableAmount"
          @change="handlePartWalletPayment()"
        />
      </div>
    </div>

    <div
      v-if="!showPart && arrearData['Total Fee']"
      class="flex flex-row justify-center gap-4 pb-4"
    >
      <button
        class="p-3 bg-mainColor text-sm rounded-md text-white grow"
        @click="premiseWalletPayment()"
      >
        Pay Full
      </button>

      <button
        class="p-3 bg-mainColor text-sm rounded-md text-white grow"
        @click="showPart = true"
      >
        Pay Part
      </button>
    </div>

    <div
      v-else-if="showPart"
      class="flex flex-col md:flex-row justify-center md:justify-center items-center gap-3 pb-4 px-6 w-full"
    >
      <!-- Credo Button -->
      <button
        v-if="gateway === 'credo'"
        class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44 text-center"
        @click="handlePayment()"
        :disabled="partAmount < 10000 || partAmount > arrearData['Total Fee']"
      >
        Pay with Credo
      </button>

      <!-- Paystack Button -->
      <button
        v-if="gateway === 'paystack'"
        class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44 text-center"
        @click="handlePayment()"
        :disabled="partAmount < 10000 || partAmount > arrearData['Total Fee']"
      >
        Pay with Paystack
      </button>

      <!-- Both Gateways -->
      <template v-if="gateway === 'both'">
        <button
          class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44 text-center"
          @click="startCredoPartPayment()"
          :disabled="partAmount < 10000 || partAmount > arrearData['Total Fee']"
        >
          Pay with Credo
        </button>

        <button
          class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44 text-center"
          @click="payPart()"
          :disabled="partAmount < 10000 || partAmount > arrearData['Total Fee']"
        >
          Pay with Paystack
        </button>
      </template>

      <!-- Wallet Button -->
      <button
        v-if="showBtn && showWalletBtn"
        :disabled="partAmount < 10000 || partAmount > arrearData['Total Fee']"
        @click="submitPartWalletPayInfo()"
        class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44 text-center flex justify-center items-center"
      >
        <IconSpinner v-if="loading" />
        <span class="text-sm font-medium text-white" v-if="!loading">
          Pay From Wallet
        </span>
      </button>
    </div>
  </div>
</template>
