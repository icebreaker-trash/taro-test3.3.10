


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Text, Image, ScrollView, ITouchEvent } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { Button } from '@taroify/core'
import { getCurrentPageUrlWithArgs, watch, selectorQueryClientRect } from '@/utils/index'
import Nav from '@/components/nav-bar/index'
import HomeTopImg from '@/static/img/home-top.png'
import classnames from 'classnames';
import { Cross } from '@taroify/icons'
import { $ } from '@tarojs/extend'
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string
  tabList: string[]
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    tabList: ['全部订单','待支付', '待发货', '待收货', '已完成', '退款']
  })
  const [, setIndexData, indexData] = useStateRef({
    tabIndex: 0
  })
  useShareTimeline(() => {
    return {
      title: '',
      path: getCurrentPageUrlWithArgs()
    }
  })
  useShareAppMessage(() => {
    return {
      title: '',
      path: getCurrentPageUrlWithArgs()
    }
  })

  useReachBottom(() => {
    console.log('useReachBottom')
  })
  // 下拉刷新
  usePullDownRefresh(() => {
    watch(async () => {

      Taro.stopPullDownRefresh();
    });
  })

  useEffect(() => {
    const index = router.params.type
    if(index){
      setIndexData(s => ({ ...s, tabIndex: Number(index) }))
    }
  }, [])

  function switchTabAction(item, index) {
    setIndexData(s => ({ ...s, tabIndex: index }))
  }

  function refundAction(item, index, e: ITouchEvent){
    e.stopPropagation()
    console.log(1)
  }

  return (
    <View className=' order-list-page page-view-content'>
      <View className=' tab-box flex items-center justify-between px-[30px] bg-[#fff]'>
        {
          infoData.current.tabList.map((item, index) =>
            <View className={classnames('item text-[25px] text-[#666666] px-[10px] py-[50px]', { active: index === indexData.current.tabIndex })} key={index} onClick={() => switchTabAction(item, index)}>
              {item}
            </View>)
        }
      </View>
      {/* list */}
      <ScrollView scrollY className=' list pt-[50px]' id='order-list-content'>
        <View className=' px-[30px]'>
          {
            Array(10).fill(1).map((item, index) =>
              <View key={index} className='item' onClick={() => Taro.navigateTo({ url: `/subPackage/pages/order/detail/index?id=${item.id || 1}` })}>
                <View className='time-box flex items-center justify-between pb-[30px] text-[24px]'>
                  <View className='  text-[#666666]'>下单时间：2022/11/22  18:00:14</View>
                  <View className=' text-[#F03C21]'>待发货</View>
                </View>
                <View className='sku-info flex items-center justify-center pt-[27px] pb-[37px] pr-[12px]'>
                  <Image className=' w-[165px] h-[165px] mr-[37px]' src='https://img.zcool.cn/community/031qofbtd42hapnautedjab3235.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
                  <View className=' h-[165px] flex-1 flex flex-col justify-between'>
                    <View className=' text-[#000000] text-[25px]'>美妆套装</View>
                    <View className=' flex items-center justify-between'>
                      <View className=' text-[25px] text-[#333333]'>￥890</View>
                      <View className=' text-[#666666] text-[24px]'><Cross size={10} color='#666666' />1</View>
                    </View>
                  </View>
                </View>
                <View className=' operator flex items-center justify-between pt-[35px] pr-[10px]'>
                  {/* <View className=' text-[25px] text-[#666666] text-right'>实付款：￥890</View> */}
                  {/* <View className=' text-[25px] text-[#666666] text-right'>已退款：￥890</View> */}
                  <View className=' text-[25px] text-[#666666] text-right'>实付款：￥890+600积分</View>
                  <View className=' btns flex items-center'>
                    <View className=' plain-btn btn' onClick={(e) => refundAction(item, index, e)}>申请退款</View>
                    <View className=' common-btn btn' onClick={(e) => refundAction(item, index, e)}>立即支付</View>
                  </View>
                </View>
              </View>
            )
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))