import Vue from 'vue'

const KeepScrollTop = (Dom, name) => { // 添加监听

  Dom.addEventListener('scroll', scroll)

  function scroll() {
    let scrollNum = Dom && Dom.scrollTop
    localStorage.setItem(name, scrollNum)
  }
}

const SetScroll = (Dom, name) => { // 设置返回滚动条位置
  if (localStorage.getItem(name)) {
    if (!Dom.scrollTo) {
      Dom.scrollTop = localStorage.getItem(name)
    } else {
      Dom.scrollTo(0, localStorage.getItem(name))
    }
  }
}

const removeScrollNum = (name) => { // 清除滚动条数值
  if (localStorage.getItem(name)) {
    localStorage.removeItem(name)
  }
}

const KeepScrollLeft = (Dom, name) => { // 添加横向滚动监听

  Dom.addEventListener('scroll', scroll)

  function scroll() {
    let scrollNum = Dom && Dom.scrollLeft
    localStorage.setItem(name, scrollNum)
  }
}

const SetLeftScroll = (Dom, name) => { // 设置返回横向滚动条位置
  if (localStorage.getItem(name)) {

    Dom.scrollLeft = localStorage.getItem(name)

  }
}


Vue.prototype.$KeepScrollTop = KeepScrollTop
Vue.prototype.$SetScroll = SetScroll
Vue.prototype.$removeScrollNum = removeScrollNum
Vue.prototype.$KeepScrollLeft = KeepScrollLeft
Vue.prototype.$SetLeftScroll = SetLeftScroll
