
interface AnyCommonObj  {
  [name: string]: any
}
type CommonObj = AnyCommonObj | null | undefined


export interface UserStore {
  userInfo: CommonObj
  setUserInfo: (val: object) => {}
}

export interface BaseStore {
  tabIndex: number,
  menuButtonInfo: CommonObj
}

export interface CommonStore {
  categoryInfo: CommonObj,
  goodsInfo: CommonObj,
  editUserInfo: CommonObj,
  errorInfo: any
}