import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from './http'

// 导入全局样式表
import 'assets/css/global.css'

// 导入elementui
import 'plugin/element.js'

// 导入字体图标
import 'assets/fonts/iconfont.css'

// 导入vue-quill-editor 富文本编辑器
import 'plugin/vueQuillEditor.js'

Vue.prototype.$http = http

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
