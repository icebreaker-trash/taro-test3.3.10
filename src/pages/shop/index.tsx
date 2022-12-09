


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Image, Text, Input } from '@tarojs/components'
import React, { useCallback, useEffect, useState } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import Nav from '@/components/nav-bar/index'
import { Search } from '@taroify/icons'
import { Swiper } from '@taroify/core'
import Tabbar from '@/components/tabbar'
import HomeTopImg from '@/static/img/home-top.png'
import banner01 from '@/static/img/banner01.png'
import classNames from 'classnames'
import BannerShaderImg from '@/static/img/banner-shader.png'
import VirtualList from '@tarojs/components/virtual-list'
import ShopCard from '@/components/shop-card'
import './index.scss'

interface Props {
  user: UserStore
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const [, setSearchVal, searchVal] = useStateRef('')
  const [, setResData, resData] = useStateRef({
    shopTotal: 50,
    shopList: [
      {
        img: 'https://img.zcool.cn/community/012078636df8f3000e4b1000caad81.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口红套装',
        price: '1850.00',
        delPrice: '2100'
      },
      {
        img: 'https://img.zcool.cn/community/012078636df8f3000e4b1000caad81.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口红套装',
        price: '1850.00',
        delPrice: '2100'
      },
      {
        img: 'https://img.zcool.cn/community/012078636df8f3000e4b1000caad81.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口红套装',
        price: '1850.00',
        delPrice: '2100'
      },
      {
        img: 'https://img.zcool.cn/community/012078636df8f3000e4b1000caad81.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
        name: '口红套装',
        price: '1850.00',
        delPrice: '2100'
      }
    ]
  })
  const [, setInfoData, infoData] = useStateRef<InfoData>({
    name: ''
  })
  const [, setFlagData, flagData] = useStateRef({
    loading: false
  })
  const [swiperIndex, setSwiperIndex] = useState(0)
  const categoryList = [
    {
      name: '面霜',
      img: require('@/static/img/shop-page-c1.png')
    },
    {
      name: '精华',
      img: require('@/static/img/shop-page-c2.png')
    },
    {
      name: '美妆',
      img: require('@/static/img/shop-page-c3.png')
    },
    {
      name: '口红',
      img: require('@/static/img/shop-page-c4.png')
    },
    {
      name: '眼影',
      img: require('@/static/img/shop-page-c5.png')
    },
  ]
  const banner = [
    banner01,
    'https://img.zcool.cn/community/01dea66381cd2d000ddb1000bccc3d.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
    'https://img.zcool.cn/community/031g0uvuiqnmlpj896ru7me3631.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
    'https://img.zcool.cn/community/031e7cnc3mjl1btgxqbypyh3232.png?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100'
  ]
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
      Taro.stopPullDownRefresh();
    });
  })
  const Row = React.memo(({ id, index, style, data }) => {
    return (
      <View id={id} className=' item ' style={style}>
        {/* Row {index} : {data[index]} */}
      </View>
    );
  })

  const listReachBottom = useCallback(() => {

  }, [])

  const toDetailAction = useCallback((item) => {
    Taro.navigateTo({ url: `/subPackage/pages/common/shop-detail/index?id=${item.id || 1}` })
  }, [])

  function toCateShopAction(item) {
    Taro.navigateTo({ url: `/subPackage/pages/common/category-shop/index?id=${item.id || 1}&title=${item.name}` })
  }

  function toSearchPage(){
    Taro.navigateTo({ url: '/subPackage/pages/search/index' })
  }

  return (
    <View className='shop-page page-view-content bg-[#F4F3F2] pb-[200px]'>
      <Nav
        title='商城'
        noBack
        className=' bg-transparent'
        style={{ background: 'transparent' }}
        bgNode={() => <Image src={HomeTopImg} className=' absolute top-0 left-0 w-full' mode='widthFix' />}
      ></Nav>
      <View className='main-content pt-[160px] relative px-[22px]'>
        <Image src={HomeTopImg} className='home-top absolute top-0 left-0 w-full' mode='widthFix' />
        {/* 搜索 */}
        <View
          className=' search-box flex
           items-center justify-between 
           rounded-[38px] bg-white 
           py-[16px] px-[30px] relative mb-[36px]'
          onClick={toSearchPage}
        >
          <Search size={20} color='#BEBEBE' />
          <Input
            value={searchVal.current}
            className=' text-[30px] flex-1 ml-[22px]'
            placeholder='请输入商品名称'
            disabled
            placeholderStyle='color:#828282'
            onInput={(e) => setSearchVal(e.detail.value)}
          ></Input>
        </View>
        {/* swiper */}
        <View className='swiper-out-box'>
          <Swiper autoplay={4000} className='swiper rounded-[54px] h-[380px] relative' onChange={setSwiperIndex}>
            {
              banner.map((item, index) => (
                <Swiper.Item key={index} className=' w-full h-full relative'>
                  <Image className='img w-full h-full' mode='aspectFill' src={item} />
                </Swiper.Item>
              ))
            }
            <Swiper.Indicator className='custom-indicator absolute bottom-[16px] flex items-center'>
              {
                banner.map((item, index) => (
                  <View
                    className={classNames(
                      'i-item w-[10px] h-[10px] rounded-full bg-[#656362] opacity-50 mr-[10px]',
                      { 'active': index === swiperIndex }
                    )}
                    key={index}
                  ></View>
                ))
              }
            </Swiper.Indicator>
          </Swiper>
          <Image src={BannerShaderImg} className=' w-full mt-[-40px]' mode='widthFix' />
        </View>
        {/* 分类 */}
        <View className=' category flex items-center justify-between'>
          {
            categoryList.map((item, index) =>
              <View className='item ' key={index} onClick={() => toCateShopAction(item)}>
                <Image src={item.img} className=' img w-[98px] h-[98px] mb-[18px]'></Image>
                <View className=' text-center text-[25px]'>{item.name}</View>
              </View>)
          }
        </View>
        {/* 推荐 */}
        <View className=' hot-goods mt-[50px]'>
          <View className='title text-[30px] font-bold pl-[8px] mb-[26px]'>热门推荐</View>
          {
            true || <VirtualList
              height={500} /* 列表的高度 */
              width='100%' /* 列表的宽度 */
              itemData={resData.current.shopList} /* 渲染列表的数据 */
              itemCount={resData.current.shopTotal} /*  渲染列表的长度 */
              itemSize={100} /* 列表单项的高度  */
              onScroll={({ scrollDirection, scrollOffset }) => {
                const itemSize = 100
                if (
                  // 避免重复加载数据
                  !flagData.current.loading &&
                  // 只有往前滚动我们才触发
                  scrollDirection === 'forward' &&
                  // 5 = (列表高度 / 单项列表高度)
                  // 100 = 滚动提前加载量，可根据样式情况调整
                  scrollOffset > ((resData.current.shopTotal - 5) * itemSize + 100)
                ) {
                  listReachBottom()
                }
              }}
            >
              {/* 列表单项组件，这里只能传入一个组件 */}
              {Row}
            </VirtualList>
          }
          <View className=' scroll-view flex flex-wrap justify-between'>
            {
              resData.current.shopList.map((item, index) =>
                <ShopCard data={item} key={index} onClick={() => toDetailAction(item)}></ShopCard>
              )
            }
          </View>
        </View>
      </View>
      <Tabbar></Tabbar>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))