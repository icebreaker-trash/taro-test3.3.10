import wxAPI from 'weixin-js-sdk'
import $api from '@/api/index'

export function wxPay(res) {
  return new Promise((resolve, reject) => {
    wxAPI.ready(() => {
      wxAPI.chooseWXPay({
        timestamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
        package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: res.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
        paySign: res.paySign, // 支付签名
        success: (nres) => {
          Taro.showToast({
            title: '支付成功'
          });
          resolve(nres)
        },
        fail: (err) => {
          reject(err)
        }
      });
    })
  })
}

export async function wxConfig() {
  const res = await $api.getConfig({ url: window.location.href })
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