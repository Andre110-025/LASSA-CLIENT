<script setup>
import { ref, reactive } from "vue";
import IconSpinner from "../icons/IconSpinner.vue";
import IconUpload from "../icons/IconUpload.vue";
import axios from "axios";
import { toast } from "vue3-toastify";

const props = defineProps({
  montages: Array,
  appId: Number,
  status: String,
});

const names = ref([]);
const loading = ref(false);
const emit = defineEmits(['update']);

const imgList = reactive({
  montage: {
    mobilesMontage: [],
  },
});

function handleFileUpload(event) {
  const fileList = event.target.files;
  const promises = [];

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const reader = new FileReader();

    promises.push(
      new Promise((resolve) => {
        reader.onload = () => {
          resolve({
            name: file.name,
            base64: { image_montage: reader.result.split(",")[1] },
          });
        };
      })
    );

    reader.readAsDataURL(file);
  }

  Promise.all(promises).then((result) => {
    names.value = result.map((image) => image.name);
    imgList.montage.mobilesMontage = result.map((image) => image.base64.image_montage);
  });
}

const addNewMontage = async () => {

  loading.value = true;

  try {

    const response = await axios.put(
      `updateImagemontagemobile/${props.appId}`,
      imgList
    );
    // console.log(response);
    if (response.status === 200) {
      toast.success("Saved! Ensure you Submit Application", {
        position: toast.POSITION.TOP_CENTER,
      });
      imgList.montage.mobilesMontage = [];
      names.value = []
      emit('update')
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
  <div class="flex flex-col gap-4">
    <img
      v-for="(img, index) in montages"
      :key="index"
      :src="img.image_montage"
      alt=""
      class="w-full h-auto bg-gray-600"
    />
  </div>
  <form @submit.prevent="addNewMontage()" v-if="status === 'declined'">
    <div class="inputHolder">
      <label for="multipleMontage" v-show="!names.length">
        <span class="block text-sm text-start mb-2.5">
          Upload New Vehicle Montages
        </span>
        <div
          class="bg-indigo-100 bg-opacity-25 flex flex-col justify-center items-center p-5 border-2 border-dashed rounded-md"
        >
          <IconUpload class="w-6 h-6" />
          <span class="text-sm mt-2.5"> Click to Select Images </span>
        </div>
      </label>
      <input
        id="multipleMontage"
        type="file"
        accept=".jpg, .jpeg, .png"
        class="hidden"
        name="multipleMontage"
        multiple="true"
        @change="handleFileUpload"
      />
      <div v-show="names.length" class="w-full">
        <span class="block text-sm text-start mb-2.5"> Selected Images </span>
        <ul class="list-disc pl-5">
          <li
            class="text-sm text-start"
            v-for="(name, index) in names"
            :key="index"
            v-text="name"
          ></li>
        </ul>
      </div>
    </div>

    <div class="my-5 px-5">
      <button
        :disabled="loading"
        type="submit"
        v-if="imgList.montage.mobilesMontage.length"
        class="blueBtn w-48 mx-auto rounded-none"
      >
        <IconSpinner v-if="loading" />
        <span
          class="text-sm font-medium text-white tracking-wider"
          v-if="!loading"
          >Upload Image(s)</span
        >
      </button>
    </div>
  </form>
</template>
