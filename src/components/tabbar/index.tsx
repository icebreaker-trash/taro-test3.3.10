import React, { useCallback, useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useDidShow, useReady } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { observer, inject } from 'mobx-react'

import home from '@/static/tabbar/home.png'
import home_active from '@/static/tabbar/home-active.png'
import shop from '@/static/tabbar/shop.png'
import shop_active from '@/static/tabbar/shop-active.png'
import serve from '@/static/tabbar/serve.png'
import serve_active from '@/static/tabbar/serve-active.png'
import my from '@/static/tabbar/my.png'
import my_active from '@/static/tabbar/my-active.png'
import { BaseStore } from '@/types/store'
import './index.scss'

interface Props {
  base?: BaseStore
}
const Tabbar: React.FC<Props> = ({ base }) => {
  const tabbar = [
    {
      text: '首页',
      iconPath: home,
      selectedIconPath: home_active,
      pagePath: '/pages/index/index'
    },
    {
      text: '商城',
      iconPath: shop,
      selectedIconPath: shop_active,
      pagePath: '/pages/shop/index'
    },
    {
      text: '服务项目',
      iconPath: serve,
      selectedIconPath: serve_active,
      pagePath: '/pages/serve/index'
    },
    {
      text: '我的',
      iconPath: my,
      selectedIconPath: my_active,
      pagePath: '/pages/my/index'
    }
  ]

  const [tabIndex, settabIndex] = useState(0)
  const tabbarAction = (value, index) => {
    // Taro.vibrateShort()
    Taro.switchTab({
      url: value.pagePath
    })
  }
  useEffect(() => {
    getCurrentInstance().router?.path == '/pages/index/index' && settabIndex(0)
    getCurrentInstance().router?.path == '/pages/shop/index' && settabIndex(1)
    getCurrentInstance().router?.path == '/pages/serve/index' && settabIndex(2)
    getCurrentInstance().router?.path == '/pages/my/index' && settabIndex(3)
  }, [getCurrentInstance().router])
  return (
    <View className='tabbar'>
      {tabbar.map((item, index) => (
        <View
          onClick={() => tabbarAction(item, index)}
          className={`item ${tabIndex == index && 'active'}`}
          key={index}
        >
          <View className='img-box'>
            <Image
              className='img'
              src={tabIndex == index ? item.selectedIconPath : item.iconPath}
            ></Image>
          </View>
          <View className='text'>{item.text}</View>
        </View>
      ))}
    </View>
  )
}
export default React.memo(inject('base')(Tabbar))
