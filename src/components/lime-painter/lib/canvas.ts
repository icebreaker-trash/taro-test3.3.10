import { CanvasContext } from '@tarojs/taro';
import {PLATFORM} from '../utils/platform'
import {UNI_PLATFORM} from '../utils/constant'


export type CompatableContext = CanvasContext | CanvasRenderingContext2D;
interface FontOptions {
    fontFamily?: string
    fontSize?: string | number
    fontWeight?: string
    fontStyle?: string
}


export default function adaptor(ctx: CompatableContext) {
    ctx.setFonts = ({ fontFamily = 'sans-serif', fontSize = 14, fontWeight = 'normal', fontStyle = 'normal' }: FontOptions) => {
        if (PLATFORM == UNI_PLATFORM.MP_TOUTIAO) {
            fontWeight = fontWeight == 'bold' ? 'bold' : ''
            fontStyle = fontStyle == 'italic' ? 'italic' : ''
        }
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    }
    if (!ctx.draw) {
        return Object.assign(ctx, {
            setStrokeStyle(val: string) {
                ctx.strokeStyle = val;
            },
            setLineWidth(val: string) {
                ctx.lineWidth = val;
            },
            setLineCap(val: string) {
                ctx.lineCap = val;
            },
            setFillStyle(val: string) {
                ctx.fillStyle = val;
            },
            setFontSize(val: string) {
                ctx.font = `${String(val)}px sans-serif`;
            },
            setGlobalAlpha(val: string) {
                ctx.globalAlpha = val;
            },
            setLineJoin(val: string) {
                ctx.lineJoin = val;
            },
            setTextAlign(val: string) {
                ctx.textAlign = val;
            },
            setMiterLimit(val: string) {
                ctx.miterLimit = val;
            },
            setShadow(offsetX: string, offsetY: string, blur: string, color: string) {
                ctx.shadowOffsetX = offsetX;
                ctx.shadowOffsetY = offsetY;
                ctx.shadowBlur = blur;
                ctx.shadowColor = color;
            },
            setTextBaseline(val: string) {
                ctx.textBaseline = val;
            },
            createCircularGradient() { },
            draw() { },
        })
    } else {
        return ctx
    }
}
