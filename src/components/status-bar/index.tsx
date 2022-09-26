


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button } from '@tarojs/components'
import React, { useCallback, useEffect, useMemo } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import classNames from 'classnames';
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import './index.scss'


interface Props {
  user?: UserStore
  bgColor?: string
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user, children, bgColor }) => {
  const router = useRouter()

  const style = useMemo(() => {
    const obj: { height?: number; backgroundColor?: any } = {}
    // 状态栏高度，由于某些安卓和微信开发工具无法识别css的顶部状态栏变量，所以使用js获取的方式
    // getSystemInfoSync
    obj.height = 0
    obj.backgroundColor = bgColor
    return obj
  }, [])

  return (
    <View
      style={style}
      className='u-status-bar w-full'
    >
      {children && children}
    </View>
  )
}

Index.defaultProps = {
  bgColor: 'transparent'
}

export default React.memo(inject('user')(observer(Index)))