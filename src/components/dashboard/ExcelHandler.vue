<script setup>
import { ref } from 'vue';
import IconUpload from '../icons/IconUpload.vue';

defineProps({
  index: {
    default: 0,
    type: Number
  }
});

const model = defineModel();

const fileName = ref(null);

const setDoc = async (e) => {
  const doc = e.target.files[0];

  if (doc) {
    if (/\.xlsx?$/i.test(doc.name)) {
      try {
        const arrayBuffer = await doc.arrayBuffer();
        const base64String = arrayBufferToBase64(arrayBuffer);

        // Assign the base64 string to your data property
        model.value = base64String;
        fileName.value = doc.name;
      } catch (error) {
        console.error('Error processing file:', error);
      }
    } else {
      console.error('Invalid file format. Please select a valid Excel file.');
    }
  }

  e.target.value = null;
};

// Function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}
</script>

<template>
  <div class="inputHolder">
    <label v-if="!model" :for="'spread' + index">
      <span class="block text-sm text-start mb-2.5">Upload an Excel Document</span>
      <div
        class="bg-indigo-100 bg-opacity-25 flex flex-col justify-center items-center p-5 border-2 border-dashed rounded-md"
      >
        <IconUpload class="w-6 h-6" />
        <span class="text-sm mt-2.5">Click to Select File</span>
      </div>
    </label>
    <input
      :id="'spread' + index"
      type="file"
      accept=".xlsx, .xls"
      class="hidden"
      :name="'spread' + index"
      @change="setDoc($event)"
    />
    <div v-if="fileName" class="w-full mt-2">
      <span class="text-start block underline">{{ fileName }} File Selected</span>
    </div>
  </div>
</template>