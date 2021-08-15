/*
 * @Author: SummerJay__
 * @Date: 2021-08-12 10:18:09
 * @LastEditTime: 2021-08-14 15:45:38
 * @LastEditors: your name
 * @Description: 请求模块，基于axios
 * @FilePath: \toutiao-publish-admin\src\utils\request.js
 */

// axios请求模块
import axios from 'axios'
import JSONBig from 'json-bigint'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const instance = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  timeout: 20000,
  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [
    function(data) {
      // Do whatever you want to transform the data
      // console.log(data)

      // 后端返回的数据可能不是 JSON 格式字符串
      // 如果不是的话，那么 JSONbig.parse 调用就会报错
      // 所以我们使用 try-catch 来捕获异常，处理异常的发生
      try {
        // 如果转换成功，则直接把结果返回
        return JSONBig.parse(data)
      } catch (err) {
        console.log('转换失败', err)
        // 如果转换失败了，则进入这里
        // 我们在这里把数据原封不动的直接返回给请求使用
        return data
      }

      // axios 默认在内部使用 JSON.parse 来转换处理原始数据
      // return JSON.parse(data)
    }
  ]
})

// 添加请求拦截器
instance.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  NProgress.start() // 开启进度条
  const user = JSON.parse(localStorage.getItem('USER_TOKEN'))

  // 如果有登录用户信息，则统一设置 token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 然后我们就可以在允许请求出去之前定制统一业务功能处理
  // 例如：统一的设置 token
  return config
})

// 添加响应拦截器
instance.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    NProgress.done() // 停止进度条
    return response
  },
  function(error) {
    // 对响应错误做点什么
    NProgress.done() // 停止进度条
    // 统一处理请求错误,
    alert('发送请求失败' + error.message || '未知错误')
    return Promise.reject(error)
  }
)

export default instance
