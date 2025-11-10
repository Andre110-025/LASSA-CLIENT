<script setup>
import { ref, reactive, computed } from 'vue'
import Logo from '../icons/IconLogo.vue'
import IconEye from '../icons/IconEye.vue'
import IconHidden from '../icons/IconHidden.vue'
import IconSpinner from '../icons/IconSpinner.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from "../../stores/user";
import axios from 'axios'
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  sameAs,
  minLength,
  helpers,
} from "@vuelidate/validators";
import { useHelpers } from '../../helper'
import { toast } from 'vue3-toastify';


const userStore = useUserStore();

const router = useRouter();

const { containsUppercase, containsLowercase, containsNumber } = useHelpers();

const passwordShow1 = ref(false);
const passwordShow2 = ref(false);
const loading = ref(false);

const pwdData = reactive({
  password: null,
  cPwd: null,
})

const rules = computed(() => ({
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage(
      "Password must be at least 6 characters",
      minLength(6)
    ),
    containsUppercase: helpers.withMessage(
      "Password must include uppercase",
      containsUppercase
    ),
    containsLowercase: helpers.withMessage(
      "Password must include lowercase",
      containsLowercase
    ),
    containsNumber: helpers.withMessage(
      "Password must include numbers",
      containsNumber
    )
  },
  cPwd: {
    required: helpers.withMessage(
      "Password confirmation is required",
      required
    ),
    sameAsPassword: helpers.withMessage(
      "Passwords don't match",
      sameAs(pwdData.password)
    ),
  }
}));

const v$ = useVuelidate(rules, pwdData);

const changePwd = async () => {
  loading.value = true;
  userStore.resetData.password = pwdData.password
  try {
    const response = await axios.patch('changepassword', userStore.resetData);
    console.log(response);
    if (response.status === 200) {
      toast.success("Password Successfully Changed", {
        position: toast.POSITION.TOP_CENTER,
      });

      userStore.resetVerify()
      loading.value = false;
      router.push({name: 'Login'});
    }
  } catch (error) {
    toast.error("Something went wrong", {
      position: toast.POSITION.TOP_CENTER,
    });
    console.log(error);
    loading.value = false;
  }
}
</script>

<template>
  <div class="relative bg-white h-full w-full flex flex-col items-center justify-center sm:rounded-md p-4 sm:max-w-md sm:min-h-[450px] sm:min-w-[450px]">
    <div class="flex justify-center items-center top-0">
      <Logo class="h-auto w-40" />
    </div>

    <form novalidate @submit.prevent="changePwd" class="w-full max-w-[400px] mx-auto" autocomplete="off">
      <p class="text-center uppercase mt-2.5">Enter new Password</p>

      <!-- Password -->
      <div class="inputHolder">
        <input
          :type="passwordShow1 ? 'text' : 'password'"
          placeholder=" "
          class="input peer"
          id="password"
          v-model="pwdData.password"
          @blur="v$.password.$touch"
          autocomplete="new-password"
        />
        <label for="password" class="inputLabel">Password</label>
        <div class="absolute top-1.5 right-7" @click="passwordShow1 = !passwordShow1">
          <IconEye class="w-5" v-if="passwordShow1" />
          <IconHidden class="w-5" v-else />
        </div>
      </div>

      <div class="inputHolder">
        <input
          :type="passwordShow2 ? 'text' : 'password'"
          placeholder=" "
          class="input peer"
          id="cPwd"
          v-model="pwdData.cPwd"
          autocomplete="new-password"
          @blur="v$.cPwd.$touch"
        />
        <label for="cPwd" class="inputLabel">Confirm Password</label>
        <div class="absolute top-1.5 right-7" @click="passwordShow2 = !passwordShow2">
          <IconEye class="w-5" v-if="passwordShow2" />
          <IconHidden class="w-5" v-else />
        </div>
      </div>

      <div class="mt-5">
        <button
          :disabled="loading"
          type="submit"
          class="blueBtn min-w-[200px] mx-auto"
        >
          <IconSpinner v-if="loading" />
          <span class="text-sm font-medium text-white tracking-wider" v-if="!loading">Continue</span>
        </button>
      </div>
    </form>
  </div>
</template>