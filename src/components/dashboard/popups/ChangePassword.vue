<script setup>
import { VueFinalModal } from "vue-final-modal";
import IconCloseLight from "../../icons/IconCloseLight.vue";
import IconSpinner from "../../icons/IconSpinner.vue";
import { ref, reactive, computed } from "vue";
import IconEye from "../../icons/IconEye.vue";
import IconHidden from "../../icons/IconHidden.vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { required, sameAs, minLength, helpers } from "@vuelidate/validators";
import { toast } from "vue3-toastify";
import { useHelpers } from "../../../helper";

const emit = defineEmits(["confirm"]);

const { containsUppercase, containsLowercase, containsNumber } = useHelpers();

const pwdShow = ref([false,false,false]);
const loading = ref(false);
const passwordData = reactive({
  oldpassword: null,
  password: null,
  cPassword: null
});

const rules = computed(() => ({
  oldpassword: {
    required: helpers.withMessage("Old Password is required", required),
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
  cPassword: {
    required: helpers.withMessage(
      "Password confirmation is required",
      required
    ),
    sameAsPassword: helpers.withMessage(
      "Passwords don't match",
      sameAs(passwordData.password)
    ),
  }
}));

const v$ = useVuelidate(rules, passwordData);

const updatePassword = async () => {
  if (v$.value.$invalid) return;
  loading.value = true;

  try {
    const { data } = await axios.post("edituserpassword", passwordData);
    console.log(data);
    if (data.success) {
      toast.success(data.message);
      emit("confirm");
    }
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.errors);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <VueFinalModal
    class="flex h-full w-full justify-center items-center"
    content-class="relative bg-white border space-y-2 w-full sm:w-4/5 sm:min-w-[400px]] min-h-[300px] max-w-[340px]"
    overlay-class="bg-background/80 backdrop-blur-sm"
    :overlayTransition="'vfm-fade'"
    :contentTransition="'vfm-fade'"
    :clickToClose="true"
  >
    <div class="flex flex-col">
      <button
        class="absolute right-6 top-5 cursor-pointer"
        @click="emit('confirm')"
      >
        <IconCloseLight class="w-4 h-auto" />
      </button>

      <!-- content goes here -->
      <div class="mt-8">
        <h5
          class="text-center text-lg font-semibold border-b-2 border-gray-200 mb-3 pb-2"
        >
          Change Password
        </h5>
        <form
          class="flex flex-col justify-center pb-8"
          @submit.prevent="updatePassword"
        >
          <div class="inputHolder">
            <input
              :type="pwdShow[0] ? 'text' : 'password'"
              placeholder="Enter Old Password"
              class="input placeholder:text-gray-800"
              id="pwd"
              v-model="passwordData.oldpassword"
            />
            <label for="pwd" class="inputLabel"> Current Password </label>

            <div class="absolute top-1.5 right-7" @click="pwdShow[0] = !pwdShow[0]">
              <IconEye class="w-5" v-if="pwdShow[0]" />
              <IconHidden class="w-5" v-else />
            </div>
          </div>
          
          <div class="inputHolder">
            <input
              :type="pwdShow[1] ? 'text' : 'password'"
              placeholder="Enter New Password"
              class="input placeholder:text-gray-800"
              id="pwd-new"
              v-model="passwordData.password"
            />
            <label for="pwd-new" class="inputLabel"> New Password </label>

            <div class="absolute top-1.5 right-7" @click="pwdShow[1] = !pwdShow[1]">
              <IconEye class="w-5" v-if="pwdShow[1]" />
              <IconHidden class="w-5" v-else />
            </div>
          </div>

          <div class="inputHolder">
            <input
              :type="pwdShow[2] ? 'text' : 'password'"
              placeholder="Password"
              class="input placeholder:text-gray-800"
              id="pwd-confirm"
              v-model="passwordData.cPassword"
            />
            <label for="pwd-confirm" class="inputLabel"> Confirm New Password </label>

            <div class="absolute top-1.5 right-7" @click="pwdShow[2] = !pwdShow[2]">
              <IconEye class="w-5" v-if="pwdShow[2]" />
              <IconHidden class="w-5" v-else />
            </div>
          </div>

          <button
            :disabled="loading || v$.$invalid"
            type="submit"
            class="w-40 py-4 text-center cursor-pointer rounded-md text-xs border-2 bg-mainColor text-white mx-auto"
          >
            <IconSpinner v-if="loading" />
            <span
              class="text-xs text-center font-medium text-white tracking-wider"
              v-if="!loading"
            >
              Update Password
            </span>
          </button>

        </form>
      </div>
    </div>
  </VueFinalModal>
</template>

<style scoped>
.inputHolder {
    @apply my-4
}
</style>

