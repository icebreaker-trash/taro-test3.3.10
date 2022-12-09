export default {
  pages: [
    'pages/index/index',
    'pages/shop/index',
    'pages/serve/index',
    'pages/my/index'
    // 'pages/demo/index',
    // 'pages/tcss/index',
    // 'pages/test-hooks/index',
    // 'pages/tcomp/index'
  ],
  subPackages: [
    {
      root: 'subPackage',
      name: 'subPackage',
      // independent: true,
      pages: [
       'pages/common/shop-detail/index',
       'pages/common/category-shop/index',
       'pages/common/introduce/index',
       'pages/common/introduce-content/index',
       'pages/common/cart/index',
       'pages/active/collect/index',
       'pages/active/detail/index',
       'pages/order/checkout/index',
       'pages/order/list/index',
       'pages/serve/detail/index',
       'pages/mine/basic/index',
       'pages/integral/shop/index',
       'pages/sale/center/index',
       'pages/sale/income/index',
       'pages/sale/customer/index',
       'pages/sale/apply/index',
       'pages/search/index',
       'pages/order/detail/index'
      ]
    }
  ],
  // debug: true, // 开启 一些编译时的 log
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  requiredPrivateInfos: ['chooseAddress'],
  tabBar: {
    color: '#828282',
    selectedColor: '#333333',
    borderStyle: 'black',
    backgroundColor: '#ffffff',
    custom: true,
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/home-active.png',
        text: '首页'
      },
      {
        pagePath: 'pages/shop/index',
        iconPath: 'static/tabbar/shop.png',
        selectedIconPath: 'static/tabbar/shop-active.png',
        text: '商城'
      },
      {
        pagePath: 'pages/serve/index',
        iconPath: 'static/tabbar/serve.png',
        selectedIconPath: 'static/tabbar/serve-active.png',
        text: '服务项目'
      },
      {
        pagePath: 'pages/my/index',
        iconPath: 'static/tabbar/my.png',
        selectedIconPath: 'static/tabbar/my-active.png',
        text: '我的'
      }
    ]
  }
}
