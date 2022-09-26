


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import './index.scss'
import { toRpx } from './../poster/util';


interface Props {
  user?: UserStore
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user }) => {
  const [info, setInfo] = useState<Taro.getMenuButtonBoundingClientRect.Rect | {}>({})
  useReachBottom(() => {

    console.log('useReachBottom')
  })

  useEffect(() => {
    const newInfo = Taro.getMenuButtonBoundingClientRect()
    setInfo(newInfo)
    console.log(info, 'info')
  }, [])


  return (
    <View
      className=' bg-amber-200'
      style={{
        paddingTop: toRpx(info.top) + 'rpx',
        paddingLeft: 20,
        paddingRight: 20,
        boxSizing: "content-box"
      }}
    >
      <View className='content bg-purple-100 h-[88px]'>xx</View>
      {/* <View className=' absolute bg-purple-300 z-10' style={info}></View> */}
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))