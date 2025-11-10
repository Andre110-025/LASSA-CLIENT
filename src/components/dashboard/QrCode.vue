<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps({
  formType: String,
  id: Number
})

const getEndPoint = () => {
  if (props.formType === "premise") return "generateonpremiseqrcode";
  else if (props.formType === "Mobile")
    return "generatemobileadsqrcode";
  else if (props.formType === "ThirdPartyMobile")
    return "generatethirdpartymobileqrcode";
  else if (props.formType === "streetLamp") return "generatestreetlampqrcode";
};

const qrCode = ref(null);

const getQrCode = async () => {
  try {
    const response = await axios.get(`${getEndPoint()}/${props.id}`);

    if (response.status === 200) {
      qrCode.value = response.data;
    }
  } catch (error) {
    console.log(error);
  }
}

getQrCode();
</script>

<template>
  <div v-if="qrCode" class="flex flex-col p-6 gap-4">
    <h6 class="border-b-gray-300 border-b-2 text-lg font-semibold pb-2 mb-3">
      Advert QR Code
    </h6>
    <div v-html="qrCode" class="qrCode"></div>
  </div>
</template>

<style>
.qrCode svg {
  @apply block w-full h-full max-w-[250px] max-h-[250px] mx-auto
}
</style>
