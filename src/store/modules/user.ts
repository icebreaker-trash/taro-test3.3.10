import { UserStore } from '@/types/store'
import { observable } from 'mobx'

const user = observable({
  userInfo: null,
  setUserInfo(val) {
    user.userInfo = val
  }
} as UserStore)

export default user