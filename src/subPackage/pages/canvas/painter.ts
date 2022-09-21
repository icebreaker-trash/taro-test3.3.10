/*
 * @Author: lsmi
 * @Date: 2022-05-24 21:19:59
 * @LastEditors: lsmi
 * @LastEditTime: 2022-05-28 23:27:31
 * @FilePath: \taro-tsx-temp\src\subPackage\pages\canvas\painter.ts
 */
// 海报图
export function drawPoster(data?) {
  return new Promise(function(resolve) {
    resolve(poster(data))
  })
}

function posterTest(data?){
  return {
    width: '550rpx',
    height: '876rpx',
    background: '#f4f5f7',
    views: [
      {
        type: 'text',
        text: 'https://www.sunniejs.cn/static/avatar.png',
        css: {
          width: '524rpx',
          top: '36rpx',
          left: '36rpx',
          background: '#5B89BA',
          padding: '20rpx 30rpx',
          textIndent: '20rpx',
          display: 'block',
        }
      },
      {
        type: 'text',
        text: `没有经济上的独立，就缺少自尊。\n没有思考上的独立，就缺少自主。没有人格上的独立，就缺少自信
        有时候不是别人冷漠，只是别人有他自己的事
        那些特别懂得自娱的人，其实都是孤独却又不愿轻易打破孤独的孩子。所以他们学会了独自一个人的快乐方式，而那种快乐，恰是最不容易失去的
  `,
        css: {
          width: '550rpx',
          top: '100rpx',
          left: '26rpx',
          background: '#5B89BA',
          padding: '20rpx 30rpx',
          fontSize: '36rpx',
          display: 'block',
          textIndent: '20rpx',
          id: 'text'
        }
      },
      {
        type: 'rect',
        css: {
          width: '550rpx',
          height: '200rpx',
          top: '400rpx',
          left: '0',
          color: '#81BA5B',
          borderRadius: '10rpx'
        }
      },
    ]
  }
}
function posterTest2(data?){
  return {
    width: '550rpx',
    height: '876rpx',
    background: '#f4f5f7',
    views: [
      {
        type: 'text',
        text: 'https://www.sunniejs.cn/static/avatar.png',
        css: {
          width: '524rpx',
          top: '36rpx',
          left: '36rpx',
          background: '#5B89BA',
          padding: '20rpx 30rpx',
          textIndent: '20rpx',
          display: 'block',
        }
      },
      {
        type: 'text',
        text: `没有经济上的独立，就缺少自尊。\n没有思考上的独立，就缺少自主。没有人格上的独立，就缺少自信
        有时候不是别人冷漠，只是别人有他自己的事
        那些特别懂得自娱的人，其实都是孤独却又不愿轻易打破孤独的孩子。所以他们学会了独自一个人的快乐方式，而那种快乐，恰是最不容易失去的
  `,
        css: {
          width: '550rpx',
          top: '100rpx',
          left: '26rpx',
          background: '#5B89BA',
          padding: '20rpx 30rpx',
          fontSize: '36rpx',
          display: 'block',
          textIndent: '20rpx',
          id: 'text'
        }
      },
      {
        type: 'rect',
        css: {
          width: '550rpx',
          height: '200rpx',
          top: ['800rpx', 'text'],
          left: '0',
          color: '#81BA5B',
          borderRadius: '10rpx'
        }
      },
    ]
  }
}

// demo 微信分享图
function poster(data?) {
  return {
    width: '550rpx',
    height: '876rpx',
    background: '#f4f5f7',
    views: [
      {
        type: 'image',
        url: 'https://www.sunniejs.cn/static/avatar.png',
        css: {
          top: '20rpx',
          left: '36rpx',
          borderRadius: '100%',
          width: '80rpx',
          height: '80rpx',
          borderWidth: '6rpx',
          borderColor: '#fff'
        }
      },
      {
        type: 'text',
        text: '乖摸摸头的小店,我设置了maxLines为1',
        css: {
          top: '48rpx',
          left: '136rpx',
          width: '360rpx',
          maxLines: 1,
          fontSize: '26rpx',
          fontWeight: 500
        }
      },
      {
        type: 'rect',
        css: {
          top: '120rpx',
          left: '12rpx',
          color: '#fff',
          width: '526rpx',
          height: '540rpx',
          borderRadius: '10rpx'
        }
      },
      {
        type: 'image',
        url: require('../../static/img/1.jpg'),
        css: {
          top: '150rpx',
          left: '25rpx',
          width: '332rpx',
          height: '332rpx'
        }
      },
      {
        type: 'image',
        url: 'https://tgoods.top1buyer.com/res/testfile/imgs/20190702180744/MR9600-Pink/2.jpg',
        css: {
          top: '150rpx',
          left: '364rpx',
          width: '160rpx',
          height: '160rpx'
        }
      },
      {
        type: 'image',
        url: 'https://tgoods.top1buyer.com/res/testfile/imgs/20190702180744/MR9600-Pink/3.jpg',
        css: {
          top: '320rpx',
          left: '364rpx',
          width: '160rpx',
          height: '160rpx',
        }
      },
      {
        type: 'text',
        text: '二手精选',
        css: {
          top: '507rpx',
          left: '27rpx',
          fontSize: '22rpx',
          color: '#02BE8A',
          padding: '3px 4px 3px 4px',
          borderRadius: '2rpx',
          background: 'rgba(2,190,138,0.1)'
        }
      },
      {
        type: 'text',
        text: '18987、安奈儿童装上衣条纹童装上衣条纹童装上衣 条纹童装上衣',
        css: {
          top: '507rpx',
          left: '25rpx',
          textIndent: '110rpx',
          color: '#666666',
          fontSize: '22rpx',
          width: '460rpx',
          lineHeight: '33rpx',
          maxLines: 2
        }
      },
      {
        type: 'text',
        text: '劲爆价:',
        css: {
          top: '608rpx',
          left: '26rpx',
          color: '#666666',
          fontSize: '24rpx'
        }
      },
      {
        id:'price',
        type: 'text',
        text: '¥392.00',
        css: {
          top: '601rpx',
          left: '116rpx',
          color: '#E5463E',
          fontSize: '36rpx',
          fontWeight: 'bold'
        }
      },
      {
        type: 'text',
        text: '¥259.00',
        css: {
          top: '609rpx',
          left: ['130rpx', 'price'],
          color: '#999999',
          fontSize: '26rpx',
          fontWeight: 'bold',
          textDecoration: 'line-through'
        }
      },
      {
        type: 'rect',
        css: {
          top: '647rpx',
          left: '439rpx',
          color: '#fff',
          width: '28rpx',
          height: '28rpx',
          rotate: 45
        }
      },
      {
        type: 'text',
        text: '长按或扫描二维码',
        css: {
          fontSize: '18rpx',
          color: '#999999',
          bottom: '22rpx',
          left: '385rpx'
        }
      },
      // base64
      {
        type: 'image',
        url:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAYCAYAAACcPeNkAAAMO0lEQVR4Xu1czW4byRHuGjHnBeVcksvCVN6ARuRDjjSwIuWj/AIB5EewHkF6BAvIC6yOFqkFrGMOVmC+QUxjL5scIgt7zUpTwdfsGtY0u6d7RpR2kyxPEqf/p776+aqaZH5Bn++/+lP/tnc7lCXtXH+4zF1ebt/vv3o2uO31Bl3mCK3l77/dHRJTH8+Y+OYP/7qa56550+3G4/1PzHR5cfHu9abHxnh7e5M3xhT9i4t3R/74e3sv3xZFeTadTrPfWdc1TiaT0SbmmUwm/bIs3hhjsKcHOTPZI8kfn588x4SdP8Xt7dnXP35c+APIuFzyzeDm6nSxvcu2DdHl4PrDC90ebZn52D42ZvH0y9VO7oI+PXk+Iub30n7w5araW2wOfB9rlzvv4snz94Z5FNtT7jj3bTeZTIbM9JGZTn2hmUwmUCyVAmuaazqdnsWeA8g4stnsvHa2EHxmes9MJyEQdtnbeLz/LTPdFEV5NJ1Ob2SM8Xj/I/6ezc6fdRnX74N5jDEHzHx0cTE92cSYoTGqA6sA0HEmJnoRskA+sNb+h6C6D7EZsmFrHcjQDZNZsw4l8ZFYDQ0uzB8CGtoUSsjYmFEFDIt3qmnnp9cf1g77vmcj+4udUccjr3WbTCaHzPQ2JDB7ey+PiThLkfogghUjosPZ7HwnBjTXBnO8agJq7j4nk8kBMwEAcx9QAoycuTBOWRYpBdMn4kNjzIKZokpG1l4U5bzLHn9+oImFy3wLWlhzgKatZM4UIQv33wA0AVNIAFMWrSzNgIjgSYQEG1YMFiQKtPF4H8py5IM057z9NnDnYJlhOYn4he8iiuUGMLCmpjnaKJjctXa12kGgQcuHNLtejO+qdbZoDmhwFQ3Rac3iEF2SMZf6uxjQDKwfK/eI6NKUvNRQBR2srCYP2JgqRoMLq/flu7N4hr3GXgQZPq7mJTNnU7eQul/vtjf/+se/Vm5Q7svNaddV2J1gAygi2DUvwlmxKNAAYmYCGLGv5N4ywPEWFqZJoAVAXYU+5zw33eYXAzSJ2WpxmgO8/i4KtMDJhBSGb+GaYjSfYAn73vlAQ/9Ngk1cuSahSFkZ5Yq9nk6np/5Y4/E+YmrrVhExFBaAZd1rxGPiNuYKZtN61FhrljWwLli9YW5sBYVQlgVcxNafoihPp9PpGv/QZqBHA1plsRTZURK9lrhKYjLilcVBHyZa6O800CrQLK0ZNHF1kABZaczcjxvbAM232m0ONtZ2k3EamD4iS8TAkiAW0cKAWLffLNi2/2FMWJWbFtwOxnZgxzzbEluJ++qICzzbESsUW48C2YKIn2kCJDS5W5uN752L2cj2qriv9WvMiQdTg4ZjNOeyNXVmwwfaVdu6u9sJsY5N8Q3AICxjaqHyXAvqYvv5t8bwgYDKJ0NA5Ze9XuU2YowUGYI24jaDui/Yxi73+miSZ5NAk0WJkGrAxIiLVR8B2TpLKW2EYFHAqbGOvgun4sQdWABYQ2FBm4CmQHaTAxq1PjCtAFs/ZdkEaG3czaa4t61AbIYMCVD1shABWpBFRAxF5q3VSh1iNIyNcYu73g7ybz7Qulok350UwDKXC6bipnd7u/CVSlN+TqcAHgJoyv2DJbCa3QHtJkaDp4DoxrDUt1gh3UfFZhUpoan3VbphSZuHgObiQ7x/KMM5EcN9bZWHVJYNJMqpnw5QoBQmEy5wkl20SpltbH+wWYumaPY2aCVj5sVt7yQW5DflzTCP/7xNjLbsy68GX/52FsqjdbVIPiESBawjXJAfbHJJHwFoFTMo787FVpez2XktV6meB3Ni+t07YAFIdgwfnLBERWEuAQ4/j+dbwxDQHDDh8gJkYBiTZEqDGwnAYqyz2ez8ld/uoVzHZexnDorCLJpo/2BStw3QUm1XQKozclJFsbJ4wjpqlxQBOPqtvtMu6mL7jwcAGdaQm7DW69VVHSErJW1Bitxt/XtEVAyYzZAMDyvm0lnzTQJtb+/lHhH/xWnVP19cvLuInbOKoyoB8xPIEHK/v09s6OeSdAZYEP+JADVZQeVmWUredyMjFm1YlmakLV5KnkLPYXGlyqMoypMQYPEcKYgu4xtjlcmaEggQQVAYmN/KpDC6sNTURF3LokAo5DBwaO+TD9EYzQloqxwVmfng+ipYEeADrSyMbddUEqUtTSylYa1iaQ6JyBINIFgASvu3i/8Q0zUBrQ7oNMU/Hu//YIz5nTv/f8xm57+PCYhKFlesof+ds27ZMhYjLJqA5ruqfgVHigwJJZcd0WOtFPPy/PXHKQtLxDRtLpVHzDyYGthUzAd39awszRCJfbCyy/XynMi6nkibPKMcQUfMkhvv+PFNEmiVy8r9eh4MLCKttAjzYuvuN0faRRUBppIHhqzb4NG3hBjQVpqEPvVKlCXDidwbXEFpH9u3ZUSNuRx8ubI1cm3YzNSL9YD2z9nsXEC31tUJNMqiKmHzc2oQCr8jM6FSZIj4w38Wc4EEaCAepFoEfX0yRuI3XQ7WJc8nrmUC+DbH13Smm0hc+3Gas6DHutxNrKqrNIHcgUFFtcz88YDmWzBFoNgyKea34o5p4gQx4NPrD2tFrDjYWp1hGEpnYCVTgl3XkuvJerH6KOVauo5mJKVioljuU6fpr++bb/bHRWHgOt6VpTn87rvzWWwPK+Ff1hkqVzIan2GsHDJEz+nAA3JESppsrsu5RzZhLQIfsrId58O4TXGmzfGlgNbWorlKGbFOc2Y+a1sHCeWmFVYNaNoaaUu0ZtE8ltFvq19Qstaxv3u4Yh7pxpCxydCK9m9iNHVBryeJiOXwlU/v15oxH+pYC1UoOvemXT5f0ItlzeQBcoF4llshsukKf5+5YybECYeOwVtLQMs+cgQfsV5ZFiPlwtnuWruL1Ql851vZJPmizziUsvDfgSTTU0DLVbSOwIFiRixn2ckudY1B7ykGkscCmq3uZ/PGkDkV9rLmhjUBrb97SAX1AQ7nPtpUAT6iNHRRsZ/ATsVoaYuZ+wpVu4b9dBit6uIF5kktnwM0cfdUZQgEcCiunEuYo1yqujGg2L0a+5czn96/JMKJGDm5IBuZYlZzz9MBzBZdM/NpURhUgnRiQGNzPppFI6ITuIDawtlFyRWT3FOJXG2JsY7Ib91tbVn627+a878ENGxP8mnLY40nol3bpIVxsR1YR1sP6uXRkLeylRk6V6csXJXTy51PRGBlzRqT6cmrOSG2NWhtltU1UdLF79PlKtCDAs0xdvb+kGHz2r+P9hhAwxyLJ7sfhWgBGylMZApoOdhfbO/CigZr6B4iOR1bk75a4tpYwXEu5Jp2bmthQmCB26o1fxNAdHFy07l6pVVRa7Zi/eL3yNqyrTnv2ymW1mmxBwXaQsVfkv/SFg13y+R2st4ksSUwlsIbqIgP3XtryqN9fvL8mHl5H0vT+PcBGnJ4hghur77vJDFRreYydRMi9wU3gAyFvlBouFuF5PLcWZtoMngTQNPrUQBBGdVarWIO0HSVR6oaY5PlUZscK/aOakCDBkZDBPoimPh/nQxZJZ+XTNzyVrS0lb+VIJ8KDZ6qFEHf3BhNb6oJaLo8ShLTyAuWWz99rJjOxNUg64IWWyOkEcjQgbCOS10Aqp+PJHm+dgdOVZDcF1R+f80G+vV+iKHQPnRNf5NASxX4KmsbZRB1jJlRtwi3Fa5vY9F07lk/OtAiC7MgycqjBdhIqUWU/NfPATS9r9hF0JCbV5VwBeJIyaMx0VnIwrrYEFa05lZKrJorBJlulq3zC/yEQeXaIeAvy6K6hye5ntQ1Gj1/CJwO6NaaCkAAPJe4NY4qt7/LEWJCHUilfArWED9dYD0D9ZsetWOQqpZYuVXqbMGmIqJA4bNmbVNWNDVu03OyVifyAd1d3PZOAZJU3WCo5vHz9u6nu8K80tUZMl9TfmzTFi0FtJjw15TL8kbDnEtebJV3l6GbCqFjtOVbxU9wM0c2/2arW+q/ldL1BeaQBjJ26N5YijDx1xWzgiBAdK4pdL0mVjWv76A5Qa9VgDTcuetcHxlJYGddz+n6rloHdW0mgpB1uVGsXb3cvJN/JSYWF/lV9k0XMbF+7LfLHmLnhPlzQZpz1n5iNNYnUOsXrN9rmjP2K1g+KeKsUVUokMpFNe3BWR+/uqf12vW+/EugRVEC3MiZbZTS13M+KNByBOXXNr+ewP/DCfwHtNUa1e3n2PsAAAAASUVORK5CYII=',
        css: {
          left: '26rpx',
          bottom: '22rpx',
          width: '218rpx',
          height: '24rpx'
        }
      },
      {
        type: 'qrcode',
        content: 'https://github.com/sunniejs/vue-canvas-poster',
        css: {
          bottom: '50rpx',
          right: '26rpx',
          color: '#000',
          width: '130rpx',
          height: '130rpx'
        }
      }
    ]
  }
  return {
    width: 580,
    height: 783,
    background: '#abcdef',
    views: [
      // {
      //   type: 'image',
      //   mode: 'aspectFill',
      //   width: 580,
      //   height: 200,
      //   url: 'https://img.zcool.cn/community/0144da628b01d00002c4212c18672e.jpg?x-oss-process=image/resize,m_fill,w_520,h_390,limit_0/auto-orient,1/sharpen,100/format,webp/quality,Q_100',
      //   top: 20,
      //   left: 20
      // }
    ]
  }
}

 
