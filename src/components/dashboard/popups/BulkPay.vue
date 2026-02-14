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

const { formatCurrency, channelList, generateRandomRef, serviceCodeSelector } = useHelpers();

const props = defineProps({
  multipleID: Number,
  formType: String,
  appPurpose: {
    default: "Application for New Sign",
    type: String,
  },
});

// const { paymentID: payId } = props.multipleID

const emit = defineEmits(["confirm"]);

const loading = ref(false);

const payData = ref(null);

const getPaymentInfo = async () => {
  try {
    const { data } = await axios.post(
      `forbulkapplicationfeepayment/${[props.multipleID]}`
    );

    console.log(data);

    if (data.success) {
      payData.value = data;
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

function startPayment() {
  loading.value = true;
  const paystack = new PaystackPop();
  const amount =
    payData.value.total_price +
    (payData.value.chargeFee || payData.value.ChargeFee);

  // const simpleMeta = {
  //   paymentFor: "Application Fee",
  //   appType: props.formType,
  //   paymentId: payData.value.paymentID,
  //   appPurpose: props.appPurpose,
  //   amountPaid: payData.value.total_price,
  // };

  // if (props.multipleID) {
  //   simpleMeta.customFields = [
  //     {
  //       variable_name: "paymentId",
  //       display_name: "Payment Id",
  //       value: Array.isArray(props.multipleID)
  //         ? props.multipleID.join(", ")
  //         : props.multipleID,
  //     },
  //   ];
  // }

  // console.log(simpleMeta)

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + payData.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
    paymentFor: "Application Fee",
    appType: props.formType,
    paymentId: payData.value.paymentID,
    appPurpose: props.appPurpose,
    amountPaid: payData.value.total_price,
  },
    onSuccess: (transaction) => {
      console.log(transaction);
      setTimeout(() => emit("confirm"), 7000);
      toast.success("Your Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Payment Successful", {
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

const startCredoPay = () => {
  loading.value = true;

  const channel = payData.value.chargeFee || payData.value.ChargeFee

  const transRef = generateRandomRef();
  const amount =
    payData.value.total_price +
    (payData.value.chargeFee || payData.value.ChargeFee);

  const simpleMeta = {
    paymentFor: "Application Fee",
    // paymentId: payData.value.paymentID,
    appType: props.formType,
    appPurpose: props.appPurpose,
    amountPaid: payData.value.total_price,
  };

  if (props.multipleID) {
    simpleMeta.customFields = [
      {
        variable_name: "paymentId",
        display_name: "Payment Id",
        value: Array.isArray(payData.value.paymentID)
          ? payData.value.paymentID.join(", ")
          : payData.value.paymentID,
      },
    ];
  }

  // console.log(simpleMeta);
  // return;
  // console.log(payData.value.paymentID.map((f) => `"${f}"`).join(", "));
  // return;

  const handler = window.CredoWidget.setup({
    key: payData.value.additionalInfoCredo,
    // customerFirstName: 'Ciroma', value: payID.map((f) => `"${f}"`).join(", "),
    // customerLastName: 'Chukwuma',
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    // serviceCode: serviceCodeSelector(channel),
    reference: transRef,
    splitConfiguration: payData.value.split_settlement,
    // customerPhoneNumber: '08032698425',
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
      // console.log("Metadata:", metadata);
      // window.location.href = response.callbackUrl
      setTimeout(() => emit("confirm"), 5000);

      toast.success("Your Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
    },
  });

  handler.openIframe();
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
        v-if="payData.ChargeFee || payData.chargeFee"
        class="flex flex-col justify-center items-center gap-5 mb-5"
      >
        <h4 class="text-sm font-medium">Credo Charge</h4>

        <p
          v-text="formatCurrency(payData.ChargeFee || payData.chargeFee)"
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
            @click="startCredoPay()"
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
