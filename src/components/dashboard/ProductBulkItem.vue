<script setup>
import { ref } from "vue";
import { useHelpers } from "../../helper";
import PaystackPop from "@paystack/inline-js";
import { useUserStore } from "../../stores/user";
import { toast } from "vue3-toastify";
import axios from "axios";
import IconSpinner from "../icons/IconSpinner.vue";
import { useModal } from "vue-final-modal";
import PaymentForBulk from "./popups/PaymentForBulk.vue";

const { formatCurrency, channelList, generateRandomRef, serviceCodeSelector } = useHelpers();

const { userDetails } = useUserStore();

const isLoading = ref(false);
const loading = ref(false);
const payData = ref(null);

const props = defineProps({
  title: {
    type: String,
  },
  type: String,
});

const getUrl = () => {
  if (props.type === "Onpremise") {
    return "bulkonpremisepermitfeepayment";
  } else if (props.type === "OutDoor Site") {
    return "getbulkarrearsforoutdoor";
  } else if (props.type === "SmallFormat Details") {
    return "getbulksmallformatdetailsarrears"
  }
};

const getPayment = async () => {
  try {
    isLoading.value = true;

    const { data } = await axios.get(getUrl());

    console.log(data);

    if (data.success) {
      payData.value = data;
      isLoading.value = false;
    }
  } catch (error) {
    // emit("confirm");
    isLoading.value = false;
  }
};

const startCredoPayment = () => {
  const amount = payData.value.total_price + payData.value.ChargeFee;
  const transRef = generateRandomRef()
  const channel = payData.value.ChargeFee;

    const simpleMeta = {
      paymentFor: "Permit Bill",
      appType: props.type,
      appPurpose: "Bulk Payment",
      permitFee: payData.value.total_price,
    }

    if (Array.isArray(payData.value.applicationId)) {
      simpleMeta.customFields = [
        {
          variable_name: "applicationId",
          display_name: "application Id",
          value: Array.isArray(payData.value.applicationId) ? payData.value.applicationId.join(", ") : payData.value.applicationId,
        },
      ]
    }

    console.log(simpleMeta)
    // return;

  const handler = window.CredoWidget.setup({
    key: payData.value.additionalInfoCredo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    // serviceCode: serviceCodeSelector(channel),
    reference: transRef,
    splitConfiguration: payData.value.split_settlement,
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
      // window.location.href = response.callbackUrl
      setTimeout(() => emit("confirm"), 10000);

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });
    },
  });

  handler.openIframe();
}

function startPayment() {
  const paystack = new PaystackPop();

  const amount = payData.value.total_price + payData.value.ChargeFee;

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + payData.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
      paymentFor: "Permit Bill",
      applicationId: payData.value.applicationId,
      appType: props.type,
      appPurpose: "Bulk Payment",
      permitFee: payData.value.total_price,
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      // const data = {
      //   reference_id: transaction.reference,
      //   payment_id: props.paymentID,
      //   form_type: props.formType,
      //   payment_type: "Paystack",
      // };

      setTimeout(() => getPayment(), 7000);

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
    },
  });
}

getPayment();

function bulkPayment() {
  const { open, close } = useModal({
    component: PaymentForBulk,
    attrs: {
      onConfirm() {
        close();
        getPayment()
      },
      type: props.type,
      amount: payData.value.total_price,
      chargeFee: payData.value.ChargeFee,
      cKey: payData.value.additionalInfoCredo,
      pKey: payData.value.additionalInfo,
      split: payData.value.split_settlement,
      appID: payData.value.applicationId,
    }
  });

  open();
}
</script>

<template>
  <div
    class="bg-indigo-100 grow bg-opacity-25 py-2.5 px-3.5 border border-blue-300 rounded-xl max-w-[320px]"
  >
    <div v-if="isLoading" class="h-10 flex justify-center items-center">
      <div
        class="animate-spin rounded-full h-8 w-8 border-2 border-mainColor border-t-transparent"
      ></div>
    </div>
    <div v-else>
      <p class="mb-3.5 font-medium" v-text="title"></p>

      <span class="text-sm">Total Permit Bill</span>
      <h4>{{ formatCurrency(payData.total_price) }}</h4>

      <div
        v-if="payData.total_price > 1000"
        class="mt-5 flex flex-col items-center"
      >
        <button @click="bulkPayment()" class="blueBtn max-w-[200px] w-full">
          Pay Now
        </button>

        <span class="italic text-red-500 text-xs block mt-2"
          >{{ formatCurrency(payData.ChargeFee) }} charge applies</span
        >
      </div>
    </div>
  </div>
</template>
