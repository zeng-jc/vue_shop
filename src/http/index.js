import axios from "axios";
import API from "./api.js";

const instance = axios.create({
  baseURL: API.baseURL,
  timeout: "6000",
});

//请求拦截器
instance.interceptors.request.use(
  config => {
    //此处编写请求拦截代码，一般用于加载弹窗
    console.log("正在请求...");
    return config;
  },
  err => {
    console.log("请求失败", err);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  data => {
    console.log("响应成功");
    //该返回对象会绑定到响应对象中
    return data;
  },
  err => {
    console.log("响应失败", err);
  }
);

//options 接收 {method, url, params}
export default function(options = {}) {
  return instance({
    method: options.method,
    url: API[options.url],
    params: options.params,
  });
}
