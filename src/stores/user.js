import { reactive, ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import { useRouter } from "vue-router";

export const useUserStore = defineStore('userStore', () => {

  const router = useRouter();

  const userDetails = useStorage('_auth123', {
    accessToken: "",
    userInfo: null,
  });

  const walletDetails = reactive({
    balance: 0,
    history: []
  })

  const verifyType = ref(null);

  const resetData = reactive({
    userid: null,
    otp: null,
    password: null
  })

  const getUserData = async () => {
    try {
      const response = await axios.get('getuser')
      console.log(response);
      if (response.status === 200) {
        userDetails.value.userInfo = response.data.data[0];
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getWalletData = async () => {
    try {
      const response = await axios.get('getuserwallet')
      console.log(response);
      if (response.status === 200) {
        walletDetails.user_id = response.data.data.user_id
        walletDetails.balance = response.data.data[0].balance;
        walletDetails.application_balance = response.data.data[0].application_balance;
        walletDetails.mobile_balance = response.data.data[0].mobile_balance;
        walletDetails.pav_balance = response.data.data[0].pav_balance;
        walletDetails.streetlamp_processing_balance = response.data.data[0].streetlamp_processing_balance;
        walletDetails.streetlamp_administrative_balance = response.data.data[0].streetlamp_administrative_balance;
        walletDetails.history = response.data.data[0].wallet_transaction;
        walletDetails.onpremise_wallet = response.data.data[0].onpremise_wallet;
        walletDetails.temporary_wallet = response.data.data[0].temporary_wallet;
        walletDetails.outdoor_wallet = response.data.data[0].outdoor_wallet;
        walletDetails.small_format_wallet = response.data.data[0].small_format_wallet;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const logOut = async () => {
    try {
      const response = await axios.post('logout')
      if (response.status === 200) {
        $reset()
      }
    } catch (error) {
      $reset();
    }
  }
  
  const $reset = () => {
    delete axios.defaults.headers.common['Authorization']
    userDetails.value.accessToken = null;
    router.push({ name: "Login" })
    userDetails.value.userInfo = null;
    resetVerify()
  }

  const resetVerify = () => {
    verifyType.value = null;
    resetData.userid = null;
    resetData.otp = null;
    resetData.password = null;
  }

  return { verifyType, userDetails, resetData, walletDetails, $reset, getUserData, getWalletData, resetVerify, logOut }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}