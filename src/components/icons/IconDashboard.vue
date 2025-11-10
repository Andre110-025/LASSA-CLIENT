<script setup>
defineProps({
  strokeCol: {
    type: String,
    default: "#fff",
  },
});
</script>

<template>
  <svg
    class="w-4 h-auto"
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 14 14"
  >
    <g
      fill="none"
      :stroke="strokeCol"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect width="5" height="5" x=".5" y=".5" rx="1" />
      <rect width="5" height="5" x="8.5" y=".5" rx="1" />
      <rect width="5" height="5" x=".5" y="8.5" rx="1" />
      <rect width="5" height="5" x="8.5" y="8.5" rx="1" />
    </g>
  </svg>
</template>
