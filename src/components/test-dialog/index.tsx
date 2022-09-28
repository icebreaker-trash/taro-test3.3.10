import { View, Text, RichText } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react'
import { ToastProps } from './type'
import { on, off, trigger } from './events'
import toast from './toast'

const defaultId = 'van-toast'
const defaultOptions = {
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
    show: false,
    duration: 2000,
    mask: false,
    forbidClick: false,
    type: 'text',
    position: 'middle',
    message: '',
    loadingType: 'circular' as any,
    selector: '#van-toast',
    id: defaultId,
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

  const noop = function () {}
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

      clearTimeout(timer)
      if (options.duration != null && options.duration > 0) {
        timer = setTimeout(() => {
          trigger('toast_clear', toastOptions)
        }, options.duration)
      }
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
  return (
    <View>
      dialog
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
