<script setup>
const props = defineProps({choice: String})
</script>

<template>
  <div class="flex flex-row gap-8 mt-12">
    <input type="radio" v-model="props.choice" value="pending" @change="$emit('changeState', 'pending')" class="logInput" id="requestRadioNew">
    <label class="flex gap-2 text-gray-700 text-sm" for="requestRadioNew">
      <svg class="relative my-auto" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z"
          fill="#FFCE20" />
      </svg>
      <span>
        Pending
      </span>
    </label>
    <input type="radio" v-model="props.choice" value="approved" @change="$emit('changeState', 'approved')" class="logInput" id="requestRadioApproved">
    <label class="flex gap-2 text-gray-700 text-sm" for="requestRadioApproved">
      <svg class="relative my-auto" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_941_27509)" transform="translate(-2,-2)">
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM9.29 16.29L5.7 12.7C5.31 12.31 5.31 11.68 5.7 11.29C6.09 10.9 6.72 10.9 7.11 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.7 16.29C10.32 16.68 9.68 16.68 9.29 16.29Z"
            fill="#05CD99" />
        </g>
        <defs>
          <clipPath id="clip0_941_27509">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <span>
        Approved
      </span>
    </label>
    <input type="radio" v-model="props.choice" value="declined" @change="$emit('changeState', 'declined')" class="logInput" id="requestRadioDeclined">
    <label class="flex gap-2 text-gray-700 text-sm" for="requestRadioDeclined">
      <svg class="relative my-auto" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.69 13.28 14.69 12.89 14.3L10 11.41L7.11 14.3C6.72 14.69 6.09 14.69 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.69 6.09 14.69 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z"
          fill="#EE5D50" />
      </svg>
      <span>
        Declined
      </span>
    </label>
  </div>
</template>