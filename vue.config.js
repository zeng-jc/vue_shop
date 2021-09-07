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
  }
}
