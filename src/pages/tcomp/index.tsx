


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
import commonStore from '@/store/modules/common'
import MyDialog from '@/components/test-dialog/index'
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
    // setTimeout(() => {
    //   MyDialog.show({
    //     show: true,
    //     onClose: () => {
    //       console.log('close')
    //     }
    //   })
    // }, 0)
    testApiAction()
  },[])
  function userInfoAction(){
    Taro.getUserProfile({
      desc: 'mmmm',
      success: (res) => {
        console.log(res, 'res')
      }
    })
  }
  function getPhoneNumber(e){
    console.log(e, 'e')
  }
  function openAuthAction(){
    MyDialog.show({
      show: true
    })
  }
  function testApiAction(){
    Taro.request({
      url: 'http://www.kitco.cn/KitcoDynamicSite/RequestHandler?requestName=getFileContent&AttributeId=PreciousLiveQuote',
      method: 'GET',
    }).then(res => {
      const data: string = res.data
      // console.log(data, 'data')
      const a = data.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)
      console.log(a, 'a')
      // const a = data.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/ig, (v, v2) => {
      //   console.log(v)
      // })
      // 铂
      const bo = a[4].match(/<td[^>]*>([\s\S]*?)<\/td>/ig)
      console.log(bo[4], '铂')
      bo[4].replace(/(?<=(<td[^>]*?>)).*?(?=(<\/td>))/ig, (v) => {
        console.log(v, 'vvv')
      })
    })
  }
  return (
    <View>
      <Button onClick={() => {
          commonStore.setCategoryInfo({ ids: commonStore.categoryInfo.ids+1 })
        }}
      >add</Button>
      <MyDialog></MyDialog>
      <Button onClick={userInfoAction}>user info</Button>
      <Button openType='getPhoneNumber' onGetPhoneNumber={getPhoneNumber}>user phone</Button>
      <Button onClick={openAuthAction}>打开</Button>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))