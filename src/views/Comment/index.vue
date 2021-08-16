<!--
 * @Author: SummerJay__
 * @Date: 2021-08-16 10:33:24
 * @LastEditTime: 2021-08-16 13:56:42
 * @LastEditors: your name
 * @Description: 评论管理组件开发
 * @FilePath: \toutiao-publish-admin\src\views\Comment\index.vue
-->

<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span
          ><!-- card title -->
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>评论管理</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <!-- card body -->
      <el-table :data="commentsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
        ></el-table-column>
        <el-table-column
          prop="fans_comment_count"
          label="粉丝评论数"
        ></el-table-column>
        <el-table-column prop="comment_status" label="评论状态">
          <template slot-scope="scope">
            {{ scope.row.comment_status ? '正常' : '关闭' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.statusDisabled"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[20, 30, 40, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { reqArticle, reqUpdateCommentStatus } from '@/api/article'
export default {
  name: 'Comment',
  data() {
    return {
      commentsList: [],
      page: 1,
      pageSize: 20,
      total: 0,
    }
  },
  created() {
    this.loadCommentsList()
  },
  methods: {
    async loadCommentsList(page = 1) {
      this.page = page
      const { data: res } = await reqArticle({
        response_type: 'comment',
        page,
        per_page: this.pageSize,
      })
      // console.log(res)
      res.data.results.forEach((item) => {
        item.statusDisabled = false
      })
      if (res.message !== 'OK') {
        return this.$message.error('获取评论列表数据失败！')
      }
      this.pageSize = res.data.per_page
      this.total = res.data.total_count
      this.commentsList = res.data.results
      this.$message.success('获取评论列表数据成功！')
    },
    async onStatusChange(comment) {
      comment.statusDisabled = true
      const { data: res } = await reqUpdateCommentStatus(
        comment.id.toString(),
        comment.comment_status
      )
      console.log(res)
      if (res.message !== 'OK') {
        return this.$message.error('评论状态修改失败！')
      }
      this.$message.success('修改评论状态成功！')
      comment.statusDisabled = false
    },
    handleSizeChange(val) {
      this.loadCommentsList(1)
    },
    handleCurrentChange(val) {
      this.loadCommentsList(val)
    },
  },
}
</script>

<style lang='less' scoped>
</style>
