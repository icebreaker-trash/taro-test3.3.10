


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Image, ScrollView } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import Tabbar from '@/components/tabbar'
import Nav from '@/components/nav-bar/index'
import HomeTopImg from '@/static/img/home-top.png'
import classnames from 'classnames';
import { $ } from '@tarojs/extend'
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
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    tabList: ['精选服务', '身体特护', '塑形服务', '皮肤养护']
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
    console.log('useReachBottom')
  })
  // 下拉刷新
  usePullDownRefresh(() => {
    watch(async () => {
      Taro.stopPullDownRefresh();
    });
  })

  useEffect(() => {
    Taro.nextTick(async () => {
      const { top } = await $('#list-contain').offset()
      const tabbarHeight = await $('.tabbar').height()
      $('#list-contain').css({ height: `calc(100vh - ${top}px - ${tabbarHeight}px - constant(safe-area-inset-bottom))` })
      $('#list-contain').css({ height: `calc(100vh - ${top}px - ${tabbarHeight}px - env(safe-area-inset-bottom))` })
    })
  }, [])

  function switchTabAction(item, index) {
    setIndexData(s => ({ ...s, tabIndex: index }))
  }

  function toDetailAction(item, index) {
    Taro.navigateTo({ url: `/subPackage/pages/serve/detail/index?id=${item.id || 1}` })
  }

  return (
    // pb-[200px]
    <View className='serve-page page-view-content '>
      <Nav
        title='服务项目'
        noBack
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      <Image src={HomeTopImg} className=' w-full' mode='widthFix'></Image>
      <View className='main pt-[190px] mt-[-500px]'>
        <View className=' tab-box flex items-center px-[30px]'>
          {
            infoData.current.tabList.map((item, index) =>
              <View className={classnames('item text-[25px] text-[#666666] mr-[50px] p-[12px]', { active: index === indexData.current.tabIndex })} key={index} onClick={() => switchTabAction(item, index)}>
                {item}
              </View>)
          }
        </View>
        {/* list */}
        <ScrollView scrollY className='list mt-[60px] relative' id='list-contain'>
          <View className=' px-[30px]'>
            {
              Array(5).fill(1).map((item, index) =>
                <View onClick={() => toDetailAction(item, index)} className='item bg-white p-[35px] flex justify-between mb-[30px]' key={index}>
                  <Image className=' w-[200px] h-[200px] rounded-[16px] mr-[20px]' src='https://img.zcool.cn/community/01cf95631da1c80002535a861c8132.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='aspectFill'></Image>
                  <View className=' flex-1'>
                    <View className=' text-[30px] font-bold mb-[20px]'>光子嫩肤脸部提拉服务</View>
                    <View className='text text-[25px] text-[#666666] text-justify taroify-ellipsis--l3'>光子嫩肤治疗可以改善脸部长斑的现
                      象，主要是利用强脉冲光的作用，可
                      以提高皮肤代谢，分解皮肤中的分解皮肤中的</View>
                  </View>
                </View>
              )
            }
          </View>
        </ScrollView>
      </View>
      <View id='tabbar'>
        <Tabbar></Tabbar>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))