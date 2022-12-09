


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Text, Image } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import { Location, Arrow, Cross } from '@taroify/icons'
import { Stepper, Button } from '@taroify/core'
import MyOrderP1Img from '@/static/img/my-order-p1.png'
import MyOrderP2Img from '@/static/img/my-order-p2.png'
import MyOrderP3Img from '@/static/img/my-order-p3.png'
import MyOrderP4Img from '@/static/img/my-order-p4.png'
import MyOrderP5Img from '@/static/img/my-order-p5.png'
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: ''
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

  })
  // 下拉刷新
  usePullDownRefresh(() => {
    watch(async () => {
      Taro.stopPullDownRefresh();
    });
  })

  return (
    <View className=' order-detail-page page-view-content py-[46px] px-[35px] pb-[200px]'>
      <View className=' title-box flex items-center justify-center'>
        <Image src={MyOrderP1Img} className='w-[72px] h-[72px]'></Image>
        <View className=' text-[#000000] text-[36px] font-bold ml-[15px]'>订单待付款</View>
      </View>
      {/* address */}
      <View className=' mt-[44px] py-[46px] address rounded-[18px] bg-white px-[46px] flex'>
        <Location size={26} color='#917320' className=' mr-[40px]' />
        <View className=' flex-1 relative'>
          <View className=' name mb-[20px]'>
            <Text className=' font-bold text-[30px]'>汤生</Text>
            <Text className=' text-[24px] ml-[22px]'>13723453361</Text>
          </View>
          <View className=' text-[24px]'>深圳市南山区沙河西路168号A栋816号</View>
        </View>
      </View>
      {/* sku */}
      <View className='sku-info py-[44px] pl-[46px] pr-[30px] bg-white rounded-[18px] mt-[30px]'>
        <View className=' text-[#333333] text-[30px] font-bold mb-[40px]'>商品信息</View>
        <View className=' flex justify-between'>
          <Image className=' w-[165px] h-[165px] mr-[36px]' src='https://img.zcool.cn/community/01175b638c1fd7000e7e1000481294.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
          {/* info */}
          <View className=' flex h-[165px] flex-col justify-between flex-1'>
            <View className=' text-[28px]'>美妆套装</View>
            <View className=' flex items-center justify-between'>
              <View className=' text-[30px]'>￥849</View>
              <View className=' flex items-center text-[24px]'><Cross size={10} />1</View>
              {/* <Stepper size='22' min={1} max={999}>
                <Stepper.Button />
                <Stepper.Input width='40' />
                <Stepper.Button />
              </Stepper> */}
            </View>
          </View>
        </View>
        {/*  */}
        <View className=' text-[28px] flex items-center justify-between mt-[70px] mb-[40px]'>
          <View>配送方式</View>
          <View>快递免邮</View>
        </View>
        <View className=' text-[28px] flex items-center justify-between mb-[20px]'>
          <View>应付款</View>
          <View className=' text-[#F03C21] font-bold'>￥849</View>
        </View>
      </View>
      {/* order info */}
      <View className=' order-info bg-white rounded-[18px] mt-[30px] p-[44px]'>
        <View className=' text-[30px] font-bold mb-[48px]'>订单信息</View>
        <View className=' item text-[28px]'>
          <View>订单号</View>
          <View>1654654654646465</View>
        </View>
        <View className=' item text-[28px]'>
          <View>时间</View>
          <View>2022-12-04  10:00:14</View>
        </View>
        <View className=' item text-[28px]'>
          <View>已退款</View>
          <View className=' text-[#F03C21] font-bold'>￥698</View>
        </View>
      </View>
      {/*  */}
      <View className=' flex items-center justify-between mt-[40px]'>
        {/* <Button variant='outlined' color='primary' shape='round' className=' w-[320px]'>取消订单</Button>
        <Button shape='round' color='primary' className=' w-[320px]'>立即支付</Button> */}
        <Button variant='outlined' color='primary' shape='round' className=' w-full'>申请退款</Button>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))