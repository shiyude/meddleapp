const openPdf = (url) => {
  console.log(url)
  if (!url) return
  let str = Base64.encode(url).toString("base64");
  str = str.replace(/\+/g, "%2B");
  str = str.replace(/\=/g, "%3D");
  str = "uniwebview://openPdf?json=" + str;
  console.log(str)
  window.location.href = str;
}
export default openPdf
