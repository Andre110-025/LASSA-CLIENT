<script setup>
import { ref, inject } from "vue";
import TemporaryEditFirst from "./TemporaryEditFirst.vue"
import TemporaryEditReg from "./TemporaryEditReg.vue"

const props = defineProps({
  item: Object,
  index: Number,
  editable: Boolean,
});

const data = inject("appData");

const edit = ref(false);
</script>

<template>
  <li class="">
    <h6 class="font-medium text-sm mb-5">
      Temporary Advert Type {{ props.index + 1 }}
    </h6>

    <div class="flex flex-col gap-4" v-if="!edit">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
        <p class="text-sm capitalize" v-text="item.type_sign"></p>
      </div>

      <div v-if="item.class_signs" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Classification</p>
        <p class="text-sm capitalize" v-text="item.class_signs"></p>
      </div>

      <div v-if="item.size_ads" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Size</p>
        <p class="text-sm" v-text="item.size_ads"></p>
      </div>

      <div v-if="item.dimension_ads" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Dimension</p>
        <p class="text-sm" v-text="item.dimension_ads"></p>
      </div>
      
      <div v-if="item.number_of_days" class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of Days</p>
        <p class="text-sm" v-text="item.number_of_days"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Number of Wearable</p>
        <p class="text-sm" v-text="item.number_wearable"></p>
      </div>

      <div v-if="item.days_in_duration" class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Selected Days</p>
        <p class="text-sm" v-text="item.days_in_duration"></p>
      </div>

      <div v-if="item.license_number" class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Vehicle License Plate</p>
        <p class="text-sm" v-text="item.license_number"></p>
      </div>

      <div class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img :src="item.photo_montage" alt="" class="w-full bg-gray-600" />
      </div>

      <div class="flex flex-col gap-2" v-if="item.vehicle_license">
        <p class="w-2/5 text-sm font-semibold">Vehicle License</p>
        <img :src="item.vehicle_license" alt="" class="w-full bg-gray-600" />
      </div>

      <div class="flex flex-col gap-2" v-if="item.traffic_statement">
        <p class="w-2/5 text-sm font-semibold">Traffic Statement</p>
        <embed
          :src="item.traffic_statement"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>

      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="edit = true"
        v-if="editable"
      >
        Edit Application
      </button>
    </div>

    <div v-else>
      <TemporaryEditFirst v-if="data.assigned_department === 'Mobile_advert'" :index="index" :detailInfo="item" />
      <TemporaryEditReg v-else-if="data.assigned_department === 'Registry'" :index="index" :detailInfo="item" />
    </div>
  </li>
</template>
