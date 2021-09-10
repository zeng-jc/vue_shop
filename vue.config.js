module.exports = {
  configureWebpack: {
    resolve: {
      //'@': 'src', 脚手架中已经默认配置，但是此项被隐藏
      alias: {
        components: '@/components',
        views: '@/views',
        assets: '@/assets',
        router: '@/router',
        plugin: '@/plugin',
        http: '@/http',
        eventBus: '@/eventBus',
        common: '@/common'
      }
    }
  },
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app') //拿到默认入口文件
        .clear() //清空默认入口文件
        .add('./src/main-prod.js')
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')
    })
  }
}
