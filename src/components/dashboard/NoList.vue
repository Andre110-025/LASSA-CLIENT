<script setup>
import IconNotFound from '../icons/IconNotFound.vue';

defineProps({
  showBtn: {
    default: true,
    type: Boolean
  }
})

</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="p-8 my-10 rounded-full bg-blue-950 bg-opacity-10">
      <IconNotFound class="w-14 h-14" />
    </div>

    <p class="text-center text-gray-400">
      <slot name="description">No data</slot>
    </p>

    <button
      type="submit"
      class="blueBtn min-w-[200px] mx-auto my-5"
      @click="$emit('performAction')"
      v-if="showBtn"
    >
      <span class="text-sm font-medium text-white tracking-wider">
        <slot name="action">Add Sign</slot>
      </span>
    </button>
  </div>
</template>
