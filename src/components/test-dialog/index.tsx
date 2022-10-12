import { View, Text, RichText } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react'
import { Popup, Button } from '@taroify/core'
import Taro from '@tarojs/taro'
import { getUserInfo, watch } from '@/utils/index'
import $api from '@/api/index'
import userStore from '@/store/modules/user'
import { StoreConfigNameCollect } from '@/config/index';
import { ToastProps } from './type'
import { on, off, trigger } from './events'
import toast from './toast'
import './index.scss'



const defaultId = 'van-toast'
const defaultOptions = {
  title: '',
  show: true,
  duration: 2000,
  mask: false,
  forbidClick: false,
  type: 'text',
  position: 'middle',
  message: '',
  loadingType: 'circular',
  selector: '#van-toast',
  id: defaultId,
}
let currentOptions = Object.assign({}, defaultOptions)
let timer: any = null

export function Toast(props: ToastProps) {
  const [state, setState] = useState({
    title: '',
    show: false,
    phoneShow: false,
    duration: 0,
    mask: false,
    forbidClick: false,
    type: 'text',
    position: 'middle',
    message: '',
    loadingType: 'circular' as any,
    selector: '#van-toast',
    id: defaultId,
    onCancel: () => { },
    onClose: () => { },
    onSuccess: () => { }
  })

  /* eslint-disable-next-line */
  const { style, className, children, zIndex, ...others } = props

  useEffect(() => {
    setState((s) => {
      return {
        ...s,
        id: props.id || defaultId,
      }
    })
  }, [props])

  const noop = function () { }
  const clear = useCallback((toastOptions: any) => {
    setState((s) => {
      return {
        ...s,
        show: false,
      }
    })
    toastOptions?.onClose?.()
  }, [])

  const tShowListener = useCallback((toastOptions) => {
    watch(() => {
      if (userStore.userInfo?.nickname) {
        // 获取过用户信息
        setState(s => ({ ...s, phoneShow: true }))
      }
    })
    const options = Object.assign(
      Object.assign({}, currentOptions),
      toastOptions,
    )

    if (options.id === state.id || (!options.id && state.id === defaultId)) {
      setState((s) => {
        return {
          ...s,
          ...options,
        }
      })

      // clearTimeout(timer)
      // if (options.duration != null && options.duration > 0) {
      //   timer = setTimeout(() => {
      //     trigger('toast_clear', toastOptions)
      //   }, options.duration)
      // }
    }
  }, [])

  const tClearListener = useCallback((toastOptions) => {
    clear(toastOptions)
    // queue.forEach((toast: any) => {
    //   toast.clear()
    // })
    // queue = []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tSetDftOptsListener = useCallback((options: any) => {
    currentOptions = Object.assign(currentOptions, options)
  }, [])

  const tResetDftOptsListener = useCallback(() => {
    currentOptions = Object.assign({}, defaultOptions)
  }, [])

  useEffect(() => {
    on('toast_show', tShowListener)

    on('toast_clear', tClearListener)

    on('toast_setDefaultOptions', tSetDftOptsListener)

    on('toast_resetDefaultOptions', tResetDftOptsListener)

    return () => {
      off('toast_show', tShowListener)
      off('toast_clear', tClearListener)
      off('toast_setDefaultOptions', tSetDftOptsListener)
      off('toast_resetDefaultOptions', tResetDftOptsListener)
    }
    /* eslint-disable-next-line */
  }, [])

  const rejectAction = useCallback(() => {
    setState(s => ({ ...s, show: false, phoneShow: false }))
    state.onClose?.()
    state.onCancel?.()
  }, [])
  const userInfoAction = useCallback(() => {
    getUserInfo().then(_ => {
      setState(s => ({ ...s, phoneShow: true }))
    })
  }, [])

  const getPhoneAction = useCallback((e) => {
    if (e.detail.encryptedData) {
      $api.decryptData({
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        session_key: Taro.getStorageSync('base-login-info').session_key
      }).then(async res => {
        if (!res) {
          return
        }
        await $api.saveUserInfo({
          mobile: res
        })
        let data1 = await $api.getUserInfo()
        if (data1) {
          Taro.setStorageSync(StoreConfigNameCollect.userInfo, data1)
          userStore.userInfo = data1
        }
        setState(s => ({ ...s, show: false, phoneShow: false }))
        state.onSuccess?.()
      })
    }
  }, [])
  return (
    <View>
      <Popup onClose={rejectAction} className='lsmi-auth-comp' rounded open={state.show} placement='bottom'>
        <View className=''>
          <View className='title'>{state.title || (state.phoneShow ? '授权手机号' : '授权用户信息')}</View>
          <View className='content'>
            <View className='row1'>欢迎您来到招聘小程序！</View>
            <View className='row2'>
              请在使用小程序前点击
              <Text className='book'>《用户服务协议》</Text>和
              <Text className='book'>《隐私协议》</Text>
              并仔细阅读。
            </View>
          </View>
          {
            state.phoneShow ?
              <View className='btn-group'>
                <Button className='btn2 btn' size='small' onClick={rejectAction}>拒绝</Button>
                <Button className='btn' openType='getPhoneNumber' size='small' color='primary' onGetPhoneNumber={getPhoneAction}>同意</Button>
              </View> :
              <View className='btn-group'>
                <Button className='btn2 btn' size='small' onClick={rejectAction}>拒绝</Button>
                <Button className='btn' size='small' color='primary' onClick={userInfoAction}>同意并继续</Button>
              </View>
          }
        </View>
      </Popup>
    </View>
  )
}

Toast.show = toast
Toast.loading = toast.loading
Toast.success = toast.success
Toast.fail = toast.fail
Toast.clear = toast.clear
Toast.setDefaultOptions = toast.setDefaultOptions
Toast.resetDefaultOptions = toast.resetDefaultOptions
export default Toast
