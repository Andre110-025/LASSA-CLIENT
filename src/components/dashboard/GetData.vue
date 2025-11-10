<script setup>
import IconLoader from '../icons/IconLoader.vue'
</script>

<template>
  <div class="my-20 flex flex-col gap-10 justify-center items-center">
    <IconLoader />
    <p class="font-medium">
      <slot>
        Loading
      </slot>
    </p>
  </div>
</template>