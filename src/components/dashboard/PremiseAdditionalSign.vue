<script setup>
import { ref, reactive, onMounted } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import IconDelete from "../icons/IconDelete.vue";
import { toast } from "vue3-toastify";
import axios from "axios";
import PhotoLoader from "./PhotoLoader.vue";
import PayAdvertDialog from "./popups/PayAdvertApplication.vue";
import { useModal } from "vue-final-modal";
import SignTypesSelector from "./SignTypesSelector.vue";

const props = defineProps({
  appId: {
    required: true,
  },
});

const emits = defineEmits(["getUpdate"]);

const loading = ref(false);
const appInfo = ref(null);

const additionalData = reactive({
  purpose: "Additional Sign",
  onpremiseform: {
    onpremiseinfo: [
      {
        type_of_sign: null,
        number_of_sign: null,
        length_in_meter: null,
        width_in_meter: null,
        photo_montage: null,
      },
    ],
  },
});

const addNewSign = () => {
  additionalData.onpremiseform.onpremiseinfo.push({
    type_of_sign: null,
    number_of_sign: null,
    length_in_meter: null,
    width_in_meter: null,
    photo_montage: null,
  });
};

const removeSignData = (index) => {
  additionalData.onpremiseform.onpremiseinfo.splice(index, 1);
};

const submitPremiseData = async () => {
  loading.value = true;
  try {
    const response = await axios.post(
      `addonpremisesign/${props.appId}`,
      additionalData
    );
    console.log(response);
    if (response.status === 200) {
      appInfo.value = response.data;

      toast.success("Application Sign Saved", {
        position: toast.POSITION.TOP_CENTER,
      });

      const { open, close } = useModal({
        component: PayAdvertDialog,
        attrs: {
          onConfirm() {
            close();
            emits("getUpdate");
          },
          appDetails: appInfo.value,
          formType: "Onpremise",
          appPurpose: "Additional Sign",
        },
        slots: {},
      });

      open();
    }
    loading.value = false;
  } catch (error) {
    if (error.response.data.errors?.length >= 1) {
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

    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="submitPremiseData" class="scroll-mt-24">
    <transition-group tag="ul" name="signs">
      <li
        v-for="(item, index) in additionalData.onpremiseform.onpremiseinfo"
        :key="index"
      >
        <h5 class="font-medium px-5 mb-5 flex items-center justify-between">
          <span>Additional Sign {{ index + 1 }}</span>
          <button
            v-if="additionalData.onpremiseform.onpremiseinfo.length > 1"
            type="button"
            @click="removeSignData(index)"
          >
            <IconDelete class="h-6 w-auto" />
          </button>
        </h5>
        <SignTypesSelector
          :index="index"
          :productType="'on_premise'"
          v-model="additionalData.onpremiseform.onpremiseinfo[index].type_of_sign"
        />

        <div class="">
          <div class="inputHolder">
            <input
              type="number"
              placeholder=" "
              class="input peer"
              :id="'signNumber' + index"
              v-model="
                additionalData.onpremiseform.onpremiseinfo[index].number_of_sign
              "
              autocomplete="off"
              min="0"
              required
            />
            <label :for="'signNumber' + index" class="inputLabel"
              >Number of Signs</label
            >
          </div>

          <div class="flex flex-row gap-2.5 items-center px-5">
            <input
              type="checkbox"
              :name="'product_on_sign' + index"
              :id="'product_on_sign' + index"
              v-model="
                additionalData.onpremiseform.onpremiseinfo[index]
                  .product_on_sign
              "
            /><label class="text-sm" :for="'product_on_sign' + index"
              >check if Product is on Sign</label
            >
          </div>

          <h5 class="font-medium px-5 my-5">Dimension of Sign</h5>

          <div
            v-if="
              additionalData.onpremiseform.onpremiseinfo[index].type_of_sign !==
              'Led Screens At Filling Stations'
            "
            class="flex flex-col sm:flex-row mt-5"
          >
            <div class="inputHolder my-0 grow">
              <input
                type="number"
                placeholder=" "
                class="input peer"
                :id="'length_sign' + index"
                min="1"
                autocomplete="off"
                v-model="
                  additionalData.onpremiseform.onpremiseinfo[index]
                    .width_in_meter
                "
                required
              />
              <label :for="'length_sign' + index" class="inputLabel"
                >length(meter)</label
              >
            </div>

            <div class="inputHolder mb-0 sm:my-0 grow">
              <input
                type="number"
                placeholder=" "
                class="input peer"
                :id="'width_sign' + index"
                autocomplete="off"
                v-model="
                  additionalData.onpremiseform.onpremiseinfo[index]
                    .length_in_meter
                "
                required
              />
              <label :for="'width_sign' + index" class="inputLabel"
                >Width(meter)</label
              >
            </div>
          </div>

          <div v-else class="inputHolder">
            <input
              type="number"
              placeholder=" "
              class="input peer"
              :id="'length_in_meter' + props.index"
              min="1"
              max="60"
              autocomplete="off"
              v-model="
                additionalData.onpremiseform.onpremiseinfo[index]
                  .length_in_meter
              "
              @input="emitUpdate"
              required
            />
            <label :for="'length_in_meter' + props.index" class="inputLabel"
              >Dimension in Inches</label
            >
          </div>
        </div>

        <PhotoLoader
          :label="'Photomontage' + index"
          @update:photoEncode="
            (base64Content) =>
              (additionalData.onpremiseform.onpremiseinfo[index].photo_montage =
                base64Content)
          "
        >
          Upload a Photomontage
        </PhotoLoader>
      </li>
    </transition-group>

    <div class="flex justify-between items-center px-5">
      <span class="text-sm font-semibold"
        >Click the plus button to add more sign</span
      >
      <button
        @click="addNewSign"
        type="button"
        class="p-2 border-2 border-mainColor leading-none h-9 w-9"
      >
        +
      </button>
    </div>

    <div class="mt-5 px-5 text-xs text-justify">
      <p>
        By Submitting the form, I declare that I am the duly authorized agent or
        owner of the business/company that has submitted this application to
        erect a sign. I verify that all information provided above are true and
        accurate and understand that false or misleading information provided by
        me in the course of this application will result in the automatic
        disqualification and attract a penalty which I undertake to pay. I also
        undertake to obtain the Agency's approval before I implement any changes
        to any sign approved by the Agency. I agree to notify the Agency of any
        change in my mailing address, status and/or telephone number.
      </p>
    </div>

    <div class="my-5 px-5">
      <button
        :disabled="loading"
        type="submit"
        class="blueBtn w-full mx-auto rounded-none"
        @click="submitPremiseData"
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
</template>
