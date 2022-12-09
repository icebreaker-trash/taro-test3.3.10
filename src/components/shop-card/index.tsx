


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Image, Text } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import './index.scss'

interface Props {
  user?: UserStore
  onClick?: () => void
  data: { name: string, img: string, price: string, delPrice: string; score: number | string}
  type?: 'common' | 'score'
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user, onClick, data, type = 'common' }) => {
  const router = useRouter()
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: ''
  })

  return (
    <View
      className='shop-card-comp item w-[326px] bg-white rounded-[43px] overflow-hidden mb-[36px]'
      onClick={onClick}
    >
      <Image className='img w-full h-[326px] block' src={data.img} mode='aspectFill' />
      <View className='info px-[22px] pt-[18px] pb-[36px]'>
        <View className='name text-[25px]'>{data.name}</View>
        {
          type === 'common' ? <View className=' mt-[22px]'>
            <Text className=' text-[36px] text-[#F03C21] font-bold'>
              <Text className=' text-[25px] mr-[4px] font-medium'>￥</Text>
              {data.price}
            </Text>
            <Text className=' ml-[14px] text-[#999999] text-[25px]' style='text-decoration:line-through'>
              ￥{data.delPrice}
            </Text>
          </View> : 
          <View className=' mt-[22px] text-[#F03C21]'>
            <Text className=' text-[36px] font-bold'>{data.score}</Text>
            <Text className=' text-[25px]'> 积分</Text>
          </View>
        }
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))