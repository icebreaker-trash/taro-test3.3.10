import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index bg-red-200'>
        {/* 样式不生效 要在tailwind.config.js 中保存一下才生效 */}
        <Text className=' text-[#124785] bg-[yellow] text-[128rpx]'>Hello world!</Text>
      </View>
    )
  }
}
