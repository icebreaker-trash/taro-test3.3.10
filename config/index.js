import path from 'path'
import { TaroWeappTailwindcssWebpackPluginV5 } from 'weapp-tailwindcss-webpack-plugin'

const config = {
  projectName: 'taro_thin_temp_ts',
  compiler: 'webpack5',
  date: '2022-9-20',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  alias: {
    '@': path.resolve(__dirname, '..', 'src'),
    '~@': path.resolve(__dirname, '..', 'src'),
  },
  defineConstants: {
  },
  plugins: [
    //['@tarojs/plugin-react-devtools'],
    // ['@tarojs/plugin-html', {}], // 解析html
    // ['taro-plugin-compiler-optimization'],
    // ['@dcasia/mini-program-tailwind-webpack-plugin/dist/taro', { }]
  ],
  // copy: {
  //   patterns: [
  //     { from: 'src/subPackage/static/common/', to: `dist/${process.env.TARO_ENV}/staticCommon/`, ignore: ['*.js'] }, // 指定需要 copy 的目录
  //   ],
  //   options: {
  //   }
  // },
  sass: {
    resource: [path.resolve(__dirname, '..', 'src/static/scss/index.scss')]
  },
  framework: 'react',
  mini: {
    debugReact: true, // 错误提示就没有map文件
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    // 开启分包 分包把common放到自己的分包
    optimizeMainPackage: {
      enable: true,
      // 排除某个文件  把这个分包文件放到主包
      // exclude: [
      //   path.resolve(__dirname, '..', 'src/subMap/components/echarts-taro3-react/ec-canvas/echarts.min.js')
      // ]
    },
    webpackChain(chain, webpack) {
      chain.merge({
        // optimization: {
        //   minimize: true
        // },
        plugin: {
          install: {
            plugin: TaroWeappTailwindcssWebpackPluginV5,
            args: [
              {
                // 注意这一行(不传默认 react)
                framework: 'react' // 'vue2' / 'vue3'
              }
            ]
          }
        }
      })
    },
  },
  h5: {
    devServer: {
      compress: true,
      // host: 'abc.cc.com',
      host: 'abc.cc.com',
      // 这个才是有效
      public: 'abc.cc.com:80',
      disableHostCheck: true,
      port: 80,
      open: false,
      sockHost: 'abc.cc.com',
      sockPort: 80
    },
    router: {
      mode: 'browser' // 或者是 'browser' 'hash'
    },
    esnextModules: ["@taroify"],
    // publicPath: process.env.NODE_ENV === "development" ? "/" : "/taroify.com/h5",
    publicPath: '/',
    staticDirectory: "static",
    // output: {
    //   filename: "js/[name].[hash:8].js",
    //   chunkFilename: "chunk/[name].[chunkhash:8].js",
    // },
    // miniCssExtractPluginOption: {
    //   filename: "css/[name].[hash:8].css",
    //   chunkFilename: "chunk/[name].[chunkhash:8].css",
    // },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
