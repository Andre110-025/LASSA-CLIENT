<script setup>
import { VueFinalModal } from "vue-final-modal";
import axios from "axios";
import { reactive, ref, computed, defineProps, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import PhotoLoader from "../PhotoLoader.vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import { useUserStore } from "../../../stores/user";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import PaystackPop from "@paystack/inline-js";
import { useHelpers } from "../../../helper";

const loading = ref(false);
const userStore = useUserStore();
const { userDetails } = useUserStore();
const { getWalletData } = useUserStore();
const { formatCurrency, generateRandomRef, channelList, serviceCodeSelector } =
  useHelpers();

const emit = defineEmits(["confirm"]);

const props = defineProps({
  paymentID: String,
});

console.log("Payment ID received in FundWallet:", props.paymentID);

const fundData = reactive({
  transaction_amount: null,
  // transaction_name: null,
  transaction_purpose: null,
  // transaction_date: null,
  // bank_name: null,
  // account_number: null,
  // account_name: null,
  // receipt: null
});

const rules = computed(() => ({
  transaction_amount: { required },
  // transaction_name: { required },
  transaction_purpose: { required },
  // transaction_date: { required },
  // bank_name: { required },
  // account_number: { required },
  // account_name: { required },
  // receipt: { required }
}));

const f$ = useVuelidate(rules, fundData);

// const purpose = [
//   { name: "Onpremise Wallet", value: "Onpremise Wallet" },
//   { name: "Temopary Advert Wallet", value: "Temopary Advert Wallet" },
//   { name: "Outdoor Wallet", value: "Outdoor Wallet" },
//   { name: "Small Format Wallet", value: "Small Format Wallet" },
// ];

const showPurpose = computed(() => {
  const userType = userStore.userDetails.userInfo.user_type;

  if (userType === "first_party") {
    return [
      { name: "Onpremise Wallet", value: "Onpremise Wallet" },
      { name: "Temopary Advert Wallet", value: "Temopary Advert Wallet" },
      { name: "Small Format Wallet", value: "Small Format Wallet" },
    ];
  } else {
    return [
      { name: "Onpremise Wallet", value: "Onpremise Wallet" },
      { name: "Temopary Advert Wallet", value: "Temopary Advert Wallet" },
      { name: "Outdoor Wallet", value: "Outdoor Wallet" },
      { name: "Small Format Wallet", value: "Small Format Wallet" },
    ];
  }
});

const publicKey = ref(false);
const isButtonEnabled = ref(false);

const selectPaymentPurpose = async () => {
  loading.value = true;
  isButtonEnabled.value = false;
  publicKey.value = false;

  if (!fundData.transaction_purpose) return;

  try {
    const response = await axios.post("savewallettransaction", {
      transaction_purpose: fundData.transaction_purpose,
    });
    console.log(response);
    if (response.status === 200) {
      publicKey.value = response.data;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      isButtonEnabled.value = true;
      loading.value = false;
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong while validating.", {
      position: toast.POSITION.TOP_CENTER,
    });
    loading.value = false;
  }
};

watch(
  () => [fundData.transaction_purpose, fundData.transaction_amount],
  ([newPurpose, newAmount], [oldPurpose, oldAmount]) => {
    if (newPurpose && newAmount && (!oldPurpose || !oldAmount)) {
      selectPaymentPurpose();
    }
  },
);

// const showBtn = ref(false);

// const handleWallet = async () => {
//   loading.value = true;
//   showBtn.value = false;

//   try {
//     const balance = Number(userStore.walletDetails.balance);
//     const amountEntered = fundData.transaction_amount;

//     if (amountEntered >= balance) {
//       showBtn.value = true;
//     } else {
//       showBtn.value = false;
//     }
//   } catch (error) {
//     console.log(error);
//     loading.value = false;
//   }
// };

// {
//   "usePaystack": false,
//   "useCredo": true
// }

const chargeFeeCredo = ref(0);
const chargeFeePaystack = ref(0);

const getCredoCharge = () => {
  if (fundData.transaction_amount <= 133333.33) {
    chargeFeeCredo.value = (fundData.transaction_amount * 2) / 100;
  } else {
    chargeFeeCredo.value = 2600;
  }
  return chargeFeeCredo.value;
};

const getPaystackCharge = () => {
  if (fundData.transaction_amount <= 133333.33) {
    chargeFeePaystack.value = (fundData.transaction_amount * 2) / 100;
  } else {
    chargeFeePaystack.value = 2000;
  }

  return chargeFeePaystack.value;
};
const startCredoPay = () => {
  loading.value = true;
  const channel = getCredoCharge();
  const transRef = generateRandomRef();
  const amount = fundData.transaction_amount + getCredoCharge();

  const handler = window.CredoWidget.setup({
    key: publicKey.value.additionalInfoCredo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    currency: "NGN",
    renderSize: 0,
    channels: ["card", "bank"],
    // serviceCode: serviceCodeSelector(channel),
    reference: transRef,
    splitConfiguration: publicKey.value.split_settlement,
    metadata: {
      paymentFor: fundData.transaction_purpose,
      userId: userDetails.userInfo.id,
      amountPaid: fundData.transaction_amount,
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
      loading.value = true;
    },
  });

  handler.openIframe();
};

function startPaystackPay() {
  loading.value = true;
  const paystack = new PaystackPop();
  const amount = fundData.transaction_amount + getPaystackCharge();

  paystack.newTransaction({
    key: import.meta.env.VITE_ENV_STRING + publicKey.value.additionalInfo,
    email: userDetails.userInfo.email,
    amount: amount * 100,
    channels: channelList(amount),
    metadata: {
      paymentFor: fundData.transaction_purpose,
      userId: userDetails.userInfo.id,
      amountPaid: fundData.transaction_amount,
    },
    onSuccess: (transaction) => {
      console.log(transaction);
      setTimeout(() => emit("confirm"), 7000);

      toast.success("Payment Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.success("Kindly check your mail", {
        position: toast.POSITION.TOP_CENTER,
      });
      loading.value = true;
    },
    onCancel: () => {
      toast.error("Payment Cancelled", {
        position: toast.POSITION.TOP_CENTER,
      });
      loading.value = false;
    },
  });
}

const validateForm = async () => {
  const isFormValid = await f$.value.$validate();
  isButtonEnabled.value = isFormValid;
  return isFormValid;
};

// const handlePayment = async (gateway) => {
//   const isValid = await validateForm();
//   if (!isValid) {
//     toast.error("Amount must be entered", {
//       position: toast.POSITION.TOP_CENTER,
//     });
//     return;
//   }

//   if (gateway === "credo") {
//     startCredoPay();
//   } else if (gateway === "paystack") {
//     startPaystackPay();
//   }
// };

const submitWalletPayInfo = async () => {
  loading.value = true;

  const infoWallet = {
    reference_id: `wa${props.paymentID}`,
    payment_id: props.paymentID,
    form_type: fundData.transaction_purpose,
    payment_type: "Wallet",
  };

  // console.log(data);
  try {
    const response = await axios.post("confirmpayment", infoWallet);

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

    // router.push({ name: "RequestLists" });
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
    startPaystackPay();
  } else if (gateway.value === "credo") {
    startCredoPay();
  } else if (gateway.value === "both") {
    startCredoPay();
    startPaystackPay();
  }
};

const paymentDetails = [
  {
    type: "Application Fee",
    accountName: "LASAA APPLICATION PROCESSING FEE ACCOUNT",
    accountNumber: "2001714167",
    bank: "First City Monument Bank",
  },
  {
    type: "Street Lamp Processing Fee", //permit fee
    accountName: "STREET LAMP POLE ACCOUNT",
    accountNumber: "5030046052",
    bank: "Fidelity Bank",
  },
  {
    type: "Street Lamp Poles", // administative
    accountName: "SLP ADMINISTRATIVE/PROCESSING FEE",
    accountNumber: "2001714198",
    bank: "First City Monument Bank",
  },
  {
    type: "Mobile Vehicle Branding",
    accountName: "LASAA MOBILE ADVERT ACCOUNT",
    accountNumber: "0876032049",
    bank: "Guaranty Trust Bank",
  },
  {
    type: "3rd Party Ad",
    accountName: "LASAA BILLBOARD ACCOUNT",
    accountNumber: "0055914693",
    bank: "Access Bank",
  },
  {
    type: "On-Premise Signage",
    accountName: "LAGOS STATE SIGN. & ADVERT. AGENCY - REV",
    accountNumber: "1011119613",
    bank: "Zenith Bank",
  },
];

const selectBank = () => {
  switch (fundData.transaction_purpose) {
    case "Application Fee":
      fundData.account_name = paymentDetails[0].accountName;
      fundData.account_number = paymentDetails[0].accountNumber;
      fundData.bank_name = paymentDetails[0].bank;
      break;

    case "Mobile Adverts":
      fundData.account_name = paymentDetails[3].accountName;
      fundData.account_number = paymentDetails[3].accountNumber;
      fundData.bank_name = paymentDetails[3].bank;
      break;

    case "PAVs":
      fundData.account_name = paymentDetails[3].accountName;
      fundData.account_number = paymentDetails[3].accountNumber;
      fundData.bank_name = paymentDetails[3].bank;
      break;

    case "Street Lamp Processing Fee":
      fundData.account_name = paymentDetails[1].accountName;
      fundData.account_number = paymentDetails[1].accountNumber;
      fundData.bank_name = paymentDetails[1].bank;
      break;

    case "Street Lamp Administrative Fee":
      fundData.account_name = paymentDetails[2].accountName;
      fundData.account_number = paymentDetails[2].accountNumber;
      fundData.bank_name = paymentDetails[2].bank;
      break;

    default:
      fundData.account_name = null;
      fundData.account_number = null;
      fundData.bank_name = null;
      break;
  }
};

const submitFundRequest = async () => {
  f$.value.$touch();
  if (f$.value.$invalid) {
    return;
  }
  loading.value = true;
  try {
    const response = await axios.post("savewallettransaction", fundData);
    console.log(response);
    if (response.status === 200) {
      toast.success("Fund Request Submitted", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getWalletData();
      emit("confirm");
    }
    loading.value = false;
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border rounded-lg space-y-2 w-full sm:w-4/5 sm:min-w-[28.125rem] h-fit min-h-[350px] max-h-[100dvh] max-w-[340px] overflow-y-auto"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="border-b-2 border-dashed">
      <h4 class="px-5 py-5 text-center">Fund Wallet</h4>
    </div>
    <form class="p-10" @submit.prevent>
      <div class="inputHolder">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          id="transaction_amount"
          v-model="fundData.transaction_amount"
          autocomplete="off"
          required
        />
        <label for="transaction_amount" class="inputLabel"
          >Transaction Amount</label
        >
      </div>

      <div class="inputHolder" v-if="false">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="transaction_name"
          v-model="fundData.transaction_name"
          autocomplete="off"
          required
        />
        <label for="transaction_name" class="inputLabel">Depositors Name</label>
      </div>

      <div class="inputHolder">
        <select
          placeholder=" "
          class="input peer"
          id="transaction_purpose"
          v-model="fundData.transaction_purpose"
          required
        >
          <!-- removed from the top -->
          <option
            v-for="(item, index) in showPurpose"
            :key="index"
            :value="item.value"
            v-text="item.name"
          ></option>
        </select>
        <label for="transaction_purpose" class="inputLabel"
          >Select Payment Purpose</label
        >
      </div>

      <div class="mt-5 px-5 text-xs text-justify">
        <span class="text-red-700">
          MOBILE ADVERT CLIENTS, PLEASE DO NOT FUND WALLET!!! DO NOT PUT YOUR
          MONEY IN THE WRONG ACCOUNT!
        </span>
      </div>

      <div class="inputHolder" v-if="false">
        <input
          type="date"
          placeholder=" "
          class="input peer"
          id="transaction_date"
          v-model="fundData.transaction_date"
          autocomplete="off"
          required
        />
        <label for="transaction_date" class="inputLabel">Payment Date</label>
      </div>

      <!-- <div v-if="fundData.transaction_purpose" class="inputHolder">
        <span v-text="fundData.account_name"></span>
        <span v-text="fundData.account_number"></span>
        <span v-text="fundData.bank_name"></span>
      </div> -->

      <PhotoLoader
        v-if="false"
        :label="'transReceipt'"
        @update:photoEncode="
          (base64Content) => (fundData.receipt = base64Content)
        "
      >
        Upload Transaction Receipt
      </PhotoLoader>

      <div
        v-if="fundData.fee"
        class="flex flex-col justify-center items-center gap-5 mb-5"
      >
        <h4 class="text-sm font-medium">Credo Charge</h4>

        <p
          v-text="formatCurrency(fundData.fee)"
          class="font-semibold text-xl"
        ></p>
      </div>

      <div
        class="flex flex-col justify-center items-center gap-3 w-full mt-4 mb-4 px-4"
      >
        <button
          v-if="gateway === 'credo'"
          :disabled="loading || !isButtonEnabled"
          class="p-4 w-full md:w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
          @click="handlePayment()"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay with Credo
          </span>
        </button>

        <!-- Pay with Paystack -->
        <button
          v-if="gateway === 'paystack'"
          :disabled="loading || !isButtonEnabled"
          class="p-4 w-full md:w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
          @click="handlePayment()"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white" v-if="!loading">
            Pay with Paystack
          </span>
        </button>

        <div
          v-if="gateway === 'both'"
          class="flex flex-col md:flex-row justify-center items-center gap-3 w-full"
        >
          <button
            :disabled="loading || !isButtonEnabled"
            class="p-4 w-full md:w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
            @click="startCredoPay()"
          >
            <IconSpinner v-if="loading" />
            <span class="text-sm font-medium text-white" v-if="!loading">
              Pay with Credo
            </span>
          </button>

          <button
            :disabled="loading || !isButtonEnabled"
            class="p-4 w-full md:w-1/2 bg-mainColor text-base rounded-lg text-white font-medium transition-all hover:opacity-90"
            @click="startPaystackPay()"
          >
            <IconSpinner v-if="loading" />
            <span class="text-sm font-medium text-white" v-if="!loading">
              Pay with Paystack
            </span>
          </button>
        </div>
      </div>
    </form>
  </VueFinalModal>
</template>

<style scoped>
.disclaimer {
  color: #dc2626; /* Tailwind red-600 equivalent */
}
</style>