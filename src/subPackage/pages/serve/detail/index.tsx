


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Image, Text } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import Parser from '@/components/parse/index'
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
  const content = `
    <img src="https://img.zcool.cn/community/031bf83e13q1idoepkyov3w3834.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100">
    <img src="https://img.zcool.cn/community/031jflcfmro70zja6hcniqj3836.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100">
    <img src="https://img.zcool.cn/community/031rnppuvbrdcocslu4svah3339.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100">
  `
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
    <View className=' serve-detail-page page-view-content'>
      <View className='banner'>
        <Image className=' img w-full' src='https://img.zcool.cn/community/031dvrpkcsngg6ucbahupfa3036.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='widthFix'></Image>
      </View>
      {/* base */}
      <View className='basic py-[50px] px-[27px] bg-white'>
        <View className=' text-[30px] font-bold mb-[45px]'>水分子脸部提拉服务</View>
        <View className=' flex items-end justify-between'>
          <View className=' price-group'>
            <Text className=' text-[48px] text-[#F03C21] font-bold'><Text className=' text-[25px] font-semibold'>￥</Text>987</Text>
            <Text className=' text-[25px] text-[#999999] line-through ml-[26px]'>￥999</Text>
          </View>
          <View className=' text-[25px] text-[#666666]'>服务时间：120分钟</View>
        </View>
        <View className='desc text-[25px] text-[#666666] mt-[60px] text-justify leading-normal'>
        光子嫩肤是一种先进的高科技美容项目，采用特定的宽光谱彩光，直接照射于皮肤表面，它可以穿透至皮肤深层，选择性作用于皮下色素或血管，分解色斑，闭合异常的毛细血管，同时光子还能刺激皮下胶原蛋白的增生。
        </View>
      </View>
      {/* 详细介绍 */}
      <View className='detail-box mt-[20px] bg-white py-[44px] px-[27px]'>
        <View className=' text-[30px] font-bold mb-[50px]'>详细介绍</View>
        <Parser content={content} tagStyle={{ img: 'display: block' }}></Parser>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))