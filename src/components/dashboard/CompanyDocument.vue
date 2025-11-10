<script setup>
import DocumentLoader from "./DocumentLoader.vue";

defineProps({
  kycStep: {
    require: true,
    type: Number,
  },
  // checker: Boolean
});
defineEmits(["moveNext"]);
const interestData = defineModel("interestData");
</script>

<template>
  <div>
    <h5>Supporting Document</h5>

    <DocumentLoader
      label="companyprofile"
      @update:fileEncode="
        (base64Content) => (interestData.companyprofile = base64Content)
      "
    >
      Company Profile(Including Ownership Structure and Management Team)
    </DocumentLoader>

    <DocumentLoader
      label="auditfile"
      @update:fileEncode="
        (base64Content) => (interestData.auditfile = base64Content)
      "
    >
      3 Years Audited Accounts of the firm/Consultant Firm.
    </DocumentLoader>

    <DocumentLoader
      label="listpastproject"
      @update:fileEncode="
        (base64Content) => (interestData.listpastproject = base64Content)
      "
    >
      List of Similar projects undertaken by the firm/Consultants
    </DocumentLoader>

    <h5 class="font-medium px-5 my-5">
      Evidence of Technical Competence (Anyone of below)
    </h5>

    <DocumentLoader
      label="technicalcompetence"
      @update:fileEncode="
        (base64Content) => (interestData.technicalcompetence = base64Content)
      "
    >
      Evidence of technical competence, experience and tract record.
    </DocumentLoader>

    <DocumentLoader
      label="technicalpartner"
      @update:fileEncode="
        (base64Content) => (interestData.technicalpartner = base64Content)
      "
    >
      Track record of Technical Partner/Consultants to be responsible for
      development/management
    </DocumentLoader>

    <h5 class="font-medium px-5 my-5">
      Evidence of registration for the following authority
    </h5>

    <DocumentLoader
      label="cacfile"
      @update:fileEncode="
        (base64Content) => (interestData.cacfile = base64Content)
      "
    >
      Corporate Affair Commission.
    </DocumentLoader>

    <DocumentLoader
      label="apconfile"
      @update:fileEncode="
        (base64Content) => (interestData.apconfile = base64Content)
      "
    >
      Advertising Practitioner Council of Nigeria.
    </DocumentLoader>

    <DocumentLoader
      label="outdoorfile"
      @update:fileEncode="
        (base64Content) => (interestData.outdoorfile = base64Content)
      "
    >
      Outdoor Advertising Association of Nigeria.
    </DocumentLoader>

    <h5 class="font-medium px-5 my-5">
      Relevant Government Clearance(s) Certificate
    </h5>

    <DocumentLoader
      label="taxcertificate"
      @update:fileEncode="
        (base64Content) => (interestData.taxcertificate = base64Content)
      "
    >
      3 years Tax clearance Certificate of the company ( or of the Principal
      Director in case of new company)
    </DocumentLoader>

    <DocumentLoader
      label="evidenceoffinance"
      @update:fileEncode="
        (base64Content) => (interestData.evidenceoffinance = base64Content)
      "
    >
      Evidence of good source of Finance. (Minimum of 25 Million Naira e.g.
      Share Certificate, Fixed Deposit, Treasury bill e.t.c)
    </DocumentLoader>

    <DocumentLoader
      label="businessplan"
      @update:fileEncode="
        (base64Content) => (interestData.businessplan = base64Content)
      "
    >
      Clear and Workable business plan. e.g. Financial Plan, Management Plan,
      and Technical plan
    </DocumentLoader>

    <DocumentLoader
      label="director_bank_statement"
      @update:fileEncode="
        (base64Content) => (interestData.director_bank_statement = base64Content)
      "
    >
      Bank Statement of the Principal Director of the company certified by the
      bank (In case of New Company)
    </DocumentLoader>

    <DocumentLoader
      label="preliminarydesign"
      @update:fileEncode="
        (base64Content) => (interestData.preliminarydesign = base64Content)
      "
    >
      Preliminary Samples or Technical Designs.
    </DocumentLoader>

    <DocumentLoader
      label="bankreference"
      @update:fileEncode="
        (base64Content) => (interestData.bankreference = base64Content)
      "
    >
      Bank Reference and Corporate Organization Reference
    </DocumentLoader>

    <DocumentLoader
      label="technicalreference"
      @update:fileEncode="
        (base64Content) => (interestData.technicalreference = base64Content)
      "
    >
      Technical Reference (Must be COREN Registered).
    </DocumentLoader>

    <div class="mt-5">
      <button
        type="button"
        class="blueBtn min-w-[200px] mx-auto"
        @click="$emit('moveNext')"
      >
        <span class="text-sm font-medium text-white tracking-wider">Next</span>
      </button>
    </div>
  </div>
</template>
