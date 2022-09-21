import toPx from '../utils/toPx'

export type ObjectFit = "fill" | "contain" | "cover" | "scale-down" | "none";
export type ObjectPosition = ["left" | "center" | "right" | string | number, "top" | "center" | "bottom" | string | number];
export type returnPosition = {
    dx: number, dy: number, dw: number, dh: number
    sx: number, sy: number, sw: number, sh: number
}
// 图片容器大小
export type contentSize = { width: number, height: number }
// 图片原始大小
export type intrinsicSize = { width: number, height: number }

// objectFit
// https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit
// - fill 缩放 不保持宽高比 铺满
// - contain 缩放 保持宽高比 长边占满
// - cover 缩放 保持宽高比 短边占满
// - none 不缩放 显示原始尺寸中间部分
// - scale-down 
// objectPosition
// https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-position

export function calculateRenderedRect(style: { objectFit?: ObjectFit, objectPosition?: ObjectPosition }, contentSize: contentSize, intrinsicSize: intrinsicSize): returnPosition {
    const { objectFit, objectPosition } = style
    // 思路：
    // fill 为铺满所以不需要处理
    // 因为等比缩放的只有 contain 和 cover 所以只需要针对它俩做等比缩放比例 其它的不需要处理
    // 通过对比原图尺寸 intrinsicSize 和 容器尺寸 contentSize 得到一个渲染比例值 renderedScale
    // 再使用 原图尺寸 intrinsicSize 乘以 渲染比例值 renderedScale 得到原图最终的尺寸


    // 宽高比： 值越大 表示 宽越大 形状越扁 反之则高度越大 形状越瘦
    // 容器
    let contentRatio = contentSize.width / contentSize.height
    // 原图
    let intrinsicRatio = intrinsicSize.width / intrinsicSize.height
    // console.log('intrinsicRatio', intrinsicRatio)
    // 默认渲染比例值
    let renderedScale = 1;



    if (
        objectFit == 'contain' && contentRatio >= intrinsicRatio ||
        objectFit == 'cover' && contentRatio < intrinsicRatio
    ) {
        // contain：     整个对象在填充盒子 就是 长边占满
        // 比例：        当容器的比例大时 则表示 容器的高度比较小 而图片的高度较大 要把整个图片放到容器里 即最终图片的高度等于容器的高度
        // 计算方式：    容器的高 / 原图高 * 原图高
        // cover：       短边占满 长边裁剪
        // 比例：        当容器的比例小时 则表示 容器的高度比较大 而图片的高度较小 求把图片的短边占满容器 即最终图片的高度等于容器的高度
        // 计算方式：    容器的高 / 原图高 * 原图高
        renderedScale = contentSize.height / intrinsicSize.height
    } else if (
        objectFit == 'contain' && contentRatio < intrinsicRatio ||
        objectFit == 'cover' && contentRatio >= intrinsicRatio
    ) {
        // contain：     整个对象在填充盒子 就是 长边占满
        // 比例：        当容器的比例小时 则表示 容器的宽度比较小 而图片的宽度比较大 要把整个图片放到容器里 即最终图片的宽度等于容器的宽度
        // 计算方式：    容器的宽 / 原图宽 * 原图宽
        // cover：       短边占满 长边裁剪
        // 比例：        当容器的比例大时 则表示 容器的宽度比较大 而图片的宽度比较小 求把图片的短边占满容器 即最终图片的宽度等于容器的宽度
        renderedScale = contentSize.width / intrinsicSize.width
    } else {
        // console.log('objectFit', objectFit)
    }

    // 最终图片的尺寸
    let renderedWidth: number = intrinsicSize.width * renderedScale
    let renderedHeight: number = intrinsicSize.height * renderedScale

    let renderedLeft = /^\d+px|rpx$/.test(objectPosition?.[0]) ? toPx(objectPosition?.[0], contentSize.width) : (contentSize.width - renderedWidth) * (/%$/.test(objectPosition?.[0]) ? toPx(objectPosition?.[0], 1, true) : { left: 0, center: .5, right: 1 }[objectPosition?.[0] || 'center']);
    let renderedTop = /^\d+px|rpx$/.test(objectPosition?.[1]) ? toPx(objectPosition?.[1], contentSize.height) : (contentSize.height - renderedHeight) * (/%$/.test(objectPosition?.[1]) ? toPx(objectPosition?.[1], 1, true) : { top: 0, center: .5, bottom: 1 }[objectPosition?.[1] || 'center'])

    // 需要还原 原图在相对于容器坐标上的位置
    let dist2src = (disx: number, disy: number) => [
        /* srcX =*/(disx - renderedLeft) / renderedScale,
        /* srcY =*/(disy - renderedTop) / renderedScale
    ]
    let [srcLeft, srcTop] = dist2src(0, 0);
    let [srcRight, srcBottom] = dist2src(contentSize.width, contentSize.height);
    // drawImage(src, dx, dy, dw, dh, sx, sy, sw, sh)
    return {
        sx: Math.max(srcLeft, 0),
        sy: Math.max(srcTop, 0),
        sw: Math.min(srcRight - srcLeft, intrinsicSize.width),
        sh: Math.min(srcBottom - srcTop, intrinsicSize.height),
        dx: Math.max(renderedLeft, 0),
        dy: Math.max(renderedTop, 0),
        dw: Math.min(renderedWidth, contentSize.width),
        dh: Math.min(renderedHeight, contentSize.height)
    }
}