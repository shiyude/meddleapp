import Vue from 'vue'
import Router from 'vue-router'
import {
  AlertModule
} from 'vux'


Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [{
      name: 'login',
      path: '/',
      component: () => import('@/page/login/login') // 登录
    },
    {
      name: 'forget',
      path: '/forget',
      component: () => import('@/page/login/forgetPassword') // 忘记密码
    },
    {
      name: 'index',
      path: '/home',
      component: () => import('@/page/tabbar/index'), // 主页
    },
    {
      name: 'setInBox',
      path: '/inBox/setInBox',
      component: () => import('@/page/tabbar/inbox/setInBox'), // 消息设置
    },
    {
      name: 'messageDetails',
      path: '/inBox/messageDetails',
      component: () => import('@/page/tabbar/inbox/messageDetails'), // 消息详情
    },
    {
      name: 'SendMessage',
      path: '/inBox/SendMessage',
      component: () => import('@/page/tabbar/inbox/SendMessage'), // 发送消息
    },
    {
      name: 'projectList',
      path: '/projectList',
      component: () => import('@/page/list/projectList') // 项目列表
    },
    {
      name: 'projectDetails',
      path: '/projectDetails',
      component: () => import('@/page/details/projectDetails') // 项目主页
    },
    {
      name: 'detailsImg',
      path: '/projectDetails/detailsImg',
      component: () => import('@/page/details/projectModule/detailsImg') // 项目图片列表
    },
    {
      name: 'siteplanPage',
      path: '/projectDetails/siteplanPage',
      component: () => import('@/page/details/projectModule/SitePlan/siteplanModule/siteplanPage') // 小区设计图页面
    },
    {
      name: 'building',
      path: '/projectDetails/building',
      component: () => import('@/page/details/projectModule/SitePlan/siteplanModule/building') // 楼盘设计图
    },
    {
      name: 'siteplanPageTable',
      path: '/projectDetails/table',
      component: () => import('@/page/details/projectModule/SitePlan/siteplanModule/table') // 楼盘设计图
    },
    {
      name: 'unitInfo',
      path: '/projectDetails/unitInfo',
      component: () => import('@/page/details/projectModule/Units/unitInfo') // 单元设计图
    },
    {
      name: 'sellBlock',
      path: '/projectDetails/sellBlock',
      component: () => import('@/page/details/projectModule/Units/sellBlock') // 经济公司sellBkick
    },
    {
      name: 'Interest',
      path: '/projectDetails/Interest',
      component: () => import('@/page/details/projectModule/Units/Interest') // 登记买家信息
    },
    {
      name: 'developerSellBlock',
      path: '/projectDetails/developerSellBlock',
      component: () => import('@/page/details/projectModule/Units/developerSellBlock') // 开发商sellBkick
    },
    {
      name: 'calculator',
      path: '/projectDetails/calculator',
      component: () => import('@/page/details/projectModule/Units/calculator') // 房贷计算器
    },
    {
      name: 'emailPage',
      path: '/projectDetails/emailPage',
      component: () => import('@/page/details/projectModule/Email/Email') // 邮箱
    },
    {
      name: 'emailSetting',
      path: '/emailSetting',
      component: () => import('@/page/settings/emailSetting'), // settings emailSetting
    },
    {
      name: 'myFile',
      path: '/myFile',
      component: () => import('@/page/settings/myFile'), // myFile
    },
    {
      name: 'syncDownload',
      path: '/syncDownload',
      component: () => import('@/page/settings/syncDownload'), // settings syncDownload
    },
    {
      name: 'sentEmails',
      path: '/sentEmails',
      component: () => import('@/page/settings/sentEmails'), // settings sentEmail
    },
    {
      name: 'passwordChange',
      path: '/passwordChange',
      component: () => import('@/page/settings/passwordChange'), // settings passwordChange
    },
    {
      name: 'collectLists',
      path: '/collectLists',
      component: () => import('@/page/settings/collectLists'), // collectList
    },
    {
      name: 'calenday',
      path: '/calenday',
      component: () => import('@/page/settings/calenday'), // calenday
    },
    {
      name: 'eventDetails',
      path: '/eventDetails',
      component: () => import('@/page/settings/eventDetails'), // calenday
    },
    {
      name: 'reports',
      path: '/reports',
      component: () => import('@/page/settings/reports'), // 
    },
    {
      name: 'language',
      path: '/language',
      component: () => import('@/page/settings/language'), // settings language
    },
    {
      name: 'PDFpage',
      path: '/PDFpage',
      component: () => import('@/page/details/projectModule/PDFpage'), // PDF查看
    },
    {
      name: 'seekUnitList',
      path: '/seekUnitList',
      component: () => import('@/page/details/projectModule/Units/seekUnitList'), // PDF查看
    },
    {
      name: 'floorPlanOfUnits',
      path: '/floorPlanOfUnits',
      component: () => import('@/page/details/projectModule/FloorPlan/floorPlanOfUnits'), // floorplan下面的units查看
    },
    {
      path: '*',
      component: () => import('@/page/tabbar/index')
    }, //全不匹配的情况下，返回404，路由按顺序从上到下，依次匹配。最后一个*能匹配全部，
  ]
})

export default router

router.beforeEach((to, from, next) => {
  let userInfo = localStorage.getItem('userInfo')
  userInfo = userInfo ? JSON.parse(userInfo) : {}
  if ((to.path !== '/' && to.path!=='/forget') && (userInfo.email === '' || userInfo.email === undefined)) {
    AlertModule.show({
      // title: Vue.prototype.$t('remind'),
      title: "alert",
      // content: Vue.prototype.$t('log_back_in'),
      content: "Login is invalid. Please login again",
      buttonText: 'OK',
      onShow() {
        // console.log('Module: I\'m showing')
      },
      onHide() {
        // console.log('Module: I\'m hiding now')
      }
    })
    next('/')
  } else if ((to.path === '/'||to.path === '/forget') && userInfo.email) {
    next('/home')
  } else {
    next()
  }
  next()
})
