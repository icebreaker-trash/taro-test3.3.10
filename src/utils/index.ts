import Taro, { getCurrentPages } from '@tarojs/taro'
// import { wxLogin } from '@/hooks/index'
import { StoreConfigNameCollect } from '@/config'
import userStore from '@/store/modules/user'
import $api from '@/api/index'

let a = 0
interface LoginOb {
  isLogin: boolean
  fnList: Function[]
}


const loginOb: LoginOb = {
  isLogin: false,
  fnList: []
}
/**
 * 获取 rpx => px 的转换系数
 * @returns { number } factor 单位转换系数 1rpx = factor * px
 */
 export const getFactor = () => {
  const sysInfo = Taro.getSystemInfoSync();
  const { screenWidth } = sysInfo;
  return screenWidth / 750;
};

/**
 * rpx => px 单位转换
 * @param { number } rpx - 需要转换的数值
 * @param { number } factor - 转化因子
 * @returns { number }
 */


export const toPx = (rpx, factor?) => {
  return parseInt(String(rpx * (factor || getFactor())), 10);
}


/**
 * px => rpx 单位转换
 * @param { number } px - 需要转换的数值
 * @param { number } factor - 转化因子
 * @returns { number }
 */
export const toRpx = (px, factor = getFactor()) =>
  parseInt(String(px / factor), 10);

export function isAndroid() {
  const u = navigator.userAgent;
  return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
}

export function getQueryVar(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

export function click(fn, timer) {
  if (a) {
    Taro.showToast({
      title: '请勿重复点击',
      icon: 'none'
    })
    return
  } else {
    setTimeout(() => {
      a = 0
    }, timer || 2000)
    a = 1
    fn()
  }
}

export function handle401() {
  localStorage.removeItem(StoreConfigNameCollect.userInfo)
  // wxLogin()
}

export function watch(fn: Function) {
  if (loginOb.isLogin) {
    // 登录已完成
    fn()
  } else {
    loginOb.fnList.push(fn)
    Object.defineProperty(loginOb, 'isLogin', {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._isLogin = value
        for (let i = loginOb.fnList.length - 1; i >= 0; i--) {
          const tfn: any = loginOb.fnList[i]
          tfn && tfn()
          // loginOb.fnList.splice(i, 1)
        }
        loginOb.fnList = []
      },
      get: function () {
        return this._isLogin
      }
    })
  }
}

export function setLoginState(val) {
  loginOb.isLogin = val
}

export function getUserInfo(fn) {
  return new Promise((resolve, reject) => {
    if (!userStore.userInfo || !userStore.userInfo.nickname || new Date().getTime() - Taro.getStorageSync('login') > 7 * 24 * 60 * 60 * 1000) {
      Taro.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: async (res) => {
          await $api.saveUserInfo({
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl
          })
          Taro.setStorageSync('login', new Date().getTime())
          userStore.userInfo!.nickname = res.userInfo.nickName
          userStore.userInfo!.avatarurl = res.userInfo.avatarUrl
          fn && fn(res)
          resolve(res)
        }
      })
    } else {
      fn && fn()
      resolve(true)
    }
  })
}
// 获取当前页面url及参数
export function getCurrentPageUrlWithArgs(params = {}) {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = currentPage.route
  const options = currentPage.options
  let urlWithArgs = `/${url}?`
  for (let key in options) {
    const value = options[key]
    urlWithArgs += `${key}=${value}&`
  }
  for (let key in params) {
    const value = params[key]
    urlWithArgs += `${key}=${value}&`
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  console.log(urlWithArgs, 'urlWithArgs')
  return urlWithArgs
}

// 转字符串
export function decode(data) {
  if (!data) {
    return
  }
  var toBinaryTable = [
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    0,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    -1,
    -1,
    -1,
    -1,
    -1
  ]
  var base64Pad = '='
  var result = ''
  var leftbits = 0 // number of bits decoded, but yet to be appended
  var leftdata = 0 // bits decoded, but yet to be appended
  // Convert one by one.
  for (var i = 0; i < data.length; i++) {
    var c = toBinaryTable[data.charCodeAt(i) & 0x7f]
    var padding = data.charCodeAt(i) == base64Pad.charCodeAt(0)
    // Skip illegal characters and whitespace
    if (c == -1) continue
    // Collect data into leftdata, update bitcount
    leftdata = (leftdata << 6) | c
    leftbits += 6
    // If we have 8 or more bits, append 8 bits to the result
    if (leftbits >= 8) {
      leftbits -= 8
      // Append if not padding.
      if (!padding)
        result += String.fromCharCode((leftdata >> leftbits) & 0xff)
      leftdata &= (1 << leftbits) - 1
    }
  }
  // If there are any bits left, the base64 string was corrupted
  if (leftbits) throw 'Corrupted base64 string'
  var result = decodeURIComponent(escape(result))
  return result
}