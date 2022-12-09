


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Image, Input} from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { Popup } from '@taroify/core'
import { Close } from '@taroify/icons'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import CompanyHomeIcon from '@/static/img/company-home-icon.png'
import './index.scss'


interface Props {
  user?: UserStore
  open?: boolean
  onClose?: () => void
  title?: string
  titleRender?: any
}

interface InfoData {
  name: string
  mobile: string
}

const Index: React.FC<Props> = ({ user, open: openFlag, onClose, title, titleRender }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: '',
    mobile: ''
  })
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(!!openFlag)
  }, [openFlag])

  function closeAction(val: boolean){
    setOpen(val) 
    onClose?.()
  }

  return (
    <View className=' join-comp'>
      <Popup open={open} onClose={closeAction} style={{ background: 'transparent', overflow: 'inherit' }}>
        <View className='content-box w-[580px] bg-white rounded-[20px]'>
          <View className='header-box bg-[#F9F8F8] h-[230px] relative'>
            <View className=' text-[36px] font-bold pt-[78px] pl-[54px]'>
              {
                titleRender ? titleRender() : (title || '活动报名')
              }
            </View>
            <Image src={CompanyHomeIcon} className=' w-[88px] h-[88px] absolute top-[38px] right-[50px]'></Image>
          </View>
          <View className=' form py-[45px] px-[50px]'>
            <View className=' f-item'>
              <View className='name'>姓名：</View>
              <Input className='input' value={infoData.current.name} onInput={(e) => setInfoData(s => ({ ...s, name: e.detail.value }))}></Input>
            </View>
            <View className=' f-item'>
              <View className='name'>电话：</View>
              <Input className='input' value={infoData.current.mobile} onInput={(e) => setInfoData(s => ({ ...s, mobile: e.detail.value }))}></Input>
            </View>
            <View className=' w-[480px] py-[20px] 
      text-center bg-[#917320] rounded-[43px] text-white mt-[58px]'
            >报名</View>
          </View>
          {/*  */}
          <Close className=' close' onClick={() => closeAction(false)} />
        </View>
      </Popup>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))