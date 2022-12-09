


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
import ShopCard from '@/components/shop-card'
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string
  pageTitle: string
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    pageTitle: ''
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
    console.log('useReachBottom')
  })
  // 下拉刷新
  usePullDownRefresh(() => {
    watch(async () => {
      Taro.stopPullDownRefresh();
    });
  })
  useEffect(() => {
    const title = router.params.title || ''
    setInfoData(s => ({ ...s, pageTitle: title }))
    Taro.setNavigationBarTitle({ title })
  }, [])

  function toDetailAction(item){
    Taro.navigateTo({ url: `/subPackage/pages/common/shop-detail/index?id=${item.id || 0}` })
  }

  return (
    <View className=' category-shop-page page-view-content bg-[#F4F3F2]'>
      <Nav
        title={infoData.current.pageTitle}
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src='https://img.zcool.cn/community/031xwslvotjgzq7hz44oszl3934.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      <View className='main'>
        <Image className=' w-full' src='https://img.zcool.cn/community/031xwslvotjgzq7hz44oszl3934.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='widthFix'></Image>
        <View className=' list mt-[40px] px-[30px] flex justify-between flex-wrap'>
          {
            Array(5).fill(1).map((item, index) => <ShopCard data={{}} key={index} onClick={() => toDetailAction(item)}></ShopCard>)
          }
        </View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))