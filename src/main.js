import './assets/main.css'
import 'vue-final-modal/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'
import Vue3Toasity from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import "./app.service"
import TawkMessengerVue from '@tawk.to/tawk-messenger-vue-3';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createVfm())
app.use(Vue3Toasity, {
  autoClose: 3000,
  clearOnUrlChange: false,
  position: 'top-center'
})
app.use(TawkMessengerVue, {
  propertyId : '675964b8af5bfec1dbda3d84',
  widgetId : '1ieqj2sq1'
})

app.mount('#lasaaClient')
