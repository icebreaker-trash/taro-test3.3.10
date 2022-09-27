


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, RichText } from '@tarojs/components'
import { Image, DatetimePicker, Popup, Icon, NavBar } from '@antmjs/vantui'
import { DatetimePickerProps } from '@antmjs/vantui/types/datetime-picker'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@taroify/core'
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
  minDate: DatetimePickerProps['minDate'];
  maxDate: DatetimePickerProps['maxDate'];
  currentDate: any
  page: number
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setResData, resData] = useStateRef<{ list: any[] }>({
    list: []
  })
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    articleInfo: {},
    minDate: new Date(2018, 0, 1).getTime(),
    maxDate: new Date(2022, 0, 1).getTime(),
    currentDate: null,
    page: 1
  })
  const [, setFlagData, flagData] = useStateRef({
    popupFlag: false
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
    // setInfoData(t => ({ ...t, page: t.page + 1 }))
    // getNewsList('concat')
  })
  // 下拉刷新
  usePullDownRefresh(() => {
    watch(async () => {
      await initAction();
      Taro.stopPullDownRefresh();
    });
  })
  useDidShow(() => {

  })
  useEffect(() => {
    // 获取不到dom
    initAction()
  }, [])
  useReady(() => {
    // dom挂载完毕
    getHomeDomAction()
  })

  function initAction() {
    watch(() => {
      getNewsDetailAction()
    })
    setTimeout(() => {
      setInfoData(state => ({ ...state, name: 'msg' }))
      setInfoData(state => ({ ...state, name: 'msg23' }))
      Taro.nextTick(() => {
        getHomeDomAction()
      })
    }, 2000)
  }

  function getNewsDetailAction() {
    // console.log(Taro.ENV_TYPE.WEAPP, 'jd')
    // console.log(Taro.getEnv(), 'getEnv')
    // 29  17
    $api.getNewsDetail({ news_id: 21 }).then(res => {
      if (!res) {
        return
      }
      setInfoData(state => ({ ...state, articleInfo: res }))
    })
  }

  function getHomeDomAction() {
    const query = Taro.createSelectorQuery()
  }

  const confirmAction = useCallback((e) => {
    console.log(e, 'ee')
  }, [])

  const closeAction = useCallback(() => {
    setFlagData({ popupFlag: false })
  }, [])

  const openPopupAction = useCallback(() => {
    setFlagData({ popupFlag: true })
  }, [])
  const [minDate] = useState(new Date(2021, 9, 14))
  const [maxDate] = useState(new Date(2023, 11, 12))
  const [defaultValue] = useState(new Date(2021, 9, 14))
  const [value, setValue] = useState(new Date(2022, 10, 14))
  return (
    <View id='Home' className=' '>
      <NavBar
        title='标题'
        fixed
        placeholder
        leftText=''
        leftArrow
        safeAreaInsetTop={false}
        style="background: '#abcdef'"
      />
      <View className=' w-32 bg-green-200'>
        <View className=' m-2'>000</View>
      </View>
      <Button onClick={openPopupAction}>show</Button>
      <Button color='info'>信息按钮</Button>
      <Button color='success'>成功按钮</Button>
      <Button color='warning'>警告按钮</Button>
      <Button color='danger'>危险按钮</Button>
      <Button color='default'>默认按钮</Button>
      <View className='px-[32px] content text-[28px] text-justify'>
        {/* <ParseComp content={infoData.current.articleInfo.content} tagStyle={{ img: 'width: 100%', p: 'margin: 10px 0' }}></ParseComp> */}
        <Popup style={{ background: 'red' }} position='bottom' show={flagData.current.popupFlag} onClose={closeAction}>
          <DatetimePicker
            type='datetime'
            value={infoData.current.currentDate}
            minDate={infoData.current.minDate}
            maxDate={infoData.current.maxDate}
            onConfirm={confirmAction}
          />
        </Popup>
        {
          resData.current.list.map((item, index) => (
            <View key={item.id} className=' text-black p-4 mb-2 bg-purple-100'>{item.title}</View>
          ))
        }
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))