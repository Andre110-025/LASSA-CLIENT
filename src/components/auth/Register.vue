<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import Logo from "../icons/IconLogo.vue";
import IconEye from "../icons/IconEye.vue";
import IconHidden from "../icons/IconHidden.vue";
import IconSpinner from "../icons/IconSpinner.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import {
  email,
  required,
  sameAs,
  alpha,
  numeric,
  minLength,
  maxLength,
  helpers,
} from "@vuelidate/validators";
import { useHelpers } from "../../helper";
import { toast } from "vue3-toastify";

const userStore = useUserStore();
const router = useRouter();

const { containsUppercase, containsLowercase, containsNumber } = useHelpers();

const passwordShow1 = ref(false);
const passwordShow2 = ref(false);
const loading = ref(false);
const recaptchaWidgetId = ref(null);

const RegData = reactive({
  business_name: null,
  first_name: null,
  last_name: null,
  email: null,
  phone_number: null,
  password: null,
  cPwd: null,
  terms: false,
  recaptchaToken: null,
});

const rules = computed(() => ({
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Enter a valid email", email),
  },
  first_name: {
    required: helpers.withMessage("First Name is required", required),
    alpha: helpers.withMessage("First Name must be alphabet", alpha),
    minLength: helpers.withMessage(
      "First Name must be at least 3 characters",
      minLength(3)
    ),
  },
  last_name: {
    required: helpers.withMessage("Last Name is required", required),
    alpha: helpers.withMessage("Last Name must be alphabet", alpha),
    minLength: helpers.withMessage(
      "Last Name must be at least 3 characters",
      minLength(3)
    ),
  },
  business_name: {
    required: helpers.withMessage("Business Name is required", required),
    minLength: helpers.withMessage(
      "Last Name must be at least 5 characters",
      minLength(3)
    ),
  },
  phone_number: {
    required: helpers.withMessage("Phone Number is required", required),
    numeric: helpers.withMessage("Field must be a Number", numeric),
    minLength: helpers.withMessage(
      "Phone Number must be at least 10 characters",
      minLength(10)
    ),
    maxLength: helpers.withMessage(
      "Phone Number must be at most 11 characters",
      maxLength(11)
    ),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage(
      "Password must be at least 6 characters",
      minLength(8)
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
    ),
  },
  cPwd: {
    required: helpers.withMessage(
      "Password confirmation is required",
      required
    ),
    sameAsPassword: helpers.withMessage(
      "Passwords don't match",
      sameAs(RegData.password)
    ),
  },
  terms: {
    sameAsPassword: helpers.withMessage(
      "You must check Terms and Conditions",
      sameAs(true)
    ),
  },
  recaptchaToken: {
    required: helpers.withMessage("Please complete the reCAPTCHA verification", required),
  },
}));

const v$ = useVuelidate(rules, RegData);

// reCAPTCHA functions
const renderRecaptcha = () => {
  if (window.grecaptcha && document.getElementById('g-recaptcha')) {
    recaptchaWidgetId.value = window.grecaptcha.render('g-recaptcha', {
      'sitekey': import.meta.env.VITE_RECAPTCHA_SITE_KEY,
      'callback': onRecaptchaVerified,
      'expired-callback': onRecaptchaExpired,
      'error-callback': onRecaptchaError
    });
  }
};

const onRecaptchaVerified = (token) => {
  RegData.recaptchaToken = token;
};

const onRecaptchaExpired = () => {
  RegData.recaptchaToken = null;
};

const onRecaptchaError = () => {
  RegData.recaptchaToken = null;
  toast.error("reCAPTCHA error occurred", {
    position: toast.POSITION.TOP_CENTER,
  });
};

const resetRecaptcha = () => {
  if (window.grecaptcha && recaptchaWidgetId.value !== null) {
    window.grecaptcha.reset(recaptchaWidgetId.value);
    RegData.recaptchaToken = null;
  }
};

const submitReg = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;
  
  if (!RegData.recaptchaToken) {
    toast.error("Please complete the reCAPTCHA verification", {
      position: toast.POSITION.TOP_CENTER,
    });
    return;
  }
  
  loading.value = true;

  try {
    const response = await axios.post("register", RegData);

    if (response.status === 200) {
      toast.success("Registration Successful", {
        position: toast.POSITION.TOP_CENTER,
      });
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.token;
      userStore.userDetails.accessToken = response.data.token;

      userStore.verifyType = "reg";

      router.push({ name: "Verify Account" });
    }
  } catch (error) {
    // Reset reCAPTCHA on error
    resetRecaptcha();
    
    if (error.response?.status == 500) {
      toast.warning("Email/Phone Number Already Used", {
        position: toast.POSITION.TOP_CENTER,
      });
      toast.error("Something went wrong", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (error.response?.data?.errors?.length) {
      error.response.data.errors.forEach((element) => {
        toast.error(element, {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    } else {
      toast.error("Account Could not be Created", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // Wait for recaptcha to be loaded
  if (window.grecaptcha && window.grecaptcha.render) {
    renderRecaptcha();
  } else {
    // Define global callback for when recaptcha loads
    window.onRecaptchaLoaded = () => {
      renderRecaptcha();
    };
  }
});

onBeforeUnmount(() => {
  // Clean up
  if (window.onRecaptchaLoaded) {
    window.onRecaptchaLoaded = undefined;
  }
});
</script>

<template>
  <div
    class="relative bg-white h-full w-full sm:rounded-md p-4 sm:max-w-md sm:min-h-[450px] sm:min-w-[450px]"
  >
    <div class="flex justify-center items-center top-0">
      <Logo class="h-auto w-40" />
    </div>

    <form
      @submit.prevent="submitReg"
      class="w-full max-w-[400px] mx-auto"
      autocomplete="off"
    >
      <p class="text-center uppercase mt-2.5">Create new Account</p>

      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="business_name"
          v-model="RegData.business_name"
          autocomplete="off"
          @blur="v$.business_name.$touch"
        />
        <label for="business_name" class="inputLabel">Business Name</label>
      </div>

      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="first_name"
          v-model="RegData.first_name"
          autocomplete="off"
          @blur="v$.first_name.$touch"
        />
        <label for="first_name" class="inputLabel">First Name</label>
      </div>

      <div class="inputHolder">
        <input
          type="text"
          placeholder=" "
          class="input peer"
          id="last_name"
          v-model="RegData.last_name"
          autocomplete="off"
          @blur="v$.last_name.$touch"
        />
        <label for="last_name" class="inputLabel">Last Name</label>
      </div>

      <div class="inputHolder">
        <input
          type="email"
          placeholder=" "
          class="input peer"
          id="email"
          v-model="RegData.email"
          autocomplete="off"
          inputmode="email"
          @blur="v$.email.$touch"
        />
        <label for="email" class="inputLabel">Email</label>
      </div>

      <div class="inputHolder">
        <input
          type="tel"
          placeholder=" "
          class="input peer"
          id="pNum"
          v-model="RegData.phone_number"
          autocomplete="off"
          @blur="v$.phone_number.$touch"
          inputmode="tel"
        />
        <label for="pNum" class="inputLabel">Phone Number</label>
      </div>

      <!-- Password -->
      <div class="inputHolder">
        <input
          :type="passwordShow1 ? 'text' : 'password'"
          placeholder=" "
          class="input peer"
          id="password"
          v-model="RegData.password"
          @blur="v$.password.$touch"
          autocomplete="new-password"
        />
        <label for="password" class="inputLabel">Password</label>
        <div
          class="absolute top-1.5 right-7"
          @click="passwordShow1 = !passwordShow1"
        >
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
          v-model="RegData.cPwd"
          autocomplete="new-password"
          @blur="v$.cPwd.$touch"
        />
        <label for="cPwd" class="inputLabel">Confirm Password</label>
        <div
          class="absolute top-1.5 right-7"
          @click="passwordShow2 = !passwordShow2"
        >
          <IconEye class="w-5" v-if="passwordShow2" />
          <IconHidden class="w-5" v-else />
        </div>
      </div>

      <!-- Terms -->
      <div class="flex justify-center gap-3 text-xs my-5">
        <input
          type="checkbox"
          id="terms"
          v-model="RegData.terms"
          @blur="v$.terms.$touch"
          required
        />
        <label for="terms"
          >I agree to the <strong>Terms of Service</strong> and
          <strong>Privacy Policy</strong></label
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

      <!-- reCAPTCHA container -->
      <div class="flex justify-center my-4">
        <div id="g-recaptcha"></div>
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
            >Continue</span
          >
        </button>
      </div>

      <div class="mt-3 mb-5 text-xs text-center">
        <span
          >Have an Account?
          <RouterLink class="font-semibold" :to="{ name: 'Login' }"
            >Sign In</RouterLink
          ></span
        >
      </div>
    </form>
  </div>
</template>