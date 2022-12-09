


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
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import Nav from '@/components/nav-bar/index'
import classnames from 'classnames';
import HomeTopImg from '@/static/img/home-top.png'
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
  const tabList = ['一级客户', '二级客户']
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: ''
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
    const type = router.params.type || '0'
    setIndexData(s => ({ ...s, tabIndex: Number(type) || 0 }))
  }, [])

  function switchTabAction(item, index) {
    setIndexData(s => ({ ...s, tabIndex: index }))
  }

  return (
    <View className='sale-customer-page page-view-content'>
      <Nav
        title='分销中心'
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      {/* top */}
      <View className='top-box h-[521px] relative'>
        <Image src={HomeTopImg} className=' w-full absolute top-0 left-0' mode='widthFix'></Image>
        <View className=' main-box pt-[200px] relative px-[25px]'>
          <View className=' tab-box flex items-center'>
            {
              tabList.map((item, index) =>
                <View key={index} className={classnames('item text-[25px] text-[#666666] p-[6px] mr-[77px]', { active: index === indexData.current.tabIndex })} onClick={() => switchTabAction(item, index)}>
                  {item}
                </View>
              )
            }
          </View>
          {/* list */}
          <View className=' list mt-[107px]'>
            {
              Array(5).fill(1).map((item, index) => (
                <View key={index} className=' item mb-[30px] bg-white p-[30px] rounded-[43px]'>
                  <UserBasic avatar='https://img.zcool.cn/community/031hwcvtoco1ijutbtkwfmp3733.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' type='small' name='William 汤(微信&小程序开发)' text='2022/11/14加入'></UserBasic>
                </View>
              ))
            }

          </View>
        </View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))