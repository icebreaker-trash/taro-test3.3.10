


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
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
      await initAction();
      Taro.stopPullDownRefresh();
    });
  })
  useDidShow(() => {
    console.log('show')
  })
  useEffect(() => {
    // 获取不到dom
    console.log('one effect')
    initAction()
  }, [])
  useReady(() => {
    // dom挂载完毕
    getHomeDomAction()
    console.log('mounted')
  })

  function initAction() {
    setTimeout(() => {
      setInfoData(state => ({ ...state, name: 'msg' }))
      setInfoData(state => ({ ...state, name: 'msg23' }))
      console.log(infoData.current, 'curt')
      Taro.nextTick(() => {
        getHomeDomAction()
      })
    }, 2000)
  }

  function getHomeDomAction() {
    // debugger
    const query = Taro.createSelectorQuery()
    query.select('#Home').boundingClientRect((res) => {
      console.log(res, 'res')
    }).exec()
  }

  return (
    <View className=' flex items-center justify-center'>
      <View className=' w-[50px] h-[50px] bg-red-400'></View>
      <View className=' w-1/2 h-[100px] bg-purple-400 ml-2'></View>
      <View className='p-[10px] bg-green-400 text-light-600 ml-2'>sss</View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))