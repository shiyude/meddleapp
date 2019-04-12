import Vue from 'vue';
const imgDownLoad = () => {
  let canvas = document.querySelector("canvas");
  let dataURL = canvas.toDataURL("image/png");
  let fileData = dataURLtoFile(dataURL)
  let formData = new FormData();
  let userInfo = JSON.parse(
    window.localStorage.getItem("userInfo") || "{}"
  );
  formData.append("agentId", userInfo.agentId);
  formData.append("brokeId", userInfo.brokeId);
  formData.append("token", userInfo.token);
  formData.append("type", "mappingImgTemp");
  formData.append("file", fileData);
  Vue.prototype.$PostFormData(Vue.api.uploadFile, formData, false)
    .then(res => {
      if (res.code == 0) {
        let hostUrl = window.localStorage.getItem("imgUlr") || "";
        let imgPath = hostUrl + res.datas.filePath;
        let str = Base64.encode(imgPath).toString("base64");
        str = str.replace(/\+/g, "%2B");
        str = str.replace(/\=/g, "%3D");
        str = "uniwebview://downloadImage?json=" + str;
        window.location.href = str;
      } else {
        Vue.$vux.loading.hide()
        Vue.$vux.toast.show({
          text: 'Fail',
          type: "cancel"
        })
      }
    })
    .catch(err => {
      Vue.$vux.loading.hide()
      console.log("上传失败");
    });

}
const dataURLtoFile = (dataurl, filename = 'file') => { //base64转文件类型的对象
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}
export  default imgDownLoad