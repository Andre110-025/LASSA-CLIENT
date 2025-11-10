<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="relative w-full min-h-[100dvh] bg-white sm:bg-mainColor sm:bg-[url('/authImg.jpg')] flex justify-center items-center py-10 bg-no-repeat bg-cover">
    <div class="absolute hidden sm:block inset-0 bg-mainColor opacity-70"></div>
    <RouterView />
  </div>
</template>