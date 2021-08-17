/*
 * @Author: SummerJay__
 * @Date: 2021-08-12 15:51:52
 * @LastEditTime: 2021-08-17 09:59:46
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

// 修改用户头像
export const reqUpdateUser = photoInfo => {
  return request.patch('/mp/v1_0/user/photo', photoInfo)
}

// 修改用户基本信息
export const reqUpdateUserInfo = userInfo => {
  return request.patch('/mp/v1_0/user/profile', userInfo)
}

// 获取粉丝列表数据
export const reqFansList = params => {
  return request.get('/mp/v1_0/followers', {
    params
  })
}
