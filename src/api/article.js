/*
 * @Author: SummerJay__
 * @Date: 2021-08-13 16:18:32
 * @LastEditTime: 2021-08-15 08:37:51
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

// 发表文章
export const reqAddArticle = (AddDataObj, draft = false) => {
  return request.post('/mp/v1_0/articles', AddDataObj, {
    params: {
      draft: draft // 是否存在草稿 true为草稿
    }
  })
  // return request({
  //   method: 'POST',
  //   url: '/mp/v1_0/articles',
  //   params: {
  //     draft // 是否存为草稿（true 为草稿）
  //   },
  //   data: AddDataObj
  // })
}

// 编辑文章
export const reqUpdateArticle = (articleId, updateDataObj, draft) => {
  return request.put(`/mp/v1_0/articles/${articleId}`, updateDataObj, {
    params: {
      draft
    }
  })
}

// 获取指定文章
export const reqGetArticle = articleId => {
  return request.get(`/mp/v1_0/articles/${articleId}`)
}
