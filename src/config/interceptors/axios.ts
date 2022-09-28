
import Taro from '@tarojs/taro'
import store from '@/store/index'
import { CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE } from '..'


export function requestSuccessFunc (requestObj) {
  CONSOLE_REQUEST_ENABLE &&
    console.info('requestInterceptorFunc', `url: ${requestObj.url}`, requestObj)
  // 自定义请求前拦截逻辑
  let method = requestObj.method?.toUpperCase()
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    requestObj.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  const baseLoginInfo = Taro.getStorageSync('base-login-info')
  if (baseLoginInfo) {
    if (!requestObj.data) {
      requestObj.data = { uid: baseLoginInfo.uid }
    } else {
      requestObj.data.uid = baseLoginInfo.uid
    }
  }
  const storeId = Taro.getStorageSync('defaultStore')
  if (storeId) {
    if (storeId.id && requestObj.data && !requestObj.noStoreId) {
      if (!requestObj.data.store_id) {
        requestObj.data.store_id = storeId.id
      }
    }
  }

  // console.log('mend', storeId)
  // requestObj.headers['lsmi'] = 'lsmi'
  // requestObj.headers['auth'] = 'auth'
  return requestObj
}

export function requestFailFunc (requestError) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  return Promise.reject(requestError)
}

export async function responseSuccessFunc (responseObj) {
  CONSOLE_RESPONSE_ENABLE &&
    console.info('responseInterceptorFunc', responseObj)
  // 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
  const resData = responseObj
  if(resData.all){
    return resData
  }
  const { code } = resData
  switch (code) {
    case undefined:
      return resData
    case 0:
      Taro.showToast({
        title: resData.info,
        icon: 'none',
        duration: 2000
      })
      return
    case 1:
      return resData.data
    case 401:
      return null
    case 403:
    // token 过期
    // return handle401(responseObj.config)
    default:
      // 业务中还会有一些特殊 code 逻辑，我们可以在这里做统一处理，也可以下方它们到业务层
      !responseObj.config.noShowDefaultError &&
        Taro.showToast({
          title: resData.message,
          icon: 'none',
          duration: 2000
        })
      // global.vbus.$emit('business.response.incorrect', resData.message)
      // return Promise.reject(resData)
      return Promise.resolve(null)
  }
}

const errorMsgMap = {
  429: {
    msg: '请求太频繁，请休息一会'
  },
  422: {
    msg: '参数错误，请检查参数'
  },
  404: {
    msg: '您访问的接口不存在'
  },
  403: {
    msg: '没有此操作的执行权限'
  },
  401: {
    msg: '登录过期，请重新登录',
    fn: async () => {
      // Taro.setStorageSync(StoreConfigNameCollect.token, '')
      // Taro.navigateTo({ url: loginUrl })
      // wxLogin()
    }
  }
}
export function responseFailFunc (responseError) {
  // 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
  if (!responseError.status) {
    return Promise.reject(responseError.msg || responseError.errMsg || responseError)
  }
  const errorResponse = responseError.response
  const { status } = errorResponse
  const nowError = errorMsgMap[status]
  const msg = nowError ? nowError.msg : '网络繁忙请稍后再试'
  !responseError.config.noShowDefaultError &&
    Taro.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  if (nowError && nowError.fn) nowError.fn()
  return Promise.reject(responseError)
}
