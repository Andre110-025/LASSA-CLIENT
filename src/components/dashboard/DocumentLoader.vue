<script setup>
import { ref } from 'vue';
import IconDelete from '../icons/IconDelete.vue';
import IconUpload from '../icons/IconUpload.vue';

const props = defineProps({
  label: String,
});

const emits = defineEmits(['update:fileEncode']);

const fileData = ref(null);

const setFile = (e) => {
  const file = e.target.files[0];
  let reader = new FileReader();

  reader.addEventListener('load', () => {
    fileData.value = reader.result;
    if (/\.(pdf)$/i.test(file.name)) {
      const base64Content = reader.result.split(',')[1];
      emits('update:fileEncode', base64Content);
    }
  }, false);

  if (file) {
    if (/\.(pdf)$/i.test(file.name)) {
      reader.readAsDataURL(file);
    }
  }

  e.target.value = null;
};

const removeFile = () => {
  fileData.value = null;
  emits('update:fileEncode', null);
};
</script>

<template>
  <div class="inputHolder">
    <label :for="props.label" v-show="!fileData">
      <span class="block text-sm text-start mb-2.5">
        <slot></slot>
      </span>
      <div class="bg-indigo-100 bg-opacity-25 flex flex-col justify-center items-center p-5 border-2 border-dashed rounded-md">
        <IconUpload class="w-6 h-6" />
        <span class="text-sm mt-2.5">
          Click to Select PDF Document
        </span>
      </div>
    </label>
    <input
      :id="props.label"
      type="file"
      accept=".pdf"
      class="hidden"
      :name="props.label"
      @change="setFile"
    />
    <div v-show="fileData" class="w-full">
      <span class="block text-sm text-start mb-2.5">
        <slot></slot>
      </span>
      <embed class="max-h-[300px]" :src="fileData" width="100%" height="100%" type="application/pdf">
      <button type="button" class="absolute bg-slate-200 rounded-md bottom-5 right-10 w-10 h-10 flex justify-center items-center" @click="removeFile">
        <IconDelete />
      </button>
    </div>
  </div>
</template>
