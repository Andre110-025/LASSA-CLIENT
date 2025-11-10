<script setup>
import { ref } from "vue";
import axios from "axios";
import IconDelete from "../icons/IconDelete.vue";
import IconUpload from "../icons/IconUpload.vue";
import { toast } from "vue3-toastify";

const imgData = ref(null);
const imageUrl = ref(null);
const base64 = ref(null);
const loading = ref(false);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = async () => {
      imgData.value = reader.result;
      base64.value = reader.result.split(",")[1]; // Get base64 without metadata
      // await uploadImage(base64Image);
    };
    reader.readAsDataURL(file);
  }
};

const uploadImage = async () => {
  try {
    loading.value = true;
    const { data } = await axios.post("forbulkupload", {
      photo_montage: base64.value,
    });

    if (data.success) {
      imageUrl.value = data.Url;
      loading.value = false;
    }
  } catch (error) {
    toast.error("Error Encountered while uploading Image", {
      position: toast.POSITION.TOP_CENTER,
    });

    loading.value = false;
  }
};

const copyUrl = () => {
  navigator.clipboard.writeText(imageUrl.value).then(() => {
    toast.success("Image URL copied to clipboard!", {
      position: toast.POSITION.TOP_CENTER,
    });
  });
};

const resetUpload = () => {
  imgData.value = null;
  imageUrl.value = null;
};
</script>

<template>
  <div class="p-4 bg-white max-w-md mx-auto">
    <h2 class="text-xl font-bold mb-4">Upload Image</h2>

    <div class="inputHolder">
      <label v-show="!imgData" for="PhotomontageUpload">
        <span class="block text-sm text-start mb-2.5">Upload an Image</span>
        <div
          class="bg-indigo-100 bg-opacity-25 flex flex-col justify-center items-center p-5 border-2 border-dashed rounded-md select-none"
        >
          <IconUpload class="w-6 h-6" />
          <span class="text-sm mt-2.5">Click to Image File</span>
          <span class="text-xs mt-1.5"
            >Image Should not be greater than 2MB</span
          >
        </div>
      </label>
      <input
        id="PhotomontageUpload"
        type="file"
        accept=".jpg, .jpeg, .png"
        class="hidden"
        name="PhotomontageUpload"
        @change="handleFileUpload"
      />
      <div v-show="imgData" class="w-full">
        <div v-show="imgData" class="w-full relative">
          <img :src="imgData" alt="" />
          <button
            type="button"
            class="absolute bg-slate-200 rounded-md bottom-5 right-10 w-10 h-10 flex justify-center items-center"
            @click="resetUpload"
          >
            <IconDelete />
          </button>
        </div>

        <div v-if="imageUrl" class="text-center mt-5">
          <div class="flex items-center justify-between">
            <input
              type="text"
              :value="imageUrl"
              readonly
              class="border text-xs p-2 w-full"
            />
            <button
              @click="copyUrl"
              class="bg-blue-500 text-white px-3 py-2 rounded ml-2"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <button
            @click="uploadImage"
            v-if="imgData && !imageUrl"
            class="mt-4 bg-mainColor text-white px-4 py-2 rounded"
            :disabled="loading"
          >
            Upload Image
          </button>

          <button
            @click="resetUpload"
            class="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            v-else-if="imageUrl"
          >
            Upload Another
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
