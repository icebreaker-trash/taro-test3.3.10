import { inject, observer } from 'mobx-react'
import {View, Button, WebView} from '@tarojs/components'
import React, { useCallback, useEffect , useState } from 'react'
import Taro from '@tarojs/taro'
import { UserStore } from '@/types/store'

import './index.scss'

interface Props {
  user: UserStore
}

const Index: React.FC<Props> = ({ user }) => {

  const [url, setUrl] = useState(`http://192.168.1.8:3000?c=${Date.now()}`)

  useEffect(() => {
    setTimeout(() => {
      Taro.showToast({
        title: 'xxx',
      })
    }, 2000)
  }, [])

  function messageHandleAction(e){
    console.log(e, 'e')
  }
  function loadAction(){
    console.log('loadAction')
  }
  return (
    <View style={{width: '100%',height: '100vh'}}>
      <WebView src={url} onLoad={loadAction} onMessage={messageHandleAction}></WebView>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))