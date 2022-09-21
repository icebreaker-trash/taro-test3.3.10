/*
 * @Author: lsmi
 * @Date: 2021-11-25 20:05:50
 * @LastEditors: lsmi
 * @LastEditTime: 2021-11-30 22:42:09
 * @FilePath: \taro-plaid-shop\src\utils\axios\type.ts
 */
import Taro, { RequestParams, RequestTask } from '@tarojs/taro'
import interceptoManager from './interceptoManager'

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'Delete'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export interface AxiosTransformer {
  (data: any | { [name: string]: any; all?: boolean }, headers?: any): any
}
export type BaseAxiosRequestConfig<T = any, U = any> = {
  url?: string
  preUrl?: string
  upload?: boolean
  timeout?: number
  baseURL?: string
  data?: T
  params?: U
  method?: Method
  all?: boolean
  headers?: any
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  validateStatus?: (status: number) => boolean
  [name: string]: any
}

// const a = Taro.request({ url: 'xxx' }).then(res => {

// })

// type MyExclude<T, U> = T extends U ? never : T
type MyExclude<T, U> = T extends U ? never : T


type exclude2<T, U extends keyof T> = {
  [K in MyExclude<keyof T, U>]?: T[K]
}

// axios的请求前的config配置类型
export type AxiosRequestConfig<T = any> = exclude2<Taro.request.Option<T>, 'method'> & BaseAxiosRequestConfig<T>

// axios的请求后的返回数据包装类型  data, headers等
export type AxiosResponse<T = any> = Taro.request.SuccessCallbackResult<T>


export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}
export interface RejectedFn {
  (error: any): any
}

// .then操作
// export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> { }
export interface AxiosPromise<T = any> extends Promise<T> { }


export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: interceptoManager<AxiosRequestConfig>
    response: interceptoManager<AxiosResponse>
  }
  // 请求什么类型就能拿到什么类型
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  // <T = any>(url: string, config: AxiosRequestConfig): AxiosPromise<T>
}
// 给axios添加create方法
export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  // CancelToken: CancelTokenStatic
  // Cancel: CancelStatic
  // isCancel: (value: any) => boolean
}

