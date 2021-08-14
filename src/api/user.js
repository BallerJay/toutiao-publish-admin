/*
 * @Author: SummerJay__
 * @Date: 2021-08-12 15:51:52
 * @LastEditTime: 2021-08-13 16:18:23
 * @LastEditors: your name
 * @Description: 用户相关请求模块
 * @FilePath: \toutiao-publish-admin\src\api\user.js
 */

import request from '@/utils/request'

// 用户登录
export const reqLogin = loginFormObj => {
  return request.post('/mp/v1_0/authorizations', loginFormObj)
}

// 获取用户信息
export const reqUserProfile = () => {
  // const user = JSON.parse(localStorage.getItem('USER_TOKEN'))

  // console.log(user)
  return request.get('/mp/v1_0/user/profile')
  // return request({
  //   method: 'GET',
  //   url: '/mp/v1_0/user/profile',
  //   headers: {
  //     Authorization: `Bearer ${user.token}`
  //   }
  // })
}
