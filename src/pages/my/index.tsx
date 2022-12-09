


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
import Tabbar from '@/components/tabbar'
import Nav from '@/components/nav-bar/index'
import MyBgImg from '@/static/img/my-bg.png'
import UserBasic from '@/components/user-basic'
import MyServeP1 from '@/static/img/my-serve-p1.png'
import MyServeP2 from '@/static/img/my-serve-p2.png'
import MyServeP3 from '@/static/img/my-serve-p3.png'
import MyServeP4 from '@/static/img/my-serve-p4.png'
import More from '@/components/more'
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
  const orderList = [
    {
      name: '待付款',
      img: require('@/static/img/my-order-p1.png')
    },
    {
      name: '待发货',
      img: require('@/static/img/my-order-p2.png')
    },
    {
      name: '待收货',
      img: require('@/static/img/my-order-p3.png')
    },
    {
      name: '已完成',
      img: require('@/static/img/my-order-p4.png')
    },
    {
      name: '退款',
      img: require('@/static/img/my-order-p5.png')
    }
  ]
  // const avatar = 'https://img.zcool.cn/community/031ecyauthiydlma8bcyfom3535.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100'
  const avatar = ''
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

  function toMineAction(){
    Taro.navigateTo({ url: `/subPackage/pages/mine/basic/index` })
  }

  function toSaleAction(){
    Taro.navigateTo({ url: `/subPackage/pages/sale/apply/index` })
  }
  return (
    <View className='my-page page-view-content pb-[200px]'>
      <Nav
        title=''
        noBack
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={MyBgImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      {/* top */}
      <View className='top-box h-[521px] relative'>
        <Image src={MyBgImg} className=' w-full absolute top-0 left-0' mode='widthFix'></Image>
        {/* pt-[154px] */}
        <View className=' basic-box flex items-center relative pt-[160px] px-[54px]'>
          <UserBasic
            showLogin
            type='common'
            avatar={avatar}
            name='William 汤(微信&小程序开发)'
            text='积分 800'
            onLogin={toMineAction}
          ></UserBasic>
        </View>
      </View>
      {/* main */}
      <View className='main py-[36px] px-[22px] rounded-[54px] mt-[-200px] relative bg-[#F4F3F2]'>
        <View className=' item'>
          <View className=' title-box'>
            <View className=' title'>我的订单</View>
            <More className=' more' type='grey' onClick={() => Taro.navigateTo({ url: `/subPackage/pages/order/list/index?type=${0}` })}></More>
          </View>
          <View className=' c-list'>
            {
              orderList.map((item, index) =>
                <View className='cl-item' key={index} onClick={() => Taro.navigateTo({ url: `/subPackage/pages/order/list/index?type=${index+1}` })}>
                  <Image src={item.img} className=' img'></Image>
                  <View className=' text'>{item.name}</View>
                </View>)
            }
          </View>
        </View>
        <View className=' item'>
          <View className=' title-box'>
            <View className=' title'>积分订单</View>
            <More className=' more' type='grey'></More>
          </View>
          <View className=' c-list'>
            {
              orderList.map((item, index) =>
                <View className='cl-item' key={index}>
                  <Image src={item.img} className=' img'></Image>
                  <View className=' text'>{item.name}</View>
                </View>)
            }
          </View>
        </View>
        <View className=' item'>
          <View className=' title'>服务</View>
          <View className=' list'>
            <View className='l-item' onClick={toSaleAction}>
              <Image src={MyServeP1} className='img'></Image>
              <View className=' text'>分销申请</View>
            </View>
            <View className='l-item'>
              <Image src={MyServeP2} className='img'></Image>
              <View className=' text'>会员权益</View>
            </View>
            <View className='l-item'>
              <Image src={MyServeP3} className='img'></Image>
              <View className=' text'>反馈建议</View>
            </View>
            <View className='l-item'>
              <Image src={MyServeP4} className='img'></Image>
              <View className=' text'>联系我们</View>
            </View>
          </View>
        </View>
      </View>
      <Tabbar></Tabbar>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))