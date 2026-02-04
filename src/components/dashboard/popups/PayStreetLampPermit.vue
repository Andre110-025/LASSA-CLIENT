<script setup>
import { ref, onMounted } from "vue";
import { VueFinalModal } from "vue-final-modal";
import { useHelpers } from "../../../helper";
import { useUserStore } from "../../../stores/user";
import PaystackPop from "@paystack/inline-js";
import { toast } from "vue3-toastify";
import axios from "axios";
import IconSpinner from "../../icons/IconSpinner.vue";

const { userDetails } = useUserStore();

const { formatCurrency, channelList, generateRandomRef, serviceCodeSelector } = useHelpers();
const props = defineProps({
  appID: Number,
  adType: String,
  paymentID: String,
});

const emit = defineEmits(["confirm"]);

const loading = ref(false);

const permitCost = ref(null);

const getPaymentInfo = async () => {
  try {
    const response = await axios.get(`streetlamppayment/${props.appID}`);

    console.log(response);

    if (response.status === 200) {
      permitCost.value = response.data;
    }
  } catch (error) {
    // emit('confirm')
  }
};

const infoWallet = {
  reference_id: `wa${props.paymentID}`,
  payment_id: props.paymentID,
  type_ads: props.adType,
  payment_type: "Wallet",
};

const startCredoPayment = () => {
  loading.value = true;
  const channel = permitCost.value.ChargeFee;
  const transRef = generateRandomRef();
  const amount = permitCost.value["Total Fee"] + permitCost.value.ChargeFee;

  const handler = window.CredoWidget.setup({
    key: permitCost.value.additionalInfoCredo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    // serviceCode: serviceCodeSelector(channel),
    reference: transRef,
    splitConfiguration: permitCost.value.split_settlement,
    metadata: {
      paymentFor: "Permit Bill",
      applicationId: props.appID,
      appType: props.adType,
      amountPaid: permitCost.value["Total Fee"],
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
    },
  });

  handler.openIframe();
};

function startPayment() {
  loading.value = true;
  const paystack = new PaystackPop();

  const amount = permitCost.value["Total Fee"] + permitCost.value.ChargeFee;

  console.log(channelList(amount));

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + permitCost.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    channels: channelList(amount),
    split: {
      type: "flat",
      bearer_type: "account",
      subaccounts: [
        {
          subaccount: import.meta.env.VITE_ENV_SUB_SLP,
          share: parseInt(permitCost.value.AdmininstrativeFee) * 100,
        },
      ],
    },
    metadata: {
      paymentFor: "Permit Bill",
      applicationId: props.appID,
      appType: props.adType,
      amountPaid: permitCost.value["Total Fee"],
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
    },
    onCancel: () => {
      loading.value = false;

      toast.error("Payment Cancelled", {
        position: toast.POSITION.TOP_CENTER,
      });
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

onMounted(() => {
  getPaymentInfo();
});

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
    content-class="flex flex-col relative bg-white border space-y-2 w-full sm:w-4/5 sm:min-w-[28.125rem] min-h-[350px] max-w-[340px] max-h-[100dvh]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed h-fit">
      <h4 class="px-5 py-8 text-center">Signage Fee</h4>
    </div>
    <div class="p-10 overflow-y-auto">
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

        <div
          v-if="permitCost.ChargeFee"
          class="flex flex-col justify-center items-center gap-5 mb-5"
        >
          <h4 class="text-sm font-medium">Credo Charge</h4>

          <p
            v-text="formatCurrency(permitCost.ChargeFee)"
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

        <button
          :disabled="loading"
          v-if="false"
          @click="submitPayInfo(infoWallet)"
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
