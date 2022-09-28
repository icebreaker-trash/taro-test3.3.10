


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { Button } from '@taroify/core'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
// 引入组件对应的样式，若组件没有样式文件，则无须引入
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user }) => {

  useEffect(() => {
    
  },[])
  function userInfoAction(){
    // Taro.getUserProfile({
    //   desc: 'mmmm',
    //   success: (res) => {
    //     console.log(res, 'res')
    //   }
    // })
  }
  function getPhoneNumber(e){
    console.log(e, 'e')
  }
  return (
    <View>
      <Button onClick={userInfoAction}>user info</Button>
      <Button openType='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>user phone</Button>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))