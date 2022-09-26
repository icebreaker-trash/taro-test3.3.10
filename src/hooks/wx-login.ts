import $api from '@/api/index'
import Taro from '@tarojs/taro'
import { StoreConfigNameCollect } from '@/config'
import { setLoginState } from '@/utils/index'
import store from '@/store/modules/user'

export async function login(params?) {
  let scene: any = 0
  if (params && params.scene == 1047) {
    scene = decodeURIComponent(params.scene)
  }
  let data = await $api.login(
    {
      code: await new Promise((resolve, reject) => {
        Taro.login({
          success(res) {
            console.log(res)
            // return
            resolve(res.code)
          }
        })
      }),
      scene: scene
    }
  )
  Taro.setStorageSync(StoreConfigNameCollect.base_login_info, data)
  let data1 = await $api.getUserInfo()
  if (data1) {
    store.setUserInfo(data1)
    Taro.setStorageSync(StoreConfigNameCollect.userInfo, data1)
    // if(!data1.member){
    //   Taro.redirectTo({
    //     url: '/pages/login/index'
    //   })
    // }
  }
  Taro.hideLoading()
  setLoginState(true)
  return data1
}