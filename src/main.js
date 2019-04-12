import Vue from 'vue'

import App from './App'
import i18n from '@/util/i18nFn'
import FastClick from 'fastclick'
import Navigation from 'vue-navigation'
import MintUI from 'mint-ui'
import AlloyFinger from 'AlloyFinger'
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue'
import router from '@/router/index'
import VConsole from 'vconsole'
import store from '@/store/index'

import '@/util/scroll'
import '@/util/component'
import '@/config/api'
import '@/config/axios'
import 'mint-ui/lib/style.css'

const Base64 = require('js-base64').Base64;

// let vConsole = new VConsole()
Vue.use(MintUI)
Vue.use(Navigation, { router})
Vue.use(AlloyFingerVue, {AlloyFinger})

// FastClick.attach(document.body)

Vue.config.productionTip = false


/* eslint-disable no-new */

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app-box')
