import Taro from '@tarojs/taro'
import isNumber from "./isNumber";
import { uni } from './platform'

export default function toPx(value: any, baseSize?: any, isDecimal?: boolean): number {
    // 如果是数字
    if (typeof value === 'number') {
        return value
    }
    // 如果是字符串数字
    if (isNumber(value)) {
        return 1 * value
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
        let res: any = 0;
        if (unit === 'rpx') {
            
            // res = uni.upx2px(value);
            res = Math.floor(value * (Taro.getSystemInfoSync().windowWidth / 750))
        } else if (unit === 'px') {
            res = value * 1;
        } else if (unit === '%' && baseSize) {
            res = value * toPx(baseSize) / 100;
        } else if (unit === 'em' && baseSize) {
            res = value * toPx(baseSize || 14);
        }
        return res.toFixed(2) * 1 //isDecimal ? res.toFixed(2) * 1 : Math.floor(res)//Math.round(res);
    }
    return 0
}