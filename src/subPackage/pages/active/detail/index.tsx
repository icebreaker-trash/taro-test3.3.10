


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Image } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import JoinComp from '@/components/join/index'
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
  const [open, setOpen] = useState(false)
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
  return (
    <View className=' active-detail-page page-view-content pb-[100px]'>
      <Image className=' w-full' src='https://img.zcool.cn/community/031u6vm9dptbk7xro5fh4993932.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='widthFix'></Image>
      <Image className=' w-full' src='https://img.zcool.cn/community/031u6vm9dptbk7xro5fh4993932.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='widthFix'></Image>
      <Image className=' w-full' src='https://img.zcool.cn/community/031u6vm9dptbk7xro5fh4993932.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='widthFix'></Image>
      <Image className=' w-full' src='https://img.zcool.cn/community/031u6vm9dptbk7xro5fh4993932.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100' mode='widthFix'></Image>
      <View
        className=' 
        fixed w-[628px] py-[28px] 
      text-center bottom-[58px] left-1/2 
      translate-x-[-50%] bg-[#917320] rounded-[43px] text-white
      '
        onClick={() => setOpen(true)}
      >活动报名</View>
      <JoinComp open={open} onClose={() => setOpen(false)}></JoinComp>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))