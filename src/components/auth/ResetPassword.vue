<script setup>
import { ref } from "vue";
import Logo from "../icons/IconLogo.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { toast } from 'vue3-toastify';

const userStore = useUserStore();

const router = useRouter();

const loading = ref(false);

const email = ref(null);

const checkUserExist = async () => {
  loading.value = true;
  try {
    const response = await axios.post("checkemailorphone", {
      email: email.value
    });
    console.log(response);
    if (response.status === 200) {
      toast.success("Token Sent", {
        position: toast.POSITION.TOP_CENTER,
      });

      userStore.verifyType = 'reset';
      userStore.resetData.userid = response.data.userId

      router.push({ name: "Verify Account" });

      loading.value = false;
    }
  } catch (error) {
    toast.error("Email not correct", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="relative flex flex-col justify-center bg-white h-full w-full sm:rounded-md p-4 sm:max-w-md sm:min-h-[450px] sm:min-w-[450px]"
  >
    <div class="flex justify-center items-center">
      <Logo class="h-auto w-40" />
    </div>
    <form
      novalidate
      @submit.prevent="checkUserExist"
      class="w-full max-w-[400px] mx-auto"
      autocomplete="off"
    >
      <p class="text-center uppercase mt-2.5">Reset Password</p>

      <div class="inputHolder">
        <input
          type="text"
          placeholder="Email/Phone Number"
          class="input placeholder:text-gray-800"
          id="email"
          v-model="email"
          autocomplete="email"
        />
      </div>

      <div class="mt-5">
        <button
          :disabled="loading || !email"
          type="submit"
          class="blueBtn min-w-[200px] mx-auto"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-sm font-medium text-white tracking-wider"
            v-if="!loading"
            >Reset Password</span
          >
        </button>
      </div>

      <div class="mt-3 mb-5 text-xs text-center">
        <span
          >Remember Password?
          <RouterLink class="font-semibold" :to="{ name: 'Login' }"
            >Login</RouterLink
          ></span
        >
      </div>
    </form>
  </div>
</template>
