


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
import Nav from '@/components/nav-bar/index'
import { Cross } from '@taroify/icons'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import MyBgImg from '@/static/img/my-bg.png'
import UserBasic from '@/components/user-basic'
import './index.scss'


interface Props {
  user: UserStore
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setResData, resData] = useStateRef({
    list: [
      {
        img: 'https://img.zcool.cn/community/031f7f162fafd790002c45e3707a137.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口号套餐',
        count: 1,
        score: 250,
        price: 890,
      },
    ]
  })
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: ''
  })
  const avatar = 'https://img.zcool.cn/community/031yfq4vrjwjvsdqcu6690x3136.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100'
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
    <View className='sale-income-page page-view-content'>
      <Nav
        title='收益明细'
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={MyBgImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      {/* top */}
      <View className='top-box h-[521px] relative'>
        <Image src={MyBgImg} className=' w-full absolute top-0 left-0' mode='widthFix'></Image>
        <View className=' basic-box flex items-center relative pt-[154px] px-[54px]'>
          <UserBasic
            type='common'
            avatar={avatar}
            name='William 汤(微信&小程序开发)'
            text='推广累计总收益 800积分'
          ></UserBasic>
        </View>
      </View>
      {/* main */}
      <View className='main py-[36px] px-[22px] rounded-[54px] mt-[-200px] relative bg-[#F4F3F2]'>
        <View className='info-box bg-white py-[66px] px-[94px] flex justify-between flex-wrap'>
          <View className=' item'>
            <View className=' big'>360</View>
            <View className=' text'>总收益（积分）</View>
          </View>
          <View className=' item'>
            <View className=' big'>100</View>
            <View className=' text'>总支出（积分）</View>
          </View>
        </View>
        {/* 积分记录 */}
        <View className='hot-shop mt-[94px]'>
          <View className=' text-[30px] font-bold mb-[50px] pl-[6px]'>积分记录</View>
          <View className=' list'>
            <View className='item'>
              <View className=' item-top-box'>
                <Image src='https://img.zcool.cn/community/0314tugtsmoqltkxc7hdkos3737.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' className='img' mode='aspectFill'></Image>
                <View className=' right-box'>
                  <View className=' title-box'>
                    <View className='title'>美妆套装</View>
                    <View className='price'>￥849</View>
                  </View>
                  <View className=' count-box'><Cross size={12} />1</View>
                </View>
              </View>
              <View className=' user-box'>
                <View className=' user-info'>
                  <Image className='avatar' src='https://img.zcool.cn/community/03138bunw734gllibdw7uev3431.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
                  <View className=' text'>2022/14/12 一级客户购买商品</View>
                </View>
                <View className=' score-update'>+10积分</View>
              </View>
            </View>
            <View className='item'>
              <View className=' item-top-box'>
                <Image src='https://img.zcool.cn/community/0314tugtsmoqltkxc7hdkos3737.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' className='img' mode='aspectFill'></Image>
                <View className=' right-box'>
                  <View className=' title-box'>
                    <View className='title'>美妆套装</View>
                    <View className='price'>￥849</View>
                  </View>
                  <View className=' count-box'><Cross size={12} />1</View>
                </View>
              </View>
              <View className=' user-box'>
                <View className=' user-info'>
                  <Image className='avatar' src='https://img.zcool.cn/community/03138bunw734gllibdw7uev3431.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
                  <View className=' text'>2022/14/12 兑换商品</View>
                </View>
                <View className=' score-update'>-10积分</View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))