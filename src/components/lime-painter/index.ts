import Taro from '@tarojs/taro'
import { PLATFORM } from './utils/platform'
import { calculateRenderedRect } from './lib/object-size'
import adaptor from './lib/canvas'
import toPx from './utils/toPx'
import isNumber from './utils/isNumber'
import { sleep } from './utils/sleep'
import { getImageInfo } from './utils/getImageInfo'
import GD from './lib/gradient'
import { Element } from './lib/layout'
import QR from './lib/qrcode'
//import { uni } from './utils/platform'
import { UNI_PLATFORM, ELEMENT_TYPE, DISPLAY, BACKGROUND_COLOR, OBJECT_FIT } from './utils/constant'

interface DefalutOption {
  platform: string
  toPx?: (v: number, b: any, d: boolean) => number
  root: { width: number, height: number, fontSizeRate: number }
}
interface PainterOption {
  id?: string | null
  context: any
  pixelRatio?: number
  width?: number
  height?: number
  canvas: HTMLCanvasElement
  sleep?: number
  isCache?: boolean
  fixed?: string
  listen: any
}
// declare class Image {
//     src: string
//     onload(v: any): void;
//     onerror(v: any): void;
//     success(v: any): void;
//     fail(v: any): void;
// }
export class Painter {
  id: PainterOption['id'] = null
  ctx: PainterOption['context']
  pixelRatio: PainterOption['pixelRatio'] = 1
  width: PainterOption['width'] = 0
  height: PainterOption['height'] = 0
  //toPx: DefalutOption['toPx']
  //platform: DefalutOption["platform"]
  sleep: number = 1000 / 30
  progress: number
  canvas: any
  size: any
  count: number = 0
  root: DefalutOption['root']
  isRate: Boolean = false
  node: any
  component: any
  isDraw: boolean = true
  isCache: boolean = true
  fixed: string = ''
  imageBus: Promise<{}>[] = []
  options: PainterOption
  // { id, context, canvas, pixelRatio, width, height, sleep = 1000 / 30, fixed = '' }
  constructor(options: PainterOption, component?: any) {
    this.options = options
    Object.assign(this, options)
    // this.id = id
    // this.canvas = canvas
    // this.pixelRatio = Number(pixelRatio.toFixed(2))
    // this.width = width
    // this.height = height
    // this.isRate = false
    this.component = component
    //this.toPx = toPx
    // this.isCache = isCache
    this.ctx = adaptor(options.context)
    // this.sleep = sleep
    this.progress = 0
    // this.fixed = fixed
    this.root = { width: options.width, height: options.height, fontSizeRate: 1 }
    this.init()
    const size = { ...this.size }
    Object.defineProperty(this, 'size', {
      configurable: true,
      set: (v) => {
        Object.keys(v).forEach(key => {
          size[key] = v[key]
          if (!this.fixed.includes(key)) {
            this.root[key] = v[key]
          }
        })
        // callBack(this.root);
      },
      get: () => {
        return size
      }
    })
    let progress = 0
    Object.defineProperty(this, 'progress', {
      configurable: true,
      set: (v) => {
        progress = v;
        // this.listen
        this.lifecycle('onProgress', v / this.count)
      },
      get: () => {
        return progress || 0;
      }
    })


  }
  lifecycle(name: string, arg: any) {
    if (this.options.listen) {
      this.options.listen[name] && this.options.listen[name](arg)
    }
  }
  init() {
    if (this.canvas.height || PLATFORM === 'h5') {
      this.canvas.height = this.root.height * (this.pixelRatio || 1)
      this.canvas.width = this.root.width * (this.pixelRatio || 1)
      this.ctx.scale(this.pixelRatio, this.pixelRatio)
    } else if (this.canvas.height || 'weapp' === PLATFORM) {
      this.canvas.height = this.root.height * (this.pixelRatio || 1)
      this.canvas.width = this.root.width * (this.pixelRatio || 1)
      this.ctx.scale(this.pixelRatio, this.pixelRatio)
    }
  }
  clear() {
    this.ctx.clearRect(0, 0, this.root.width, this.root.height);
  }
  clipPath(x: number, y: number, w: number, h: number, path: string, fill: boolean = false, stroke: boolean = false) {
    const { ctx } = this
    if (/polygon/.test(path)) {
      let paths = path.match(/-?\d+(rpx|px|%)?\s+-?\d+(rpx|px|%)?/g) || []
      ctx.beginPath()
      paths.map(v => {
        let [x1, y1] = v.split(' ')
        return [
          toPx(x1, w) + x,
          toPx(y1, h) + y
        ]
      }).forEach((v, i) => {
        if (i == 0) {
          ctx.moveTo(v[0], v[1])
        } else {
          ctx.lineTo(v[0], v[1])
        }
      })
      ctx.closePath()
      if (stroke) ctx.stroke()
      if (fill) ctx.fill()
    }
  }
  roundRect(x: number, y: number, w: number, h: number, r: any, fill: boolean = false, stroke: boolean = false) {
    if (r < 0) return
    const { ctx } = this
    ctx.beginPath()
    if (!r) {
      ctx.rect(x, y, w, h)
    } else {
      let {
        borderTopLeftRadius: tl = r || 0,
        borderTopRightRadius: tr = r || 0,
        borderBottomRightRadius: br = r || 0,
        borderBottomLeftRadius: bl = r || 0
      } = r || {}
      // 右下角
      ctx.arc(x + w - br, y + h - br, br, 0, Math.PI * 0.5)
      ctx.lineTo(x + bl, y + h)
      // 左下角
      ctx.arc(x + bl, y + h - bl, bl, Math.PI * 0.5, Math.PI)
      ctx.lineTo(x, y + tl)
      // 左上角
      ctx.arc(x + tl, y + tl, tl, Math.PI, Math.PI * 1.5)
      ctx.lineTo(x + w - tr, y)
      // 右上角
      ctx.arc(x + w - tr, y + tr, tr, Math.PI * 1.5, Math.PI * 2)
      ctx.lineTo(x + w, y + h - br)
    }
    ctx.closePath()
    if (stroke) ctx.stroke()
    if (fill) ctx.fill()
  }
  setTransform(box: any, { transform, transformOrigin }: any) {

    const { ctx } = this
    let {
      scaleX = 1,
      scaleY = 1,
      translateX = 0,
      translateY = 0,
      rotate = 0,
      skewX = 0,
      skewY = 0
    } = transform || {}
    let { left: x, top: y, width: w, height: h } = box
    translateX = toPx(translateX, w) || 0
    translateY = toPx(translateY, h) || 0

    const yMaps: any = {
      "top": toPx('0%', 1),
      "center": toPx('50%', 1, true),
      "bottom": toPx('100%', 1),
    }
    const xMaps: any = {
      "left": toPx('0%', 1),
      "center": toPx('50%', 1, true),
      "right": toPx('100%', 1)
    }
    transformOrigin = transformOrigin.split(' ').filter((v: string | number, i: number) => i < 2).reduce((c: any, v: any) => {
      if (/\d+/.test(v)) {
        let n = toPx(v, 1, true) / (/px|rpx$/.test(v) ? (isNumber(c.x) ? h : w) : 1)
        return isNumber(c.x) ? Object.assign(c, {
          y: n
        }) : Object.assign(c, {
          x: n
        })
      } else {
        return isNumber(xMaps[v]) && !isNumber(c.x) ? Object.assign(c, {
          x: xMaps[v]
        }) : Object.assign(c, {
          y: yMaps[v] || 0.5
        })
      }
    }, {})
    if (translateX || translateY) {
      ctx.translate(translateX, translateY)
    }
    if (scaleX || scaleY) {
      ctx.scale(scaleX, scaleY)
    }

    if (rotate) {
      const x1 = x + w * transformOrigin.x
      const y1 = y + h * transformOrigin.y
      ctx.translate(x1, y1)
      ctx.rotate(rotate * Math.PI / 180)
      ctx.translate(-x1, -y1)
    }
    if (skewX || skewY) {
      ctx.transform(1, Math.tan(skewY * Math.PI / 180), Math.tan(skewX * Math.PI / 180), 1, 0, 0)
    }
  }
  setBackground(bg: string, w: number, h: number, x: number, y: number) {
    const { ctx } = this
    if (!bg || bg == BACKGROUND_COLOR) {
      if (!['rn', 'h5'].includes(PLATFORM)) {
        ctx.setFillStyle(BACKGROUND_COLOR)
      } else {
        ctx.setFillStyle('rgba(0,0,0,0)')
      }
    } else if (GD.isGradient(bg)) {
      GD.doGradient(bg, w, h, x, y, ctx);
    } else {
      ctx.setFillStyle(bg)
    }
  }
  setShadow({ boxShadow: bs = [] }) {
    const { ctx } = this
    if (bs.length) {
      const [x, y, b, c] = bs
      ctx.setShadow(x, y, b, c)
    }
  }
  setBorder(box: any, style: any) {
    const { ctx } = this
    let { width: w, height: h, left: x, top: y } = box
    const {
      border,
      borderBottom,
      borderTop,
      borderRight,
      borderLeft,
      borderRadius: r,
      lineCap
    } = style;
    const {
      borderWidth: bw = 0,
      borderStyle: bs,
      borderColor: bc,
    } = border || {}
    const {
      borderBottomWidth: bbw = bw,
      borderBottomStyle: bbs = bs,
      borderBottomColor: bbc = bc,
    } = borderBottom || {}
    const {
      borderTopWidth: btw = bw,
      borderTopStyle: bts = bs,
      borderTopColor: btc = bc,
    } = borderTop || {}
    const {
      borderRightWidth: brw = bw,
      borderRightStyle: brs = bs,
      borderRightColor: brc = bc,
    } = borderRight || {}
    const {
      borderLeftWidth: blw = bw,
      borderLeftStyle: bls = bs,
      borderLeftColor: blc = bc,
    } = borderLeft || {}

    let {
      borderTopLeftRadius: tl = r || 0,
      borderTopRightRadius: tr = r || 0,
      borderBottomRightRadius: br = r || 0,
      borderBottomLeftRadius: bl = r || 0
    } = r || {}
    if (!borderBottom && !borderLeft && !borderTop && !borderRight && !border) return;
    const _borderType = (w: number, s: string, c: string) => {
      if (s == 'dashed') {
        // /mp/.test(PLATFORM)
        if (!['rn', 'h5'].includes(PLATFORM)) {
          // 是小程序
          ctx.setLineDash([Math.ceil(w * 4 / 3), Math.ceil(w * 4 / 3)])
        } else {
          ctx.setLineDash([Math.ceil(w * 6), Math.ceil(w * 6)])
        }
      } else if (s == 'dotted') {
        ctx.setLineDash([w, w])
      }
      ctx.setStrokeStyle(c)
    }
    const _setBorder = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, r1: number, r2: number, p1: number, p2: number, p3: number, bw: number, bs: string, bc: string, isSquare: boolean) => {
      ctx.save()
      // this.setOpacity(style)
      // this.setTransform(box, style)
      ctx.setLineCap(isSquare ? 'square' : lineCap)
      // ctx.setLineJoin('round')
      ctx.setLineWidth(bw)
      _borderType(bw, bs, bc)
      ctx.beginPath()
      ctx.arc(x1, y1, r1, Math.PI * p1, Math.PI * p2)
      ctx.lineTo(x2, y2)
      ctx.arc(x3, y3, r2, Math.PI * p2, Math.PI * p3)
      ctx.stroke()
      ctx.restore()
    }
    ctx.save()
    // this.setOpacity(style)
    // let { x, y } = 
    // this.setTransform(box, style)
    if (border && !borderBottom && !borderLeft && !borderTop && !borderRight) {
      ctx.setLineWidth(bw)
      _borderType(bw, bs, bc)
      this.roundRect(x, y, w, h, r, false, bc ? true : false)
      ctx.restore()
      return
    }
    if (bbw) {
      _setBorder(x + w - br, y + h - br, x + bl, y + h, x + bl, y + h - bl, br, bl, 0.25, 0.5, 0.75, bbw, bbs, bbc, blw && brw)
    }
    if (blw) {
      // 左下角
      _setBorder(x + bl, y + h - bl, x, y + tl, x + tl, y + tl, bl, tl, 0.75, 1, 1.25, blw, bls, blc, btw && bbw)
    }
    if (btw) {
      // 左上角
      _setBorder(x + tl, y + tl, x + w - tr, y, x + w - tr, y + tr, tl, tr, 1.25, 1.5, 1.75, btw, bts, btc, blw && brw)
    }
    if (brw) {
      // 右上角
      _setBorder(x + w - tr, y + tr, x + w, y + h - br, x + w - br, y + h - br, tr, br, 1.75, 2, 0.25, brw, brs, brc, btw && bbw)
    }
  }
  setOpacity({ opacity = 1 }) {
    this.ctx.setGlobalAlpha(opacity)
  }
  async drawPattern(img: any, box: any, style: any) {
    return new Promise<void>((resolve, reject) => {
      this.drawView(box, style, true, false, true)
      const { ctx, canvas } = this
      const { width, height, left: x, top: y } = box
      let { borderRadius = 0, backgroundImage, backgroundRepeat = 'repeat' } = style || {}
      const _pattern = (img: any) => {
        const pattern = ctx.createPattern(img.src, backgroundRepeat)
        ctx.setFillStyle(pattern)
        this.roundRect(x, y, width, height, borderRadius, true, false)
        this.setBorder(box, style)
        resolve()
      }
      if (backgroundImage) {
        _pattern(img)
      }
    })

  }
  drawView(box: any, style: any, fill: boolean = true, stroke: boolean = true, shadow: boolean = true) {
    const { ctx } = this
    const { width, height, left: x, top: y } = box
    let { borderRadius = 0, backgroundColor = BACKGROUND_COLOR, overflow } = style || {}
    if (style.opacity) {
      this.setOpacity(style)
    }
    this.setTransform(box, style)
    if (shadow) {
      ctx.save()
      this.setShadow(style)
    }
    if (fill) {
      this.setBackground(backgroundColor, width, height, x, y)
    }
    if (style.clipPath) {
      this.clipPath(x, y, width, height, style.clipPath, true && fill, false)
    } else {
      this.roundRect(x, y, width, height, borderRadius, true && fill, false)
    }

    if (shadow) {
      ctx.restore()
    }
    if (stroke) {
      this.setBorder(box, style)
    }
    if (overflow == 'hidden') {
      ctx.clip()
    }
  }
  async drawImage(img: any, box: any = {}, style: any = {}, custom = true) {
    await new Promise(async (resolve, reject) => {
      if (style.boxShadow) {
        this.drawView(box, Object.assign(style, { backgroundColor: style.backgroundColor || style.boxShadow && (style.backgroundColor || '#ffffff') }), true, false, true)
      }
      const { ctx, canvas } = this
      let {
        borderRadius = 0,
        backgroundColor = BACKGROUND_COLOR,
        objectFit = OBJECT_FIT,
        backgroundSize = OBJECT_FIT,
        objectPosition,
        backgroundPosition,
      } = style
      if (style.backgroundImage) {
        objectFit = backgroundSize
        objectPosition = backgroundPosition
      }
      let { width: w, height: h, left: x, top: y } = box
      ctx.save()
      let offsetLeft = box.contentSize.left - box.borderSize.left
      let offsetTop = box.contentSize.top - box.borderSize.top
      if (!custom) {
        this.setOpacity(style)
        this.setTransform(box, style)
        this.setBackground(backgroundColor, w, h, x, y)
        this.roundRect(x, y, w, h, borderRadius, borderRadius ? true : false, false)
      }
      x += offsetLeft
      y += offsetTop
      ctx.clip()
      const _modeImage = (img: any) => {
        if (objectFit !== OBJECT_FIT) {
          let { sx, sy, sh, sw, dx, dy, dh, dw } = calculateRenderedRect({ objectFit, objectPosition }, box.contentSize, img)
          if (PLATFORM == 'swan') {
            ctx.drawImage(img.src, dx + x, dy + y, dw, dh, sx, sy, sw, sh)
          } else {
            ctx.drawImage(img.src, sx, sy, sw, sh, dx + x, dy + y, dw, dh)
          }
        } else {
          ctx.drawImage(img.src, x, y, w, h);
        }
      }
      const _restore = () => {
        ctx.restore()
        this.drawView(box, style, false, true, false)
        resolve(1)
      }
      const _drawImage = (img: any) => {
        _modeImage(img)
        _restore()
      }
      // if (typeof img === 'string') {
      //     try {
      //         const { path, width, height } = await this.getImageInfo(img)
      //         _drawImage({ path, src: path, width, height })
      //     } catch (error) {
      //        // this.lifecycle('onEffectFail', `createImage fail: ${img}`)
      //     }
      // } else {
      _drawImage(img)
      //}
    })
  }
  drawText(text: string, box: any, style: any, attr: any) {
    this.drawView(box, style)
    const { ctx } = this
    let {
      // width: w,
      // height: h,
      borderSize,
      contentSize,
      left: x,
      top: y
    } = box
    let { width: w, height: h } = contentSize
    let offsetLeft = contentSize.left - borderSize.left
    let offsetTop = contentSize.top - borderSize.top
    let {
      color = '#000000',
      lineHeight = '1.4em',
      fontSize = 14,
      fontWeight,
      fontFamily,
      fontStyle,
      textAlign = 'left',
      verticalAlign = 'middle',
      backgroundColor: bg,
      lineClamp,
      // borderRadius = 0,
      textDecoration: td
    } = style
    lineHeight = toPx(lineHeight, fontSize)
    if (!text) return
    ctx.save()
    // this.setOpacity(style)
    // let { x, y } = 
    //this.setTransform(box, style)
    x += offsetLeft
    y += offsetTop
    ctx.setFonts({ fontFamily, fontSize, fontWeight, fontStyle })
    ctx.setTextBaseline('middle')
    ctx.setTextAlign(textAlign)
    ctx.setFillStyle(color)
    y += fontSize / 2
    // 水平布局
    switch (textAlign) {
      case 'left':
        break
      case 'center':
        x += 0.5 * w
        break
      case 'right':
        x += w
        break
      default:
        break
    }
    const actualHeight = attr.lines * lineHeight
    let paddingTop = Math.ceil((h - actualHeight) / 2)
    if (paddingTop < 0) paddingTop = 0
    // 垂直布局
    switch (verticalAlign) {
      case 'top':
        break
      case 'middle':
        y += paddingTop
        break
      case 'bottom':
        y += 2 * paddingTop
        break
      default: break
    }
    const inlinePaddingTop = (lineHeight - attr.fontHeight) / 2
    // 绘线
    const _drawLine = (x: number, y: number, textWidth: number) => {
      let to = x
      switch (textAlign) {
        case 'left':
          x = x
          to += textWidth
          break
        case 'center':
          x = x - textWidth / 2
          to = x + textWidth
          break
        case 'right':
          to = x
          x = x - textWidth
          break
        default:
          break
      }

      if (td) {
        ctx.setLineWidth(fontSize / 13);
        ctx.beginPath();
        y -= inlinePaddingTop
        if (/\bunderline\b/.test(td)) {
          ctx.moveTo(x, y - attr.fontHeight * 0.5);
          ctx.lineTo(to, y - attr.fontHeight * 0.5);
        }

        if (/\boverline\b/.test(td)) {
          ctx.moveTo(x, y - attr.fontHeight * 1.5);
          ctx.lineTo(to, y - attr.fontHeight * 1.5);
        }
        if (/\bline-through\b/.test(td)) {
          ctx.moveTo(x, y - attr.fontHeight);
          ctx.lineTo(to, y - attr.fontHeight);
        }
        ctx.closePath();
        ctx.setStrokeStyle(color);
        ctx.stroke();
      }
    }
    // 不超过一行
    if (!attr.widths || attr.widths.length == 1 && attr.widths[0].total <= contentSize.width) {
      ctx.fillText(text, x, y + inlinePaddingTop)
      y += lineHeight
      _drawLine(x, y, attr?.widths?.[0]?.total || attr.text)
      ctx.restore()
      this.setBorder(box, style)
      return
    }
    // 多行文本
    const chars = text.split('')
    const _y = y
    let _x = x
    // 逐行绘制
    let line = ''
    let lineIndex = 0
    let startIndex = 0
    for (let index = 0; index <= chars.length; index++) {
      let ch = chars[index] || ''
      const isLine = ch === '\n'
      const isRight = ch == '' // index == chars.length
      ch = isLine ? '' : ch;
      let textline = line + ch
      let textWidth = ctx.measureText(textline).width
      // 绘制行数大于最大行数，则直接跳出循环
      if (lineIndex >= lineClamp) {
        break;
      }
      if (lineIndex == 0) {
        textWidth = textWidth
        _x = x
      } else {
        textWidth = textWidth
        _x = x
      }

      if (textWidth > contentSize.width || isLine || isRight) {
        let endIndex = index
        lineIndex++
        line = isRight && textWidth <= contentSize.width ? textline : line
        if (lineIndex === lineClamp && textWidth > w) {
          while (ctx.measureText(`${line}...`).width > contentSize.width) {
            if (line.length <= 1) {
              // 如果只有一个字符时，直接跳出循环
              break;
            }
            line = line.substring(0, line.length - 1);
          }
          line += '...'
        }

        ctx.fillText(line, _x, y + inlinePaddingTop)
        y += lineHeight
        _drawLine(_x, y, textWidth)
        line = ch
        startIndex = endIndex + (isLine ? 1 : 0)
        if ((y + lineHeight) > (_y + h)) break
      } else {
        line = textline
      }
    }
    ctx.restore()
    // this.setBorder(box, style)
  }
  async source(element: any) {
    //console.time('layout')
    const startTime = +new Date()
    if (JSON.stringify(element) == '{}') { return }
    if (!element.type) {
      element.type = ELEMENT_TYPE.VIEW
      element.css = element.css || {}
      for (let key in element) {
        if (!['views', 'children', 'type', 'css'].includes(key)) {
          element.css[key] = element[key]
          delete element[key]
        }
      }
    }
    if (!element.css?.width) {
      if (element.css) {
        element.css.width = this.root.width
      } else {
        element.css = {
          width: this.root.width
        }
      }
    }
    const node = await this.create(element)
    this.size = node?.layout() || {}
    this.node = node
    //console.timeEnd('layout')
    this.onEffectFinished()
      .then(res => this.lifecycle('onEffectSuccess', res))
      .catch(res => this.lifecycle('onEffectFail', res))
    console.log('布局用时：' + (+new Date() - startTime) + 'ms')
    return this.root
  }
  getImageInfo(url: string) {
    if (!this.imageBus[url]) {
      this.imageBus[url] = getImageInfo(url, this.canvas.createImage && this.canvas || (PLATFORM == 'h5' && new Image))
    }
    return this.imageBus[url]
  }
  async create(element: any, parent?: any) {
    if (element.type == ELEMENT_TYPE.TEXT) {
      element.text = String(element.text)
    }
    if (element.type == ELEMENT_TYPE.IMAGE && !(element.src || element.url) || (element.type == ELEMENT_TYPE.QRCODE || element.type == ELEMENT_TYPE.TEXT) && !element.text) {
      return
    }
    if (element.css && element.css.display == DISPLAY.NONE) {
      // console.log('element display none')
      return
    }
    if (element.type == ELEMENT_TYPE.IMAGE || element.type == ELEMENT_TYPE.VIEW && element.css?.backgroundImage) {
      let src = element.src
      const urlReg = /url\((.+)\)/
      if (element.css && element.css.backgroundImage && urlReg.exec(element.css.backgroundImage)?.[1]) {
        src = urlReg.exec(element.css.backgroundImage)?.[1]
      }
      try {
        let { width, height, path } = await this.getImageInfo(src)
        if (!path && element.type == ELEMENT_TYPE.IMAGE) return
        if (path) {
          element.attributes = Object.assign(element.attributes || {}, { width, height, path, src: path, naturalSrc: src })
        }
      } catch (error: any) {
        // this.lifecycle('onEffectFail', { ...error, src })
        return
      }
    }
    this.count += 1
    const node = new Element(element, parent, this.root, this.ctx)
    const child = element.views || element.children
    if (child) {
      for (let i = 0; i < child.length; i++) {
        const childNode = child[i]
        const newNode = await this.create(childNode, node)
        if (newNode) {
          node.add(newNode)
        }
      }
    }
    return node
  }
  async drawNode(element: any) {
    const {
      layoutBox: box,
      computedStyle: style,
      attributes: attr,
      name,
      children,
    } = element
    const {
      src,
      text
    } = element.attributes
    this.ctx.save()
    if (name === ELEMENT_TYPE.VIEW) {
      if (src) {
        if (style.backgroundRepeat) {
          await this.drawPattern(attr, box, style)
        } else {
          await this.drawImage(attr, box, style, false)
        }
      } else {
        this.drawView(box, style)
      }
    } else if (name === ELEMENT_TYPE.IMAGE && src) {
      await this.drawImage(attr, box, style, false)
    } else if (name === ELEMENT_TYPE.TEXT) {
      this.drawText(text, box, style, attr)
    } else if (name === ELEMENT_TYPE.QRCODE && QR.api) {
      QR.api.draw(text, this, box, style)
    }
    this.progress += 1

    if (children) {
      const childs = Object.values ? Object.values(children) : Object.keys(children).map((key) => children[key]);
      for (const child of childs) {
        await this.drawNode(child)
      }
    }
    this.ctx.restore()
  }
  render() {
    return new Promise(async (resolve, reject) => {
      const startTime = +new Date()
      this.init()
      await sleep(30)
      try {
        if (this.node) {
          await this.drawNode(this.node)
          resolve(this.node)
        } else {
          this.lifecycle('onEffectFail', 'node is empty')
        }
      } catch (e) {
        this.lifecycle('onEffectFail', e)
        reject(e)
      }
      console.log('渲染用时：' + (+new Date() - startTime - 30) + 'ms')
    })
  }
  onEffectFinished() {
    const list = Object.keys(this.imageBus).map((key) => {
      return this.imageBus[key];
    });
    return Promise.all(list);
  }
  destroy() {
    this.node = []
  }
  save(args: { fileType: string, quality: number }) {
    try {
      const { fileType = 'png', quality = 1 } = args || {}
      return this.canvas.toDataURL(`image/${fileType}`, quality)
    } catch (error) {
      this.lifecycle('onEffectFail', 'image cross domain')
      return error
    }
  }
}
if ('h5' == PLATFORM) {
  window.Painter = Painter
}
export default Painter