/*
 * @Author: SummerJay__
 * @Date: 2021-08-13 16:18:32
 * @LastEditTime: 2021-08-14 08:59:12
 * @LastEditors: your name
 * @Description:
 * @FilePath: \toutiao-publish-admin\src\api\article.js
 */

import request from '@/utils/request'

// 获取所有文章列表数据
export const reqArticle = params => {
  return request.get('/mp/v1_0/articles', { params })
}

// 获取文章的频道
export const reqArticleChannels = () => {
  return request.get('/mp/v1_0/channels')
}

// 删除文章
export const reqDelArticle = articleId => {
  return request.delete(`/mp/v1_0/articles/${articleId}`)
}
