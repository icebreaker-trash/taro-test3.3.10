import Taro from "@tarojs/taro"
import { uni, PLATFORM } from "./platform"
import { UNI_PLATFORM } from './constant'
// const imageBus = {}
function biggerThan(v1: string, v2: string) {
  let v1Array: any[] = v1.split('.')
  let v2Array: any[] = v2.split('.')
  let update = false
  for (let index = 0; index < v2Array.length; index++) {
    let diff = v1Array[index] - v2Array[index]
    if (diff !== 0) {
      update = diff > 0
      break
    }
  }
  return update
}
function dataUrlToBase64(str: string) {
  let array = str.split(',')
  return array[array.length - 1]
}
export function base64ToPath(base64: string) {
  return new Promise(function (resolve, reject) {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64) || [];
    if (!/^rn/.test(PLATFORM) && !/^h5/.test(PLATFORM)) {
      const fs = Taro.getFileSystemManager()
      //自定义文件名
      if (!format) {
        reject(new Error('ERROR_BASE64SRC_PARSE'))
      }
      const time = new Date().getTime();
      const filePath = `${Taro.env.USER_DATA_PATH}/${time}.${format}`
      fs.writeFile({
        filePath,
        data: base64.replace(/^data:\S+\/\S+;base64,/, ''),
        encoding: 'base64',
        success() {
          resolve(filePath)
        },
        fail(err: any) {
          reject(err)
        }
      })
      return
    }
    if (PLATFORM == 'rn') {
      let extName: RegExpMatchArray | null | string = base64.split(',')[0].match(/data\:\S+\/(\S+);/)
      if (extName) {
        extName = extName[1]
      } else {
        reject(new Error('base64 error'))
      }
      let fileName = Date.now() + '.' + extName

      let basePath = '_doc'
      let dirPath = 'taro_app_temp'
      let filePath = basePath + '/' + dirPath + '/' + fileName
      if (!biggerThan(plus.os.name === 'Android' ? '1.9.9.80627' : '1.9.9.80472', plus.runtime.innerVersion)) {
        plus.io.resolveLocalFileSystemURL(basePath, function (entry: any) {
          entry.getDirectory(dirPath, {
            create: true,
            exclusive: false,
          }, function (entry: any) {
            entry.getFile(fileName, {
              create: true,
              exclusive: false,
            }, function (entry: any) {
              entry.createWriter(function (writer: any) {
                writer.onwrite = function () {
                  resolve(filePath)
                }
                writer.onerror = reject
                writer.seek(0)
                writer.writeAsBinary(dataUrlToBase64(base64))
              }, reject)
            }, reject)
          }, reject)
        }, reject)
        return
      }
      let bitmap = new plus.nativeObj.Bitmap(fileName)
      bitmap.loadBase64Data(base64, function () {
        bitmap.save(filePath, {}, function () {
          bitmap.clear()
          resolve(filePath)
        }, function (error: any) {
          bitmap.clear()
          reject(error)
        })
      }, function (error: any) {
        bitmap.clear()
        reject(error)
      })
      return
    }
    reject(new Error('not support'))
  })
}

export function downloadFile(path: string) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url: path,
      success: (res: any) => {
        resolve(res.tempFilePath)
      },
      fail: reject
    })
  })
}

export function getImageInfo(path: string, Image: any): Promise<ImageInfo> {

  return new Promise(async (resolve, reject) => {
    // if(imageBus[path] && isCache) {
    //     return resolve(imageBus[path])
    // }
    let src = path
    const isBase64 = /data:image\/(\w+);base64,(.*)/.test(path)
    try {
      if (!isBase64 && PLATFORM == 'rn' && !/^\/?(static|_doc)\//.test(src)) {
        src = await downloadFile(path) as string
      } else if ((PLATFORM == 'rn' || !/^h5/.test(PLATFORM)) && isBase64) {
        src = await base64ToPath(path) as string
      }
    } catch (error: any) {
      reject({ ...error, src })
    }
    Taro.getImageInfo({
      src,
      success: (res: any) => {
        if (['right', 'left'].includes(res.orientation)) {
          const { width, height } = res
          res.width = height
          res.height = width
        }
        // const { MP_WEIXIN, MP_BAIDU, MP_QQ, MP_TOUTIAO } = UNI_PLATFORM
        if (['weapp', 'swan', 'qq', 'tt'].includes(PLATFORM)) {
          const localReg = /^\.|^\/(?=[^\/])/;
          res.path = localReg.test(src) ? `/${res.path}` : res.path;
        }
        if (Image) {
          let image = Image.createImage ? Image.createImage() : Image
          image.onload = () => {
            res.path = image
            resolve(res)
          }
          image.onerror = reject
          image.src = res.path
        } else {
          resolve(res)
        }
        // imageBus[path] = res
        // resolve(res)
      },
      fail: (error: any) => {
        reject({ ...error, src })
      }
    })
  }
  );
}