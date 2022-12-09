


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Image, Text } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { Swiper, Divider, Button, Popup } from '@taroify/core'
import { click, getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import { GuideOutlined, Cross } from '@taroify/icons'
import classNames from 'classnames'
import Parse from '@/components/parse/index'
import DetailP1Img from '@/static/img/detail-p1.png'
import DetailP2Img from '@/static/img/detail-p2.png'
import DetailP3Img from '@/static/img/detail-p3.png'
import DetailShareIcon from '@/static/img/detail-share.png'
import ServeManIcon from '@/static/img/serve-man.png'
import CartIcon from '@/static/img/cart.png'
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string
}
type PageType = 'common' | 'score'

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [pageType, setPageType] = useState<PageType>('common')
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: ''
  })
  const [swiperIndex, setSwiperIndex] = useState(0)
  const [, setSkuPopup, skuPopup] = useStateRef(false)
  const banner = [
    'https://img.zcool.cn/community/01dea66381cd2d000ddb1000bccc3d.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
    'https://img.zcool.cn/community/031g0uvuiqnmlpj896ru7me3631.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
    'https://img.zcool.cn/community/031e7cnc3mjl1btgxqbypyh3232.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100'
  ]
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
  useEffect(() => {
    const paramsType = router.params.type || ''
    paramsType && (setPageType(paramsType as PageType))
  }, [])

  function instantPayAction() {
    setSkuPopup(true)
  }

  function toPayAction(){
    click(() => {
      setSkuPopup(false)
      Taro.navigateTo({ url: `/subPackage/pages/order/checkout/index` })
    })
  }

  return (
    <View className=' shop-detail-page page-view-content bg-[#F4F3F2] pb-[200px]'>
      {/* swiper */}
      <View className='swiper-out-box'>
        <Swiper autoplay={4000} className='swiper h-[710px] relative' onChange={setSwiperIndex}>
          {
            banner.map((item, index) => (
              <Swiper.Item key={index} className=' w-full h-full relative'>
                <Image className='img w-full h-full' mode='aspectFill' src={item} />
              </Swiper.Item>
            ))
          }
          <Swiper.Indicator
            className='custom-indicator absolute bottom-[16px] left-1/2 flex items-center'
            style='transform: translateX(-50%);'
          >
            {
              banner.map((item, index) => (
                <View
                  className={classNames(
                    'i-item w-[10px] h-[10px] rounded-full bg-[#656362] opacity-50 mr-[10px]',
                    { ' w-[58px] rounded-[11px] opacity-100': index === swiperIndex }
                  )}
                  key={index}
                ></View>
              ))
            }
          </Swiper.Indicator>
        </Swiper>
      </View>
      <View className='goods-basic p-[35px] bg-white'>
        {
          pageType === 'common' ? <View className=''>
            <Text className=' text-[#F03C21] text-[48px] font-bold'>
              <Text className=' text-[25px] font-[400]'>￥</Text>
              <Text>698</Text>
            </Text>
            <Text className=' text-[#999999] text-[25px] ml-[26px]' style='text-decoration:line-through'>
              ￥698
            </Text>
          </View> : <View className=' text-[#F03C21]'>
            <Text className=' text-[48px] font-bold'>360</Text>
            <Text className=' text-[25px] ml-[8px]'>积分</Text>
          </View>
        }
        <View className=' flex items-center justify-between mt-[34px]'>
          <View className='title text-[36px] font-bold'>美妆套装</View>
          <Image src={DetailShareIcon} className=' w-[44px] h-[44px]'></Image>
        </View>
        <View className=' mt-[50px] flex px-[10px] items-center justify-between'>
          <View className='item flex items-center'>
            <Image src={DetailP1Img} className=' w-[23px]' mode='widthFix' />
            <View className='text text-[25px] ml-[6px]'>精选好物</View>
          </View>
          <View className='item flex items-center'>
            <Image src={DetailP2Img} className=' w-[23px]' mode='widthFix' />
            <View className='text text-[25px] ml-[6px]'>品质保障</View>
          </View>
          <View className='item flex items-center'>
            <Image src={DetailP3Img} className=' w-[21px]' mode='widthFix' />
            <View className='text text-[25px] ml-[6px]'>放心购物</View>
          </View>
        </View>
      </View>
      {/* 产品详情 */}
      <View className=' py-[30px] px-[240px]'>
        <Divider className=' text-[#999999] text-[24px]' style={{ color: "#999999", borderColor: "#999999", margin: 0 }}>产品详情</Divider>
      </View>
      <View>
        {/* <Image src='https://img.zcool.cn/community/031bf83e13q1idoepkyov3w3834.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' />
        <Image src='https://img.zcool.cn/community/031jflcfmro70zja6hcniqj3836.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' />
        <Image src='https://img.zcool.cn/community/031rnppuvbrdcocslu4svah3339.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' /> */}
        <Parse content={content} tagStyle={{ img: 'display: block' }}></Parse>
      </View>
      {/* fixed */}
      {
        pageType === 'common' && <View className=' fixed-box fixed bottom-0 left-0 z-10 h-[120px] bg-white flex items-center justify-between w-full'>
          <View className=' flex items-center justify-center h-full flex-1'>
            <View className='item mr-[65px]'>
              <Image src={ServeManIcon} className=' w-[36px] h-[36px]'></Image>
              <View className='text-[24px] mt-[7px]'>客服</View>
            </View>
            <View className='item' onClick={() => Taro.navigateTo({ url: '/subPackage/pages/common/cart/index' })}>
              <Image src={CartIcon} className=' w-[36px] h-[37px]'></Image>
              <View className='text-[24px] mt-[7px]'>购物车</View>
            </View>
          </View>
          {/* btn */}
          <View className=' flex items-center text-[30px] text-white h-full'>
            <View className='fixed-btn w-[210px] text-center'>加入购物车</View>
            <View className='fixed-btn w-[210px] text-center' onClick={instantPayAction}>立即购买</View>
          </View>
        </View>
      }
      {
        pageType === 'score' &&
        <View className=' w-full fixed bottom-[38px] text-center'>
          <Button
            color='primary'
            className=' w-[628px]'
            shape='round'
            onClick={instantPayAction}
          >立即兑换</Button>
        </View>
      }
      {/* sku */}
      <Popup open={skuPopup.current} placement='bottom' onClose={() => setSkuPopup(false)}>
        <Popup.Close><Cross size={20} color='#707070' /></Popup.Close>
        <View className='sku-box py-[32px] px-[40px]'>
          <View className='sku-info flex justify-between'>
            <Image className=' w-[165px] h-[165px] mr-[36px]' src='https://img.zcool.cn/community/011766630db8050002c45e3708e217.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
            <View className=' h-[165px] flex flex-col justify-between flex-1'>
              <View className=' text-[28px]'>美妆套装</View>
              <View className=' text-[25px]'>￥890</View>
            </View>
          </View>
          {/* list */}
          <View className=' sku-list mt-[40px]'>
            <View className=' text-[25px] font-bold mb-[32px]'>规格</View>
            <View>
              {
                Array(12).fill(1).map((item, index) =>
                  <View
                    className={classNames(`item text-[24px] w-[208px] 
                    inline-block mr-[22px] 
                    py-[12px] bg-[#F7F7F7] 
                    rounded-[10px] text-center mb-[22px]`,
                      {
                        ' mr-0': (index + 1) % 3 === 0,
                        'bg-[#FFF7E2] text-[#917320] border border-[#917320]': index === 0
                      })}
                    key={index}
                  >规格一</View>
                )
              }
            </View>
          </View>
          <View className=' px-[24px] mt-[60px]'>
            <Button color='primary' shape='round' className=' w-full' onClick={toPayAction}>立即购买</Button>
          </View>
        </View>
      </Popup>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))