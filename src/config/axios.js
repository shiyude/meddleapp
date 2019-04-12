import Vue from 'vue'
import {
  baseURL
} from '@/config/evn'
import axios from 'axios'
import qs from 'qs'
import {
  AlertModule,
  LoadingPlugin,
  ToastPlugin
} from 'vux'
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin, {
  position: 'middle'
})
import router from '@/router/index'

const axiosX = axios.create({
  baseURL: baseURL
})

// 校验是否有html标签
function hasHTML(data) {
  data = JSON.stringify(data)
  let reg1 = /<\/?[^>]*>/g
  let reg2 = /&nbsp;/ig
  if (reg1.test(data) || reg2.test(data)) {
    return true
  } else {
    return false
  }
}

const XHR = (isLoading) => {

  const user = { // 用户登陆信息
    agentId: JSON.parse(localStorage.getItem('userInfo') || '{}').agentId || '',
    brokeId: JSON.parse(localStorage.getItem('userInfo') || '{}').brokeId || '',
    token: JSON.parse(localStorage.getItem('userInfo') || '{}').token || '',
  }

  const sucFun = res => { // 成功执行方法 
    if (isLoading) {
      Vue.$vux.loading.hide()
    }

    if (res.data.code === '-2') {
      // console.log('登录失效')
      AlertModule.show({
        // title: Vue.prototype.$t('remind'),
        title: "alert",
        // content: Vue.prototype.$t('log_back_in'),
        content: "Login is invalid. Please login again",
        buttonText: 'OK',
        onShow() {

        },
        onHide() {
          sessionStorage.clear();
          localStorage.clear();
          router.replace("/");
          // console.log('Module: I\'m hiding now')
        }
      })
    } else {
      return res.data
    }
  }

  const errFun = err => { // 失败执行访求 
    if (isLoading) {
      Vue.$vux.loading.hide()
    }
    Vue.$vux.toast.show({
      text: 'Fail',
      type: "cancel"
    })

    console.log(err, '失败')
  }

  return {
    user,
    sucFun,
    errFun
  }
}

const Post = function (url = '', data = {}, isLoading = false, allowHTML = false) {
  if (!allowHTML && hasHTML(data)) {
    return Promise.resolve({
      msg: '您的填写的数据带有非法字符，请改正后重试'
    })
  }
  if (isLoading) {
    Vue.$vux.loading.show({
      text: 'Loading'
    })
  }
  let {
    user,
    sucFun,
    errFun
  } = XHR(isLoading)
  let reqData = qs.stringify({
    ...user,
    ...data
  })
  return axiosX.post(url, reqData).then(sucFun).catch(errFun)
}

const Get = function (url = '', data = {}, isLoading = false, allowHTML = false) {
  if (!allowHTML && hasHTML(data)) {
    return Promise.resolve({
      msg: '您的填写的数据带有非法字符，请改正后重试'
    })
  }
  if (isLoading) {
    Vue.$vux.loading.show({
      text: 'Loading'
    })
  }
  let {
    user,
    sucFun,
    errFun
  } = XHR(isLoading)
  let params = {
    params: {
      ...user,
      ...data
    }
  }
  return axiosX.get(url, params).then(sucFun).catch(errFun)
}
const PostFormData = function (url = '', formData, isLoading = true) {
  if (isLoading) {
    Vue.$vux.loading.show({
      text: 'Loading'
    })
  }
  let config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
  let {
    sucFun,
    errFun
  } = XHR(isLoading)
  return axios.post(baseURL + url, formData, config).then(sucFun).catch(errFun)
}


Vue.prototype.$PostFormData = PostFormData
Vue.prototype.$Post = Post
Vue.prototype.$Get = Get
