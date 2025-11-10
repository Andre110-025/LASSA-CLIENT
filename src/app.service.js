import axios from "axios";
import { toast } from 'vue3-toastify';
import { useUserStore } from "./stores/user";

// axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
// axios.defaults.baseURL = 'https://backend.lasaa.lg.gov.ng/public/api/';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const user = JSON.parse(window.localStorage.getItem('_auth123'))

if (user?.accessToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.accessToken;
}

axios.interceptors.response.use(undefined, error => {
  
  const userStore = useUserStore();

  console.log(error)
  if (error.message === 'Network Error') {
    console.log(error.message)
    toast.error("No internet connection", {
      position: toast.POSITION.TOP_CENTER,
    });
  } else if (error.response.data.message === "Unauthenticated.") {
    console.log(error.response.data.message)
    toast.error("Kindly Login", {
      position: toast.POSITION.TOP_CENTER,
    });

    userStore.$reset()
  }

  return Promise.reject(error);
})