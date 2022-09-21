/*
 * @Author: lsmi
 * @Date: 2021-11-25 20:19:27
 * @LastEditors: lsmi
 * @LastEditTime: 2021-11-30 22:45:34
 * @FilePath: \taro-plaid-shop\src\utils\axios\index.ts
 */
import { AxiosRequestConfig, AxiosResponse, ResolvedFn, RejectedFn, AxiosPromise, AxiosStatic } from './type'
import { isObject, extend } from './utils'
import InterceptorManager from './interceptoManager'
import { mergeConfig } from './mergeConfig'
import { platformHttpXHR } from './request'
import defaultOptions from './defaults'

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}
type AxiosInterceptors = {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}
class Axios<T = any> {
  defaults: AxiosRequestConfig
  interceptors: AxiosInterceptors
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    };
  }
  // 
  request(url, config: any = {}) {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else if (isObject(url)) {
      config = url
    }
    // 合并配置
    config = mergeConfig(this.defaults, config)
    let promise = Promise.resolve(config)
    let mergeInterceptors: PromiseChain<any>[] = [{ resolved: platformHttpXHR, rejected: undefined }]
    this.interceptors.request.forEach(inter => {
      mergeInterceptors.unshift(inter)
    })
    this.interceptors.response.forEach(inter => {
      mergeInterceptors.push(inter)
    })
    while (mergeInterceptors.length) {
      const item = mergeInterceptors.shift()
      const { resolved, rejected } = item!
      promise = promise.then(resolved, rejected)
    }
    return promise
  }
}


function createInstance(defaultConfig: AxiosRequestConfig): AxiosStatic {
  var context = new Axios(defaultConfig);
  var instance = Axios.prototype.request.bind(context);
  extend(instance, context)
  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}

const axios = createInstance(defaultOptions as AxiosRequestConfig)

export default axios