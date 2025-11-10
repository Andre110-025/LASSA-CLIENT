<script setup>
import { ref, onMounted } from 'vue'
import IconSpinner from '../icons/IconSpinner.vue'
import IconVerify from '../icons/IconVerify.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { toast } from 'vue3-toastify';

const userStore = useUserStore();

const router = useRouter();

const loading = ref(false);
// const resend = ref(false);

const token = ref(null);
// const time = ref('3:00');

// const countdown = () => {
//   let seconds = 300; // 5 minutes in seconds
//   const timer = setInterval(() => {
//     seconds--;

//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;

//     time.value = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;

//     if (seconds <= 0) {
//       clearInterval(timer);
//       resend.value = true;
//     }
//   }, 1000); // Update every second
// }

const checkVerifyType = async () => {
  if (userStore.verifyType === 'reg') {
    await verifyAccount();
  } else if (userStore.verifyType === 'reset') {
    await verifyReset();
  }
}

// From Reg or Login
const verifyAccount = async () => {
  loading.value = true;
  try {
    const response = await axios.patch('checktokenreg',{
      "otp": token.value
    })

    if (response.status === 200) {
      toast.success("Account Verified", {
        position: toast.POSITION.TOP_CENTER,
      });

      await userStore.getUserData();

      userStore.verifyType = null;
      loading.value = false;
      router.push({name: 'Dashboard'});
    }
  } catch (error) {
    toast.error("Token Incorrect", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
}

// From Reset Password
const verifyReset = async () => {
  loading.value = true;
  try {
    const response = await axios.patch('checktoken',{
      "userid": userStore.resetData.userid,
      "otp": token.value
    })

    if (response.status === 200) {
      toast.success("Token Correct", {
        position: toast.POSITION.TOP_CENTER,
      });

      userStore.resetData.otp = token.value;
      loading.value = false;
      router.push({name: 'Change Password'});
    }
  } catch (error) {
    toast.error("Token Incorrect", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
}

onMounted(() => {
  // countdown();
})
</script>

<template>
  <div class="relative bg-white h-full w-full sm:rounded-md p-4 sm:max-w-md sm:min-h-[450px] sm:min-w-[450px]">
    <div class="flex justify-center items-center top-0">
      <div class="p-5 my-5 rounded-full bg-blue-950 bg-opacity-10">
        <IconVerify class="w-8 h-8" />
      </div>
    </div>

    <form novalidate class="w-full max-w-[400px] mx-auto" autocomplete="off" @submit.prevent="checkVerifyType">

      <h4 class="text-center font-semibold mt-2.5">Verify your Account</h4>
      <p class="text-center text-xs mx-auto mt-2.5 w-48">Enter the 6 digit code sent to your email and Phone Number</p>

      <div class="inputHolder w-64 mx-auto">
        <input
          type="Text"
          placeholder="Enter Token"
          class="input"
          v-model="token"
          inputmode="numeric"
        />
      </div>

      <div v-if="false" class="mt-3 text-xs text-center">
        <span>If you didn't get the code, 
          <span class="underline underline-offset-4">
          Resend code</span> in <span v-text="time"></span> 
        </span>
      </div>

      <div class="my-5">
        <button
          :disabled="loading"
          type="submit"
          class="blueBtn min-w-[200px] mx-auto"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white tracking-wider" v-if="!loading">Proceed</span>
        </button>
      </div>
    </form>
  </div>
</template>