


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
import $api from '@/api/index';
import ParseComp from '@/components/parse/index'
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string;
  articleInfo: { content?: string }
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    articleInfo: {}
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
    watch(() => {
      getNewsDetailAction()
    })
    setTimeout(() => {
      setInfoData(state => ({ ...state, name: 'msg' }))
      setInfoData(state => ({ ...state, name: 'msg23' }))
      console.log(infoData.current, 'curt')
      Taro.nextTick(() => {
        getHomeDomAction()
      })
    }, 2000)
  }

  function getNewsDetailAction() {
    $api.getNewsDetail({ news_id: 35 }).then(res => {
      if (!res) {
        return
      }
      setInfoData(state => ({ ...state, articleInfo: res }))
    })
  }

  function getHomeDomAction() {
    const query = Taro.createSelectorQuery()
    query.select('#Home').boundingClientRect((res) => {
      console.log(res, 'res')
    }).exec()
  }

  return (
    <View id='Home' className=' '>
      <View>000</View>
      xxx
      {/* {infoData.current.name && <View style={{ height: 500, background: '#abcdef' }}>{infoData.current.name}</View>} */}
      <View className='px-[32px] content text-[28px] text-justify'>
        <ParseComp content={infoData.current.articleInfo.content} tagStyle={{ img: 'width: 100%;', p: 'margin: 10px 0' }}></ParseComp>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))