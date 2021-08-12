/*
 * @Author: SummerJay__
 * @Date: 2021-08-12 15:51:52
 * @LastEditTime: 2021-08-12 15:56:22
 * @LastEditors: your name
 * @Description: 用户相关请求模块
 * @FilePath: \toutiao-publish-admin\src\api\user.js
 */

import request from '@/utils/request'

// 用户登录
export const reqLogin = loginFormObj => {
  return request.post('/mp/v1_0/authorizations', loginFormObj)
}
