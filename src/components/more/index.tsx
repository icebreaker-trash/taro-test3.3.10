


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
import { Arrow } from '@taroify/icons'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import classnames from 'classnames'
import './index.scss'

interface Props {
  user?: UserStore;
  text?: string;
  className?: string;
  style?: string | React.CSSProperties | undefined;
  iconSize?: number | string;
  onClick?: () => void
  type?: 'grey' | 'common'
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user, text, className, style, iconSize = 16, onClick, type = 'common' }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: ''
  })

  return (
    <View className={classnames('more-comp flex items-center p-2', className)} style={style} onClick={onClick}>
      <View
        className={
          classnames(
            { ' text-[#64544A]': type === 'common' },
            { ' text-[#666666]': type === 'grey' }
          )}
      >{text || '更多'}</View>

      <Arrow
        className={
          classnames(
            { ' text-[#64544A]': type === 'common' },
            { ' text-[#666666]': type === 'grey' }
          )}
        size={iconSize}
      />
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))