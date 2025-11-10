<script setup>
import { ref } from "vue";
import SmallFormatDebt from "./SmallFormatDebt.vue"

const props = defineProps({
  item: Object,
  index: Number,
  paymentUID: String,
  editable: {
    default: false,
    type: Boolean
  },
});

const emit = defineEmits(["getUpdate"]);

const edit = ref(false);
const loading = ref(false);

</script>

<template>
  <li class="">
    <h6 class="font-medium text-sm mb-5">
      Small Format Advert Type {{ props.index + 1 }}
    </h6>

    <div class="flex flex-col gap-4" v-if="!edit">
      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Type of Sign</p>
        <p class="text-sm capitalize" v-text="item.type_signs"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Length</p>
        <p class="text-sm" v-text="item.length"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Breadth</p>
        <p class="text-sm" v-text="item.breadth"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Dimension</p>
        <p class="text-sm" v-text="item.dimension_sign"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Advert Setback Distance</p>
        <p class="text-sm" v-text="item.setback_distance"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Site Format</p>
        <p class="text-sm capitalize" v-text="item.sign_format"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Site of Sign</p>
        <p class="text-sm capitalize" v-text="item.sign_site"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Illumination</p>
        <p class="text-sm" v-text="item.illumination"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Interactivity</p>
        <p class="text-sm" v-text="item.interactivity"></p>
      </div>

      <div class="flex xs:flex-row align-middle">
        <p class="w-2/5 text-sm font-semibold">Electricity Source</p>
        <p class="text-sm" v-text="item.electricity_source"></p>
      </div>

      <div v-if="item.photo_montage" class="flex flex-col gap-2">
        <p class="w-2/5 text-sm font-semibold">Photomontage</p>
        <img :src="item.photo_montage" alt="" class="w-full bg-gray-600" />
      </div>

      <button
        class="px-16 py-3 bg-mainColor text-sm rounded-md text-white"
        @click="edit = true"
        v-if="editable"
      >
        Edit Application
      </button>
    </div>

    <SmallFormatDebt
      v-if="item.final_bill_generated === 'approved'"
      :appID="item.id"
      :paymentUID="paymentUID"
    />
  </li>
</template>
