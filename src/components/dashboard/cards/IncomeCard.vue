<script setup>
// import { defineProps } from 'vue';

const props = defineProps({
    info:Object,

})

</script>

<template>
    <div class=" h-auto flex flex-col w-1/5 rounded-lg gap-2 bg-white p-4 min-w-[200px]">
        <p class=" opacity-60 text-sm">{{ info.title }}</p>
        <p class=" text-[.5rem] text-green-600 p-1 bg-green-100 w-fit rounded-lg">{{ info.percentageChange }}%</p>
        <p class=" text-[.6rem] text-gray-500">Total Income This {{ info.period }}</p>
        <p class=" text-lg text-gray-700">₦ {{ info.amount }}</p>
    </div>
    
</template>
