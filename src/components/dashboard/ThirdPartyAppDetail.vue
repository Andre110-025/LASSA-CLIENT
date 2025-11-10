<script setup>
import { ref } from "vue";
// import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import { useUserStore } from "../../stores/user";
import { useHelpers } from "../../helper";
import ThirdPartyLicenseFee from "./popups/ThirdPartyLicenseFee.vue";
import EoiRegFee from "./popups/EoiRegFee.vue";

const userStore = useUserStore();
const { formatDate } = useHelpers();

// const route = useRoute();

const pageData = ref(userStore.userDetails.userInfo.kyc_third_party);
const loading = ref(false);
const loadingAction = ref(false);
const url = import.meta.env.VITE_API_URL;

// Score Popup

const { open: openGetLicense, close: closeGetLicense } = useModal({
  component: ThirdPartyLicenseFee,
  attrs: {
    kycId: pageData.value.id,
    onConfirm(bol) {
      if (bol) {
        // getAppInfo();
        window.location.reload();
      }
      closeGetLicense();
    },
  },
  slots: {},
});

const emit = defineEmits(["edit", "editA", "editL", "editR"]);

const { open: openRegPay, close: closeRegPay } = useModal({
  component: EoiRegFee,
  attrs: {
    onConfirm(bool) {
      if (bool) {
        completeKycProcess();
      }
      closeRegPay();
    },
    // regData: interestData,
  },
  slots: {},
});
</script>

<template>
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">
      THIRD PARTY PRACTITIONER APPLICATION DETAILS
    </h4>
    <!-- General info -->
    <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Company Name</p>
        <p class="text-sm" v-text="pageData.company_name"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Company Type</p>
        <p class="text-sm" v-text="pageData.company_type"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Employee Count</p>
        <p class="text-sm" v-text="pageData.employee_count"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Local Government</p>
        <p class="text-sm" v-text="pageData.lga"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Full Address</p>
        <p class="text-sm" v-text="pageData.office_address"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Nearest Bus Stop</p>
        <p class="text-sm" v-text="pageData.nearest_bustop"></p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.operation_status"
      >
        <p class="w-2/5 text-sm font-semibold">Operations Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.operation_status" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.legal_status">
        <p class="w-2/5 text-sm font-semibold">Legal Approval</p>
        <p class="text-sm"><IconAppStatus :status="pageData.legal_status" /></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.account_status">
        <p class="w-2/5 text-sm font-semibold">Account Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.account_status" />
        </p>
      </div>

      <div
        class="flex xs:flex-row align-middle"
        v-if="pageData.registry_status"
      >
        <p class="w-2/5 text-sm font-semibold">Registry Approval</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.registry_status" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.hod_status">
        <p class="w-2/5 text-sm font-semibold">HOD Approval</p>
        <p class="text-sm"><IconAppStatus :status="pageData.hod_status" /></p>
      </div>

      <div class="flex xs:flex-row align-middle" v-if="pageData.md_status">
        <p class="w-2/5 text-sm font-semibold">MD Approval</p>
        <p class="text-sm"><IconAppStatus :status="pageData.md_status" /></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Date</p>
        <p class="text-sm" v-text="formatDate(pageData.created_at)"></p>
      </div>

      <div v-if="pageData.user" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Customer ID</p>
        <p class="text-sm" v-text="pageData.user.id"></p>
      </div>

      <div>
        <RouterLink
          class="italic font-semibold text-sm underline"
          :to="{
            name: 'ViewDownloads',
            params: {
              id: pageData.id,
              app_type: 'getkycformatdownloadables',
            },
          }"
          >Click to view LASAA Issued Documents</RouterLink
        >
      </div>
    </div>

    <!-- Supporting Document -->

    <div class="p-6 space-y-4">
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Supporting Document
      </h6>

      <div class="flex flex-col gap-2" v-if="pageData.company_profile">
        <p class="text-sm font-semibold">Company Profile</p>
        <embed
          :src="pageData.company_profile"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.technical_competence">
        <p class="text-sm font-semibold">Technical Competence</p>
        <embed
          :src="pageData.technical_competence"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.technical_partner">
        <p class="text-sm font-semibold">Technical Partner</p>
        <embed
          :src="pageData.technical_partner"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.cac_document">
        <p class="text-sm font-semibold">CAC Certificate</p>
        <embed
          :src="pageData.cac_document"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.apcon_document">
        <p class="text-sm font-semibold">Apcon Certificate</p>
        <embed
          :src="pageData.apcon_document"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.outdoor_association">
        <p class="text-sm font-semibold">Outdoor Association Certificate</p>
        <embed
          :src="pageData.outdoor_association"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.audit_report">
        <p class="text-sm font-semibold">Audit Report</p>
        <embed
          :src="pageData.audit_report"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.list_past_project">
        <p class="text-sm font-semibold">List of Past Project</p>
        <embed
          :src="pageData.list_past_project"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.tax_clearance">
        <p class="text-sm font-semibold">Tax Clearance</p>
        <embed
          :src="pageData.tax_clearance"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.evidence_finance">
        <p class="text-sm font-semibold">Financial Evidence</p>
        <embed
          :src="pageData.evidence_finance"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.business_plan">
        <p class="text-sm font-semibold">Business Plan</p>
        <embed
          :src="pageData.business_plan"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.director_bank_statement">
        <p class="text-sm font-semibold">Director's Bank Statement</p>
        <embed
          :src="pageData.director_bank_statement"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div
        class="flex flex-col gap-2"
        v-if="pageData.preliminary_technical_design"
      >
        <p class="text-sm font-semibold">Preliminary Technical Design</p>
        <embed
          :src="pageData.preliminary_technical_design"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div
        class="flex flex-col gap-2"
        v-if="pageData.bank_or_corporate_reference"
      >
        <p class="text-sm font-semibold">Bank or Corporate Reference</p>
        <embed
          :src="pageData.bank_or_corporate_reference"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
      <div class="flex flex-col gap-2" v-if="pageData.technical_reference">
        <p class="text-sm font-semibold">Technical Reference</p>
        <embed
          :src="pageData.technical_reference"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
    </div>

    <!-- Actions -->
    <div
      class="flex flex-row justify-center px-6 gap-4 my-10"
      v-if="!pageData.operation_status"
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-mainColor text-white mx-auto"
        @click="openRegPay()"
      >
        Pay Registration Fee
      </button>
    </div>
    <div
      class="flex flex-row justify-center px-6 gap-4 my-10"
      v-if="
        pageData.operation_status === 'pending' ||
        pageData.account_status === 'disapproved'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-mainColor text-white mx-auto"
        @click="emit('edit')"
        v-if="pageData.operation_status === 'pending'"
      >
        Edit Application
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        @click="emit('editA')"
        class="w-full blueBtn border-2 bg-mainColor text-white mx-auto"
        v-if="pageData.account_status === 'disapproved'"
      >
        Edit Account Documents
      </button>
    </div>

    <div
      class="flex flex-row justify-center px-6 gap-4 my-10"
      v-if="
        pageData.legal_status === 'disapproved' ||
        pageData.registry_status === 'disapproved'
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="w-full blueBtn border-2 bg-mainColor text-white mx-auto"
        @click="emit('editL')"
        v-if="pageData.legal_status === 'disapproved'"
      >
        Edit Legal Documents
      </button>

      <button
        :disabled="loadingAction"
        type="submit"
        @click="emit('editR')"
        class="w-full blueBtn border-2 bg-mainColor text-white mx-auto"
        v-if="pageData.registry_status === 'disapproved'"
      >
        Edit Registry Documents
      </button>
    </div>

    <!-- Get License -->

    <div
      class="flex flex-row justify-center px-6 gap-4 my-10"
      v-if="
        pageData.hod_status === 'approved' &&
        (!pageData.license_fee_status ||
          pageData.license_fee_status === 'not_paid')
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        class="blueBtn w-4/5 border-2 bg-mainColor text-white mx-auto"
        @click="openGetLicense()"
      >
        Get License
      </button>
    </div>

    <div v-if="false" class="flex flex-row justify-center gap-4 pb-5">
      <a
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        :href="`${url}getcertificate/${pageData.id}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download Permit Letter
      </a>
    </div>
  </div>
</template>

<style scoped>
div.fxfcol > div.flex {
  @apply gap-2 2md:flex-row flex-col;
}
div.fxfcol > div > p:nth-of-type(1) {
  @apply 2md:w-[40%] w-full;
}
div.fxfcol > div > p:nth-of-type(2) {
  @apply 2md:w-[60%] w-full;
}
</style>
