/*
 * @Author: SummerJay__
 * @Date: 2021-08-12 10:18:09
 * @LastEditTime: 2021-08-13 13:42:01
 * @LastEditors: your name
 * @Description: 请求模块，基于axios
 * @FilePath: \toutiao-publish-admin\src\utils\request.js
 */

// axios请求模块
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const instance = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  timeout: 20000
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
