


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Text, Image } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { Stepper } from '@taroify/core'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import CartChange from '@/static/img/cart-change.png'
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
    <View className=' cart-page page-view-content pb-[320px]'>
      <View className=' title-box bg-[#F4F3F2] text-[24px] flex items-center justify-between py-[40px] px-[35px]'>
        <View>共1件商品</View>
        <View className=' text-[#9A7D2B] font-bold'>完成</View>
      </View>
      {/* list */}
      <View className=' list mt-[20px] px-[35px]'>
        {/* active */}
        <View className=' item '>
          <View className=' change-box w-[44px] h-[44px]'>
            <Image className='img w-full h-full' src={CartChange}></Image>
          </View>
          {/* info */}
          <View className=' info'>
            <Image className=' img' src='https://img.zcool.cn/community/031wdjhmmatjcftovtkwczs3038.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
            <View className=' flex-1 flex h-[165px] flex-col justify-between'>
              <View className=' text-[28px]'>美妆套装</View>
              <View className=' flex items-center justify-between'>
                <View className=' text-[30px] font-bold'>￥849</View>
                <Stepper size='22' min={1} max={999}>
                  <Stepper.Button />
                  <Stepper.Input width='40' />
                  <Stepper.Button />
                </Stepper>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* fixed */}
      <View className=' fixed-box fixed bottom-0 left-0 w-full h-[120px] flex items-center justify-between bg-white'>
        <View className=' show-area flex items-center flex-1 justify-between py-[38px] px-[42px]'>
          <View className=' flex items-center'>
            <View className=' change-box w-[44px] h-[44px]'>
              <Image className='img w-full h-full' src={CartChange}></Image>
            </View>
            <View className=' text-[24px] ml-[12px]'>全选</View>
          </View>
          {/*  */}
          <Text className=' text-[24px]'>
            共0件，合计：
            <Text className=' text-[36px] text-[#F03C21] font-bold'>￥698</Text>
          </Text>
        </View>
        <View className=' h-full bg-[#9A7D2B] w-[210px] text-center leading-[120px] text-white'>删除</View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))