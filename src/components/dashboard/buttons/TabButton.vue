<script setup>

import {ref} from 'vue'


defineProps({
  tabs: Array,
  gap: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['radio-selected']);


</script>

<template>
  <div class="flex flex-row mt-6 mb-2" :class="'gap-' + gap">
    <div v-for="tabIndex in tabs.length">
      <input
        type="radio"
        name="requestTabRadio"
        class="logInput checked:border-b-2 peer"
        :id="'tab' + tabIndex"
        :checked="tabIndex - 1 === 0"
        :value="'tab' + tabIndex"
      />
      <label
        :for="'tab' + tabIndex"
        class="peer-checked:border-b-2 text-xs border-b-mainColor p-2"
        @click="emit('radio-selected', tabs[tabIndex-1])"
      >
        {{ tabs[tabIndex - 1] }}
      </label>
    </div>
  </div>
</template>
