/*
 * @Author: lsmi
 * @Date: 2021-11-30 22:33:25
 * @LastEditors: lsmi
 * @LastEditTime: 2021-11-30 22:37:50
 * @FilePath: \taro-plaid-shop\src\api2\index.ts
 */
import axios from '@/plugins/axios'
import Taro from '@tarojs/taro'

const all = true

export default {
  login (data?) {
    return axios({ url: '/index/index/login', data })
  },
  getGoodsList2(data?){
    return axios({ url: '/index/index/getGoodsList2', data, })
  },
  getConfig(data?){
    return axios({ url: '/index/index/login', data })
  },
  getUserInfo(data?){
    return axios({ url: '/index/index/getUserInfo', data })
  },
  saveUserInfo (data?) {
    return axios({ url: '/index/index/saveUserInfo', data, method: 'post' })
  },
  // 解密
  decryptData (data?) {
    return axios({ url: '/index/index/decryptData', data })
  },
  getNewsDetail (data?) {
    return axios({ url: '/index/index/getNewsDetail', data })
  },
  getNewsList (data?) {
    return axios({ url: '/index/index/getNewsList', data })
  },
  upload (path) {
    return axios({
      url: '/index/plug/upload',
      filePath: path,
      name: 'file',
      upload: true,
      formData: { test: 'xxx' },
      transformResponse: [
        (data, header) => {
          if (typeof data === 'string') {
            data = JSON.parse(data)
          }
          if (data && !data.uploaded) {
            Taro.showToast({
              title: data.error ? data.error.message : '',
              duration: 2000,
              icon: 'none'
            })
            return
          }
          if (data.uploaded) {
            return data.path || data.url || data.src
          }
          return data
        }
      ]
    })
  }
}
