


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button } from '@tarojs/components'
import React, { Component, ReactElement, useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { ArrowLeft, WapHomeOutlined } from '@taroify/icons'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import classnames from 'classnames'
import './index.scss'

interface Props {
  user?: UserStore
  noBack?: boolean;
  title?: string;
  theme?: 'white' | 'black';
  style?: string | React.CSSProperties | undefined;
  className?: string;
  bgNode?: any
  backFn?: () => void
}

interface InfoData {
  name: string;
  menuInfo: { top: number }
  showBack: boolean
  showHome: boolean
}

const Index: React.FC<Props> = ({ user, noBack, title, children, theme = 'black', style, className, bgNode, backFn }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    menuInfo: { top: 0 },
    showBack: false,
    showHome: false
  })

  useEffect(() => {
    const menuInfo = Taro.getMenuButtonBoundingClientRect()
    setInfoData(s => ({ ...s, menuInfo }))
    const pageList = Taro.getCurrentPages()
    if(pageList.length >= 2){
      setInfoData(s => ({ ...s, showBack: true }))
    }else{
      setInfoData(s => ({ ...s, showHome: true }))
    }
  }, [])


  const backAction = useCallback(() => {
    Taro.navigateBack({ delta: 1 })
    backFn?.()
  }, [])


  const toHome = useCallback(() => {
    Taro.switchTab({ url: '/pages/index/index' })
    backFn?.()
  }, [])

  return (
    <View className={classnames('nav-bar-comp', [`nav-${theme}`], className)} style={style}>
      <View className='nav-content z-10 flex items-center justify-between h-[88px] px-[30px] relative' style={{ paddingTop: infoData.current.menuInfo?.top + 'px' }}>
        {
          !noBack && <View className='left-box'>
            { infoData.current.showHome ? <WapHomeOutlined className='back-icon' size={25} onClick={toHome} /> : <ArrowLeft className='back-icon' size={25} onClick={backAction} /> }
          </View>
        }
        <View className={classnames('title text-[32px] absolute')} style={noBack ? 'left: 30rpx; transform: translateX(0)' : ''}>
          {title || children}
        </View>
      </View>
      {bgNode()}
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))