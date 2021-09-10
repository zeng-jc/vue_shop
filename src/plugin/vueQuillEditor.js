import Vue from 'vue'
// 导入vue-quill-editor 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入vue-quill-editor 富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
