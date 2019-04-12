
// const env = 'development' // 开发环境 
const env = 'test' // 测试环境
// const env = 'production' // 生产环境

let baseURL = '' // 接口地址


switch (env) {
  case 'development': // 开发环境
    baseURL = 'http://192.168.0.119:9998'
    break
  case 'test': // 测试环境
    baseURL = 'http://192.168.0.145:9998'
    break
  case 'production': // 生产环境
    baseURL = 'http://api.singmap.com'
    break
}

export { baseURL }
