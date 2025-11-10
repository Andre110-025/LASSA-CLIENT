<script setup>
import { ref } from 'vue';
import IconDelete from '../icons/IconDelete.vue';
import IconUpload from '../icons/IconUpload.vue';

const props = defineProps({
  label: String,
});

const emits = defineEmits(['update:photoEncode']);

const imgData = ref(null);

const setImg = (e) => {
  const img = e.target.files[0];
  let reader = new FileReader();

  reader.addEventListener('load', () => {
    imgData.value = reader.result;
    if (/\.(jpe?g|png)$/i.test(img.name)) {
      const base64Content = reader.result.split(',')[1];
      // console.log(base64Content);
      emits('update:photoEncode', base64Content);
    }
  }, false);

  if (img) {
    if (/\.(jpe?g|png)$/i.test(img.name)) {
      reader.readAsDataURL(img);
    }
  }

  e.target.value = null;
};

const removeImg = () => {
  imgData.value = null;
  emits('update:photoEncode', null);
};
</script>

<template>
  <div class="inputHolder">
    <label :for="props.label" v-show="!imgData">
      <span class="block text-sm text-start mb-2.5">
        <slot></slot>
      </span>
      <div class="bg-indigo-100 bg-opacity-25 flex flex-col justify-center items-center p-5 border-2 border-dashed rounded-md">
        <IconUpload class="w-6 h-6" />
        <span class="text-sm mt-2.5">
          Click to Select Image File
        </span>
      </div>
    </label>
    <input
      :id="props.label"
      type="file"
      accept=".jpg, .jpeg, .png"
      class="hidden"
      :name="props.label"
      @change="setImg"
    />
    <div v-show="imgData" class="w-full">
      <span class="block text-sm text-start mb-2.5">
        <slot></slot>
      </span>
      <img :src="imgData" alt="" />
      <button type="button" class="absolute bg-slate-200 rounded-md bottom-5 right-10 w-10 h-10 flex justify-center items-center" @click="removeImg">
        <IconDelete />
      </button>
    </div>
  </div>
</template>
