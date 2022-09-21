/*
 * @Author: lsmi
 * @Date: 2022-04-19 20:13:13
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-19 20:17:54
 * @FilePath: \ternary-quotation---taro\src\store\common.js
 */
import { CommonStore } from '@/types/store'
import { observable } from 'mobx'

const common = observable({
  categoryInfo: null,
  goodsInfo: null,
  editUserInfo: null,
  setEdtUserInfo(val){
    common.editUserInfo = val
  },
  setCategoryInfo(val){
    common.categoryInfo = val
  },
  setGoodsInfo(val){
    common.goodsInfo = val
  },
} as CommonStore)

export default common