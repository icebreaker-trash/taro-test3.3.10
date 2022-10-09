


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View } from '@tarojs/components'
import React, { useCallback, useEffect , useState } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { Button, Dialog } from '@taroify/core'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch , checkObj } from '@/utils/index'
import { useGetNextList } from '@/hooks'
import Input from '@/components/input'
import $api from '@/api/index';
import classNames from 'classnames';
import TestDialog from '@/components/test-dialog'
import './index.scss'




interface Props {
  user: UserStore
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user }) => {
  const { reLoadAction, nextAction, page, renderAction: RenderAction } = useGetNextList()
  const [inputVal, setInputVal] = useState('')

  useReachBottom(() => {
    nextAction(getNewsListAction)
  })

  useEffect(() => {
    watch(() => {
      reLoadAction(getNewsListAction)
    })
  }, [])

  async function getNewsListAction() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return $api.getNewsList({ page: page.current }).then(res => {
          if (!res) {
            return
          }
          resolve(res)
          return res
        })
      }, 1000)
    })
    return $api.getNewsList({ page: page.current }).then(res => {
      if (!res) {
        return
      }
      return res
    })
  }

  function checkAction() {
    const obj = { name: 'x', sex: 1, ary: [1] }
    const flag = checkObj(obj, { name: '请输入姓名', sex: '请输入性别', ary: '请选择' })
    if (!flag) {
      return
    }
    console.log('pass')
  }

  async function changeImageAction(){
    const res = await Taro.chooseImage({count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera']})
    console.log(res, 'res')
  }
  const class_fix = 'home_page'
  return (
    <View className={classNames(class_fix)}>
      <Button onClick={checkAction}>检查</Button>
      <Button block onClick={changeImageAction}>选择图片</Button>
      {inputVal}
      <View className=' p-4'>
        <Input value={inputVal} placeholderStyle='color: #fff' className=' bg-blue-200' style={{ color: '#fff' }} closeStyle={{ color: '#fff', padding: 4 }} onInput={(e) => setInputVal(e.detail.value)} onClear={() => setInputVal('')} />
      </View>

      <View className='list px-2'>
        <RenderAction>
          {
            (item, index) => <View key={item.id} className=' text-black p-8 mb-2 bg-purple-100'>{item.title}</View>
          }
        </RenderAction>
        {/* {renderAction((item, index) => <View key={item.id} className=' text-black p-8 mb-2 bg-purple-100'>{item.title}</View>)} */}
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))