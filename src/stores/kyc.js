import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

export const useKycStore = defineStore('kyc', () => {

  const kycData = reactive({
    bizCat: null,
    bizWebsite: null,
    bizAddress: null,
    bizBuildName: null,
    bizBusStop: null,
    bizLga: null
  });

  return { kycData }
})
