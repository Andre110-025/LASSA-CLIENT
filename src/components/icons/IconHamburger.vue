<script setup>
const props = defineProps({
    iconClose:Boolean,
})



function getD(index){
    if (props.iconClose){
        return ["m16.873 7.627-9.7461 9.7461","m16.873 17.199-9.7461-9.7461","m16.873 7.627-9.7461 9.7461"][index]
    }
    return ["m18.892 18.5h-13.783","m18.892 6.5h-13.783","m18.892 12.5h-13.783"][index]
}
</script>

<template>
  <svg
    class="w-4 h-4 my-auto mr-1"
    fill="none"
    version="1.1"
    viewBox="0 0 24 25"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g
      fill="currentColor"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2.3717"
      transform="matrix(1.4213708,0,0,1.4213708,-5.0564492,-5.2671346)"
    >
      <path v-for="i in 3" :d="getD(i-1)" />
    </g>
  </svg>
</template>
