const toModule = (id) => {
  if (window.localStorage.getItem("userInfo")) {
    let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    let params = {
      agentId: userInfo.agentId,
      token: userInfo.token,
      brokeId: userInfo.brokeId,
      unitId: id,
      url:window.localStorage.getItem("imgUlr") || ""
    };
    console.log(params)
    let jsonParams = JSON.stringify(params);
    let str = Base64.encode(jsonParams).toString("base64");
    str = str.replace(/\+/g, "%2B");
    str = str.replace(/\=/g, "%3D");
    str = "uniwebview://unit?json=" + str;
    window.location.href = str;
  }
}
export default toModule
