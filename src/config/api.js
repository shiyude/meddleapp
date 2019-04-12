import Vue from 'vue'

/* 接口地址 */
Vue.api = Vue.prototype.$api = {
  login: "/broke-app-service/agent/login", // 登录
  queryProjectList: "/broke-app-service/project/queryProjectList", // 项目查询
  querySysConfig: "/broke-app-service/config/querySysConfig", // 系统配置
  queryGroupProject: "/broke-app-service/project/queryGroupProject", // 首页列表
  queryProjectMedia: "/broke-app-service/media/queryProjectMedia", //Gallery列表（image，video）
  queryGeneralFile: "/broke-app-service/media/queryGeneralFile", //查询files 列表
  sendFileMail: "/broke-app-service/email/sendFileMail", //发送general file email
  queryStarBuyList: "/broke-app-service/unit/queryStarBuyList", //Star Buy
  queryCoBrokeList:"/broke-app-service/project/queryCoBrokeList",//cobroke项目列表
  queryCoBroke:"/broke-app-service/project/queryCoBroke",//查询cobroke分组项目
  queryAppVersion:"/broke-app-service/version/queryAppVersion",//查询app版本更新
  //settings
  getEmailSetting: "/broke-app-service/settings/getEmailSetting", //获取经纪人邮箱信息
  saveEmailSetting: "/broke-app-service/settings/saveEmailSetting", //设置经纪人邮箱信息
  querySentEmailList: "/broke-app-service/settings/querySentEmailList", //查询经纪人发送邮件列表
  changePassword: "/broke-app-service/settings/changePassword", //修改密碼
  logOut: "/broke-app-service/settings/logOut", //退出登录
  uploadFile: "/broke-app-service/upload/uploadFile", //文件上传
  deleteFile: "/broke-app-service/upload/deleteFile", //删除文件
  //项目
  queryProjectInfo: "/broke-app-service/project/queryProjectInfo", // 查询项目详情
  queryMediaPDFList: "/broke-app-service/media/queryMediaPDFList", // 查询PDF列表
  queryFloorPlanList: "/broke-app-service/floor/queryFloorPlanList", //查询Floor Plan列表
  queryUnitList: "/broke-app-service/unit/queryUnitList", //查询Unit列表
  getFilterList: "/broke-app-service/unit/getFilterList", //Unitl列表下拉筛选条件，
  getUnitInfo: "/broke-app-service/unit/getUnitInfo", //获取UnitInfo详情
  sendMail: "/broke-app-service/email/sendMail", //发送邮件
  querySitePlanList: "/broke-app-service/siteplan/querySitePlanList", //查询site plan mapping列表
  querySitePlanMapping: "/broke-app-service/siteplan/querySitePlanMapping", //查询site plan mapping详情
  getUnitTransaction: "/broke-app-service/trade/getUnitTransaction", // 获取transaction
  addTransaction: "/broke-app-service/trade/addTransaction", // 保存transaction
  udpateTransaction: "/broke-app-service/trade/udpateTransaction", // 修改transaction
  queryBrokeProject: "/broke-app-service/project/queryBrokeProject", // Inbox-Message项目列表
  getNotificationList: "/broke-app-service/inbox/getNotificationList", // 查詢通知Notification列表
  sendInBox: "/broke-app-service/inbox/sendInBox", // 发送通知
  queryInboxMessageList: "/broke-app-service/inbox/queryInboxMessageList", // 查詢通知Message列表
  messageUpdateIsRead: "/broke-app-service/inbox/messageUpdateIsRead", // 设置Message已读
  uploadFilequeryTableList:"/broke-app-service/unit/queryTableList",//查询table列表
  queryReportForm:"/broke-app-service/report/queryReportForm",//统计报表
  getExchange: "/broke-app-service/exchange/getExchange", // 汇率
  getProjectSetById: "/broke-app-service/project/getProjectSetById", // 项目设置
  selectCustomer: "/broke-app-service/trade/selectCustomer", // 查找买家列表
  getInterestList: "/broke-app-service/interest/getInterestList", // interest列表
  submitInterest: "/broke-app-service/interest/submitInterest", // 上传interest
  getInterestBuyerUnit: "/broke-app-service/interest/getInterestBuyerUnit", // 获取意向买家信息
  uploadTransactionFile: "/broke-app-service/upload/uploadTransactionFile", // 上传合同图片
  saveDocumentsUrl: "/broke-app-service/trade/saveDocumentsUrl", // 保存图片
  queryDocumentsList: "/broke-app-service/trade/queryDocumentsList", // 获取合同上传列表
  queryDocumentsVersion: "/broke-app-service/trade/queryDocumentsVersion", // 查看往期生成合同
  transactionGenerate: "/broke-app-service/trade/transactionGenerate", // 生成合同
  getUnitRoleAccess: "/broke-app-service/access/getUnitRoleAccess", // sellblock权限
  getBuyer: "/broke-app-service/trade/getBuyer", // 获取buyer
  getSalesRepList: "/broke-app-service/trade/getSalesRepList", // 获取SalesRepList
  getInterestChoice: "/broke-app-service/interest/getInterestChoice", // Interest页面获取UNIT列表
  queryCollectProjectList:"/broke-app-service/collect/queryCollectProjectList",//用户收藏项目列表
  cancelCollect:"/broke-app-service/collect/cancelCollect",//用户取消收藏
  agentCollect:"/broke-app-service/collect/agentCollect",//用户收藏项目
  queryCalendar:"/broke-app-service/calendar/queryCalendar",//查询某个月下的日程
  queryCalendarList:"/broke-app-service/calendar/queryCalendarList",//查询当天下的所有日程
  queryCalendarDetail:"/broke-app-service/calendar/queryCalendarDetail",//查询日程详情
  sendCode:"/broke-app-service/agent/sendCode",//发送邮箱验证码
  resetPassword:"/broke-app-service/agent/resetPassword",//重置密码
  insertProjectLike:"/broke-app-service/project/insertProjectLike",//项目点赞
  downloadFile: "/broke-app-service/download/downloadImg" ,// 下载图片
  updateLastUpdateTime:"/broke-app-service/agent/updateLastLoginTime",//设置用户最后登录时间
  queryAgentFiles:"/broke-app-service/agent/queryAgentFiles",//查询经纪人文件
  delAgentFile:"/broke-app-service/agent/delAgentFile",//删除经纪人文件
  uploadAgentFiles:"/broke-app-service/upload/uploadAgentFiles",//保存经纪人文件

}
