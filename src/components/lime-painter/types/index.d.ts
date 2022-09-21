declare var wx: Uni
declare var tt: Uni
declare var plus: Uni
declare var uni: Uni;

declare interface Uni {
    upx2px: Function
    getSystemInfoSync: Function
    getImageInfo: Function
    downloadFile?: Function|any
    addInterceptor?: any
    getFileSystemManager?: any
    runtime?: any
    os?: any
    io?: any
    nativeObj?: any
    env?: any
}
declare interface ImageInfo {
    width: number
    height: number
    path: string
}
// declare class Image {
//     src: string
//     onload(v: any): void;
//     onerror(v: any): void;
//     success(v: any): void;
//     fail(v: any): void;
//     naturalWidth: number
//     naturalHeight: number
// }
declare interface Window {
    // innerWidth: any
    Painter: any
}
