


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Image } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import Nav from '@/components/nav-bar/index'
import HomeTopImg from '@/static/img/home-top.png'
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

  function toDetailAction(item){
    Taro.navigateTo({ url: `/subPackage/pages/active/detail/index?id=${item.id || 1}` })
  }

  return (
    <View className=' active-collect-page page-view-content pb-[100px]'>
      <Nav
        title='活动召集'
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      <View className='main relative'>
        <Image src={HomeTopImg} className=' w-full absolute top-0 left-0' mode='widthFix'></Image>
        <View className=' px-[25px] relative pt-[200px]'>
          {
            Array(5).fill(1).map((item, index) =>
              <View className='item bg-white' key={index} onClick={() => toDetailAction(item)}>
                <Image className='img w-full h-[300px]' src='https://img.zcool.cn/community/031wqcvagmwdptz7xc2xnn93632.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
                <View  className=' py-[43px] px-[32px]'>
                  <View className=' text-[32px] mb-[26px]'>暑期水分子脸部提拉夏令营</View>
                  <View className=' text-[24px] text-[#666666]'>活动至 2022/11/31 23:59</View>
                </View>
              </View>
              )
          }
        </View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))