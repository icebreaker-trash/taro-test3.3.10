import { BaseStore } from '@/types/store'
import { observable } from 'mobx'

const base = observable({
  tabIndex: 0,
  menuButtonInfo: {},
  setTabIndex(val){
    base.tabIndex = val
  },
  setMenuButtonInfo(val){
    base.menuButtonInfo = val
  }
} as BaseStore)

export default base