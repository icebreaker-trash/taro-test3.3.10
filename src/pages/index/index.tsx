


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Image } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { Swiper } from '@taroify/core'
import Nav from '@/components/nav-bar/index'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import Tabbar from '@/components/tabbar'
import HomeTopImg from '@/static/img/home-top.png'
import classNames from 'classnames';
import BannerShaderImg from '@/static/img/banner-shader.png'
import banner01 from '@/static/img/banner01.png'
import ScoreBgImg from '@/static/img/score-bg.png'
import ScoreBoxImg from '@/static/img/score-box.png'
import More from '@/components/more'
import HomeActiveBg from '@/static/img/home-active-bg.png'
import ShopHomeIcon from '@/static/img/shop-home-icon.png'
import BagBox from '@/static/img/bag-box.png'
import SmallBox from '@/static/img/small-box.png'
import ServeHomeIcon from '@/static/img/serve-home-icon.png'
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
  const [swiperIndex, setSwiperIndex] = useState(0)
  const banner = [
    banner01,
    'https://img.zcool.cn/community/01dea66381cd2d000ddb1000bccc3d.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
    'https://img.zcool.cn/community/031g0uvuiqnmlpj896ru7me3631.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
    'https://img.zcool.cn/community/031e7cnc3mjl1btgxqbypyh3232.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100'
  ]
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
    // console.log('useReachBottom')
  })
  // 下拉刷新
  usePullDownRefresh(() => {
    watch(async () => {

      Taro.stopPullDownRefresh();
    });
  })

  useEffect(() => {
    
  }, [])


  return (
    <View className='home-page page-view-content bg-[#F4F3F2] pb-[200px]'>
      <Nav
        title='雪纤瘦'
        noBack
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      <View className='main-content pt-[200px] relative px-[22px]'>
        <Image src={HomeTopImg} className='home-top absolute top-0 left-0 w-full' mode='widthFix' />
        {/* swiper */}
        <View className='swiper-out-box'>
          <Swiper autoplay={4000} className='swiper rounded-[54px] h-[380px] relative' onChange={setSwiperIndex}>
            {
              banner.map((item, index) => (
                <Swiper.Item key={index} className=' w-full h-full relative'>
                  <Image className='img w-full h-full' mode='aspectFill' src={item} />
                </Swiper.Item>
              ))
            }
            <Swiper.Indicator className='custom-indicator absolute bottom-[16px] flex items-center'>
              {
                banner.map((item, index) => (
                  <View
                    className={classNames(
                      'i-item w-[10px] h-[10px] rounded-full bg-[#656362] opacity-50 mr-[10px]',
                      { 'active': index === swiperIndex }
                    )}
                    key={index}
                  ></View>
                ))
              }
            </Swiper.Indicator>
          </Swiper>
          <Image src={BannerShaderImg} className=' w-full mt-[-40px]' mode='widthFix' />
        </View>
        {/* 3 入口 */}
        <View className='entrance'>
          <View className='big-item relative'>
            <View className='name'>官方商城</View>
            <View className='text'>每天都有好物上新</View>
            <View className='icon-group absolute right-0 bottom-0'>
              <Image src={BagBox} className=' w-[250px] h-[234px] block' />
              <Image src={ShopHomeIcon} className=' w-[156px] h-[125px] block absolute right-[36px] bottom-[30px]' />
            </View>
          </View>
          <View className='small-box'>
            <View className='s-item ' onClick={() => Taro.switchTab({ url: '/pages/serve/index' })}>
              <View className='name'>服务项目</View>
              <View className='text'>全方位美容纤体</View>
              <View className='icon-group'>
                <Image src={SmallBox} className='small-box' />
                <Image src={ServeHomeIcon} className='img' />
              </View>
            </View>
            <View className='s-item ' onClick={() => Taro.navigateTo({ url: '/subPackage/pages/common/introduce/index' })}>
              <View className='name '>公司介绍</View>
              <View className='text '>专业的权威团队</View>
              <View className='icon-group'>
                <Image src={SmallBox} className='small-box' />
                <Image src={CompanyHomeIcon} className='img' />
              </View>
            </View>
          </View>
        </View>
        {/* 积分 */}
        <View className='integral-box h-[109px] relative mt-[90px]' onClick={() => Taro.navigateTo({ url: `/subPackage/pages/integral/shop/index` })}>
          <Image src={ScoreBgImg} className=' w-full h-full absolute left-0 top-0' mode='aspectFill' />
          <Image src={ScoreBoxImg} className=' absolute w-[170px] h-[160px] left-[-6px] bottom-[-4px]' />
          <View className=' text relative h-full flex items-center pl-[200px]'>
            <View className=' text-[40px]'>积分礼遇</View>
            <View className=' text-[30px] ml-[38px]'>超值好物享不停</View>
          </View>
        </View>
        {/* 活动召集 */}
        <View className='active-collect mt-[36px]'>
          <View className='flex items-center justify-between mb-[26px] px-[20px]'>
            <View>活动召集</View>
            <More onClick={() => Taro.navigateTo({ url: '/subPackage/pages/active/collect/index' })}></More>
          </View>
          <View className='c-box relative'>
            <Image src={HomeActiveBg} className='img w-full h-[174px] block' mode='widthFix'></Image>
            <View className='text text-[#424242] text-[36px] pl-[26px] absolute left-0'>暑期水分子脸部提拉夏令营</View>
          </View>
        </View>
      </View>
      <Tabbar></Tabbar>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))