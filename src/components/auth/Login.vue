<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Logo from "../icons/IconLogo.vue";
import IconEye from "../icons/IconEye.vue";
import IconHidden from "../icons/IconHidden.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { toast } from "vue3-toastify";

const userStore = useUserStore();
const router = useRouter();

const pwdShow1 = ref(false);
const loading = ref(false);

const loginData = reactive({
  email: null,
  password: null,
});

const rules = computed(() => ({
  email: {
    required: helpers.withMessage("Email/phone number is required", required),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
  },
}));

const v$ = useVuelidate(rules, loginData);

const submitLogInInfo = async () => {
  if (v$.value.$invalid) return;
  loading.value = true;
  
  try {    
    const response = await axios.post("login", loginData);
    
    if (response.status === 200) {
      toast.success("Login Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.success.token;
      userStore.userDetails.accessToken = response.data.success.token;

      if (!response.data.success.verified_account) {
        toast.success("OTP Sent", {
          position: toast.POSITION.TOP_CENTER,
        });
        userStore.verifyType = "reg";

        router.push({ name: "Verify Account" });
      } else {
        await userStore.getUserData();

        router.push({ name: "Dashboard" });
      }
    }
  } catch (error) {
    toast.error("Enter Valid Credentials", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  userStore.$reset();
})
</script>

<template>
  <div
    class="relative bg-white h-full w-full sm:rounded-md p-4 sm:max-w-md sm:min-h-[450px] sm:min-w-[450px]"
  >
    <div class="flex justify-center items-center top-0">
      <Logo class="h-auto w-40" />
    </div>

    <form
      @submit.prevent="submitLogInInfo"
      class="w-full max-w-[400px] mx-auto"
      autocomplete="off"
    >
      <p class="text-center uppercase mt-2.5">Login to Continue</p>

      <div class="inputHolder">
        <input
          type="text"
          placeholder="Email/Phone Number"
          class="input placeholder:text-gray-800"
          id="email"
          v-model="loginData.email"
          autocomplete="email"
          @blur="v$.email.$touch"
          required
          inputmode="email"
        />
      </div>

      <!-- Password -->
      <div class="inputHolder">
        <input
          :type="pwdShow1 ? 'text' : 'password'"
          placeholder="Password"
          class="input placeholder:text-gray-800"
          id="pwd"
          v-model="loginData.password"
          autocomplete="new-password"
          @blur="v$.password.$touch"
          required
        />
        <div class="absolute top-1.5 right-7" @click="pwdShow1 = !pwdShow1">
          <IconEye class="w-5" v-if="pwdShow1" />
          <IconHidden class="w-5" v-else />
        </div>
        <router-link
          class="mt-2.5 text-end text-sm font-semibold"
          :to="{ name: 'Reset Password' }"
          >Forgot Password?</router-link
        >
      </div>

      <div class="text-xs space-y-2 w-full px-5 mb-4">
        <span
          class="block text-red-600"
          v-for="(item, index) in v$.$errors"
          :key="index"
          v-text="item.$message"
        ></span>
      </div>

      <div class="mt-5">
        <button
          :disabled="loading || v$.$invalid"
          type="submit"
          class="blueBtn min-w-[200px] mx-auto"
        >
          <IconSpinner v-if="loading" />
          <span
            class="text-sm font-medium text-white tracking-wider"
            v-if="!loading"
            >Sign In</span
          >
        </button>
      </div>

      <div class="mt-3 mb-5 text-xs text-center">
        <span
          >Don't Have an Account?
          <RouterLink class="font-semibold" :to="{ name: 'Register' }"
            >Register</RouterLink
          ></span
        >
      </div>
    </form>
  </div>
</template>