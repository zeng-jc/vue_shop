import axios from 'axios'
import API from './api.js'

// 引入NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const instance = axios.create({
  baseURL: API.baseURL,
  timeout: '8000',
  method: 'GET'
})

//请求拦截器
instance.interceptors.request.use(
  config => {
    //此处编写请求拦截代码，一般用于加载弹窗，或者每个请求都需要携带的token
    console.log('正在请求...')
    NProgress.start()
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
  },
  err => {
    console.log('请求失败', err)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  res => {
    NProgress.done()
    console.log('响应成功')
    //该返回对象会绑定到响应对象中
    return res
  },
  err => {
    console.log('响应失败', err)
  }
)

//options 接收 {method, url, params/data}
export default function(options = {}) {
  return instance({
    method: options.method,
    url: (function() {
      const URL = options.url

      if (typeof URL === 'object') {
        //拿到动态 url
        let DynamicURL = API[URL.name]

        //将 DynamicURL 中对应的 key 进行替换
        for (const key of Object.keys(URL.params)) {
          DynamicURL = DynamicURL.replace(':' + key, URL.params[key])
        }

        return DynamicURL
      } else {
        return API[URL]
      }
    })(),
    //获取查询字符串参数
    params: options.params,
    //获取请求体字符串参数
    data: options.data
  })
}
