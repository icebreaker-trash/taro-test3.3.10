/*
 * @Author: lsmi
 * @Date: 2021-11-30 22:00:01
 * @LastEditors: lsmi
 * @LastEditTime: 2021-11-30 22:32:35
 * @FilePath: \taro-plaid-shop\src\plugins\axios.ts
 */
import axios from '@/utils/axios/index'
import {
  requestSuccessFunc,
  requestFailFunc,
  responseSuccessFunc,
  responseFailFunc
} from '@/config/interceptors/axios'
import { AXIOS_DEFAULT_CONFIG } from '@/config'

const axiosInstance = axios.create(AXIOS_DEFAULT_CONFIG)

// 注入请求拦截
axiosInstance.interceptors.request.use(requestSuccessFunc, requestFailFunc)
// 注入失败拦截
axiosInstance.interceptors.response.use(responseSuccessFunc, responseFailFunc)

export default axiosInstance
