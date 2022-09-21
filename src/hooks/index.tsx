import Taro, { ShareAppMessageObject, useShareAppMessage } from "@tarojs/taro"
import useStateRef from "react-usestateref"


export function useGetList(api: (...arg) => Promise<any>, params) {
  const [list, setList, refList] = useStateRef<any[]>([])
  const [page, setPage, refPage] = useStateRef(1)
  const [loading, setLoading, refLoading] = useStateRef(false)
  const [noData, setNoData, refNoData] = useStateRef(false)
  async function getList(inParams = {}, concat?) {
    if (refNoData.current) {
      return
    }
    if (refLoading.current) {
      return
    }
    setLoading(true)
    Taro.showLoading()
    return api({ ...params, ...inParams, page: refPage.current }).then(res => {
      Taro.hideLoading()
      setLoading(false)
      if (!res) {
        return [];
      }
      if (refList.current.length === res.total) {
        setNoData(true)
        return []
      }
      if (concat === 'concat') {
        setList(list.concat(res.data));
      } else {
        setList(res.data);
      }
      return res
    })
  }
  async function next(inParams = {}) {
    setPage(refPage.current + 1)
    return getList(inParams, 'concat')
  }
  async function reLoad(inParams = {}) {
    setPage(1)
    return getList(inParams)
  }
  return { refList, getList, next, reLoad, refLoading, refNoData }
}


