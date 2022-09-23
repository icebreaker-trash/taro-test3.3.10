


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, RichText, Button } from '@tarojs/components'
import { Image, DatetimePicker, Popup } from '@antmjs/vantui'
import { DatetimePicker as DatetimePickerRo, Popup as PopupRo } from '@taroify/core'
import { DatetimePickerProps } from '@antmjs/vantui/types/datetime-picker'
import React, { useCallback, useEffect, useState } from 'react'
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
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    articleInfo: {},
    minDate: new Date(2018, 0, 1).getTime(),
    maxDate: new Date(2022, 0, 1).getTime(),
    currentDate: null,
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
    console.log('useReachBottom')
  })
  // 下拉刷新
  usePullDownRefresh(() => {
    watch(async () => {
      await initAction();
      Taro.stopPullDownRefresh();
    });
  })
  useDidShow(() => {
    console.log('show')
  })
  useEffect(() => {
    // 获取不到dom
    console.log('one effect')
    initAction()
  }, [])
  useReady(() => {
    // dom挂载完毕
    getHomeDomAction()
    console.log('mounted')
  })

  function initAction() {
    watch(() => {
      getNewsDetailAction()
    })
    setTimeout(() => {
      setInfoData(state => ({ ...state, name: 'msg' }))
      setInfoData(state => ({ ...state, name: 'msg23' }))
      console.log(infoData.current, 'curt')
      Taro.nextTick(() => {
        getHomeDomAction()
      })
    }, 2000)
  }

  function getNewsDetailAction() {
    // console.log(Taro.ENV_TYPE.WEAPP, 'jd')
    // console.log(Taro.getEnv(), 'getEnv')
    // 29
    $api.getNewsDetail({ news_id: 17 }).then(res => {
      if (!res) {
        return
      }
      setInfoData(state => ({ ...state, articleInfo: res }))
    })
  }

  function getHomeDomAction() {
    const query = Taro.createSelectorQuery()
    query.select('#Home').boundingClientRect((res) => {
      console.log(res, 'res')
    }).exec()
  }

  const onInput = (e) => {
    console.log(e, 'eee')
  }

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
      <View className=' w-32 bg-green-200'>
        <View className=' m-2'>000</View>
      </View>
      <Button onClick={openPopupAction}>show</Button>
      <View className='px-[32px] content text-[28px] text-justify'>
        {/* <ParseComp content={infoData.current.articleInfo.content} tagStyle={{ img: '', p: 'margin: 10px 0' }}></ParseComp> */}
        <Popup position='bottom' show={flagData.current.popupFlag} onClose={closeAction}>
          <DatetimePicker
            type='datetime'
            value={infoData.current.currentDate}
            minDate={infoData.current.minDate}
            maxDate={infoData.current.maxDate}
            onInput={onInput}
          />
        </Popup>
        {/* <PopupRo open={flagData.current.popupFlag} placement='bottom'>
          <DatetimePickerRo
            type='date'
            min={minDate}
            max={maxDate}
            defaultValue={defaultValue}
            value={value}
            onChange={onInput}
          >
            <DatetimePickerRo.Toolbar>
              <DatetimePickerRo.Button>取消</DatetimePickerRo.Button>
              <DatetimePickerRo.Title>选择年月日</DatetimePickerRo.Title>
              <DatetimePickerRo.Button>确认</DatetimePickerRo.Button>
            </DatetimePickerRo.Toolbar>
          </DatetimePickerRo>
        </PopupRo> */}
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))