


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Text, Image } from '@tarojs/components'
import React, { useCallback, useEffect, useRef } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import Nav from '@/components/nav-bar/index'
import HomeTopImg from '@/static/img/home-top.png'
import UserBasic from '@/components/user-basic'
import classnames from 'classnames';
import ShopCard from '@/components/shop-card'
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string
  tabList: string[]
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setResData, resData] = useStateRef({
    list: [
      {
        img: 'https://img.zcool.cn/community/031f7f162fafd790002c45e3707a137.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口号套餐',
        score: 250
      },
      {
        img: 'https://img.zcool.cn/community/031f7f162fafd790002c45e3707a137.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口号套餐',
        score: 250
      },
      {
        img: 'https://img.zcool.cn/community/031f7f162fafd790002c45e3707a137.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口号套餐',
        score: 250
      },
      {
        img: 'https://img.zcool.cn/community/031f7f162fafd790002c45e3707a137.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口号套餐',
        score: 250
      },
      {
        img: 'https://img.zcool.cn/community/031f7f162fafd790002c45e3707a137.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口号套餐',
        score: 250
      }
    ]
  })
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    tabList: ['热门礼品', '生活类', '礼品类', '化妆品类']
  })
  const [, setIndexData, indexData] = useStateRef({
    tabIndex: 0
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

  useEffect(() => {

  }, [])

  function switchTabAction(item, index){
    setIndexData(s => ({ ...s, tabIndex: index }))
  }

  function toDetailAction(item){
    Taro.navigateTo({ url: `/subPackage/pages/common/shop-detail/index?id=${item.id || 1}` })
  }

  return (
    <View className=' integral-shop-page page-view-content'>
      <View className='' id='nav-content'>
        <Nav
          title='积分商城'
          className=' bg-transparent'
          style={{ background: 'transparent' }}
          bgNode={() => <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
        ></Nav>
      </View>

      {/* banner */}
      <View className='banner'>
        <Image className=' w-full' src='https://img.zcool.cn/community/031cvgtulngbpfiti1hwrhq3336.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='widthFix'></Image>
      </View>
      <View className=' main py-[35px] px-[32px]'>
        {/* 用户 */}
        <UserBasic type='small' avatar='https://img.zcool.cn/community/031f7f162fafd790002c45e3707a137.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' text='积分 800' name='William 汤(微信&小程序开发)'></UserBasic>
        <View className='tab-box py-[20px] mb-[45px]'>
          {
            infoData.current.tabList.map((item, index) =>
              <View
                key={index}
                className={classnames('item', { active: index === indexData.current.tabIndex })}
                onClick={() => switchTabAction(item, index)}
              >
                {item}
              </View>)
          }
        </View>
        <View className='shop-list flex flex-wrap justify-between'>
          {
            resData.current.list.map((item, index) =>
              <ShopCard key={index} data={item} type='score' onClick={() => toDetailAction(item)}></ShopCard>)
          }
        </View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))