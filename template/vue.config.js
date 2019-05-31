require("./build.info.js")
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
  configureWebpack: (config) => {
    // 简单/基础配置，比如引入一个新插件

  },
}
