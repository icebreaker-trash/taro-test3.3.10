/*
 * @Author: lsmi
 * @Date: 2021-11-25 20:19:46
 * @LastEditors: lsmi
 * @LastEditTime: 2021-11-30 22:42:16
 * @FilePath: \taro-plaid-shop\src\utils\axios\utils.ts
 */

const typeToString = Object.prototype.toString

export function isObject(val: any): val is Object{
  return typeToString.call(val) === '[object Object]'
}

export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isObject(val)) {
          if (isObject(result[key])) {
            // @1 这里就是 如果result[key]有 就是存在两个配置有相同key 后者覆盖前者
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}

export function extend(to, from) {
  for (const key in from) {
    to[key] = from[key]
  }
}

// 转化http返回的数据 
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do
    }
  }
  return data
}
