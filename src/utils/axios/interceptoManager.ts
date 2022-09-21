/*
 * @Author: lsmi
 * @Date: 2021-11-30 22:45:20
 * @LastEditors: lsmi
 * @LastEditTime: 2021-11-30 22:45:21
 * @FilePath: \taro-plaid-shop\src\utils\axios\interceptoManager.ts
 */

import { ResolvedFn, RejectedFn } from './type'

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}
// 拦截器
export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }
  // 添加拦截器  注入请求拦截
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  // 销毁拦截器
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
  // 拦截器循环   内部使用  不对外开发
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(inter => {
      if (inter !== null) {
        fn(inter)
      }
    })
  }
}
