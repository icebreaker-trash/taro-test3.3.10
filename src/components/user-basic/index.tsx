


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
import DefaultAvatar from '@/static/img/default-avatar.png'
import classnames from 'classnames';
import './index.scss'

interface Props {
  user?: UserStore
  avatar: string
  showLogin?: boolean
  name: string
  type: 'small' | 'common'
  text: string;
  onLogin?: () => void
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user, avatar, showLogin, name, type = 'common', text, onLogin }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: ''
  })

  return (
    <View className=' user-basic-comp flex items-center justify-between'>
      <Image className={classnames(' rounded-full mr-[30px]', [ type === 'common' ? 'w-[130px] h-[130px]' : 'w-[100px] h-[100px]' ])} src={avatar || DefaultAvatar} mode='aspectFill'></Image>
      <View className={classnames('flex-1 text-[36px] font-bold', [showLogin ? ' block' : 'hidden'])} onClick={onLogin}>请点击登录</View>
      <View className={classnames('basic-box flex-1', [showLogin ? ' hidden' : 'block'])}>
        <View className={classnames('truncate w-[478px]', [ type === 'common' ? ' text-[36px] font-bold' : 'text-[25px]' ])}>{ name || '---' }</View>
        <View className=' text-[25px] mt-[18px]'>{ text || '---' }</View>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))