const loginSuccess = (obj = {}) => {
  let jsonParams = JSON.stringify(obj);
  if (jsonParams == '{}') return
  let str = Base64.encode(jsonParams).toString("base64");
  str = str.replace(/\+/g, "%2B");
  str = str.replace(/\=/g, "%3D");
  str = "uniwebview://login?json=" + str;
  console.log(str)
  window.location.href = str;
}
export default loginSuccess
