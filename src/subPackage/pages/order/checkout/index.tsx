


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
import { click, getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import Nav from '@/components/nav-bar/index'
import { Location, Arrow } from '@taroify/icons'
import { Stepper } from '@taroify/core'
import HomeTopImg from '@/static/img/home-top.png'
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string
  addressInfo: any
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    addressInfo: null
  })

  useReachBottom(() => {

  })
  // 下拉刷新
  usePullDownRefresh(() => {
    watch(async () => {
      Taro.stopPullDownRefresh();
    });
  })

  function pickAddressAction() {
    Taro.chooseAddress({
      success: (res) => {
        setInfoData(s => ({ ...s, addressInfo: res }))
      }
    })
  }

  function submitAction() {
    click(() => {

    })
  }

  return (
    <View className=' checkout-page page-view-content pb-[200px]'>
      <Nav
        title='确认订单'
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      <View className='main relative pt-[209px] px-[35px]'>
        <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix'></Image>
        <View className=' relative address rounded-[18px] bg-white h-[180px] px-[46px] flex items-center' onClick={pickAddressAction}>
          <Location size={22} color='#917320' className=' mr-[50px]' />
          {
            infoData.current.addressInfo ? <View className=' flex-1 relative'>
              <View className=' name mb-[30px]'>
                <Text className=' font-bold text-[30px]'>{infoData.current.addressInfo.userName}</Text>
                <Text className=' text-[24px] ml-[22px]'>{infoData.current.addressInfo.telNumber}</Text>
              </View>
              <View className=' text-[24px]'>{infoData.current.addressInfo.provinceName}{infoData.current.addressInfo.cityName
              }{infoData.current.addressInfo.countyName
                }{infoData.current.addressInfo.detailInfo}</View>
              <View className=' absolute right-0 top-1/2 translate-y-[-50%]' >
                <Arrow size={20} />
              </View>
            </View> : <View className=' text-[30px] flex-1'>
              请选择收货地址
            </View>
          }
        </View>
        {/* 订单信息 */}
        <View className=' relative order-info mt-[30px] px-[46px] py-[44px] bg-white rounded-[18px]'>
          <View className=' text-[30px] mb-[50px] font-bold'>商品信息</View>
          <View className=' flex h-[165px] justify-between'>
            <Image className=' w-[165px] h-[165px] mr-[36px]' src='https://img.zcool.cn/community/03119iupjcmh45exkpy62li3933.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill' />
            <View className=' flex flex-col justify-between flex-1'>
              <View className=' text-[28px]'>美妆套装</View>
              <View className=' flex items-center justify-between'>
                <View className=' text-[30px] font-bold'>360 积分</View>
                <Stepper size='22' min={1} max={999}>
                  <Stepper.Button />
                  <Stepper.Input width='40' />
                  <Stepper.Button />
                </Stepper>
              </View>
            </View>
          </View>
          {/*  */}
          <View className='text-[28px] flex items-center justify-between mt-[88px]'>
            <View className=' '>配送方式</View>
            <View>快递免邮</View>
          </View>
          <View className='text-[28px] flex items-center justify-between mt-[30px]'>
            <View className=' '>实付款</View>
            <View className=' text-[#F03C21]'>360积分</View>
          </View>
        </View>
      </View>
      {/* fixed */}
      <View className=' fixed-box w-full fixed bottom-0 left-0 bg-white flex h-[120px]'>
        <View className=' text-[24px] flex-1 h-full flex justify-center items-center'>
          <Text>共1件，合计：</Text>
          <Text className=' text-[36px] text-[#F03C21] font-bold'>360积分</Text>
        </View>
        <View className=' submit-btn w-[210px] text-center text-white bg-[#9A7D2B]' onClick={submitAction}>提交订单</View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))