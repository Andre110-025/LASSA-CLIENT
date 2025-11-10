<script setup>
import { ref } from "vue";
import { useModal } from "vue-final-modal";
import UploadLetter from "./popups/UploadLetter.vue";
import { useRoute } from "vue-router";
import { toast } from "vue3-toastify";
import axios from "axios";

const loading = ref(false);
const route = useRoute();

const emit = defineEmits(["getApp"]);

defineProps({
  activeStatus: Boolean
})

const { open: openOffCharge, close: closeOffCharge } = useModal({
  component: UploadLetter,
  attrs: {
    onConfirm(bol) {
      if (bol) {
        emit("getApp");
      }

      closeOffCharge();
    },
  },
});

const { open: openExpunge, close: closeExpunge } = useModal({
  component: UploadLetter,
  attrs: {
    action: 'Expunction',
    onConfirm(bol) {
      if (bol) {
        emit("getApp");
      }

      closeExpunge();
    },
  },
});
</script>
<template>
  <div class="px-6">
    <div>
      <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
        Off-Charge/Expunge Site
      </h6>
    </div>
    <div class="flex flex-row justify-center gap-4 pb-4">
      <button
        class="p-3 bg-mainColor text-sm rounded-md text-white grow"
        @click="openOffCharge()"
        :disabled="loading"
        v-if="!activeStatus"
      >
        Off Charge Site
      </button>

      <button
        class="p-3 bg-mainColor text-sm rounded-md text-white grow"
        @click="openExpunge()"
        :disabled="loading"
      >
        Expunge Site
      </button>
    </div>
  </div>
</template>
