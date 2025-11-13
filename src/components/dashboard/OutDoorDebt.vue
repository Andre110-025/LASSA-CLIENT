<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import GetData from "./GetData.vue";
import PaystackPop from "@paystack/inline-js";
import { useUserStore } from "../../stores/user";
import { useHelpers } from "../../helper";
import { toast } from "vue3-toastify";
import { useModal } from "vue-final-modal";
import OutdoorWallet from "./popups/OutdoorWallet.vue";
import IconSpinner from "../icons/IconSpinner.vue";

const { formatCurrency, channelList, generateRandomRef } = useHelpers();
const { userDetails } = useUserStore();
const userStore = useUserStore();

const props = defineProps({
  appID: Number,
  paymentID: String,
  ownerId: String,
});

const permitCost = ref(null);
const arrearData = ref(null);
const loading = ref(false);
const showPart = ref(false);
const partAmount = ref(null);

console.log(props.ownerId);
console.log(userDetails.userInfo.id);

const emits = defineEmits(["setArrears"]);

const getPaymentInfo = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`outdoorsignagepayment/${props.appID}`);

    console.log(response);

    if (response.status === 200) {
      permitCost.value = response.data;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

const getArrears = async () => {
  try {
    // loading.value = true;
    const response = await axios.get(`getoutdoorsignagearrears/${props.appID}`);

    console.log("arrearData:", response);
    if (response.status === 200) {
      arrearData.value = response.data;

      if (arrearData.value?.Total == 0) {
        emits("setArrears", false);
        console.log(arrearData.value?.Total);
      }
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

const getAmount = () => {
  if (arrearData.value) {
    return arrearData.value.Total + arrearData.value.ChargeFee;
  } else {
    console.log(permitCost.value.Total + permitCost.value.ChargeFee);
    return permitCost.value.Total + permitCost.value.ChargeFee;
  }
};

const startFullCredoPayment = () => {
  loading.value = true;
  const transRef = generateRandomRef();

  // const simpleMeta = {
  //   paymentFor: "Permit Bill",
  //   paymentId: props.paymentID,
  //   appType: "OutDoor Site",
  //   permitFee: arrearData.value?.Total || permitCost.value.Total,
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
    key: permitCost.value.additionalInfoCredo,
    email: userDetails.userInfo.email,
    amount: getAmount() * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    reference: transRef,
    splitConfiguration: permitCost.value.split_settlement,
    metadata: {
    paymentFor: "Permit Bill",
    paymentId: props.paymentID,
    appType: "OutDoor Site",
    permitFee: arrearData.value?.Total || permitCost.value.Total,
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
      setTimeout(() => emit("confirm"), 7000);

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

  // const amount = (permitCost.value.Total) + permitCost.value.ChargeFee;

  // console.log(channelList(amount));

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + permitCost.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: getAmount() * 100,
    channels: channelList(getAmount()),
    metadata: {
      paymentFor: "Permit Bill",
      applicationId: props.appID,
      paymentId: props.paymentID,
      appType: "OutDoor Site",
      permitFee: arrearData.value?.Total || permitCost.value.Total,
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      const data = {
        reference_id: transaction.reference,
        payment_id: props.paymentID,
        type_ads: "OutDoor Site",
        payment_type: "Paystack",
      };

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

const getCharge = () => {
  if (partAmount.value < 130000) {
    return partAmount.value * (2 / 100);
  } else {
    return 2000;
  }
};

console.log("getcharge:", getCharge());

const startPartCredoPayment = () => {
  loading.value = true;
  console.log(getCharge());
  const amount = partAmount.value + getCharge();
  const transRef = generateRandomRef();

  // const simpleMeta = {
  //   paymentFor: "Permit Bill",
  //   paymentId: props.paymentID,
  //   appType: "OutDoor Site",
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
    paymentId: props.paymentID,
    appType: "OutDoor Site",
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
      // window.location.href = response.callbackUrl
      setTimeout(() => emit("confirm"), 15000);

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });

      showPart.value = false;

      setTimeout(getPaymentInfo, 7000);
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
    const balance = Number(userStore.walletDetails.outdoor_wallet);
    amountPaid.value = partAmount.value

    console.log("balance:", balance, "amountPaid:", amountPaid);

    if (amountPaid.value <= balance) {
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
    form_type: "Outdoor Wallet",
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
  loading.value = true;
  const paystack = new PaystackPop();
  console.log(getCharge());
  const amount = partAmount.value + getCharge();

  // const simpleMeta = {
  //   paymentFor: "Permit Bill",
  //   paymentId: props.paymentID,
  //   appType: "OutDoor Site",
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

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + permitCost.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: ["card", "bank"],
    metadata: {
    paymentFor: "Permit Bill",
    paymentId: props.paymentID,
    appType: "OutDoor Site",
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

const checkForArrears = computed(() => {
  if (arrearData.value) {
    return arrearData.value.Total > 1 ? true : false;
  } else {
    return true;
  }
});

getPaymentInfo();
getArrears();

function outDoorWallet() {
  const { open, close } = useModal({
    component: OutdoorWallet,
    attrs: {
      onConfirm() {
        close();
        getArrears();
        getPaymentInfo();
      },
      appID: props.appID,
      paymentID: props.paymentID,
      ownerId: props.ownerId,
      arrearProp: arrearData.value,
      amount: arrearData.value.Total,
      chargeFee: arrearData.value.ChargeFee,
      amountPermit: permitCost.value.Total,
      chargeFeePermit: permitCost.value.ChargeFee,
      cKey: permitCost.value.additionalInfoCredo,
      pKey: permitCost.value.additionalInfo,
      split: permitCost.value.split_settlement,
    },
  });

  open();
}

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
    console.log(showWallet.value)

    if (gatewayMethod === "paystack") {
      gateway.value = "paystack";
    } else if (gatewayMethod === "credo") {
      gateway.value = "credo";
    } else if (gatewayMethod === "both") {
      gateway.value = "both";
    }

    console.log("gateway:", gateway.value);
    console.log("wallet:", showWalletBtn.value);
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
    startPartCredoPayment();
  } else if (gateway.value === "both") {
    startPartCredoPayment();
    payPart();
  }
};
</script>

<template>
  <GetData v-if="loading">Getting Arrears</GetData>
  <div v-else>
    <div class="flex p-6 gap-2" style="flex-direction: column">
      <div>
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          Outdoor Site Permit Cost/Arrears
        </h6>
      </div>

      <div class="flex xs:flex-row items-center" v-if="arrearData">
        <p class="w-2/5 text-sm font-semibold">Permit Arrears</p>
        <p
          class="text-lg font-bold"
          v-text="formatCurrency(arrearData.Total)"
        ></p>
      </div>

      <div class="flex xs:flex-row items-center" v-else>
        <p class="w-2/5 text-sm font-semibold">Permit Cost</p>
        <p
          class="text-lg font-bold"
          v-text="formatCurrency(permitCost.Total)"
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
          class="input max-w-xs"
          type="number"
          name="payableAmount"
          id="payableAmount"
          @change="handlePartWalletPayment()"
        />
      </div>
    </div>

    <div v-if="ownerId === userDetails.userInfo.id && checkForArrears">
      <div
        v-if="!showPart"
        class="flex flex-row justify-center gap-4 pb-4 px-6"
      >
        <button
          class="p-3 bg-mainColor text-sm rounded-md text-white grow"
          @click="outDoorWallet()"
        >
          Pay Full
        </button>

        <button
          class="p-3 bg-mainColor text-sm rounded-md text-white grow"
          @click="showPart = true"
          v-if="permitCost?.first_pay && arrearData?.Total > 10000"
        >
          Pay Part
        </button>
      </div>

      <div
        v-else-if="showPart"
        class="flex flex-col md:flex-row gap-3 pb-4 px-6 w-full"
      >
        <!-- Credo Button -->
        <button
          v-if="gateway === 'credo'"
          class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44"
          @click="handlePayment()"
          :disabled="partAmount < 10000 || partAmount > arrearData.Total"
        >
          Pay with Credo
        </button>

        <!-- Paystack Button -->
        <button
          v-if="gateway === 'paystack'"
          class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44"
          @click="handlePayment()"
          :disabled="partAmount < 10000 || partAmount > arrearData.Total"
        >
          Pay with Paystack
        </button>

        <!-- Both Gateways -->
        <div
          v-if="gateway === 'both'"
          class="flex flex-col md:flex-row gap-3 w-full"
        >
          <button
            class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44"
            @click="startPartCredoPayment()"
            :disabled="partAmount < 10000 || partAmount > arrearData.Total"
          >
            Pay with Credo
          </button>

          <button
            class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44"
            @click="payPart()"
            :disabled="partAmount < 10000 || partAmount > arrearData.Total"
          >
            Pay with Paystack
          </button>
        </div>

        <!-- Wallet Button -->
        <button
          v-if="showBtn && showWalletBtn"
          :disabled="partAmount < 10000 || partAmount > arrearData.Total"
          @click="submitPartWalletPayInfo()"
          class="p-3 bg-mainColor text-sm rounded-md text-white w-full md:w-44"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay From Wallet
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
