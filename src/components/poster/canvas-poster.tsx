/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-05-28 22:07:51
 * @FilePath: \taro-tsx-temp\src\components\poster\canvas-poster.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Canvas } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import classNames from 'classnames'
import Painter from './painter'
import { equal, getRandomId, toPx as utilToPx } from './util'
import './index.scss'


interface Props {
  user?: UserStore
  painting?: {}
  dirty?: boolean
  widthPixels?: number
  debug?: boolean
  onSuccess?: (url: string) => void
  onFail?: (p: any) => any
  className?: string
}

interface InfoData {
  paintCount: number
  painterStyle: string,
  canvasWidthInPx: number,
  canvasHeightInPx: number,
  width: number,
  height: number,
  canvas: any | null,
  ctx: any | null
}

function setStringPrototype(scale) {
  /* eslint-disable no-extend-native */
  /**
   * 是否支持负数
   * @param {Boolean} minus 是否支持负数
   */
  String.prototype.toPx = function toPx(minus, baseSize) {
    if (this === '0') {
      return 0
    }
    let reg
    if (minus) {
      reg = /^-?[0-9]+([.]{1}[0-9]+){0,1}(px|%|rpx)$/g
    } else {
      reg = /^[0-9]+([.]{1}[0-9]+){0,1}(px|%|rpx)$/g
    }
    const results = reg.exec(this)
    const unit = results[2]
    const value = parseFloat(this)
    let res = 0
    if (unit === 'px') {
      res = Math.round(value * (scale || 1))
    } else if (unit === '%') {
      res = Math.round((value * baseSize) / 100)
    } else if (unit === 'rpx') {
      res = Math.round(utilToPx(value * (scale || 1)))
    }
    return res
  }
}

const Index: React.FC<Props> = ({ user, painting = {}, dirty = false, widthPixels = 750, debug = false, onSuccess, onFail, className }) => {
  const canvasId = getRandomId()
  const [infoData, setInfoData] = useState<InfoData>({
    paintCount: 0,
    painterStyle: '',
    canvasWidthInPx: 375,
    canvasHeightInPx: 375,
    width: 100,
    height: 100,
    canvas: null,
    ctx: null
  })

  useEffect(() => {
    setInfoData(t => {
      t.paintCount = 0
      return t
    })
    console.log('painting')
    startPaint()
  }, [painting])

  /**
     * 判断一个 object 是否为 空
     * @param {object} object
     */
  function isEmpty(object) {
    for (const i in object) {
      return false
    }
    return true
  }
  function isNeedRefresh(newVal, oldVal) {
    if (!newVal || isEmpty(newVal) || (dirty && equal(newVal, oldVal))) {
      return false
    }
    return true
  }
  function initCanvas() {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const pageInstance = Taro.getCurrentInstance()?.page || {} // 拿到当前页面实例
        const query = Taro.createSelectorQuery().in(pageInstance) // 确定在当前页面内匹配子元素
        query
          .select(`#${canvasId}`)
          .fields({ node: true, size: true, context: true }, (res) => {
            const canvas = res.node
            let ctx = canvas.getContext("2d")
            resolve({ ctx, canvas })
          })
          .exec()
      }, 300)
    })
  }
  // 开始绘画
  function startPaint() {
    if (isEmpty(painting)) {
      return
    }
    setStringPrototype(1)
    initCanvas().then(({ ctx, canvas }) => {
      // 下载图片
      downloadImages(canvas)
        .then((res: any) => {
          const { width, height } = res
          if (!width || !height) {
            console.error(`You should set width and height correctly for painter, width: ${width}, height: ${height}`)
            return
          }
          // infoData.canvasWidthInPx = utilToPx(width)
          // infoData.canvasHeightInPx = utilToPx(height)
          infoData.canvasWidthInPx = (width).toPx()
          if (widthPixels) {
            // 重设宽度，高度
            setStringPrototype(widthPixels / infoData.canvasWidthInPx)
          }
          infoData.canvasHeightInPx = (height).toPx()
          setInfoData(t => {
            // t.canvasWidthInPx = utilToPx(width)
            // t.canvasHeightInPx = utilToPx(height)
            t.canvasWidthInPx = (width).toPx()
            t.canvasHeightInPx = (height).toPx()
            return t
          })
          canvas.width = infoData.canvasWidthInPx
          canvas.height = infoData.canvasHeightInPx
          const pen = new Painter(ctx, res)   
          pen.paint(() => {
            Taro.canvasToTempFilePath(
              {
                canvas,
                success: (result) => {
                  onSuccess && onSuccess(result.tempFilePath)
                },
                fail: (error) => {
                  onFail && onFail(error)
                },
              }
            )
          })
        })
        .catch(err => {
          onFail && onFail(err)
        })
    })
  }
  // 下载所有图片
  function downloadImages(canvas) {
    return new Promise((resolve) => {
      let preCount = 0
      let completeCount = 0
      const paintCopy = JSON.parse(JSON.stringify(painting))
      if (paintCopy.background) {
        preCount++
        loadImage(paintCopy.background, canvas).then(
          image => {
            paintCopy.background = image
            completeCount++
            preCount === completeCount && resolve(paintCopy)
          },
          err => {
            completeCount++
            preCount === completeCount && resolve(paintCopy)
            console.log(err)
          }
        )
      }
      if (paintCopy.views) {
        for (const view of paintCopy.views) {
          if (view && view.type === 'image' && view.url) {
            preCount++
            /* eslint-disable no-loop-func */
            loadImage(view.url, canvas).then(
              (image: any) => {
                completeCount++
                view.url = image
                // 获得一下图片信息，供后续裁减使用
                view.sWidth = image.width
                view.sHeight = image.height
                preCount === completeCount && resolve(paintCopy)
              },
              err => {
                completeCount++
                preCount === completeCount && resolve(paintCopy)
                console.log(err)
              }
            )
          }
        }
      }
      preCount === 0 && resolve(paintCopy)
      // if (preCount !== completeCount) {
      //   reject('paintCopy');
      // }
    })
  }
  // 下载图片
  function loadImage(src, canvas) {
    return new Promise((resolve, reject) => {
      if (src.startsWith('#')) {
        resolve(src)
        return
      }
      // const img = new Image()
      const img = canvas.createImage(); // 创建图片对象
      img.onload = () => resolve(img)
      img.crossOrigin = 'anonymous'
      img.src = src;
      if (img.complete === true) {
        // Inline XML images may fail to parse, throwing an Error later on
        setTimeout(() => resolve(img), 500)
      }
    })
  }

  return (
    <Canvas
      type='2d'
      canvas-id={canvasId}
      id={canvasId}
      className={classNames(className, 'canvas-comp')}
      // style={`height: ${infoData.canvasHeightInPx}px; width:${infoData.canvasWidthInPx}px;`}
      style={`
        height: ${infoData.canvasHeightInPx}px; width:${infoData.canvasWidthInPx}px;position: absolute;
        ${debug ? '' : 'transform:translate3d(-9999rpx, 0, 0)'}`}
    />
  )
}

export default React.memo(inject('user')(observer(Index)))