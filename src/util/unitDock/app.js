import {
  MessageBox
} from "mint-ui";
import Vue from "vue"
const judgeAgent = (version, obj = {}) => { //判断设备的系统
  let u = navigator.userAgent;
  let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    console.log("安卓");
    getVersion("1", version, obj);
  }
  if (isIOS) {
    getVersion("0", version, obj);
    console.log("苹果");
  }
}

const getVersion = (type, version, obj) => { //请求接口获取版本号对比unit传的版本
  Vue.prototype.$Get(Vue.api.queryAppVersion, {
    type: type
  }).then(res => {
    if (res.code == 0) {
      let data = res.datas;
      if (data.versionNo !== version) {
        //判断版本号是否一样
        if (data.isUpdate) {
          //强制更新
          MessageBox({
            message: data.desc,
            title: obj.$t('versionUpdate'),
            confirmButtonText: obj.$t('sure'),
            closeOnClickModal: false
          }).then(action => {
            if (data.url) {
              let str = Base64.encode(data.url).toString("base64");
              str = str.replace(/\+/g, "%2B");
              str = str.replace(/\=/g, "%3D");
              str = "uniwebview://updateVersion?json=" + str;
              window.location.href = str
            }
          });
        } else {
          MessageBox({
            message: data.desc,
            title: obj.$t('versionUpdate'),
            confirmButtonText: obj.$t('sure'),
            showCancelButton: true,
            cancelButtonText: obj.$t('cancel')
          }).then(action => {
            if (action !== "cancel") {
              if (data.url) {
                let str = Base64.encode(data.url).toString("base64");
                str = str.replace(/\+/g, "%2B");
                str = str.replace(/\=/g, "%3D");
                str = "uniwebview://updateVersion?json=" + str;
                window.location.href = str
              }
            }

          });
        }
      } else {
        return;
      }
    } else {
      console.log("获取版本号失败");
    }
  });
};
const saveSuc = (paramDatas,obj) => { //type==1成功 type==2 失败 url要删除的图片url
  let paramsArr = paramDatas.split(',')
  Vue.$vux.loading.hide();
  if (paramsArr[0] == 1) {
    Vue.$vux.toast.text(obj.$t('saveToAlbum'), 'middle')
  } else if (paramsArr[0] == 0) {
    Vue.$vux.toast.text(obj.$t('failToAlbum'), 'middle')
  }
  Vue.prototype.$Post(Vue.api.deleteFile, {
    path: paramsArr[1]
  })


}
export {
  judgeAgent,
  saveSuc
}
