<script setup>
import { VueFinalModal } from "vue-final-modal";

const emit = defineEmits(["confirm"]);
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:w-4/5 sm:min-w-[28.125rem] min-h-[350px] max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div
      class="flex min-h-[inherit] flex-col items-center justify-between px-5 py-20"
    >
      <p class="text-center text-lg text-red-600">
        Are you sure your want to decline this sign?
      </p>

      <div class="flex flex-row gap-5">
        <button
          @click="emit('confirm', true)"
          :disabled="loading"
          class="bookingCta w-20 justify-center bg-red-200 text-xs text-red-600 xs:text-sm"
        >
          Yes
        </button>
        <button
          @click="emit('confirm')"
          class="bookingCta w-20 justify-center bg-green-200 text-xs text-green-600 xs:text-sm"
        >
          No
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
