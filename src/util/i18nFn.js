// import Vue from 'vue'
// import Vuex from 'vuex';
// import vuexI18n from 'vuex-i18n';

// Vue.use(Vuex)

// const store = new Vuex.Store({
//   modules: {
//     i18n: vuexI18n.store
//   }
// })

// Vue.use(vuexI18n.plugin, store)

// Vue.i18n.add('zh', translationsZh)
// Vue.i18n.add('en', translationsEn)

// let isLang = localStorage.getItem('lang')

// if (!isLang) {
//   Vue.i18n.set('eh')
//   localStorage.setItem('lang', 'en')
// } else {
//   Vue.i18n.set(isLang)
// }

// const setI18n = (lang) => {
//   Vue.i18n.set(lang)
//   localStorage.setItem('lang', lang)
// }

// Vue.prototype.$setI18n = setI18n

import Zh from '@/assets/i18n/zh.json'
import En from '@/assets/i18n/en.json'
import VueI18n from 'vue-i18n'//需先安装vue-i18n
import Vue from 'vue'

Vue.use(VueI18n)
let zh = Zh
let en = En
let messagesData = {
 zh: zh,
 en: en
}

let i18n = new VueI18n({
  locale: 'en',
  messages: messagesData
})

// let lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
// lang = lang.substr(0, 2);//截取lang前2位字符
// if(lang == 'zh'){
//   i18n.locale = 'zh'
// }else{
//   i18n.locale = 'en'
// }

const setLang = (lang) => {
  i18n.locale = lang
  localStorage.setItem('lang', lang)

  if(localStorage.getItem('cutLan')) {
    localStorage.removeItem('cutLan')
    window.location.reload();
  }
}
const getLang = () => {
  return i18n.locale
}

let langType = localStorage.getItem('lang')
if(langType) {
  setLang(langType)
} else {
  localStorage.setItem('lang', 'en')
}



Vue.prototype.$setLang = setLang
Vue.prototype.$getLang = getLang

export default i18n
