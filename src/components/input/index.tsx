


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
import { Input } from '@taroify/core'
import { InputProps } from '@taroify/core/input'
import { Clear } from '@taroify/icons'
import classNames from 'classnames';
import './index.scss'


interface Props {
  user?: UserStore
  closeStyle?: React.CSSProperties
  onClear?: () => void
}

const Index: React.FC<Props & InputProps> = ({ user, value, onChange, onInput, closeStyle, onClear, ...end }) => {
  const class_fix = 'lsmi-input_comp'
  return (
    <View className={classNames('lsmi-input_comp flex items-center justify-between', [end.className])}>
      <Input className=' flex-1' {...end} placeholder={end.placeholder || '请输入文本'} value={value} onInput={onInput && ((e) => onInput(e))} onChange={onChange && ((e) => onChange(e))} />
      <Clear className={classNames('ml-[30px]', `${class_fix}__clear-icon`, [value ? `${class_fix}__clear-active` : ''])} style={closeStyle} onClick={onClear} />
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))