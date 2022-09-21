/*
 * @Author: lsmi
 * @Date: 2022-05-23 21:21:46
 * @LastEditors: lsmi
 * @LastEditTime: 2022-05-31 22:55:19
 * @FilePath: \taro-tsx-temp\src\subPackage\pages\canvas\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Image, Canvas } from '@tarojs/components'
import React, { useCallback, useEffect, useRef, useState , CSSProperties } from 'react'
import Taro, { useReady } from '@tarojs/taro'
import { UserStore } from '@/types/store'
import { Button } from '@taroify/core'
import useStateRef from 'react-usestateref'
import { Painter } from "./index";
import { getRandomId } from './utils/index'


interface Props {
  data: any
  debug?: boolean
  className?: string
  onProgress?: (v: any) => void
  onPath?: (v: string) => void
}

let canvas: any = null
const Index: React.FC<Props> = ({ debug, data, className, onProgress, onPath }) => {
  const [, setCanvasId, canvasId] = useStateRef(getRandomId())
  const [basicCanvas, setNewBasicCanvas] = useStateRef({
    height: 0,
    width: 0
  })

  useEffect(() => {
    Taro.nextTick(() => {
      initPosterAction()
    })
  }, [data])

  useReady(() => {
    Taro.nextTick(() => {
      initPosterAction()
    })
  })

  function initPosterAction() {
    Taro.showLoading()
    initCanvas().then(async res => {
      const painter = new Painter({
        context: res.ctx,
        canvas: res.canvas,
        width: res.canvas?.width,
        height: res.canvas?.height,
        pixelRatio: 2,
        listen: {
          onProgress(v) {
            onProgress && onProgress(v)
          },
          onEffectSuccess(v) {
            // console.log("onEffectSuccess", v);
          },
          onEffectFail(v) {
            console.log("onEffectFail", v);
          },
        },
      });
      await painter.source(data);
      painter
        .render()
        .then((re: any) => {
          setNewBasicCanvas(t => ({ width: re.root.width, height: re.root.height }))
          Taro.hideLoading()
          setTimeout(() => {
            // 导出图片
            Taro.canvasToTempFilePath(
              {
                canvas,
                success: (result) => {
                  onPath && onPath(result.tempFilePath)
                }
              }
            )
          }, 100)
        })
        .catch((err) => {
          console.log('err', err)
        });
    })
  }
  function initCanvas() {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        const pageInstance = Taro.getCurrentInstance()?.page || {} // 拿到当前页面实例
        const query = Taro.createSelectorQuery().in(pageInstance) // 确定在当前页面内匹配子元素
        query
          .select(`#${canvasId.current}`)
          .fields({ node: true, size: true, context: true }, (res) => {
            const canvasTemp = res.node
            canvas = canvasTemp
            let ctx = canvasTemp.getContext("2d")
            resolve({ ctx, canvas: canvasTemp })
          })
          .exec()
      }, 100)
    })
  }
  return (
    <Canvas
      id={canvasId.current}
      className={className}
      canvasId={canvasId.current}
      type='2d'
      style={`width: ${basicCanvas.width}px; height: ${basicCanvas.height}px; ${!debug&&'position: fixed; top: 99999px'}`}
    ></Canvas>
  )
}

Index.defaultProps = {
  data: {},
  debug: false
}
// export default React.memo(inject('user')(observer(Index)))
export default React.memo(Index)