


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
import { useGetList } from '@/hooks'
import $api from '@/api/index';
import './index.scss'


interface Props {
  user: UserStore
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user }) => {
  const { reLoadAction, nextAction, page, renderAction } = useGetList()

  useReachBottom(() => {
    nextAction(getNewsListAction)
  })

  useEffect(() => {
    watch(() => {
      reLoadAction(getNewsListAction)
    })
  }, [])

  async function getNewsListAction() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return $api.getNewsList({ page: page.current }).then(res => {
          if (!res) {
            return
          }
          resolve(res)
          return res
        })
      }, 1000)
    })
    return $api.getNewsList({ page: page.current }).then(res => {
      if (!res) {
        return
      }
      return res
    })
  }
  return (
    <View>
      <View className='list px-2'>
        {renderAction((item, index) => <View key={item.id} className=' text-black p-8 mb-2 bg-purple-100'>{item.title}</View>)}
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))