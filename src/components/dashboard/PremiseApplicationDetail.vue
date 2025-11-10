<script setup>
import { ref, reactive, nextTick, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import GetData from "./GetData.vue";
import IconAppStatus from "../icons/IconAppStatus.vue";
// import QrCode from "./QrCode.vue";
import { useModal } from "vue-final-modal";
import CompleteAppPay from "./popups/CompleteAppPay.vue";
import BulkPay from "./popups/BulkPay.vue";
import { toast } from "vue3-toastify";
import PremiseDebt from "./PremiseDebt.vue";
import PremiseAdditionalSign from "./PremiseAdditionalSign.vue";
import PremiseEditSign from "./PremiseEditSign.vue";
import PremiseChangeSign from "./PremiseChangeSign.vue";
import { useHelpers } from "../../helper";
import PremiseEditGeneral from "./PremiseEditGeneral.vue";
import PhotoLoader from "./PhotoLoader.vue";
import ConfirmDeletion from "./popups/ConfirmDeletion.vue";
import { useUserStore } from "../../stores/user";
import { useRouter } from "vue-router";

const { dateToSlash } = useHelpers();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const removalData = reactive({
  purpose: "Sign Removal",
  onpremiseform: {
    onpremiseinfo: [],
  },
});

const signToEdit = ref(null);

const actionType = ref(null);
const pageData = ref(null);
const loading = ref(false);
const loadingAction = ref(false);
const editGeneral = ref(null);
const removeBody = ref(null);
const removeAdditional = ref(null);
const editSign = ref(null);

const removeData = ref(null);
const additionalSignData = ref(null);
const changeData = ref(null);

const getAppInfo = async () => {
  loading.value = true;
  actionType.value = null;

  try {
    const response = await axios.get(`getonpremisedetails/${route.params.id}`);
    if (response.status === 200) {
      console.log(response);
      pageData.value = response.data.data[0];
      removeData.value = pageData.value.on_premise_removal[0] || null;
      additionalSignData.value =
        pageData.value.on_premise_additional[0] || null;
      changeData.value = pageData.value.on_premise_change[0] || null;

      pageData.value.onpremise_info.forEach((item) => {
        removalData.onpremiseform.onpremiseinfo.push({
          onpremiseinfo_id: item.id,
          signAmount: item.number_of_sign,
          signType: item.type_of_sign,
          sign_to_remove: 0,
          photo_montage: null,
        });
      });
      loading.value = false;
    }
  } catch (error) {}
};

const signEditType = computed(() => {
  if (pageData.value.status === "declined") {
    return "edit";
  } else if (additionalSignData.value?.status === "declined") {
    return "additional";
  } else {
    return "change";
  }
});

getAppInfo();

const getPurpose = () => {
  if (pageData.value.purpose_of_application === "Additional Sign") {
    return "Additional Sign";
  } else if (pageData.value.purpose_of_application === "Change of Sign") {
    return "Change of Sign";
  } else {
    return "Application for New Sign";
  }
};

function completePayment() {
  const { open, close } = useModal({
    component: CompleteAppPay,
    attrs: {
      onConfirm() {
        close();
        getAppInfo();
      },
      paymentID: pageData.value.payment_id,
      formType: "Onpremise",
      appPurpose: getPurpose(),
    },
    slots: {},
  });

  open();
}

function completeBulkAppPayment() {
  const { open, close } = useModal({
    component: BulkPay,
    attrs: {
      onConfirm() {
        close();
        getAppInfo();
      },
      multipleID: pageData.value.onpremise_multiple_id,
      formType: "Onpremise",
    },
  });

  open();
}

async function submitRemove() {
  loadingAction.value = true;

  try {
    const { data } = await axios.post(
      `removeonpremisesign/${route.params.id}`,
      removalData
    );

    console.log(data);

    if (data.success) {
      toast.success("Your Request have been Submitted", {
        position: toast.POSITION.TOP_CENTER,
      });
      actionType.value = null;
      loadingAction.value = false;
      getAppInfo();
    }
  } catch (error) {
    if (error.response.data?.errors?.length >= 1) {
      error.response.data.errors.forEach((element) => {
        toast.error(element, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    loadingAction.value = false;
  }
}

async function submitUpdate() {
  loadingAction.value = true;

  try {
    const { data } = await axios.post(`editsubmitonpremise/${route.params.id}`);

    console.log(data);

    if (data.success) {
      toast.success("Update Submitted", {
        position: toast.POSITION.TOP_CENTER,
      });

      loadingAction.value = false;
      getAppInfo();
    }
  } catch (error) {
    loadingAction.value = false;
  }
}

const scrollToElement = async () => {
  if (actionType.value === "Remove") {
    // Wait until the element is rendered
    await nextTick();

    // Check if the element exists and scroll into view
    if (removeBody.value) {
      removeBody.value.scrollIntoView({ behavior: "smooth" });
    }
  } else if (actionType.value === "Additional") {
    // Wait until the element is rendered
    await nextTick();

    // Check if the element exists and scroll into view
    if (removeAdditional.value?.$el) {
      removeAdditional.value.$el.scrollIntoView({
        behavior: "smooth",
        // top: removeAdditional.value.$el.offsetTop - 100,
      });
    }
  } else if (actionType.value === "EditSign" || actionType === "ChangeSign") {
    // Wait until the element is rendered
    await nextTick();

    // Check if the element exists and scroll into view
    if (editSign.value?.$el) {
      editSign.value.$el.scrollIntoView({
        behavior: "smooth",
        // top: removeAdditional.value.$el.offsetTop - 100,
      });
    }
  } else if (actionType.value === "editGeneral") {
    // Wait until the element is rendered
    await nextTick();

    // Check if the element exists and scroll into view
    if (editGeneral.value?.$el) {
      editGeneral.value.$el.scrollIntoView({
        behavior: "smooth",
        // top: removeAdditional.value.$el.offsetTop - 100,
      });
    }
  }
};

function deleteApplication(id, type) {
  const { open, close } = useModal({
    component: ConfirmDeletion,
    attrs: {
      onConfirm() {
        close();
        // getAppInfo();
      },
      id: id,
      type: type,
    },
    slots: {},
  });

  open();
}

watch(actionType, scrollToElement);
</script>

<template>
  <span
    v-if="
      pageData?.status === 'declined' ||
      additionalSignData?.status === 'declined' ||
      changeData?.status === 'declined'
    "
    class="fixed bg-red-100 w-fit py-1 px-2 rounded select-none text-sm font-medium text-[#f00] top-24 right-3"
    >This is a Draft</span
  >
  <GetData v-if="loading">Getting Application Details</GetData>
  <div
    v-else-if="pageData"
    class="bg-white rounded-md p-5 pt-8 my-6 max-w-xl mx-auto"
  >
    <h4 class="text-sm text-center mb-5">ON-PREMISE APPLICATION DETAILS</h4>

    <div v-if="actionType !== 'editGeneral'">
      <!-- General info -->
      <div class="flex flex-col p-6 gap-4 fxfcol border-gray-300 border-t-2">
        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Application Process</p>
          <p class="text-sm" v-text="pageData.purpose_of_application"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Business Name</p>
          <p class="text-sm" v-text="pageData.business_name"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Sign Address</p>
          <p class="text-sm" v-text="pageData.sign_address"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">LGA</p>
          <p class="text-sm" v-text="pageData.lga"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Payment ID</p>
          <p class="text-sm" v-text="pageData.payment_id"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Application Status</p>
          <p class="text-sm">
            <IconAppStatus
              :status="
                pageData.audit_status ||
                pageData.hod_status ||
                pageData.rm_status ||
                pageData.status
              "
            />
          </p>
        </div>

        <div class="flex xs:flex-row align-middle" v-if="pageData.due_date">
          <p class="w-2/5 text-sm font-semibold">Due Date</p>
          <p class="text-sm" v-text="dateToSlash(pageData.due_date)"></p>
        </div>

        <div>
          <RouterLink
            class="italic font-semibold text-sm underline"
            :to="{
              name: 'ViewDownloads',
              params: {
                id: pageData.id,
                app_type: 'getonpremisedownloadables',
              },
            }"
            >Click to view LASAA Issued Documents</RouterLink
          >
        </div>
      </div>

      <!-- Property Description -->
      <div class="flex flex-col p-6 gap-4 fxfcol">
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          Property Description
        </h6>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Property Type</p>
          <p class="text-sm" v-text="pageData.property_type"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Name of Property Owner</p>
          <p class="text-sm" v-text="pageData.name_of_owner"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Property Owner Phone No.</p>
          <p class="text-sm" v-text="pageData.phone_number"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold" v-if="pageData.email">
            Property Owner Email
          </p>
          <p class="text-sm" v-text="pageData.email"></p>
        </div>
      </div>

      <div
        v-if="
          pageData.status === 'declined' &&
          (pageData.purpose_of_application === 'Approved Application' ||
            pageData.purpose_of_application === 'Application for New Sign') &&
          !actionType
        "
        class="flex flex-row justify-center gap-4 pb-5"
      >
        <button
          class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
          @click="actionType = 'editGeneral'"
        >
          Edit General Info
        </button>
      </div>
    </div>

    <PremiseEditGeneral
      :appInfo="pageData"
      @getUpdate="getAppInfo()"
      :appID="pageData.id"
      ref="editGeneral"
      v-else-if="actionType === 'editGeneral'"
    />

    <form
      v-if="actionType === 'Remove'"
      @submit.prevent="submitRemove"
      ref="removeBody"
      class="scroll-mt-24"
    >
      <ul>
        <li
          class="flex flex-col p-6 gap-4"
          v-for="(item, index) in removalData.onpremiseform.onpremiseinfo"
          :key="index"
        >
          <h6
            class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
          >
            Sign {{ index + 1 }}
          </h6>

          <div class="flex xs:flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
            <p class="text-sm" v-text="item.signType"></p>
          </div>

          <div class="flex xs:flex-row align-middle">
            <p class="w-2/5 text-sm font-semibold">Number of Signs</p>
            <p class="text-sm" v-text="item.signAmount"></p>
          </div>

          <div class="inputHolder px-0 max-w-xs">
            <input
              type="number"
              placeholder=" "
              class="input peer"
              :id="'signNumber' + index"
              v-model="
                removalData.onpremiseform.onpremiseinfo[index].sign_to_remove
              "
              autocomplete="off"
              min="0"
              :max="item.signAmount"
              required
            />
            <label :for="'signNumber' + index" class="inputLabel left-3"
              >Number of Signs to Remove</label
            >
          </div>

          <PhotoLoader
            :label="'Photomontage' + index"
            @update:photoEncode="
              (base64Content) =>
                (removalData.onpremiseform.onpremiseinfo[index].photo_montage =
                  base64Content)
            "
          >
            Upload Removal Image
          </PhotoLoader>
        </li>
      </ul>

      <div class="flex flex-row justify-center gap-4 pb-5">
        <button
          class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
          type="submit"
          :disabled="loadingAction"
        >
          Submit Update
        </button>
      </div>
    </form>

    <PremiseAdditionalSign
      ref="removeAdditional"
      :appId="pageData.id"
      @getUpdate="getAppInfo()"
      v-else-if="actionType === 'Additional'"
    />

    <PremiseEditSign
      ref="editSign"
      :appId="pageData.id"
      :selectSign="signToEdit"
      :type="signEditType"
      @getUpdate="getAppInfo()"
      v-else-if="actionType === 'EditSign'"
    />

    <PremiseChangeSign
      ref="editSign"
      :appId="pageData.id"
      :selectSign="signToEdit"
      :type="signEditType"
      @getUpdate="getAppInfo()"
      v-else-if="actionType === 'ChangeSign'"
    />

    <!-- Signage info and Imagery -->

    <ul v-else-if="!actionType">
      <li
        class="flex flex-col p-6 gap-4"
        v-for="(item, index) in pageData.onpremise_info"
        :key="index"
      >
        <h6
          class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3"
        >
          Sign {{ index + 1 }}
          {{
            item.sign_to_add &&
            pageData.purpose_of_application === "Additional Sign"
              ? "Additional Sign"
              : ""
          }}
        </h6>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
          <p class="text-sm" v-text="item.type_of_sign"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Number of Sign(s)</p>
          <p
            class="text-sm"
            v-text="item.number_of_sign + item.sign_to_remove"
          ></p>
        </div>

        <div
          v-if="pageData.purpose_of_application === 'Sign Removal'"
          class="flex xs:flex-row align-middle"
        >
          <p class="w-2/5 text-sm font-semibold">
            Number of Sign(s) after Removal
          </p>
          <p class="text-sm" v-text="item.number_of_sign"></p>
        </div>

        <div
          v-if="pageData.purpose_of_application === 'Additional Sign'"
          class="flex xs:flex-row align-middle"
        >
          <p class="w-2/5 text-sm font-semibold">Number of Sign(s) to Add</p>
          <p class="text-sm" v-text="item.sign_to_add"></p>
        </div>

        <div
          v-if="pageData.purpose_of_application === 'Sign Removal'"
          class="flex xs:flex-row align-middle"
        >
          <p class="w-2/5 text-sm font-semibold">Number of Sign(s) to Remove</p>
          <p class="text-sm" v-text="item.sign_to_remove"></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Dimension in meters</p>
          <p
            class="text-sm"
            v-text="item.length_in_meter * item.width_in_meter"
          ></p>
        </div>

        <div class="flex xs:flex-row align-middle">
          <p class="w-2/5 text-sm font-semibold">Product on Sign</p>
          <p class="text-sm" v-text="item.product_on_sign ? 'Yes' : 'No'"></p>
        </div>

        <div class="flex flex-col gap-2">
          <p class="w-2/5 text-sm font-semibold">Photomontage</p>
          <img :src="item.photo_montage" alt="" class="w-full bg-gray-600" />
        </div>

        <div
          v-if="
            pageData.purpose_of_application === 'Sign Removal' &&
            item.photo_montage_remove
          "
          class="flex flex-col gap-2"
        >
          <p class="w-2/5 text-sm font-semibold">Removal Image</p>
          <img
            :src="item.photo_montage_remove"
            alt=""
            class="w-full bg-gray-600"
          />
        </div>

        <div
          v-if="
            pageData.purpose_of_application === 'Approved Application' ||
            pageData.purpose_of_application === 'Application for New Sign' ||
            pageData.purpose_of_application === 'Change of Sign' ||
            pageData.purpose_of_application === 'Additional Sign'
          "
          class="flex flex-row justify-center gap-4 pb-5"
        >
          <button
            class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
            @click="(actionType = 'EditSign'), (signToEdit = item)"
            v-if="
              pageData.status === 'declined' ||
              (additionalSignData?.status === 'declined' && item.sign_to_add)
            "
          >
            Edit Sign
          </button>

          <button
            class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
            @click="(actionType = 'ChangeSign'), (signToEdit = item)"
            v-else-if="
              pageData.audit_status === 'approved' &&
              (pageData.purpose_of_application === 'Approved Application' ||
                pageData.purpose_of_application === 'Application for New Sign')
            "
          >
            Change Sign
          </button>
        </div>
      </li>
    </ul>

    <!-- Change of Sign Process -->
    <div
      v-if="pageData.purpose_of_application === 'Change of Sign' && !actionType"
      class="flex flex-col p-6 gap-4 fxfcol"
    >
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Change of Sign Information
      </h6>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
        <p class="text-sm" v-text="changeData.type_of_sign"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of Sign(s)</p>
        <p class="text-sm" v-text="changeData.number_of_sign"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Dimension in meters</p>
        <p
          class="text-sm"
          v-text="changeData.length_in_meter * changeData.width_in_meter"
        ></p>
      </div>

      <div style="flex-direction: column" class="flex gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img
          :src="changeData.photo_montage"
          alt=""
          class="w-full bg-gray-600"
        />
      </div>

      <div
        v-if="
          pageData.purpose_of_application === 'Change of Sign' &&
          changeData.status === 'declined'
        "
        class="flex flex-row justify-center gap-4 pb-5"
      >
        <button
          class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
          @click="(actionType = 'EditSign'), (signToEdit = changeData)"
        >
          Edit Sign
        </button>
      </div>
    </div>

    <PremiseDebt
      v-if="
        pageData.billing_status === 'approved' &&
        (!pageData.account_status || pageData.account_status === 'approved') &&
        !actionType
      "
      :appID="pageData.id"
      :paymentID="pageData.payment_id"
    />

    <div
      v-if="
        pageData.Application_pay_status === 'not_paid' ||
        additionalSignData?.Application_pay_status === 'not_paid' ||
        changeData?.Application_pay_status === 'not_paid'
      "
      class="flex flex-row justify-center gap-4 pb-5"
    >
      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="completePayment()"
      >
        Pay Application Fee
      </button>
      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="completeBulkAppPayment()"
        v-if="pageData.onpremise_multiple_id"
      >
        Pay Bulk App Fee
      </button>
    </div>

    <div
      v-if="
        pageData.Application_pay_status === 'not_paid' ||
        additionalSignData?.Application_pay_status === 'not_paid' ||
        changeData?.Application_pay_status === 'not_paid'
      "
      class="flex flex-row justify-center gap-4 pb-5"
    >
      <button
        class="flex-1 px-2.5 py-3 bg-red-500 text-sm rounded-md text-white max-w-xs"
        @click="deleteApplication(pageData.id, 'single')"
      >
        Delete Application
      </button>
      <button
        class="flex-1 px-2.5 py-3 bg-red-500 text-sm rounded-md text-white max-w-xs"
        @click="deleteApplication(pageData.onpremise_multiple_id, 'multiple')"
        v-if="pageData.onpremise_multiple_id"
      >
        Delete Bulk Application
      </button>
    </div>

    <div
      v-else-if="
        pageData.audit_status === 'approved' &&
        (!pageData.account_status || pageData.account_status === 'approved') &&
        !actionType &&
        (pageData.purpose_of_application === 'Application for New Sign' ||
          pageData.purpose_of_application === 'Approved Application')
      "
      class="flex flex-row justify-center gap-4 pb-4"
    >
      <button
        class="p-3 bg-mainColor text-sm rounded-md text-white grow"
        @click="actionType = 'Remove'"
      >
        Remove Sign
      </button>

      <button
        class="p-3 bg-mainColor text-sm rounded-md text-white grow"
        @click="actionType = 'Additional'"
      >
        Add Sign
      </button>
    </div>

    <div
      v-else-if="pageData.status === 'declined' && !actionType"
      class="flex flex-row justify-center gap-4 pb-5 mt-10"
    >
      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="submitUpdate()"
        :disabled="loadingAction"
        v-if="pageData.status === 'declined'"
      >
        Submit Update
      </button>

      <!-- <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="submitAdditionalUpdate()"
        :disabled="loadingAction"
        v-else-if="additionalSignData?.status === 'declined'"
      >
        Submit Additional Update
      </button> -->
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
