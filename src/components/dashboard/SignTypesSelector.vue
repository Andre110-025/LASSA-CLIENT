<script setup>
import { ref, onMounted, defineModel } from "vue";
import signTypesService from "../../services/signTypesService";

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  productType: {
    type: String,
    required: true,
  },
  disableSelected: {
    type: Boolean,
    default: false,
  },
  selectedSign: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Type of Sign",
  },
});

const model = defineModel();
const signTypes = ref([]);
const error = ref(null);
const loadingSigns = ref(false);

// Method to load sign types from service
const loadSignTypes = async () => {
  loadingSigns.value = true;
  error.value = null;

  try {
    const types = await signTypesService.getSignTypes(props.productType);
    signTypes.value = types;
  } catch (err) {
    console.error("Error loading sign types:", err);
    error.value = "Failed to load sign types";
    // Fallback to empty array - service handles fallback internally
    signTypes.value = [];
  } finally {
    loadingSigns.value = false;
  }
};

// Load sign types when component mounts
onMounted(async () => {
  await loadSignTypes();
});
</script>

<template>
  <div class="inputHolder">
    <select
      placeholder=" "
      class="input peer capitalize"
      :id="'typeSign' + index"
      v-model="model"
      :disabled="loadingSigns"
      required
    >
      <option value="" disabled>
        {{ loadingSigns ? "Loading sign types..." : "Select sign type" }}
      </option>
      <option
        class="capitalize"
        v-for="sign in signTypes"
        :key="sign.id"
        :value="sign.value"
        v-text="sign.name"
        :disabled="disableSelected && selectedSign === sign.value"
        :selected="model === sign.value"
      ></option>
    </select>

    <label :for="'typeSign' + index" class="inputLabel" v-text="props.label"></label>

    <!-- Error message if loading fails -->
    <div v-if="error" class="text-red-500 text-xs mt-1 px-2">
      {{ error }}
    </div>
  </div>
</template>
