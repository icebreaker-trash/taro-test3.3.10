/*
 * @Author: lsmi
 * @Date: 2022-05-23 21:21:46
 * @LastEditors: lsmi
 * @LastEditTime: 2022-05-31 22:55:19
 * @FilePath: \taro-tsx-temp\src\subPackage\pages\canvas\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Image, Canvas } from '@tarojs/components'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Taro, { useReady } from '@tarojs/taro'
import { UserStore } from '@/types/store'
import { Button } from '@taroify/core'
import useStateRef from 'react-usestateref'
import CanvasPoster from '@/components/poster/canvas-poster'
import { Painter } from "@/components/lime-painter/index";
// import TestCanvas from '@/components/test-canvas/index'
import LCanvas from '@/components/lime-painter/canvas'
import { drawPoster } from './painter'

import './index.scss'



interface Props {
  user: UserStore
}

interface InfoData {
  painting: any | {}
}

let canvas: any = null
const Index: React.FC<Props> = ({ user }) => {
  const [infoData, setInfoData] = useState<InfoData>({
    painting: {}
  })
  const [url, setUrl] = useState('')
  const [,setLCData, LCData] = useStateRef({})
  useEffect(() => {
    drawPoster('pro').then(res => {
      setInfoData(t => {
        t.painting = res
        return { ...t }
      })
    })
    setTimeout(() => {
      setLCData({
        type: 'view',
        css: {
          // 根节点若无尺寸，自动获取父级节点
          width: "750rpx",
          // height: "2200rpx",
          // padding: "20rpx",
          background: '#CA844D'
        },
        views: [
          {
            css: {
              background: "#07c160",
              height: "120rpx",
              width: "120rpx",
              display: "block",
            },
            type: "view",
          },
          {
            css: {
              background: "#1989fa",
              height: "120rpx",
              width: "120rpx",
              borderTopRightRadius: "60rpx",
              borderBottomLeftRadius: "60rpx",
              display: "inline-block",
              // margin: "0 30rpx",
            },
            views: [],
            type: "view",
          },
          {
            css: {
              background: "#ff9d00",
              height: "120rpx",
              width: "120rpx",
              borderRadius: "50%",
              display: "inline-block",
            },
            views: [],
            type: "view",
          },
          {
            type: "text",
            text: "登鹳雀楼\n白日依山尽，黄河入海流\n欲穷千里目，更上一层楼\n登鹳雀楼\n白日依山尽，黄河入海流\n欲穷千里目，更上一层楼",
            css: {
              // 设置居中对齐
              textAlign: "center",
              // 设置中划线
              textDecoration: "line-through",
              lineClamp: 3,
            },
          },
          {
            type: "image",
            src: "https://m.360buyimg.com/babel/jfs/t1/196317/32/13733/288158/60f4ea39E6fb378ed/d69205b1a8ed3c97.jpg",
            css: {
              display: "block",
              width: "200rpx",
              height: "200rpx",
              objectFit: "cover",
              objectPosition: "50% 50%",
            },
          },
          {
            type: "image",
            src: "data:image/png;base64,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",
            css: {
              display: "block",
              width: "218rpx",
              height: "24rpx",
              margin: "20rpx 0 0 0",
            },
          },
          {
            type: "text",
            text: `没有经济上的独立，就缺少自尊。没有思考上的独立，就缺少自主。没有人格上的独立，就缺少自信
    有时候不是别人冷漠，只是别人有他自己的事
    那些特别懂得自娱的人，其实都是孤独却又不愿轻易打破孤独的孩子。所以他们学会了独自一个人的快乐方式，而那种快乐，恰是最不容易失去的
    不要在青葱岁月里一味地装蒜
    我说不出来为什么爱你，但我知道，你就是我不爱别人的理由
    一个人怎么能够在大千世界中、人海茫茫中，多迈出一步呢？就是因为你凡事多想一步
    幸福是一件礼物，得到它的秘诀是不怀期待，只在它来时尽情享受
    傻瓜的心在嘴里，聪明人的嘴在心里雨并没有越下越大，而是我们把自己围得`,
            css: {
              fontSize: '30rpx',
              width: '300rpx',
              background: "#5B89BA",
              padding: "20rpx 30rpx",
              // 设置居中对齐
              textAlign: "center",
              // 设置中划线
              textDecoration: "line-through",
              // lineClamp: 3,
              display: "inline-block",
            },
          },
          {
            type: "qrcode",
            text: "https://ext.dcloud.net.cn/plugin?id=2389",
            css: {
              display: "inline-block",
              width: "200rpx",
              height: "200rpx",
              // margin: "80rpx 0 0 0",
              padding: '80rpx 0 0 0'
            },
          },
        ],
      })
    }, 1000)
  }, [])

  useReady(() => {
    Taro.nextTick(() => {
      initPosterAction()
    })
  })

  const getFactor = () => {
    const sysInfo = Taro.getSystemInfoSync();
    const { screenWidth } = sysInfo;
    return screenWidth / 750;
  };
  function initPosterAction() {
  }
  function posterRenderAction() {

  }

  function success(url) {
    console.log(url, 'url')
    setUrl(url)
  }

  function fail(err) {
    console.log(err, 'err')
  }

  function testSuccessAction(url) {
    setUrl(url)
  }
  function onImgOK(url: any) {
    console.log(url, 'url')
  }
  return (
    <View>
      {/* <CanvasPoster
        className='poster'
        widthPixels={1000}
        painting={infoData.painting}
        onSuccess={success}
        onFail={fail}
      ></CanvasPoster> */}
      <LCanvas data={LCData.current} onPath={setUrl}></LCanvas>
      <Image src={url} className='img' mode='widthFix' showMenuByLongpress></Image>
    </View>
  )
}

// export default React.memo(inject('user')(observer(Index)))
export default Index