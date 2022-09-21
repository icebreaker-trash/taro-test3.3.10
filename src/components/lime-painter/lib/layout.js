import toPx from '../utils/toPx'
import isNumber from '../utils/isNumber'
import { POSITION, DISPLAY, ELEMENT_TYPE, DEFAULT_STYLES } from '../utils/constant'
// import {Line} from './line'
let uuid = 0;
const baseBox = { left: null, top: null, width: null, height: null }
export class Element {
  id = uuid++
  style = { left: null, top: null, width: null, height: null }
  computedStyle = {}
  originStyle = {}
  children = {}
  layoutBox = { ...baseBox }
  contentSize = { ...baseBox, maxLineHeight: 0 }
  clientSize = { ...baseBox }
  borderSize = { ...baseBox }
  offsetSize = { ...baseBox }
  constructor(element, parent, root, ctx) {
    this.ctx = ctx
    this.root = root
    if (parent) { this.parent = parent }
    this.name = element.name || element.type
    this.attributes = this.getAttributes(element)
    const style = this.getComputedStyle(element, parent?.computedStyle);
    this.isAbsolute = style.position == POSITION.ABSOLUTE
    this.isFixed = style.position == POSITION.FIXED
    this.originStyle = style
    Object.keys(style).forEach(key => {
      Object.defineProperty(this.style, key, {
        configurable: true,
        enumerable: true,
        get: () => style[key],
        set: (value) => {
          style[key] = value
        }
      })
    })
    const sizes = {
      contentSize: { ...this.contentSize },
      clientSize: { ...this.clientSize },
      borderSize: { ...this.borderSize },
      offsetSize: { ...this.offsetSize },
    }
    Object.keys(sizes).forEach(size => {
      Object.keys(this[size]).forEach(key => {
        Object.defineProperty(this[size], key, {
          configurable: true,
          enumerable: true,
          get: () => sizes[size][key],
          set: (value) => {
            sizes[size][key] = value
          }
        })
      })
    })
    this.computedStyle = this.style
  }
  add(element) {
    element.parent = this;
    this.children[element.id] = element;
  }
  getChildren() {
    return Object.keys(this.children).map((id) => this.children[id])
  }
  getComputedStyle(element, parent) {
    const inheritProps = ['color', 'fontSize', 'lineHeight', 'verticalAlign', 'fontWeight', 'textAlign']
    //DEFAULT_STYLES
    const { css = {}, type = ELEMENT_TYPE.VIEW } = element
    const style = { ...DEFAULT_STYLES }
    if (['text', 'image'].includes(type) && !css.display) {
      style.display = 'inline-block'
    }
    if (parent) {
      for (var i = 0; i < inheritProps.length; i++) {
        const prop = inheritProps[i]
        if (css[prop] || parent[prop]) {
          css[prop] = css[prop] || parent[prop]
        }
      }
    }
    for (let key of Object.keys(css)) {
      const value = css[key]
      // boxshadow
      if (/^(box)?shadow$/i.test(key)) {
        let shadows = []
        value.replace(/((\d+(rpx|px)?\s+?){3})(.+)/, (...g) => {
          shadows = g[1].match(/\d+(rpx|px)?/g).map(v => toPx(v)).concat(g[4])
        })
        style.boxShadow = shadows
        continue
      }
      // border
      if (/^border/i.test(key) && !/radius$/i.test(key)) {
        const prefix = key.match(/^border([BTRLa-z]+)?/)[0]
        const type = key.match(/[W|S|C][a-z]+/)
        let v = value.replace(/([\(,])\s+|\s+([\),])/g, '$1$2').split(' ').map(v => /^\d/.test(v) ? toPx(v, '', true) : v)
        style[prefix] = {
          [prefix + 'Width']: isNumber(v[0]) ? v[0] : 0,
          [prefix + 'Style']: v[1] || 'solid',
          [prefix + 'Color']: v[2] || 'black'
        }
        if (v.length == 1 && type) {
          style[prefix][prefix + type[0]] = v[0]
        }
        continue
      }
      // background
      if (/^background(color)?$/i.test(key)) {
        style['backgroundColor'] = value
        continue
      }
      if (/^objectPosition$/i.test(key)) {
        style[key] = value.split(' ')
        continue
      }
      if (/padding|margin|radius/i.test(key)) {
        let isRadius = /radius$/i.test(key)
        let prefix = isRadius ? 'borderRadius' : key.match(/[a-z]+/)[0]
        let pre = [0, 0, 0, 0].map((item, i) => isRadius ? ['borderTopLeftRadius', 'borderTopRightRadius',
          'borderBottomRightRadius', 'borderBottomLeftRadius'
        ][i] : [prefix + 'Top', prefix + 'Right', prefix + 'Bottom', prefix + 'Left'][i])
        const PADDING = 'padding'
        const MARGIN = 'margin'
        const AUTO = 'auto'
        if (key === PADDING || key === MARGIN || /^(border)?radius$/i.test(key)) {
          let v = value?.split(' ').map((item) => /^\d+(rpx|px)?$/.test(item) ? toPx(item) : key != MARGIN && /auto/.test(item) ? 0 : item, []) || [0];
          let type = isRadius ? 'borderRadius' : key;
          let [t, r, b, l] = v
          style[type] = {
            [pre[0]]: t == AUTO ? 0 : t,
            [pre[1]]: isNumber(r) ? r : t,
            [pre[2]]: (isNumber(b) ? b : t) == AUTO ? 0 : (isNumber(b) ? b : t),
            [pre[3]]: isNumber(l) ? l : r || t
          }
        } else {
          if (typeof style[prefix] === 'object') {
            style[prefix][key] = prefix == MARGIN && value == AUTO || /%$/.test(value) ? value : toPx(value)
          } else {
            style[prefix] = {
              [pre[0]]: style[prefix] || 0,
              [pre[1]]: style[prefix] || 0,
              [pre[2]]: style[prefix] || 0,
              [pre[3]]: style[prefix] || 0
            }
            style[prefix][key] = prefix == MARGIN && value == AUTO || /%$/.test(value) ? value : toPx(value)

          }
        }
        continue
      }
      if (/^transform$/i.test(key)) {
        style[key] = {}
        value.replace(/([a-zA-Z]+)\(([0-9,-\.%rpxdeg\s]+)\)/g, (g1, g2, g3) => {
          const v = g3.split(',').map(k => k.replace(/(^\s*)|(\s*$)/g, ''))
          const transform = (v, r) => {
            return v.includes('deg') ? v * 1 : r && !/%$/.test(r) ? toPx(v, r) : v
          }
          if (g2.includes('matrix')) {
            style[key][g2] = v.map(v => v * 1)
          } else if (g2.includes('rotate')) {
            style[key][g2] = g3.match(/^-?\d+(\.\d+)?/)[0] * 1
          } else if (/[X, Y]/.test(g2)) {
            style[key][g2] = /[X]/.test(g2) ? transform(v[0], css['width']) : transform(v[0],
              css['height'])
          } else {
            style[key][g2 + 'X'] = transform(v[0], css['width'])
            style[key][g2 + 'Y'] = transform(v[1] || v[0], css['height'])
          }
        })
        continue
      }
      if (/^font$/i.test(key)) {
        console.error('font 不支持简写')
      }
      if (/^left|top$/i.test(key) && ![POSITION.ABSOLUTE, POSITION.FIXED].includes(css['position'])) {
        style[key] = 0
      } else {
        style[key] = /^[\d\.]+(px|rpx)?$/.test(value) ? toPx(value) : /em$/.test(value) && type == 'text' ? toPx(value, css['fontSize']) : value
      }
    }
    return style
  }
  setPosition(element, baseSize) {
    const direction = { left: 'width', top: 'height', right: 'width', bottom: 'height' }
    Object.keys(direction).forEach(item => {
      const key = item == 'right' ? 'left' : 'top'
      if (['right', 'bottom'].includes(item) && element.style[item] !== undefined && typeof element.originStyle[key] != 'number') {
        element.style[key] = baseSize[direction[item]] - element.offsetSize[direction[item]] - toPx(element.style[item], baseSize[direction[item]])
      } else {
        element.style[item] = toPx(element.style[item], baseSize[direction[item]])
      }
    })
  }
  getAttributes(element) {
    let arr = element.attributes || {}
    if (element.url || element.src) {
      arr.src = arr.src || element.url || element.src;
    }
    if (element.replace) {
      arr.replace = element.replace
    }
    if (element.text) {
      arr.text = element.text
    }
    return arr
  }
  getOffsetSize(el, style, type = 'offsetSize') {
    // 内容的宽高
    // contentSize
    // 内容的宽高 + padding
    // clientSize
    // 内容的宽高 + padding + border/2
    // borderSize
    // 内容的宽高 + padding + border/2 + margin
    // offsetSize

    const {
      margin: { marginLeft = 0, marginTop = 0, marginRight = 0, marginBottom = 0 } = {},
      padding: { paddingLeft = 0, paddingTop = 0, paddingRight = 0, paddingBottom = 0 } = {},
      border: { borderWidth = 0 } = {},
      borderTop: { borderTopWidth = borderWidth } = {},
      borderBottom: { borderBottomWidth = borderWidth } = {},
      borderRight: { borderRightWidth = borderWidth } = {},
      borderLeft: { borderLeftWidth = borderWidth } = {},
    } = style || {}
    const widthAdd = marginLeft < 0 && marginRight < 0 ? Math.abs(marginLeft + marginRight) : 0
    const heightAdd = marginTop < 0 && marginBottom < 0 ? Math.abs(marginTop + marginBottom) : 0
    const subMarginLeft = marginLeft >= 0 && marginRight < 0
    const subMarginTop = marginTop >= 0 && marginBottom < 0
    if (type == 'contentSize') {
      this[type].left = el.left + marginLeft + paddingLeft + borderLeftWidth + (subMarginLeft ? -marginRight * 2 : 0)
      this[type].top = el.top + marginTop + paddingTop + borderTopWidth + (subMarginTop ? -marginBottom * 2 : 0)
      this[type].width = el.width + (this[type].widthAdd ? 0 : widthAdd)
      this[type].height = el.height + (this[type].heightAdd ? 0 : heightAdd)
      this[type].widthAdd = widthAdd
      this[type].heightAdd = heightAdd
    }
    if (type == 'clientSize') {
      this[type].left = el.left + marginLeft + borderLeftWidth + (subMarginLeft < 0 ? -marginRight : 0)
      this[type].top = el.top + marginTop + borderTopWidth + (subMarginTop ? -marginBottom : 0)
      this[type].width = el.width + paddingLeft + paddingRight
      this[type].height = el.height + paddingTop + paddingBottom
    }
    if (type == 'borderSize') {
      this[type].left = el.left + marginLeft + borderLeftWidth / 2 + (subMarginLeft < 0 ? -marginRight : 0)
      this[type].top = el.top + marginTop + borderTopWidth / 2 + (subMarginTop ? -marginBottom : 0)
      this[type].width = el.width + paddingLeft + paddingRight + borderLeftWidth / 2 + borderRightWidth / 2
      this[type].height = el.height + paddingTop + paddingBottom + borderBottomWidth / 2 + borderTopWidth / 2
    }
    if (type == 'offsetSize') {
      this[type].left = el.left + (subMarginLeft < 0 ? -marginRight : 0)
      this[type].top = el.top + (subMarginTop ? -marginBottom : 0)
      this[type].width = el.width + paddingLeft + paddingRight + borderLeftWidth + borderRightWidth + marginLeft + marginRight
      this[type].height = el.height + paddingTop + paddingBottom + borderBottomWidth + borderTopWidth + marginBottom + marginTop
    }
    return this[type]
  }
  layoutBoxUpdate(layout, style, type = -1, isMin) {
    if (style.boxSizing == 'border-box') {
      const {
        border: { borderWidth = 0 } = {},
        borderTop: { borderTopWidth = borderWidth } = {},
        borderBottom: { borderBottomWidth = borderWidth } = {},
        borderRight: { borderRightWidth = borderWidth } = {},
        borderLeft: { borderLeftWidth = borderWidth } = {},
        padding: { paddingTop = 0, paddingRight = 0, paddingBottom = 0, paddingLeft = 0 } = {}
      } = style || {}
      if (!type) {
        layout.width -= (paddingLeft + paddingRight + borderRightWidth + borderLeftWidth)
      }
      if (type === 1 && !isMin) {
        layout.height -= (paddingTop + paddingBottom + borderTopWidth + borderBottomWidth)
      }
    }
    if (this.layoutBox) {
      this.layoutBox.contentSize = this.getOffsetSize(layout, style, 'contentSize')
      this.layoutBox.clientSize = this.getOffsetSize(layout, style, 'clientSize')
      this.layoutBox.borderSize = this.getOffsetSize(layout, style, 'borderSize')
      this.layoutBox.offsetSize = this.getOffsetSize(layout, style, 'offsetSize')
      this.layoutBox = Object.assign({}, this.layoutBox, this.layoutBox.borderSize)
    }
  }
  getBoxPosition(test) {
    const { computedStyle: cstyle } = this
    const children = this.getChildren()
    let { verticalAlign: v, left: x = 0, top: y = 0, textAlign } = cstyle;
    const config = { ...this.contentSize, left: x, top: y }
    const offsetTop = this.contentSize.top - this.offsetSize.top
    const offsetLeft = this.contentSize.left - this.offsetSize.left
    let vOffset = 0
    if (v == 'bottom' && this.contentSize.maxLineHeight) {
      vOffset = this.contentSize.maxLineHeight - this.contentSize.height
    } else if (v == 'middle' && this.contentSize.maxLineHeight) {
      vOffset = (this.contentSize.maxLineHeight - this.contentSize.height) / 2
    }
    config.top += vOffset
    if (children.length) {
      x += offsetLeft
      y += offsetTop
      let prev = null;
      let maxChild = null;
      let isNewLine = false;
      let count = 0
      for (var i = 0; i < children.length; i++) {
        const item = children[i]
        if (item.isAbsolute || item.isFixed) {
          count++
          if (item.isAbsolute) {
            item.setPosition(item, config)
            item.style.left += x
            item.style.top += y
            item.getBoxPosition()
          } else {
            item.setPosition(item, this.root)
            item.getBoxPosition()
          }
        } else {
          const index = i - count;
          let align = 0
          if (textAlign && this.isInline(item)) {
            const v = (this.contentSize.width - item.contentSize.maxLineWidth) || 0
            if (textAlign == 'center' && v > 1) {
              align = v / 2
            }
            if (textAlign == 'right' && v > 1) {
              align = v
            }
          }
          if (index == 0) {
            item.style.left += (x + align)
            item.style.top += y
            item.getBoxPosition()
            prev = item
            maxChild = item
          } else {
            if (maxChild?.offsetSize.height < prev?.offsetSize.height) {
              maxChild = prev
            }
            // 如果是block或上个是block或宽度大于父级
            const isBreak = prev?.offsetSize.left + prev?.offsetSize.width + item.offsetSize.width > config.left + config.width + offsetLeft
            const isBlock = this.getBoxState(prev, item)
            if (isBlock || isBreak) {
              item.style.left += (x + align)
              if (prev?.offsetSize.height >= maxChild?.offsetSize.height) {
                item.style.top += (prev?.offsetSize.top + prev?.offsetSize.height || 0)

              } else {
                item.style.top += (maxChild?.offsetSize.top + maxChild?.offsetSize.height || 0)
              }
              item.getBoxPosition()
              prev = item
              maxChild = item
              isNewLine = true
            } else {
              item.style.left += (prev?.offsetSize.left + prev?.offsetSize.width || 0)
              if (isNewLine) {
                item.style.top += prev?.offsetSize.top
              } else {
                item.style.top += y
              }
              item.getBoxPosition()
              prev = item
            }
          }
        }
      }
      this.layoutBoxUpdate(config, cstyle)
    } else {
      this.layoutBoxUpdate(config, cstyle)
    }
    return this.layoutBox
  }
  setMaxLineHeight(index, children, inlineBlockMax) {
    let k = index
    while (k >= 0 && !children[k].contentSize.maxLineHeight) {
      children[k].contentSize.maxLineHeight = inlineBlockMax
      k--
    }
  }
  setMaxLineWidth(index, children, inlineBlockMax) {
    let k = index
    while (k >= 0 && !children[k]?.contentSize?.maxLineWidth) {
      children[k].contentSize.maxLineWidth = inlineBlockMax
      k--
    }
  }
  getBoxState(prev, item) {
    return this.isBlock(prev) || this.isBlock(item)
  }
  isBlock(item) {
    return item && item.style.display == DISPLAY.BLOCK
    // const name = item?.name
    // const display = item?.style?.display
    // return name == ELEMENT_TYPE.VIEW && display != DISPLAY.INLINE_BLOCK || display == DISPLAY.BLOCK
  }
  isInline(item) {
    return !this.isBlock(item)
    // const name = item?.name
    // const display = item?.style?.display
    // return display == DISPLAY.INLINE_BLOCK || name !== ELEMENT_TYPE.VIEW
  }

  getBoxHieght() {
    const {
      name,
      computedStyle: cstyle,
      attributes,
      parent
    } = this
    const children = this.getChildren()
    let {
      top: y,
      bottom: b,
      height: h = 0,
      fontSize,
      position,
      lineHeight,
      minHeight,
      maxHeight
    } = cstyle;
    const config = { ...this.contentSize }
    if (/%$/.test(minHeight) && parent.contentSize.height) {
      minHeight = toPx(minHeight, parent.contentSize.height, true)
    }
    if (/%$/.test(maxHeight) && parent.contentSize.height) {
      maxHeight = toPx(maxHeight, parent.contentSize.height, true)
    }
    if (name == ELEMENT_TYPE.IMAGE && h == null) {
      const { width: rWidth, height: rHeight, mode } = attributes
      // config.height = Math.round(config.width * rHeight / rWidth) || 0
      config.height = this.contrastSize(Math.round(config.width * rHeight / rWidth) || 0, minHeight, maxHeight)
      this.layoutBoxUpdate(config, cstyle, 1)
    } else if (!h) {
      let positionHeight = 0
      if (y ?? (this.isAbsolute || this.isFixed && parent.contentSize.height)) {
        const isAB = position == 'absolute' ? parent.contentSize.height : this.root.height
        const top = /%$/.test(y) ? toPx(y, isAB) : y
        const bottom = /%$/.test(b) ? toPx(b, isAB) : b
        const height = isAB - top - bottom
        positionHeight = height
      }
      if (name == ELEMENT_TYPE.TEXT) {
        lineHeight = toPx(lineHeight, fontSize)
        config.height = positionHeight ? positionHeight : this.contrastSize(this.attributes.lines * lineHeight, minHeight, maxHeight)
        this.layoutBoxUpdate(config, cstyle, 1, true)
      } else if (children.length) {
        // view 含有节点继承父节点的宽度 行内元素取行内元素里面的最大高度
        let inlineBlockMax = 0;
        let prev = null
        let prevsWidth = 0
        let lines = 0
        config.height = children.reduce((sum, item, index) => {
          const isLast = index == children.length - 1
          if (item.isAbsolute || item.isFixed) {
            item.getBoxHieght()
            if (isLast) {
              const count = sum + inlineBlockMax
              return count
            }
            return sum
          } else {
            item.getBoxHieght()
            // 如果是block或上个是block或宽度大于父级
            const isBlock = this.getBoxState(prev, item)
            const isBreak = prevsWidth + item.offsetSize.width > config.width
            if (isBreak || isBlock) {
              let count = 0
              lines++
              // (prev?.name !== 'view' || prev?.style.display == 'inline-block')
              if (isBreak || prev && this.isInline(prev)) {
                this.setMaxLineHeight(index - 1, children, inlineBlockMax)
                this.setMaxLineWidth(index - 1, children, prevsWidth)
                if (isLast) {
                  this.setMaxLineHeight(index, children, inlineBlockMax)
                  this.setMaxLineWidth(index, children, item.offsetSize.width)
                  inlineBlockMax += item.offsetSize.height
                }
                count = sum + inlineBlockMax
                inlineBlockMax = item.offsetSize.height
                prevsWidth = item.offsetSize.width
                prev = item
                return count
              } else {
                prevsWidth = 0
                inlineBlockMax = 0
              }
              return sum + item.offsetSize.height
            } else {
              prevsWidth += item.offsetSize.width
              inlineBlockMax = (Math.max(inlineBlockMax, item.offsetSize.height) || 0)

              if (isLast) {
                let k = index
                this.setMaxLineHeight(index, children, inlineBlockMax)
                this.setMaxLineWidth(index, children, prevsWidth)
                return sum + inlineBlockMax
              }
              prev = item
              return sum
            }
          }
        }, 0)
        if (positionHeight) {
          config.height = positionHeight
        }
        this.layoutBoxUpdate(config, cstyle)
      } else {
        if (positionHeight) {
          config.height = positionHeight
        }
        this.layoutBoxUpdate(config, cstyle, 1)
      }
    } else if (children.length) {
      config.height = this.contrastSize(config.height, minHeight, maxHeight)
      this.layoutBoxUpdate(config, cstyle)
      let prev = null
      let prevsWidth = 0
      let inlineBlockMax = 0
      children.forEach((item, index) => {
        const isLast = index == children.length - 1
        item.getBoxHieght()
        if (item.isAbsolute || item.isFixed) {

        } else {
          // 如果是block或上个是block或宽度大于父级
          // prev?.offsetSize.left + prev?.offsetSize.width
          const isBreak = prevsWidth + item.offsetSize.width > config.left + config.width
          const isBlock = this.getBoxState(prev, item)
          if (isBreak || isBlock) {
            if (isBreak) {
              let k = index - 1
              while (k >= 0 && !children[k].contentSize.maxLineHeight) {
                if (inlineBlockMax < children[k].contentSize.height) {
                  inlineBlockMax = children[k].contentSize.height
                }
                k--
              }
              this.setMaxLineHeight(index - 1, children, inlineBlockMax)
              this.setMaxLineWidth(index - 1, children, prevsWidth)

              inlineBlockMax = 0
              prevsWidth = item.offsetSize.width
            }

            if (isLast) {
              this.setMaxLineWidth(index, children, item.offsetSize.width)
            }
          } else {
            prevsWidth += item.offsetSize.width
            if (isLast) {
              let k = index
              while (k >= 0 && !children[k].contentSize.maxLineHeight) {
                if (inlineBlockMax < children[k].contentSize.height) {
                  inlineBlockMax = children[k].contentSize.height
                }
                k--
              }
              this.setMaxLineHeight(index, children, inlineBlockMax)
              this.setMaxLineWidth(index, children, prevsWidth)
              inlineBlockMax = 0
              prevsWidth = item.offsetSize.width
            }

            prev = item
          }
        }
      });
    } else {
      config.height = this.contrastSize(config.height, minHeight, maxHeight)
      this.layoutBoxUpdate(config, cstyle, 1)
    }
    if (cstyle.borderRadius && this.borderSize?.width) {
      for (const key in cstyle.borderRadius) {
        if (Object.hasOwnProperty.call(cstyle.borderRadius, key)) {
          cstyle.borderRadius[key] = toPx(cstyle.borderRadius[key], this.borderSize.width)
        }
      }
    }
    return this.layoutBox
  }
  contrastSize(value, minValue, maxValue) {
    let val = value
    if (maxValue) {
      val = Math.min(val, maxValue)
    }
    if (minValue) {
      val = Math.max(val, minValue)
    }
    return val
  }
  measureText(text, fontSize) {
    let w = 0
    let h = 0
    const { width, actualBoundingBoxAscent } = this.ctx.measureText(text)
    w = width
    h = actualBoundingBoxAscent || fontSize * 0.7
    return {
      width: w,
      fontHeight: h + 1
    }
  }
  getBoxWidth() {
    const {
      name,
      computedStyle: cstyle,
      attributes,
      parent = { contentSize: {} },
      ctx
    } = this
    const children = this.getChildren()
    let {
      left: x = 0,
      top: y = 0,
      right: r,
      width: w = 0,
      minWidth,
      maxWidth,
      height: h = 0,
      fontSize = 14,
      fontWeight,
      fontFamily,
      fontStyle,
      position,
      display,
      lineClamp,
      padding: p = {},
      margin: m = {},
      border: { borderWidth = 0 } = {},
      borderRight: { borderRightWidth = borderWidth } = {},
      borderLeft: { borderLeftWidth = borderWidth } = {}
    } = cstyle;
    if (/%$/.test(w) && parent?.contentSize?.width) {
      w = toPx(w, parent?.contentSize?.width, true)
    }
    if (/%$/.test(h) && parent?.contentSize?.height) {
      h = toPx(h, parent.contentSize.height)
    }
    if (/%$/.test(minWidth) && parent.contentSize.width) {
      minWidth = toPx(minWidth, parent.contentSize.width, true)
    }
    if (/%$/.test(maxWidth) && parent.contentSize.width) {
      maxWidth = toPx(maxWidth, parent.contentSize.width, true)
    }
    if (cstyle.padding && parent.contentSize?.width) {
      for (const key in cstyle.padding) {
        if (Object.hasOwnProperty.call(cstyle.padding, key)) {
          cstyle.padding[key] = toPx(cstyle.padding[key], parent.contentSize.width)
        }
      }
    }
    let { paddingRight = 0, paddingLeft = 0 } = p
    if (cstyle.margin && [cstyle.margin.marginLeft, cstyle.margin.marginRight].includes('auto')) {
      if (w) {
        const marginOffset = (parent.contentSize.width - w - paddingRight - paddingLeft - borderLeftWidth - borderRightWidth) || 0
        if (cstyle.margin.marginLeft == cstyle.margin.marginRight) {
          cstyle.margin.marginLeft = cstyle.margin.marginRight = marginOffset / 2
        } else if (cstyle.margin.marginLeft == 'auto') {
          cstyle.margin.marginLeft = marginOffset
        } else {
          cstyle.margin.marginRight = marginOffset
        }
      } else {
        cstyle.margin.marginLeft = cstyle.margin.marginRight = 0
      }
    }
    let { marginRight = 0, marginLeft = 0 } = m
    const config = { width: w, height: h, left: 0, top: 0 }
    const offsetWidth = (paddingLeft + paddingRight + borderLeftWidth + borderRightWidth + marginLeft + marginRight)
    if (name == ELEMENT_TYPE.TEXT && !this.attributes.widths) {
      const text = attributes.text || ''
      ctx.save()
      ctx.setFonts({
        fontFamily,
        fontSize,
        fontWeight,
        fontStyle
      })
      const textMap = new Map()
      text.split('\n').map(text => {
        const widths = text.split('').map(t => {
          let w = textMap.get(t)
          if (w) return w
          let width = this.measureText(t, fontSize).width
          textMap.set(t, width)
          return width
        })
        this.attributes.fontHeight = this.measureText(text, fontSize).fontHeight
        if (!this.attributes.widths) {
          this.attributes.widths = []
        }
        this.attributes.widths.push({ widths, total: widths.reduce((a, c) => a + c, 0) })
      })
      ctx.restore()
    }
    if (name == ELEMENT_TYPE.IMAGE && w == null) {
      const { width: rWidth, height: rHeight } = attributes
      config.width = this.contrastSize(Math.round(rWidth * h / rHeight) || 0, minWidth, maxWidth)
      this.layoutBoxUpdate(config, cstyle, 0)
    }
    else if (!w) {
      let positionWidth = 0
      if ((this.isAbsolute || this.isFixed) && parent.contentSize.width && name != ELEMENT_TYPE.TEXT) {
        const isAB = position == 'absolute' ? parent.contentSize.width : this.root.width
        const left = /%$/.test(x) ? toPx(x, isAB) : x
        const right = /%$/.test(r) ? toPx(r, isAB) : r
        const width = isAB - left - right
        positionWidth = width
      }
      if (name == ELEMENT_TYPE.TEXT) {
        let { widths } = this.attributes
        let width = Math.max(...widths.map(v => v.total))
        if (parent && parent.contentSize.width > 0 && (width > parent.contentSize.width || display == DISPLAY.BLOCK) && !(this.isAbsolute || this.isFixed)) {
          const pwidth = parent.contentSize.width - offsetWidth
          width = pwidth
        }
        config.width = positionWidth ? positionWidth : this.contrastSize(width, minWidth, maxWidth)
        this.layoutBoxUpdate(config, cstyle, 0)
      }
      // view含有字节点继承父节点的宽度
      else if (name == ELEMENT_TYPE.VIEW && parent && display !== DISPLAY.INLINE_BLOCK && !(this.isAbsolute || this.isFixed)) {
        config.width = this.contrastSize(parent.contentSize.width - offsetWidth, minWidth, maxWidth)
        this.layoutBoxUpdate(config, cstyle)
        if (children.length) {
          children.forEach(element => {
            element.getBoxWidth()
          })
        }
      } else if (children.length) {
        let inlineBlockMax = 0;
        let prev = null;
        let index = 0;
        while (children.length > index) {
          const item = children[index]
          const isLast = index == children.length - 1
          const isBlock = this.getBoxState(prev, item)
          if (!(item.isFixed || item.isAbsolute)) {
            if (!prev || isBlock) {
              const res = item.getBoxWidth()
              inlineBlockMax = (Math.max(inlineBlockMax, res.width) || 0)
              prev = item
            } else if (prev.offsetSize.left + prev.offsetSize.width + item.offsetSize.width < parent.contentSize.width && index !== children.length - 1) {
              const res = item.getBoxWidth()
              inlineBlockMax += res.width
              prev = item
            } else {
              const res = item.getBoxWidth()
              if (isLast) {
                inlineBlockMax += res.width
              } else {
                inlineBlockMax = parent.contentSize.width
              }
              prev = null
            }
          } else {
            const res = item.getBoxWidth()
          }
          index++
        }
        config.width = positionWidth && y ? positionWidth : this.contrastSize(Math.ceil(inlineBlockMax), minWidth, maxWidth)
        children.forEach(item => {
          if (item.style.display == DISPLAY.BLOCK && item.name == ELEMENT_TYPE.TEXT && !(item.isFixed || item.isAbsolute) && !item.style.width) {
            item.style.width = config.width // - offsetWidth
            item.getBoxWidth()
          }
        })
        this.layoutBoxUpdate(config, cstyle, 0)
      } else {
        config.width = positionWidth
        this.layoutBoxUpdate(config, cstyle, 0)
      }
    } else if (children.length) {
      config.width = this.contrastSize(config.width, minWidth, maxWidth)
      this.layoutBoxUpdate(config, cstyle, 0)
      children.forEach(element => {
        element.getBoxWidth()
      })
    } else {
      config.width = this.contrastSize(config.width, minWidth, maxWidth)
      this.layoutBoxUpdate(config, cstyle, 0)
    }
    if (name == ELEMENT_TYPE.TEXT && !this.attributes.lines) {
      let lines = this.attributes.widths.length
      this.attributes.widths.forEach(item => item.widths.reduce((a, c, i) => {
        if (a + c > config.width) {
          lines++
          return c
        } else {
          return a + c
        }
      }, 0))
      lines = lineClamp && lines > lineClamp ? lineClamp : lines
      this.attributes.lines = lines
    }
    return this.layoutBox
  }
  layout() {
    this.getBoxWidth()
    this.getBoxHieght()
    this.getBoxPosition()
    // this.getTransform()
    return this.offsetSize
  }
}

