<script setup></script>

<template>
  <div class="flex flex-col gap-2 bg-white rounded-lg h-full justify-between pb-8 min-w-[300px]">
    <div class="flex flex-col">
      <div
        class="flex flex-col border-b-[1px] gap-4 border-b-gray-300 py-4 px-6"
      >
        <h6 class="text-sm font-semibold">Images</h6>
        <p class="text-xs font-light">Photo Montage</p>
      </div>
    </div>

    <div v-for="i in 5" class="px-6">
      <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-4">
          <img src="#" class="w-8 h-8 rounded-full bg-gray-400" />
          <p class="my-auto text-sm">XYZ Media ltd</p>
        </div>
      </div>
    </div>
  </div>
</template>
