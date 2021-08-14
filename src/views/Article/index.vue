<!--
 * @Author: SummerJay__
 * @Date: 2021-08-13 14:59:29
 * @LastEditTime: 2021-08-14 10:18:34
 * @LastEditors: your name
 * @Description: 内容管理组件
 * @FilePath: \toutiao-publish-admin\src\views\Article\index.vue
-->

<template>
  <div class="article-container">
    <el-card
      shadow="always"
      :body-style="{ padding: '20px' }"
      class="filter-card"
    >
      <div slot="header">
        <span
          ><!-- card title -->
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <!-- card body -->
      <!-- 数据筛选表单 -->
      <el-form :model="form" ref="form" label-width="40px">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in channels"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeData"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- button 按钮的点击事件有默认参数，当么有指定参数的时候，他会默认传递一个没用的数据 -->
          <!-- <el-button type="primary" @click="loadArticles">查询</el-button> -->
          <el-button type="primary" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span>根据筛选条件共查询到 {{ total }} 结果</span>
      </div>
      <!-- card body -->
      <!-- 数据列表 -->
      <el-table
        :data="articles"
        style="width: 100%"
        border
        stripe
        v-loading="loading"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.cover.images[0]"
              fit="cover"
              :lazy="true"
              class="article-cover"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>

            <!-- <img
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0]"
              alt=""
              class="article-cover"
            />
            <img v-else src="./pic_bg.png" alt="" class="article-cover" /> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- <el-tag type="warning" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2"
              >审核通过</el-tag
            >
            <el-tag type="danger" v-else-if="scope.row.status === 3"
              >审核失败</el-tag
            >
            <el-tag type="info" v-else>已删除</el-tag> -->
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        :disabled="loading"
        :current-page.sync="page"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { reqArticle, reqArticleChannels, reqDelArticle } from '@/api/article'
export default {
  name: 'Article',
  data() {
    return {
      // 所有的文章数据列表
      articles: [],
      // 优化文章状态的数据
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' }, // 0
        { status: 1, text: '待审核', type: '' }, // 1
        { status: 2, text: '审核通过', type: 'success' }, // 2
        { status: 3, text: '审核失败', type: 'warning' }, // 3
        { status: 4, text: '已删除', type: 'danger' }, // 4
      ],
      total: 0, // 文章列表数据的总条数
      page: 1, // 当前页码
      pageSize: 10, // 每页大小
      status: null, // 文章的状态，不传就是全部
      form: {
        // name: '',
        // region: '',
        // delivery: false,
        // type: [],
        // resource: '',
      },
      // 文章频道数据列表
      channels: [],
      // 查询文章的频道
      channelId: null,
      // 筛选的范围日期
      rangeData: null,
      loading: true, // 表格数据加载中 loading
    }
  },
  created() {
    this.loadArticles()
    this.loadChannels()
  },
  methods: {
    async loadArticles(page = 1) {
      this.loading = true
      const { data: res } = await reqArticle({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeData ? this.rangeData[0] : null, // 开始日期
        end_pubdate: this.rangeData ? this.rangeData[1] : null, // 截止日期
      })
      // console.log(res)
      if (res.message !== 'OK') {
        return this.$message.error('获取文章列表数据失败！')
      }
      this.articles = res.data.results
      this.total = res.data.total_count
      this.pageSize = res.data.per_page
      this.loading = false
      this.$message.success('获取文章列表数据成功！')
    },
    async loadChannels() {
      const { data: res } = await reqArticleChannels()
      // console.log(res)
      this.channels = res.data.channels
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.loadArticles()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.loadArticles(val)
    },
    onDeleteArticle(articleId) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const res = await reqDelArticle(articleId)
          // console.log(res)
          if (res.status !== 204) {
            this.$message.error('删除文章失败！')
          }
          this.$message({
            type: 'success',
            message: '删除文章成功!',
          })
          this.loadArticles(this.page)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>

<style lang='less' scoped>
.filter-card {
  margin-bottom: 30px;
}
.el-table {
  margin-bottom: 30px;
}
.article-cover {
  width: 50px;
  background-size: cover;
}
</style>
