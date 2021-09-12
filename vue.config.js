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
    // 生产环境
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app') //拿到默认入口文件
        .clear() //清空默认入口文件
        .add('./src/main-prod.js')

      config.set('externals', {
        vue: 'Vue',
        'element-ui': 'ELEMENT',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 控制 cdn 的加载（给html这个插件自定义一个 isProd 属性，可以根据这个值加载首页）
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })

    // 开发环境
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      // 控制 cdn 的加载
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
