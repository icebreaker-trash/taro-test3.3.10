/*
 * @Author: lsmi
 * @Date: 2022-04-19 20:13:13
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-19 20:17:54
 * @FilePath: \ternary-quotation---taro\src\store\common.js
 */
import { CommonStore } from '@/types/store'
import { observable } from 'mobx'

interface NewCommonStore {
  setEdtUserInfo: (val: any) => void
  setCategoryInfo: (val: any) => void
  setGoodsInfo: (val: any) => void
  setErrorInfo: (val: any) => void
}

const common = observable({
  categoryInfo: {
    ids: 50
  },
  goodsInfo: null,
  editUserInfo: null,
  errorInfo: null,
  setEdtUserInfo(val){
    common.editUserInfo = val
  },
  setCategoryInfo(val){
    common.categoryInfo = val
  },
  setGoodsInfo(val){
    common.goodsInfo = val
  },
  setErrorInfo(val){
    common.errorInfo = val
  }
} as CommonStore & NewCommonStore)

export default common