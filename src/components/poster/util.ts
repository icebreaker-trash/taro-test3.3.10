import Taro from "@tarojs/taro";


const isValidUrl = url => {
  return /(ht|f)tp(s?):\/\/([^ \\/]*\.)+[^ \\/]*(:[0-9]+)?\/?/.test(url)
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

/**
 * 深度对比两个对象是否一致
 * from: https://github.com/epoberezkin/fast-deep-equal
 * @param  {Object} a 对象a
 * @param  {Object} b 对象b
 * @return {Boolean}   是否相同
 */
/* eslint-disable */
const equal = (a, b) => {
  if (a === b) return true

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    var arrA = Array.isArray(a),
      arrB = Array.isArray(b),
      i,
      length,
      key

    if (arrA && arrB) {
      length = a.length
      if (length != b.length) return false
      for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false
      return true
    }

    if (arrA != arrB) return false

    var dateA = a instanceof Date,
      dateB = b instanceof Date
    if (dateA != dateB) return false
    if (dateA && dateB) return a.getTime() == b.getTime()

    var regexpA = a instanceof RegExp,
      regexpB = b instanceof RegExp
    if (regexpA != regexpB) return false
    if (regexpA && regexpB) return a.toString() == b.toString()

    var keys = Object.keys(a)
    length = keys.length

    if (length !== Object.keys(b).length) return false

    for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false

    for (i = length; i-- !== 0;) {
      key = keys[i]
      if (!equal(a[key], b[key])) return false
    }

    return true
  }

  return a !== a && b !== b
}

/**
 * 获取 rpx => px 的转换系数
 * @returns { number } factor 单位转换系数 1rpx = factor * px
 */
export const getFactor = () => {
  const sysInfo = Taro.getSystemInfoSync();
  const { screenWidth } = sysInfo;
  return screenWidth / 750;
};

/**
 * rpx => px 单位转换
 * @param { number } rpx - 需要转换的数值
 * @param { number } factor - 转化因子
 * @returns { number }
 */


export const toPx = (rpx, factor?) => {
  return parseInt(String(rpx * (factor || getFactor())), 10);
}


/**
 * px => rpx 单位转换
 * @param { number } px - 需要转换的数值
 * @param { number } factor - 转化因子
 * @returns { number }
 */
export const toRpx = (px, factor = getFactor()) =>
  parseInt(String(px / factor), 10);

const screen = Taro.getSystemInfoSync().windowWidth / 750;
// 缓存图片
let cache = {}
export function isNumber(value) {
  return /^-?\d+(\.\d+)?$/.test(value);
}
export function toPx2(value, baseSize) {
  // 如果是数字
  if (typeof value === 'number') {
    return value
  }
  // 如果是字符串数字
  if (isNumber(value)) {
    return value * 1
  }
  // 如果有单位
  if (typeof value === 'string') {
    const reg = /^-?([0-9]+)?([.]{1}[0-9]+){0,1}(em|rpx|px|%)$/g
    const results = reg.exec(value);
    if (!value || !results) {
      return 0;
    }
    const unit = results[3];
    value = parseFloat(value);
    let res = 0;
    if (unit === 'rpx') {
      res = Math.floor(value * (screen || 0.5) * 1);
    } else if (unit === 'px') {
      res = Math.floor(value * 1);
    } else if (unit === '%') {
      res = Math.floor(value * toPx(baseSize) / 100);
    } else if (unit === 'em') {
      res = Math.ceil(value * toPx(baseSize || 14));
    }
    return res;
  }
}

/** 从 0x20 开始到 0x80 的字符宽度数据 */
export const CHAR_WIDTH_SCALE_MAP = [0.296, 0.313, 0.436, 0.638, 0.586, 0.89, 0.87, 0.256, 0.334, 0.334, 0.455, 0.742,
	0.241, 0.433, 0.241, 0.427, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.586, 0.241, 0.241, 0.742,
	0.742, 0.742, 0.483, 1.031, 0.704, 0.627, 0.669, 0.762, 0.55, 0.531, 0.744, 0.773, 0.294, 0.396, 0.635, 0.513, 0.977,
	0.813, 0.815, 0.612, 0.815, 0.653, 0.577, 0.573, 0.747, 0.676, 1.018, 0.645, 0.604, 0.62, 0.334, 0.416, 0.334, 0.742,
	0.448, 0.295, 0.553, 0.639, 0.501, 0.64, 0.567, 0.347, 0.64, 0.616, 0.266, 0.267, 0.544, 0.266, 0.937, 0.616, 0.636,
	0.639, 0.64, 0.382, 0.463, 0.373, 0.616, 0.525, 0.79, 0.507, 0.529, 0.492, 0.334, 0.269, 0.334, 0.742, 0.296
];

export { isValidUrl, equal }
