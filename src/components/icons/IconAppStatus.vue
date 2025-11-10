<script setup>

const prop = defineProps({
    status: {
        type: String,
        default: 'pending'
    }
});

</script>

<template>
    <div v-if="status === 'approved' || status === 'completed'" class="flex flex-row bg-green-100 w-fit py-1 px-2 rounded select-none">
        <svg class=" w-4 h-4 my-auto mr-1" width="24" height="25" viewBox="0 0 24 25" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M19.2047 7.85852L9.42151 17.3452L4.97461 13.0331" stroke="#00AE4E" stroke-width="2.37168"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class=" text-[#00AE4E] text-[.75rem] capitalize">
            {{ status }}
        </span>
    </div>

    <div v-else-if="status === 'declined' || status === 'rejected' || status === 'disapproved'" class="flex flex-row bg-red-100 w-fit py-1 px-2 rounded select-none">
        <svg class=" w-4 h-4 my-auto mr-1" fill="none" version="1.1" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(-2.3131 -.10186)" stroke="#f00" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2.3717">
                <path d="m20.205 6.8585-11.783 11.487" />
                <path d="m8.2532 6.8585 11.783 11.487" />
            </g>
        </svg>

        <span class=" text-[#f00] text-[.75rem] capitalize">
            {{ status }}
        </span>
    </div>

    <div v-else class="flex flex-row bg-yellow-100 w-fit py-1 px-2 rounded select-none">
        <svg class=" w-4 h-4 my-auto mr-1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#988f28" d="M12 14q-.425 0-.712-.288T11 13V6q0-.425.288-.712T12 5q.425 0 .713.288T13 6v7q0 .425-.288.713T12 14m0 5q-.425 0-.712-.288T11 18q0-.425.288-.712T12 17q.425 0 .713.288T13 18q0 .425-.288.713T12 19"/></svg>

        <span class=" text-[#988f28] text-[.75rem]">
            Pending
        </span>
    </div>
</template>
