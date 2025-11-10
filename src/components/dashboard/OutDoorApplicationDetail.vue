<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
import { useModal } from "vue-final-modal";
import CompleteAppPay from "./popups/CompleteAppPay.vue";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../helper";
import OutdoorEditGeneral from "./OutdoorEditGeneral.vue";
import OutDoorEditSpec from "./OutDoorEditSpec.vue";
import OutDoorSecondDoc from "./OutDoorSecondDoc.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import OffChargeExpunge from "./OffChargeExpunge.vue";
import OutDoorDebt from "./OutDoorDebt.vue";
import UpDownGradeOutdoor from "./popups/UpDownGradeOutdoor.vue";
import UpDownGradeComp from "./UpDownGradeComp.vue";
import TransferOwnership from "./popups/TransferOwnership.vue";
import AppealApplication from "./popups/AppealApplication.vue";
import TransferComp from "./TransferComp.vue";
import OffExpungeComp from "./OffExpungeComp.vue";

const route = useRoute();
const router = useRouter();

const { dateToSlash } = useHelpers();

const pageData = ref(null);
const showSomeActions = ref(false);
const showActions = ref(false);
const loading = ref(false);
const offExpungeData = ref(null);
const upDownGradeData = ref(null);
const transferData = ref(null);
const loadingAction = ref(false);
const editGen = ref(false);
const editSpec = ref(false);
const haveArrears = ref(null);

const getAppInfo = async () => {
  loading.value = true;

  try {
    const { data } = await axios.get(`getoneoutdoor/${route.params.id}`);
    console.log(data)

    if (!data.data) {
      router.push({ name: "RequestLists" });
    }

    if (data.success) {
      pageData.value = data.data;
      showSomeActions.value = data.show;
      showActions.value = data.new_year_bill;
      upDownGradeData.value =
        data.data.third_party_upgrade_and_downgrade[0] || null;
      transferData.value = data.data.third_party_outdoor_transfer[0] || null;
      offExpungeData.value =
        data.data.third_party_off_charge_and_expunction[0] || null;

      loading.value = false;
    }
  } catch (error) {}
};

const submitUpdate = async () => {
  try {
    loadingAction.value = true;

    const { data } = await axios.post(
      `outdoorsubmitbutton/${pageData.value.id}`
    );
    console.log(data);

    if (data.success) {
      toast.success("Application Updated", {
        position: toast.POSITION.TOP_CENTER,
      });

      await getAppInfo();
      loadingAction.value = false;
    }
  } catch (error) {
    if (error.response?.data.error) {
      toast.error(error.response.data.error, {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      toast.error("Update Could not be submitted", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
    loadingAction.value = false;
  }
};

getAppInfo();

const appPayPurpose = () => {
  return upDownGradeData.value
    ? "upgrade/downgrade"
    : "Application for New Sign";
};

const appPayID = () => {
  return upDownGradeData.value
    ? upDownGradeData.value.payment_id
    : pageData.value.payment_id;
};

const appType = () => {
  return upDownGradeData.value ? "OutdoorRequest" : "OutdoorSite";
};

function completePayment() {
  const { open, close } = useModal({
    component: CompleteAppPay,
    attrs: {
      onConfirm() {
        close();
        getAppInfo();
      },
      paymentID: appPayID(),
      formType: appType(),
      appPurpose: appPayPurpose(),
    },
    slots: {},
  });

  open();
}

const { open: openTransfer, close: closeTransfer } = useModal({
  component: TransferOwnership,
  attrs: {
    onConfirm(bol) {
      if (bol) {
        getAppInfo();
      }
      closeTransfer();
    },
  },
});

const openUpDownGrade = (signName) => {
  const { open, close } = useModal({
    component: UpDownGradeOutdoor,
    attrs: {
      signType: signName || pageData.value?.type_sign,
      onConfirm(bol) {
        if (bol) {
          getAppInfo();
        }
        close();
      },
    },
  });

  open();
};

const { open: openAppeal, close: closeAppeal } = useModal({
  component: AppealApplication,
  attrs: {
    onConfirm(bol) {
      if (bol) {
        getAppInfo();
      }
      closeAppeal();
    },
  },
});

const checkArrears = () => {
  if (haveArrears.value) {
    toast.error("Arrears Must be Paid before Transfer", {
      position: toast.POSITION.TOP_CENTER,
    });
  } else openTransfer();
};
</script>

<template>
  <span
    v-if="pageData?.application_certify_status === 'disapproved'"
    class="fixed bg-red-100 w-fit py-1 px-2 rounded select-none text-sm font-medium text-[#f00] top-24 right-3"
    >This is a Draft</span
  >
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">OUTDOOR SITE APPLICATION DETAILS</h4>

    <!-- General info -->
    <div
      v-if="!editGen"
      class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2"
    >
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Date</p>
        <p class="text-sm" v-text="dateToSlash(pageData.created_at)"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Purpose of Application</p>
        <p
          class="text-sm"
          v-text="pageData.purpose_application || 'Application for a new Site'"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Payment ID</p>
        <p class="text-sm" v-text="pageData.payment_id"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Sign Type</p>
        <p class="text-sm" v-text="pageData.type_sign"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Address</p>
        <p class="text-sm" v-text="pageData.address_proposed_site"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">LGA</p>
        <p class="text-sm" v-text="pageData.lga"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Application Status</p>
        <p class="text-sm">
          <IconAppStatus :status="pageData.application_certify_status" />
        </p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Latitude</p>
        <p class="text-sm" v-text="pageData.latitude"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Longitude</p>
        <p class="text-sm" v-text="pageData.longitude"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">North Coordinate</p>
        <p class="text-sm" v-text="pageData.north"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">East Coordinate</p>
        <p class="text-sm" v-text="pageData.east"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Property Owner</p>
        <p class="text-sm" v-text="pageData.property_owner_name"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Owner Email</p>
        <p class="text-sm" v-text="pageData.property_owner_email"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Owner Phone</p>
        <p class="text-sm" v-text="pageData.property_owner_phone"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Owner Consent</p>
        <p
          class="text-sm"
          v-text="pageData.property_owner_consent === 1 ? 'Yes' : 'No'"
        ></p>
      </div>

      <div
        class="flex gap-2"
        style="flex-direction: column"
        v-if="pageData.property_owner_signature"
      >
        <p class="text-sm font-semibold">Property Owner Signature</p>
        <img
          :src="pageData.property_owner_signature"
          alt=""
          class="w-full bg-gray-600"
        />
      </div>

      <div>
        <RouterLink
          class="italic font-semibold text-sm underline"
          :to="{
            name: 'ViewDownloads',
            params: { id: pageData.id, app_type: 'getoutdoordownloadables' },
          }"
          >Click to view LASAA Issued Documents</RouterLink
        >
      </div>

      <div
        class="flex flex-row justify-center px-6"
        v-if="pageData.application_certify_status === 'disapproved'"
      >
        <button
          @click="editGen = true"
          class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        >
          Edit General Info
        </button>
      </div>
    </div>

    <div v-else class="pt-6 border-gray-300 border-t-2">
      <OutdoorEditGeneral
        :app-info="pageData"
        @update="getAppInfo(), (editGen = false)"
      />
    </div>

    <!-- Outdoor Site Spec -->
    <div v-if="!editSpec" class="flex flex-col p-6 gap-4">
      <div>
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          Outdoor Site Specifications
        </h6>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Signage Format</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.signage_format"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Signage Interaction</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.sign_interaction"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Signage Illumination</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.sign_illumination"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of faces</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.number_faces"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Sign Dimension</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.dimension_sign"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Structure Height</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.height_structure"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Length</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.length_sign"
        ></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Breadth</p>
        <p
          class="text-sm"
          v-text="pageData.third_party_outdoor_sign_details.breadth_sign"
        ></p>
      </div>

      <div class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img
          :src="pageData.third_party_outdoor_sign_details.photomontage"
          alt=""
          class="w-full bg-gray-600"
        />
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.location_map"
        class="flex flex-col gap-2"
      >
        <p class="w-2/5 text-sm font-semibold">Location Map</p>
        <embed
          :src="pageData.third_party_outdoor_sign_details.location_map"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.structural_drawing"
        class="flex flex-col gap-2"
      >
        <p class="w-2/5 text-sm font-semibold">Structural Drawing</p>
        <embed
          :src="pageData.third_party_outdoor_sign_details.structural_drawing"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <div
        v-if="pageData.third_party_outdoor_sign_details.eia"
        class="flex flex-col gap-2"
      >
        <p class="w-2/5 text-sm font-semibold">EIA</p>
        <embed
          :src="pageData.third_party_outdoor_sign_details.eia"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <div
        class="flex flex-row justify-center px-6"
        v-if="pageData.application_certify_status === 'disapproved'"
      >
        <button
          @click="editSpec = true"
          class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        >
          Edit Site Specifications
        </button>
      </div>
    </div>

    <OutDoorEditSpec
      v-else
      :app-id="pageData.id"
      :app-info="pageData.third_party_outdoor_sign_details"
      @update="getAppInfo(), (editSpec = false)"
    />

    <!-- Off CHarge Expunge -->
    <OffExpungeComp
      v-if="
        ((pageData.ongoing_request === 'offcharge' ||
          pageData.ongoing_request === 'expunction') &&
          offExpungeData) ||
        ((pageData.active_status === 'off_charge' ||
          pageData.active_status === 'expunction') &&
          offExpungeData)
      "
      :offExpungeData="offExpungeData"
    />

    <!-- Upgrade/DownGrade -->
    <UpDownGradeComp
      v-if="
        ((pageData.ongoing_request === 'upgrade' ||
          pageData.ongoing_request === 'downgrade') &&
          upDownGradeData) ||
        ((pageData.active_status === 'upgrade' ||
          pageData.active_status === 'downgrade') &&
          upDownGradeData)
      "
      :upDownGradeData="upDownGradeData"
      :adsPrice="pageData.third_party_outdoor_sign_details.ads_price"
      :legalFee="pageData.third_party_outdoor_sign_details.legal_fee"
    />

    <!-- Site Transfer -->
    <TransferComp
      v-if="
        (pageData.ongoing_request === 'transfer' && transferData) ||
        (pageData.active_status === 'transfer' && transferData)
      "
      :transferData="transferData"
      @updateApp="getAppInfo()"
    />

    <OutDoorDebt
      v-if="pageData.hod_bill_generate === 'approved'"
      :appID="pageData.id"
      :paymentID="pageData.payment_id"
      :ownerId="pageData.user_id"
      @setArrears="haveArrears = $event"
    />

    <div class="flex flex-row justify-center gap-4 pb-4 px-6">
      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="completePayment()"
        v-if="
          pageData.application_pay_status === 'not_paid' ||
          upDownGradeData?.application_status === 'pending'
        "
      >
        Pay Application Fee
      </button>

      <button
        class="p-3 bg-mainColor text-sm rounded-md text-white w-44"
        @click="submitUpdate()"
        :disabled="loadingAction"
        v-if="pageData.application_certify_status === 'disapproved'"
      >
        <IconSpinner v-if="loadingAction" />
        <span
          class="text-xs text-center font-medium text-white tracking-wider"
          v-if="!loadingAction"
        >
          Submit Update
        </span>
      </button>
    </div>

    <OffChargeExpunge
      @getApp="getAppInfo()"
      v-if="
        pageData.bill_generated &&
        !pageData.ongoing_request &&
        (pageData.active_status === 'off_charge' ||
          pageData.active_status !== 'expunction') &&
        pageData.first_permit_pay
      "
      :activeStatus="pageData.active_status === 'off_charge'"
    />

    <!-- Up/Down Grade -->
    <div
      class="flex flex-row justify-center px-6 gap-4 my-10"
      v-if="
        pageData.bill_generated &&
        !pageData.ongoing_request &&
        (pageData.active_status === 'off_charge' ||
          pageData.active_status !== 'expunction') &&
        pageData.first_permit_pay &&
        showActions
      "
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openUpDownGrade(pageData.type_sign)"
        class="w-full blueBtn border-2 bg-mainColor text-white mx-auto"
      >
        Upgrade/Downgrade Sign
      </button>
    </div>

    <!-- Second Approval -->

    <OutDoorSecondDoc
      v-if="
        pageData.md_first_approval === 'approved' &&
        !pageData.rm_second_recommendation
      "
      @updateApp="getAppInfo()"
      :id="route.params.id"
    />
    <!-- Transfer Site -->
    <div
      v-if="
        pageData.bill_generated &&
        !pageData.ongoing_request &&
        (pageData.active_status === 'off_charge' ||
          pageData.active_status !== 'expunction') &&
        pageData.first_permit_pay &&
        showActions
      "
      class="flex flex-row justify-center px-6 gap-4 my-10"
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="checkArrears()"
        class="w-full blueBtn border-2 bg-mainColor text-white mx-auto"
      >
        Transfer Ownership
      </button>
    </div>
    <!-- Appeal Site -->
    <div
      v-if="pageData.md_second_approval === 'disapproved'"
      class="flex flex-row justify-center px-6 gap-4 my-10"
    >
      <button
        :disabled="loadingAction"
        type="submit"
        @click="openAppeal()"
        class="w-full blueBtn border-2 bg-mainColor text-white mx-auto"
      >
        Appeal Site
      </button>
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
