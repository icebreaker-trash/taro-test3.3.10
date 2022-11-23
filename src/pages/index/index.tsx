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
      <View className='index '>
        {/* 样式不生效 要在tailwind.config.js 中保存一下才生效 */}
        <Text className=' text-red-500'>Hello world!</Text>
      </View>
    )
  }
}
