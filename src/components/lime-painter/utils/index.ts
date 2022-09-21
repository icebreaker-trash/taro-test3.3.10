export function walkParent(element: any, callback: Function) {
  if (!element) return
  let cur = element
  let stop = false
  const callbreak = () => {
    stop = true
  }
  while (cur.parent) {
    callback(cur.parent, callback)
    if (stop) {
      break
    }
    cur = cur.parent
  }
}
export function findRelativeTo(element: any) {
  if (element.isInFlow()) return element.parent;
  if (element.isFixed) return element.root;
  let relativeTo: boolean | null = null

  walkParent(element, (parent: any) => {
    if (parent.style.position !== 'static' && !relativeTo) {
      relativeTo = parent
    }
  })
  if (!relativeTo) {
    relativeTo = element.root
  }
  return relativeTo
}

/**
 * @description 生成随机字符串
 * @param  { number } length - 字符串长度
 * @returns { string }
 */
export function randomString(length) {
  let str = Math.random().toString(36).substr(2);
  if (str.length >= length) {
    return str.substr(0, length);
  }
  str += randomString(length - str.length);
  return str;
}

export function getRandomId(prefix = 'canvas', length = 10) {
  return prefix + randomString(length);
}