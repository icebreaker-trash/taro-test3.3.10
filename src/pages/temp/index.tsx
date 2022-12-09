


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Text } from '@tarojs/components'
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
    const query = Taro.createSelectorQuery()
    query.select('#Home').boundingClientRect((res) => {
      console.log(res, 'res')
    }).exec()
  }

  return (
    <View id='Home' className=' text-purple-300'>
      xxx
      {infoData.current.name && <View style={{ height: 500, background: '#abcdef' }}>{infoData.current.name}</View>}
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))