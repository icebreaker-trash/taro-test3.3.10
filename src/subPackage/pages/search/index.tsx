


/*
 * @Author: lsmi
 * @Date: 2022-04-22 21:31:54
 * @LastEditors: lsmi
 * @LastEditTime: 2022-04-22 22:16:49
 * @FilePath: \taro-tsx-temp\src\pages\temp\index.tsx
 */
import { inject, observer } from 'mobx-react'
import { View, Button, Text, Input } from '@tarojs/components'
import React, { useCallback, useEffect } from 'react'
import Taro, { useDidShow, usePullDownRefresh, useReachBottom, useReady, useRouter, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import useStateRef from 'react-usestateref'
import { UserStore } from '@/types/store'
import { Search } from '@taroify/icons'
import { getCurrentPageUrlWithArgs, watch } from '@/utils/index'
import ShopCard from '@/components/shop-card'
import SearchNoData from '@/static/img/search-no-data.png'
import { useGetNextList } from '@/hooks'
import './index.scss'


interface Props {
  user: UserStore
}

interface InfoData {
  name: string
}

const Index: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const {
    reLoadAction,
    nextAction,
    page,
    list,
    setList,
    renderAction: RenderAction
  } = useGetNextList()
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
  const [, setSearchVal, searchVal] = useStateRef('')

  useReachBottom(() => {
    nextAction()
  })
  // 下拉刷新
  usePullDownRefresh(() => {
    watch(async () => {
      Taro.stopPullDownRefresh();
    });
  })

  useEffect(() => {
    reLoadAction(fetchAction)
  }, [])

  async function fetchAction() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data: any = []
        for (let i = 0; i < 10; i++) {
          data.push(
            {
              img: 'https://img.zcool.cn/community/012078636df8f3000e4b1000caad81.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_1/auto-orient,1/sharpen,100/format,webp/quality,q_100',
              name: '口红套装',
              price: '1850.00',
              delPrice: '2100'
            }
          )
        }
        resolve({
          data: [],
          total: 1000,
        })
      }, 2000)
    })
  }

  const toDetailAction = useCallback((item) => {
    Taro.navigateTo({ url: `/subPackage/pages/common/shop-detail/index?id=${item.id || 1}` })
  }, [])

  function searchFetchAction(){

  }

  return (
    <View className=' search-page page-view-content bg-[#fff] py-[20px] px-[30px] pt-[0px]'>
      <View className=' bg-white pt-[20px] sticky top-0'>
        <View
          className=' search-box flex
           items-center justify-between 
           rounded-[38px] bg-[#F8F8F8] border border-[#F1F1F1]
           py-[16px] px-[30px] relative mb-[36px]'
        >
          <Search size={20} color='#BEBEBE' />
          <Input
            value={searchVal.current}
            className=' text-[30px] flex-1 ml-[22px]'
            placeholder='请输入商品名称'
            placeholderStyle='color:#828282'
            onInput={(e) => setSearchVal(e.detail.value)}
            onConfirm={searchFetchAction}
          ></Input>
        </View>
      </View>
      {/* result */}
      <View className=' mt-[30px]'>
        <View className=' text-[30px] font-bold px-[8px] mb-[30px]'>搜索结果</View>
        <RenderAction innerList emptyText='暂无搜索结果' emptySrc={SearchNoData} emptyImageClass='list-empty-img w-[404px] h-[337px] bg-[#fff]'>
          <View className=' scroll-view flex flex-wrap justify-between'>
            {
              list.current.map((item, index) =>
                <ShopCard data={item} key={index} onClick={() => toDetailAction(item)}></ShopCard>
              )
            }
          </View>
        </RenderAction>
      </View>
    </View>
  )
}

export default React.memo(inject('user')(observer(Index)))