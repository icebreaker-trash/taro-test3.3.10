/*
 * @Author: lsmi
 * @Date: 2021-11-30 20:21:10
 * @LastEditors: lsmi
 * @LastEditTime: 2021-11-30 21:50:55
 * @FilePath: \taro-plaid-shop\src\utils\axios\request.ts
 */
import Taro from '@tarojs/taro'
import commonStore from '@/store/modules/common';
import { AxiosRequestConfig, AxiosTransformer, Method } from './type'
import { deepMerge } from './utils'


export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  // eslint-disable-next-line @typescript-eslint/no-shadow
  methodsToDelete.forEach(method => {
    delete headers[method]
  })
  return headers
}

export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) {
    return data
  }
  if (!Array.isArray(fns)) {
    fns = [fns]
  }
  fns.forEach(fn => {
    data = fn(data, headers)
  })
  return data
}

export function platformHttpXHR(config: AxiosRequestConfig) {
  config.url = config.baseURL ? config.baseURL + config.url : config.url
  // 用户配置的 transformRequest 在headers合并前
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 把headers的method删除
  config.headers = flattenHeaders(config.headers, config.method!)
  // 适配小程序
  config.header = { ...config.headers }
  config.fail = (err: any) => {
    Taro.showModal({
      title: '网络错误!',
      content: err.errMsg || JSON.stringify(err),
      showCancel: true,
      success: ({  }) => { }
    })
    commonStore.setErrorInfo(err.errMsg || JSON.stringify(err))
    throw new Error(err)
  }
  delete config.headers
  if (config.upload) {
    return Taro.uploadFile(config as Taro.uploadFile.Option).then(res => {
      if (config.validateStatus && config.validateStatus(res.statusCode)) {
        // 先处理用户自定义的  transformResponse 
        res.data = transform(res.data, {}, config.transformResponse)
        return res.data
      }
      return
    })
  } else {
    return Taro.request(config as Taro.request.Option<any>).then(res => {
      if (config.validateStatus && config.validateStatus(res.statusCode)) {
        // 先处理用户自定义的  transformResponse 
        res.data = transform(res.data, res.header, config.transformResponse) || {}
        return { ...res.data, all: config.data?.all || config.all }
      }
      return
    })
  }
}