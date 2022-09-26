/*
 * @Author: lsmi
 * @Date: 2021-11-30 21:59:41
 * @LastEditors: lsmi
 * @LastEditTime: 2021-11-30 22:06:40
 * @FilePath: \taro-plaid-shop\src\config\index.ts
 */
// 还有一些方便开发的配置
export const CONSOLE_REQUEST_ENABLE = false // 开启请求参数打印
export const CONSOLE_RESPONSE_ENABLE = false // 开启响应参数打印
export const CONSOLE_MONITOR_ENABLE = true // 监控记录打印

// export const BASE_AJAX_URL =
//   process.env.NODE_ENV === 'production'
//     ? 'https://palh.szhuitianxia.com'
//     : 'https://palh.szhuitianxia.com'

export const BASE_AJAX_URL = 'https://www.yinyuancf.com'

// axios 默认配置
export const AXIOS_DEFAULT_CONFIG = {
  baseURL: BASE_AJAX_URL,
  timeout: 20000,
  maxContentLength: 2000,
  headers: {}
}

// 缓存配置名称表
export const StoreConfigNameCollect = {
  token: 'token',
  auth_type: 'Bearer',
  session_key: 'session_key',
  base_login_info: 'base-login-info',
  userInfo: 'userInfo',
  goodsList: 'goodsList'
}
