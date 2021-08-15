/*
 * @Author: SummerJay__
 * @Date: 2021-08-15 13:17:09
 * @LastEditTime: 2021-08-15 13:53:16
 * @LastEditors: your name
 * @Description: 素材请求相关模块
 * @FilePath: \toutiao-publish-admin\src\api\image.js
 */

import request from '@/utils/request'

// 上传图片素材
export const reqUploadImage = imageInfo => {
  /**
   * 一般文件上传的接口都要求把请求头中的 Content-type 设置为 multipart/form-data
   * 但是我们使用 axios 上传文件的话不需要手动设置，你只要给 data 一个 FormData 对象即可
   */
  return request.post('/mp/v1_0/user/images', imageInfo)
}
