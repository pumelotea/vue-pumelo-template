require("./build.info.js")
const FileManagerPlugin = require('filemanager-webpack-plugin')
let distName = 'dist'
if (process.env.NODE_ENV === 'test' ){
  distName = distName + '-test'
}

if (process.env.NODE_ENV === 'production' ){

}
let disPath = './'+distName
let zipPath ='./'+distName+'.zip'
module.exports = {
  lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV === 'development',
  css: {
    extract: true,
    // 是否构建样式地图，false 将提高构建速度
    sourceMap: false,
  },
  devServer: {
    disableHostCheck: true,
  },
  parallel: require('os').cpus().length > 1,
  configureWebpack: {  //webpack的相关配置在这里
    plugins: [
      new FileManagerPlugin({  //初始化 filemanager-webpack-plugin 插件实例
        onEnd: {
          delete: [   //首先需要删除项目根目录下的dist.zip
            zipPath
          ],
          archive: [ //然后我们选择dist文件夹将之打包成dist.zip并放在根目录
            {source: disPath, destination: zipPath},
          ]
        }
      })
    ]
  }
}
