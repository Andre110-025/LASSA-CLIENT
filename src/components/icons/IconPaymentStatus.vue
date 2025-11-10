<script setup>
import { ref } from 'vue';

const prop = defineProps({
    paymentStatus: {
        type: Boolean,
        default: false
    }
});

</script>

<template>
    <div v-if="paymentStatus" class="flex flex-row bg-green-100 w-fit py-1 px-2 rounded select-none">
        <svg class=" w-4 h-4 my-auto mr-1" width="24" height="25" viewBox="0 0 24 25" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M19.2047 7.85852L9.42151 17.3452L4.97461 13.0331" stroke="#00AE4E" stroke-width="2.37168"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class=" text-[#00AE4E] text-[.75rem]">
            Success
        </span>
    </div>

    <div v-else class="flex flex-row bg-red-100 w-fit py-1 px-2 rounded select-none">
        <svg class=" w-4 h-4 my-auto mr-1" fill="none" version="1.1" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-2.3131 -.10186)" stroke="#f00" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2.3717">
                <path d="m20.205 6.8585-11.783 11.487" />
                <path d="m8.2532 6.8585 11.783 11.487" />
            </g>
        </svg>

        <span class=" text-[#f00] text-[.75rem]">
            Not Paid
        </span>
    </div>
</template>
