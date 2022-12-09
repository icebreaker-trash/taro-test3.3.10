


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
        <View className=' px-[25px] relative pt-[200px]'>
          <Image className=' w-full rounded-[18px] bg-[#A37A6F]' src='https://img.zcool.cn/community/031coy2jwswfu8uhdxdw08g3235.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='widthFix'></Image>
          <Image src={BannerShaderImg} className=' w-full mt-[-40px]' mode='widthFix' />
          {/* title */}
          <View className=' mt-[40px] mb-[70px] flex items-center'>
            <Image src={CompanyHomeIcon} className=' w-[36px] h-[36px] mr-[22px]'></Image>
            <View className=' text-[36px] font-bold'>关于雪纤瘦</View>
          </View>
          <View className='c-item' onClick={() => Taro.navigateTo({ url: '/subPackage/pages/common/introduce-content/index' })}>
            <Image className=' img' src='https://img.zcool.cn/community/0311kaggafizdwp3xbnqzp83334.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
            <View className=' flex-1'>
              <View className='name'>集团简介</View>
              <View className=' text'>本着“行多一步，设想周到”的理念，提供高
                质素的多元化美容服务</View>
            </View>
          </View>
          <View className='c-item'>
            <Image className=' img' src='https://img.zcool.cn/community/0311kaggafizdwp3xbnqzp83334.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
            <View className=' flex-1'>
              <View className='name'>集团简介</View>
              <View className=' text'>本着“行多一步，设想周到”的理念，提供高
                质素的多元化美容服务</View>
            </View>
          </View>
          <View className='c-item'>
            <Image className=' img' src='https://img.zcool.cn/community/0311kaggafizdwp3xbnqzp83334.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
            <View className=' flex-1'>
              <View className='name'>集团简介</View>
              <View className=' text'>本着“行多一步，设想周到”的理念，提供高
                质素的多元化美容服务</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))