<script setup>
import { ref, reactive } from "vue";
import PhotoLoader from "../PhotoLoader.vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import IconDelete from "../../icons/IconDelete.vue";
// import { useModal } from "vue-final-modal";
import axios from "axios";
import { toast } from "vue3-toastify";
import DocumentLoader from "../DocumentLoader.vue";
import { useRouter } from "vue-router";
import { useHelpers } from "../../../helper";
import SignTypesSelector from "../SignTypesSelector.vue";

const { todayDate, endOfYear } = useHelpers();

const router = useRouter();

// const { userDetails } = useUserStore();

const signTypes = ["FLEX", "LED", "BACKLIT"];
const powerSource = [
  "Public/Private Electricity Supply",
  "Generator",
  "Solar Energy",
];
const durationType = ["Monthly", "Quarterly", "Biannual", "Annually"];

const loading = ref(false);

const appInfo = ref(null);

const streetData = reactive({
  name_of_display: null,
  purpose: "Application for New Sign",
  type_of_sign: null,
  start_date: null,
  end_date: null,
  material_for_deployment: null,
  height_sign: null,
  width_sign: null,
  duration: null,
  weight_sign: null,
  source_of_electricity: null,
  location_of_generator: null,
  authorization_letter_lseb: null,
  photo_montage: null,
  streetlampform: {
    streetlampinfo: [
      {
        number_poles: null,
        site_address: null,
        owner_consent: null,
      },
    ],
  },
});

const addNewStreet = () => {
  streetData.streetlampform.streetlampinfo.push({
    number_poles: null,
    site_address: null,
    owner_consent: null,
  });
};

const removeStreetData = (index) => {
  streetData.streetlampform.streetlampinfo.splice(index, 1);
};

const submitStreetData = async () => {
  loading.value = true;
  try {
    const response = await axios.post("streetlamp", streetData);
    console.log(response);
    if (response.status === 200) {
      appInfo.value = response.data;

      toast.success("Application is being Processed", {
        position: toast.POSITION.TOP_CENTER,
      });

      router.push({ name: "RequestLists" });
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
  <div class="container mx-auto p-5 bg-white min-h-full">
    <h5 class="text-center font-medium mb-10">
      STREET LAMP POLES EXPRESSION OF INTEREST
      <i class="text-red-600">(THIRD PARTY)</i>
    </h5>

    <form @submit.prevent="submitStreetData" class="max-w-md mx-auto">
      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="name_of_display"
          autocomplete="off"
          v-model="streetData.name_of_display"
          required
        />
        <label for="name_of_display" class="inputLabel"
          >Name of Display/Campaign</label
        >
      </div>

      <SignTypesSelector
        :productType="'street_lamp'"
        v-model="streetData.type_of_sign"
        :label="'Type of Material'"
      />

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="date"
            placeholder=" "
            class="input peer"
            id="startDate"
            autocomplete="off"
            v-model="streetData.start_date"
            :max="endOfYear()"
            required
          />
          <label for="startDate" class="inputLabel">Start Date</label>
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <input
            type="date"
            placeholder=" "
            class="input peer"
            id="endDate"
            :min="streetData.start_date || todayDate()"
            :max="endOfYear()"
            autocomplete="off"
            v-model="streetData.end_date"
            required
          />
          <label for="endDate" class="inputLabel">End Date</label>
        </div>
      </div>

      <h5 class="font-medium px-5 my-5">Dimension of Sign</h5>

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="length_sign"
            autocomplete="off"
            min="1"
            max="8"
            v-model="streetData.height_sign"
          />
          <label for="length_sign" class="inputLabel">length(meter 1-8)</label>
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="width_sign"
            autocomplete="off"
            min="1"
            max="4"
            v-model="streetData.width_sign"
          />
          <label for="width_sign" class="inputLabel">Width(meter 1-4)</label>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row mt-5">
        <div class="inputHolder my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            id="weight_of_sign"
            autocomplete="off"
            v-model="streetData.weight_sign"
          />
          <label for="weight_of_sign" class="inputLabel"
            >Weight of Sign(KG)</label
          >
        </div>

        <div v-if="false" class="inputHolder mb-0 sm:my-0 grow">
          <select
            v-model="streetData.duration"
            placeholder=" "
            class="input peer"
            id="durationType"
          >
            <option
              v-for="(item, index) in durationType"
              :key="index"
              :value="item"
              v-text="item"
            ></option>
          </select>
          <label for="durationType" class="inputLabel">Duration</label>
        </div>
      </div>

      <div
        class="inputHolder"
        v-if="
          streetData.type_of_sign === 'LED' ||
          streetData.type_of_sign === 'BACKLIT'
        "
      >
        <select
          placeholder=" "
          class="input peer"
          id="powerSource"
          v-model="streetData.source_of_electricity"
          required
        >
          <option
            v-for="(item, index) in powerSource"
            :key="index"
            :value="item"
            v-text="item"
          ></option>
        </select>
        <label for="powerSource" class="inputLabel"
          >Source of Electricity</label
        >
      </div>

      <div
        class="inputHolder"
        v-if="streetData.source_of_electricity === 'Generator'"
      >
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="location_of_generator"
          autocomplete="off"
          v-model="streetData.location_of_generator"
          required
        />
        <label for="location_of_generator" class="inputLabel"
          >Generator Address</label
        >
      </div>

      <!-- PhotoMontage -->

      <DocumentLoader
        v-if="
          streetData.source_of_electricity ===
          'Public/Private Electricity Supply'
        "
        :label="'authorization_letter_lseb'"
        @update:fileEncode="
          (base64Content) =>
            (streetData.authorization_letter_lseb = base64Content)
        "
      >
        Upload Authorization Letter from Electricity Supplier
      </DocumentLoader>

      <!-- PhotoMontage -->

      <PhotoLoader
        :label="'Photomontage'"
        @update:photoEncode="
          (base64Content) => (streetData.photo_montage = base64Content)
        "
      >
        Upload Photomontage
      </PhotoLoader>

      <h5 class="font-medium px-5 my-5">Street Name(s)</h5>

      <transition-group tag="ul" name="signs">
        <li
          v-for="(item, index) in streetData.streetlampform.streetlampinfo"
          :key="index"
        >
          <h6
            class="font-medium text-sm px-5 my-5 flex items-center justify-between"
          >
            <span>Street {{ index + 1 }}</span>
            <button
              type="button"
              v-if="streetData.streetlampform.streetlampinfo.length > 1"
              @click="removeStreetData(index)"
            >
              <IconDelete class="h-6 w-auto" />
            </button>
          </h6>
          <div class="flex flex-col sm:flex-row mt-5">
            <div class="inputHolder my-0 grow">
              <input
                type="text"
                placeholder=" "
                class="input peer"
                :id="'site_address_1' + index"
                autocomplete="off"
                v-model="
                  streetData.streetlampform.streetlampinfo[index].site_address
                "
                required
              />
              <label :for="'site_address_1' + index" class="inputLabel"
                >Street Name</label
              >
            </div>

            <div class="inputHolder mb-0 sm:my-0 grow">
              <input
                type="number"
                placeholder=" "
                class="input peer"
                :id="'number_poles_site_1' + index"
                autocomplete="off"
                v-model="
                  streetData.streetlampform.streetlampinfo[index].number_poles
                "
                required
                min="1"
              />
              <label :for="'number_poles_site_1' + index" class="inputLabel"
                >Number of Pole(s)</label
              >
            </div>
          </div>

          <DocumentLoader
            :label="'owner_consent' + index"
            @update:fileEncode="
              (base64Content) =>
                (streetData.streetlampform.streetlampinfo[index].owner_consent =
                  base64Content)
            "
          >
            Upload Owner Consent {{ index + 1 }} (Optional)
          </DocumentLoader>
        </li>
      </transition-group>

      <div class="flex justify-between items-center mt-5 px-5">
        <span class="text-sm font-semibold"
          >Click the plus button to add Street</span
        >
        <button
          @click="addNewStreet()"
          type="button"
          class="p-2 border-2 border-mainColor leading-none h-9 w-9"
        >
          +
        </button>
      </div>

      <div class="mt-5 px-5 text-xs text-justify">
        <p>
          By Submitting the form, I declare that I am the duly authorized agent
          or owner of the business/company that has submitted this application
          to erect a sign. I verify that all information provided above are true
          and accurate and understand that false or misleading information
          provided by me in the course of this application will result in the
          automatic disqualification and attract a penalty which I undertake to
          pay. I also undertake to obtain the Agency’s approval before I
          implement any changes to any sign approved by the Agency. I agree to
          notify the Agency of any change in my mailing address, status and/or
          telephone number.
        </p>
      </div>

      <div class="my-5 px-5">
        <button
          :disabled="loading"
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
  </div>
</template>
