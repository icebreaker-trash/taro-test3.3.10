
import { ToastProps } from './type'
import { trigger } from './events'


const Toast = function (options: ToastProps | string) {
  trigger('toast_show', options)
}

const createMethod = (type: string) => (options: ToastProps | string) =>
  Toast(Object.assign({ type }, options))


Toast.loading = createMethod('loading')
Toast.success = createMethod('success')
Toast.fail = createMethod('fail')
Toast.clear = function (options?: ToastProps) {
  trigger('toast_clear', options)
}
Toast.setDefaultOptions = (options: ToastProps) => {
  trigger('toast_setDefaultOptions', options)
}
Toast.resetDefaultOptions = () => {
  trigger('toast_resetDefaultOptions')
}

export default Toast
