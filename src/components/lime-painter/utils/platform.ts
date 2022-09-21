/*
 * @Author: lsmi
 * @Date: 2022-05-31 22:08:44
 * @LastEditors: lsmi
 * @LastEditTime: 2022-05-31 22:14:59
 * @FilePath: \taro-tsx-temp\src\components\lime-painter\utils\platform.ts
 */
import { UNI_PLATFORM } from './constant'

export type UniPlatforms = "mp-weixin" | "mp-alipay" | "mp-baidu" | "mp-toutao" | "h5";

const baseFun: Uni = {
    upx2px: (upx: number) => window.innerWidth / 750 * upx,
    getSystemInfoSync: () => ({ screenWidth: window.innerWidth }),
    getImageInfo: ({ src, success, fail }) => {
        const image = new Image()
        image.onload = function () {
            success({
                width: this.naturalWidth,
                height: this.naturalHeight,
                path: this.src,
                src
            })
        }
        image.onerror = fail
        image.src = src
    }
}
const OBJECT = 'object'
const UNDEFINED = 'undefined'
export const PLATFORM = (function (): string {
    // @ts-ignore
    // if (typeof window == OBJECT)
    //     if (typeof uni == UNDEFINED || typeof uni !== UNDEFINED && !uni.addInterceptor) {
    //         return UNI_PLATFORM.WEB
    //     } else {
    //         return UNI_PLATFORM.H5
    //     }
    // if (typeof swan == OBJECT)
    //     return UNI_PLATFORM.MP_BAIDU //"mp-baidu"
    // if (typeof tt == OBJECT)
    //     return UNI_PLATFORM.MP_TOUTIAO //"mp-toutao"
    // if (typeof plus === OBJECT)
    //     return UNI_PLATFORM.PLUS
    // if (typeof wx == OBJECT)
    //     return UNI_PLATFORM.MP_WEIXIN
    return process.env.TARO_ENV
})();


const _uni = (function (): Uni {
    if (PLATFORM == UNI_PLATFORM.MP_WEIXIN) {
        return wx
    }
    // if (PLATFORM == UNI_PLATFORM.MP_TOUTIAO) {
    //     return tt
    // }
    if (typeof uni != UNDEFINED) {
        if (!uni.getImageInfo) {
            return Object.assign(uni, baseFun)
        }
        return {
            upx2px(args: any) {
                return uni.upx2px(args)
            },
            getSystemInfoSync() {
                return uni.getSystemInfoSync()
            },
            getImageInfo(args: any) {
                return uni.getImageInfo(args)
            },
            downloadFile(args: any) {
                return uni.downloadFile(args)
            }
        }
    }
    if (typeof window != UNDEFINED) {
        return baseFun
    }
    return uni;
})();

if (!_uni.upx2px) {
    let scale = ((_uni.getSystemInfoSync && uni.getSystemInfoSync()?.screenWidth) ?? 375) / 750
    _uni.upx2px = (rpx: number) => scale * rpx
}
export { _uni as uni }