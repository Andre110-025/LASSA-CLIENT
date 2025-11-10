<script setup>
import { ref, reactive, watch } from "vue";
import IconUpload from "../../icons/IconUpload.vue";
import IconDelete from "../../icons/IconDelete.vue";
import SignTypesSelector from "../SignTypesSelector.vue";

const props = defineProps({
  signData: {
    type: Object,
    required: true,
  },
  index: Number,
  length: Number,
});

const emit = defineEmits(["updateSignData", "deleteSignData"]);

const outDoorData = reactive(props.signData);

// Method to emit the updated sign data
const emitUpdate = () => {
  // console.log("test");
  emit("updateSignData", outDoorData);
};

const imgData = ref(null);

const setImg = (e) => {
  const img = e.target.files[0];

  let reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      imgData.value = reader.result;
      outDoorData.photo_montage = reader.result.split(",")[1];
      // console.log(imgData.value)
    }.bind(this),
    false
  );

  if (img) {
    if (/\.(jpe?g|png)$/i.test(img.name)) {
      reader.readAsDataURL(img);
      emitUpdate();
    }
  }

  e.target.value = null;
};

const removeImg = () => {
  outDoorData.photo_montage = null;
  imgData.value = null;
};

watch(outDoorData, (newValue, oldValue) => {
  if (outDoorData.type_of_sign === "Led Screens At Filling Stations") {
    outDoorData.width_in_meter = 1;
    emitUpdate();
  }
});
</script>

<template>
  <li>
    <h5 class="font-medium px-5 mb-5 flex items-center justify-between">
      <span>Sign {{ props.index + 1 }}</span>
      <button
        v-if="props.length > 1"
        type="button"
        @click="emit('deleteSignData')"
      >
        <IconDelete class="h-6 w-auto" />
      </button>
    </h5>
    <SignTypesSelector
      :index="props.index"
      :productType="'on_premise'"
      v-model="outDoorData.type_of_sign"
    />

    <div class="">
      <div class="inputHolder">
        <input
          type="number"
          placeholder=" "
          class="input peer"
          :id="'signNumber' + props.index"
          v-model="outDoorData.number_of_sign"
          autocomplete="off"
          @input="emitUpdate"
          min="1"
          required
        />
        <label :for="'signNumber' + props.index" class="inputLabel"
          >Number of Signs</label
        >
      </div>

      <div class="flex flex-row gap-2.5 items-center px-5">
        <input
          type="checkbox"
          name="product_on_sign"
          id="product_on_sign"
          v-model="outDoorData.product_on_sign"
        /><label class="text-sm" for="product_on_sign"
          >check if Product is on Sign</label
        >
      </div>

      <h5 class="font-medium px-5 my-5">Dimension of Sign</h5>

      <div
        v-if="outDoorData.type_of_sign !== 'Led Screens At Filling Stations'"
        class="flex flex-col sm:flex-row mt-5"
      >
        <div class="inputHolder my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            :id="'length_sign' + props.index"
            min="1"
            autocomplete="off"
            v-model="outDoorData.width_in_meter"
            @input="emitUpdate"
            required
          />
          <label :for="'length_sign' + props.index" class="inputLabel"
            >length(meter)</label
          >
        </div>

        <div class="inputHolder mb-0 sm:my-0 grow">
          <input
            type="number"
            placeholder=" "
            class="input peer"
            :id="'width_sign' + props.index"
            autocomplete="off"
            v-model="outDoorData.length_in_meter"
            @input="emitUpdate"
            min="1"
            required
          />
          <label :for="'width_sign' + props.index" class="inputLabel"
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
          v-model="outDoorData.length_in_meter"
          @input="emitUpdate"
          required
        />
        <label :for="'length_in_meter' + props.index" class="inputLabel"
          >Dimension in Inches</label
        >
      </div>
    </div>

    <div class="inputHolder">
      <label v-show="!imgData" :for="'Photomontage' + props.index">
        <span class="block text-sm text-start mb-2.5"
          >Upload a Photomontage</span
        >
        <div
          class="bg-indigo-100 bg-opacity-25 flex flex-col justify-center items-center p-5 border-2 border-dashed rounded-md"
        >
          <IconUpload class="w-6 h-6" />
          <span class="text-sm mt-2.5">Click to Select File</span>
        </div>
      </label>
      <input
        :id="'Photomontage' + props.index"
        type="file"
        accept=".jpg, .jpeg, .png"
        class="hidden"
        :name="'Photomontage' + props.index"
        @change="setImg"
      />
      <div v-show="imgData" class="w-full">
        <img :src="imgData" alt="" />
        <button
          type="button"
          class="absolute bg-slate-200 rounded-md bottom-5 right-10 w-10 h-10 flex justify-center items-center"
          @click="removeImg"
        >
          <IconDelete />
        </button>
      </div>
    </div>
  </li>
</template>
