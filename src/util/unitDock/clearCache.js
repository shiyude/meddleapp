//清除缓存 
import {
  MessageBox
} from "mint-ui";
const getCacheSize = (size, obj = {}) => {
  MessageBox({
    message: size,
    title: obj.$t('clearcachecommand'),
    confirmButtonText: obj.$t('sure'),
    showCancelButton: true,
    cancelButtonText: obj.$t('cancel')
  }).then(action => {
    if (action !== "cancel") {
      window.location.href = "uniwebview://clear";
    }

  });
}
const clearCacheBefore = (obj = {}) => {
  MessageBox({
    message: obj.$t('clearSuccess'),
    title: obj.$t('success'),
    confirmButtonText: obj.$t('sure')
  })
}
export {
  getCacheSize,
  clearCacheBefore
}
