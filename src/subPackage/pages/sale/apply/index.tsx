


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Text, Image } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import Nav from '@/components/nav-bar/index'
import { Button } from '@taroify/core'
import HomeTopImg from '@/static/img/home-top.png'
import SaleImg from '@/static/img/sale-img.png'
import BannerShaderImg from '@/static/img/banner-shader.png'
import JoinComp from '@/components/join/index'
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const br = '\n'
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: ''
  })
  const [open, setOpen] = useState(false)
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
  return (
    <View className='sale-apply-page page-view-content pb-[100px]'>
      <Nav
        title='申请分销商'
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      <View className='main-content relative px-[22px]'>
        <Image src={HomeTopImg} className='home-top absolute top-0 left-0 w-full' mode='widthFix' />
        <View className=' is-content pt-[200px] relative'>
          <Image className=' w-full relative' src={SaleImg} mode='widthFix'></Image>
          <Image src={BannerShaderImg} className=' w-full mt-[-40px]' mode='widthFix' />
          {/* 说明 */}
          <View className=' c-box mt-[30px]'>
            <View className=' text-[36px] font-bold pl-[10px]'>分销说明</View>
            <View className=' mt-[46px] text-[25px] text-[#666666] text-justify leading-normal px-[10px]'>雪纤瘦扎根香港12年来，管理团队对美容服务的热诚，以及员工的努力不懈，业务得以在短短十年间迅速扩展，成功开设多个美容及保健服务，累积深厚实力。为了让更多爱美人士享受到崭新到位的科研塑身美颜体验，本集团现引进多年香港美容实证经验到内地，计划在未来三年进驻北京、上海、广州、成都、深圳等八大城市。让顾客在任何一个城市、任何一个地区，都能实现如雪般梦幻的美肌及轻盈体态。</View>
          </View>
          <View className=' w-full fixed bottom-[98px] left-0 text-current flex justify-center'>
            <Button color='primary' shape='round' className=' w-[628px]' onClick={() => setOpen(true)}>立即申请</Button>
          </View>
        </View>
      </View>
      {/*  */}
      <JoinComp
        open={open}
        onClose={() => setOpen(false)}
        titleRender={() => <Text className=' mt-[-30px] inline-block'>hi，欢迎申请{br}成为雪纤瘦分销商</Text>}
      ></JoinComp>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))