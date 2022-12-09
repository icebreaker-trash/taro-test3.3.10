/*
 * @Author: lsmi
 * @Date: 2022-03-30 19:36:48
 * @LastEditors: lsmi
 * @LastEditTime: 2022-03-30 19:41:59
 * @FilePath: \social-security-paid-on-behalf\src\hooks\index.js
 */
import { StoreConfigNameCollect } from '@/config';
import $api from '@/api/index'
import wxAPI from "weixin-js-sdk";
import { isAndroid, getQueryVar, setLoginState } from '@/utils/index'


function handleAuthAction() {
  const appid = "wx9e9b2df13d413fd9";
  // eslint-disable-next-line no-restricted-globals
  let redirect_uri = isAndroid() ? location.href.split('#')[0] : window['entryUrl']
  redirect_uri = decodeURIComponent(redirect_uri);
  const wxURL =
    `https://open.weixin.qq.com/connect/oauth2/authorize?` +
    `appid=${appid}&redirect_uri=${redirect_uri}&` +
    `response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  window.location.href = wxURL;
}
async function handleSetLoginAction(res?) {
  if (res) {
    // 用户信息
    localStorage.setItem(StoreConfigNameCollect.userInfo, JSON.stringify(res))
  }
  setLoginState(true)
  // const wxConfigRes = await $api.getConfig({ url: window.location.href })
  // wxConfig(wxConfigRes)
}
async function loginAction(code) {
  const res = await $api.login({ code: code });
  if (res) {
    handleSetLoginAction(res); // 设置已登录
    const windowURL = window.location.href
    if (windowURL.indexOf('code') >= 0) {
      // 有code
      window.location.href = window.location.href.replace('code', 'oldCode')
      return
    }
  }
}
export function wxConfig(res) {
  if (!res) {
    return
  }
  wxAPI.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
    appId: res.appId, // 必填，公众号的唯一标识
    timestamp: res.timestamp, // 必填，生成签名的时间戳
    nonceStr: res.nonceStr, // 必填，生成签名的随机串
    signature: res.signature, // 必填，签名
    jsApiList: [
      'checkJsApi',
      "scanQRCode",
      "startRecord",
      "chooseImage",
      "stopRecord",
      "openLocation",
      "uploadVoice",
      'chooseWXPay',
      'openAddress',
      'getLocation'
    ],
  });
}

export function wxLogin() {
  const code = getQueryVar('code')
  const userInfo = localStorage.getItem(StoreConfigNameCollect.userInfo)
  const hasUserInfo = userInfo != 'undefined' && userInfo != 'null' && userInfo
  return new Promise((resolve, reject) => {
    if (!code && !hasUserInfo) {
      handleAuthAction();
    } else {
      if (!hasUserInfo) {
        loginAction(code)
      } else {
        handleSetLoginAction(); // 设置已登录
        // 跳转  如果有注册就跳转个人中心   否则跳转登录去注册
        resolve(true)
      }
    }
  })
}
