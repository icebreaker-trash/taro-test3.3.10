


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
import Nav from '@/components/nav-bar/index'
import HomeTopImg from '@/static/img/home-top.png'
import BannerShaderImg from '@/static/img/banner-shader.png'
import CompanyHomeIcon from '@/static/img/company-home-icon.png'
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
    <View className=' introduce-page page-view-content pb-[200px]'>
      <Nav
        title='公司介绍'
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      <View className='main relative'>
        <Image src={HomeTopImg} className=' w-full absolute top-0 left-0' mode='widthFix'></Image>
        <View className=' px-[25px] relative pt-[140px]'>
          {/* title */}
          <View className=' mt-[40px] mb-[40px] flex items-center'>
            <Image src={CompanyHomeIcon} className=' w-[36px] h-[36px] mr-[22px]'></Image>
            <View className=' text-[36px] font-bold'>关于雪纤瘦</View>
          </View>
          <Image className=' w-full rounded-[18px] bg-[#A37A6F]' src='https://img.zcool.cn/community/031coy2jwswfu8uhdxdw08g3235.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='widthFix'></Image>
          <Image src={BannerShaderImg} className=' w-full mt-[-40px]' mode='widthFix' />
          {/* content */}
          <View className=' text-[24px] text-justify leading-normal'>
            <View className=' indent mb-[20px]' style='text-indent: 2em'>
              包括肌肤修护、美胸护理、健康瘦身、光学脱毛、医学塑形等。集团以顾客服务至上为首要宗旨，扎根香港12年，凭藉专业技术及崭新的设备，为顾客提供体贴的优质服务。
            </View>
            <View className=' mb-[20px]' style='text-indent: 2em'>
              12周年来雪纤瘦继续积极拓展，本着“行多一步，设想周到”的理念，提供高质素的多元化美容服务，引进新的技术及仪器。全线分店均增设医学美容护理，所有产品及仪器均经过严格检测及审核，保证集高质素及高效果于一身，实践为客人缔造终身美丽的承诺。
            </View>
            <View className=' mb-[20px]' style='text-indent: 2em'>
              雪纤瘦扎根香港12年来，管理团队对美容服务的热诚，以及员工的努力不懈，业务得以在短短十年间迅速扩展，成功开设多个美容及保健服务，累积深厚实力。为了让更多爱美人士享受到崭新到位的科研塑身美颜体验，本集团现引进多年香港美容实证经验到内地，计划在未来三年进驻北京、上海、广州、成都、深圳等八大城市。让顾客在任何一个城市、任何一个地区，都能实现如雪般梦幻的美肌及轻盈体态。
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))