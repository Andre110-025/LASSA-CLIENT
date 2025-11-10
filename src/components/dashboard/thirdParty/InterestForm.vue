<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { useUserStore } from "../../../stores/user";
import CompanyInfo from "../CompanyInfo.vue";
import CompanyDocument from "../CompanyDocument.vue";
import CompanyNotice from "../CompanyNotice.vue";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, numeric } from "@vuelidate/validators";
import { useModal } from "vue-final-modal";
import EoiRegFee from "../popups/EoiRegFee.vue";

const router = useRouter();

const props = defineProps({
  editable: Boolean
})

const emit = defineEmits(['changeEdit']);

const { getUserData, userDetails } = useUserStore();
const kycData = userDetails.userInfo.kyc_third_party;

const kycStep = ref(1);
const progressPercent = computed(() => {
  if (kycStep.value === 2) return 50;
  else if (kycStep.value === 3) return 100;
  else return 0;
});

const loading = ref(false);

const interestData = reactive({
  companyname: null,
  nearestbustop: null,
  lga: null,
  employeecount: null,
  officeaddress: null,
  companytype: null,
  companyprofile: null,
  technicalcompetence: null,
  technicalpartner: null,
  cacfile: null,
  apconfile: null,
  outdoorfile: null,
  auditfile: null,
  listpastproject: null,
  taxcertificate: null,
  evidenceoffinance: null,
  businessplan: null,
  director_bank_statement: null,
  preliminarydesign: null,
  bankreference: null,
  technicalreference: null,
  terms: false,
});

const ruleOne = computed(() => ({
  companyname: {
    required,
  },
  nearestbustop: {
    required,
  },
  lga: {
    required,
  },
  employeecount: {
    required,
    numeric,
  },
  officeaddress: {
    required,
  },
  companytype: {
    required,
  },
}));

const r1$ = useVuelidate(ruleOne, interestData);

// const ruleTwo = computed(() => ({
//   companyprofile: {
//     required
//   },
//   technicalcompetence: {
//     requirePartner: requiredIf(!interestData.technicalpartner)
//   },
//   technicalpartner: {
//     requireCompetence: requiredIf(!interestData.technicalcompetence)
//   },
//   cacfile: {
//     required
//   },
//   apconfile: {
//     required
//   },
//   outdoorfile: {
//     required
//   },
//   auditfile: {
//     requireAudit: requiredIf(interestData.companyprofile === 'Existing Company')
//   },
//   listpastproject: {
//     required
//   },
//   taxcertificate: {
//     required
//   },
//   evidenceoffinance: {
//     required
//   },
//   businessplan: {
//     required
//   },
//   director_bank_statement: {
//     required
//   },
//   preliminarydesign: {
//     required
//   },
//   bankreference: {
//     required
//   },
//   technicalreference: {
//     required
//   },
// }))

// const r2$ = useVuelidate(ruleTwo, interestData);

const completeKycProcess = async () => {
  await getUserData();
  loading.value = false;
  toast.warning("Expression of Interest Submitted", {
    position: toast.POSITION.TOP_CENTER,
  });

  router.push({ name: "Overview" });
}

const { open: openRegPay, close: closeRegPay } = useModal({
  component: EoiRegFee,
  attrs: {
    onConfirm(bool) {
      if (bool) {
        completeKycProcess()
      }
      closeRegPay();
    },
    // regData: interestData,
  },
  slots: {},
});

const submitUpdate = async () => {
  loading.value = true;
  try {
    const { data } = await axios.post(
      `editthirdpartykyc/${kycData.id}/all`,
      interestData
    );
    console.log(data);
    if (data.success) {
      toast.success("Update Successful", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getUserData();      
      emit("changeEdit");
    }
  } catch (error) {
    if (!error.response.data.success) {
      toast.error(error.response.data.data, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loading.value = false;
  }
};

const submitInterestData = async () => {
  if (props.editable) {
    submitUpdate()
    return
  }
  loading.value = true;
  try {
    const response = await axios.post("kycthirdparty", interestData);
    console.log(response);
    if (response.status === 201) {
      toast.success("Expression of Interest Saved", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.warning("Kindly Pay Application Fee", {
        position: toast.POSITION.TOP_CENTER,
      });

      openRegPay();
    }
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);

    loading.value = false;
  }
};

onMounted(() => {
  if (kycData && kycData?.operation_status !== 'approved') {
    interestData.companyname = kycData.company_name 
    interestData.nearestbustop = kycData.nearest_bustop
    interestData.lga = kycData.lga
    interestData.employeecount = kycData.employee_count
    interestData.officeaddress = kycData.office_address
    interestData.companytype = kycData.company_type
  }
})
</script>

<template>
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h5 class="text-center font-medium mb-10">
      Practitioner Registration Form
    </h5>

    <!-- Progress bar -->
    <div class="progressbar max-w-md mx-auto">
      <div
        :style="{ width: progressPercent + '%' }"
        class="progress"
        id="progress"
      ></div>

      <div
        class="progress-step progress-step-active"
        data-title="Information"
      ></div>
      <div
        class="progress-step"
        :class="{ 'progress-step-active': kycStep >= 2 }"
        data-title="Document"
      ></div>
      <div
        class="progress-step"
        :class="{ 'progress-step-active': kycStep === 3 }"
        data-title="Notice"
      ></div>
    </div>

    <form @submit.prevent="submitInterestData" class="max-w-md mx-auto">
      <CompanyInfo
        v-model:interestData="interestData"
        :kyc-step="kycStep"
        v-if="kycStep == 1"
        @move-next="kycStep++"
        :checker="r1$.$invalid"
      />

      <CompanyDocument
        v-model:interestData="interestData"
        :kyc-step="kycStep"
        v-if="kycStep == 2"
        @move-next="kycStep++"
      />

      <CompanyNotice v-model:interestData="interestData" v-if="kycStep == 3" />

      <div v-if="kycStep == 3" class="flex flex-row gap-5">
        <input
          type="checkbox"
          name="terms"
          class="mt-1.5"
          v-model="interestData.terms"
          id="terms"
          required
        />
        <label for="terms" class="text-xs"
          >I declare that I am the duly authorized agent or owner of the
          business/Company that has submitted this application to practice
          outdoor advertising in Lagos State. I hereby verify that all
          information provided is true and and accurate, and understand that
          false or misleading information provided by me in the course of this
          application will result in automatic disqualification and attract a
          penalty which I undertake to pay. I agree to notify the Agency of any
          change in my mailing address, status and/or telephone number.</label
        >
      </div>

      <div class="my-5 px-5" v-if="kycStep == 3">
        <button
          :disabled="loading || !interestData.terms"
          type="submit"
          class="blueBtn w-full mx-auto rounded-none"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-sm font-medium text-white tracking-wider"
            v-if="!loading"
            >Submit</span
          >
        </button>
      </div>
    </form>

    <!-- <div v-else>
      <h5 class="font-medium text-center px-5 my-10">You have a pending Application</h5>
    </div> -->
  </div>
  
</template>

<style scoped>
/* Progressbar */
.progressbar {
  position: relative;
  display: flex;
  justify-content: space-between;
  counter-reset: step;
  margin-block: 2rem 4rem;
  --primary-color: #020f54;
  isolation: isolate;
}

.progressbar::before,
.progress {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  width: 100%;
  background-color: #dcdcdc;
  z-index: -1;
}

.progress {
  background-color: var(--primary-color);
  width: 0%;
  transition: 0.3s;
}

.progress-step {
  width: 2.1875rem;
  height: 2.1875rem;
  background-color: #dcdcdc;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-step::before {
  counter-increment: step;
  content: counter(step);
}

.progress-step::after {
  content: attr(data-title);
  position: absolute;
  top: calc(100% + 0.5rem);
  font-size: 0.85rem;
  color: #666;
}

.progress-step-active {
  background-color: var(--primary-color);
  color: #f3f3f3;
}
</style>