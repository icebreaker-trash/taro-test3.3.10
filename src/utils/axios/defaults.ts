/*
 * @Author: lsmi
 * @Date: 2021-11-30 20:30:22
 * @LastEditors: lsmi
 * @LastEditTime: 2021-11-30 21:42:41
 * @FilePath: \taro-plaid-shop\src\utils\axios\defaults.ts
 */
import { BaseAxiosRequestConfig } from './type'
import { transformResponse, isObject } from './utils'

export function handHead(headers: any, data: any): any {
  if (isObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }
  return headers
}

// 默认配置
const defaults: BaseAxiosRequestConfig = {
  method: 'get',
  // 不设置超时
  timeout: 0,
  headers: {
    Accept: 'application/json, text/plain, */*'
  },
  transformRequest: [
    function(data: any, headers: any): any {
      handHead(headers, data)
      return data
    }
  ],
  transformResponse: [
    function(data: any): any {
      return transformResponse(data)
    }
  ],
  validateStatus(status: number): boolean {
    return status >= 200 && status < 300
  }
}

const methodsNoData = ['delete', 'get', 'head', 'options']
methodsNoData.forEach(method => {
  defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(method => {
  defaults.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaults
