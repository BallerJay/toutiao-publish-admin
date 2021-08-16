<!--
 * @Author: SummerJay__
 * @Date: 2021-08-15 15:02:36
 * @LastEditTime: 2021-08-16 10:17:13
 * @LastEditors: your name
 * @Description: 素材管理组件
 * @FilePath: \toutiao-publish-admin\src\views\Images\index.vue
-->

<template>
  <div class="image-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span
          ><!-- card title -->
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>素材管理</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <!-- card body -->
      <div class="action-header">
        <el-radio-group
          v-model="collect"
          size="small"
          @change="loadImagesList(1)"
        >
          <el-radio-button label="false">全部</el-radio-button>
          <el-radio-button label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size="small"
          type="success"
          @click="dialogUploadVisible = true"
          >上传素材</el-button
        >
      </div>
      <!-- 图片列表 -->
      <el-row :gutter="10">
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          v-for="(item, index) in imageList"
          :key="index"
          class="image-item"
        >
          <el-image
            style="height: 100px"
            :src="item.url"
            fit="cover"
          ></el-image>
          <div class="image-action">
            <el-button
              type="warning"
              size="small"
              :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              circle
              @click="onCollect(item)"
              :loading="item.loading"
            >
            </el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete-solid"
              circle
              @click="onDelImage(item)"
              :loading="item.loading"
            ></el-button>

            <!-- <i
              :class="{
                'el-icon-star-on': item.is_collected,
                'el-icon-star-off': !item.is_collected,
              }"
              @click="onCollect(item)"
            ></i> -->
            <!-- <i class="el-icon-delete-solid"></i> -->
          </div>
        </el-col>
      </el-row>
      <el-pagination
        background
        :page-size="pageSize"
        :current-page.sync="page"
        :total="total"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="onPageChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </el-card>

    <!-- 上传素材的对话框 -->
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >
      <!-- upload 组价本身就支持请求提交上传操作，
      说白了你使用它不用自己去写请求方法，upload组价会自动发 
      1. 请求方法 默认是就是post
      2. 请求路径，一定是完整路径 action
      3. 请求头 headerss
      4. 上传文件字段名 name

      v-if="dialogUploadVisible" 清除上次上传文件的信息 或者直接设置 :file-list="true"
      -->
      <el-upload
        v-if="dialogUploadVisible"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { reqImagesList, reqCollectImage, reqDelImage } from '@/api/image'
export default {
  name: 'Images',
  data() {
    const user = JSON.parse(window.localStorage.getItem('USER_TOKEN'))
    return {
      collect: false, // 默认查询全部
      imageList: [], // 图片素材列表
      dialogUploadVisible: false, // 控制上传对话框的显示与隐藏
      // 设置上传图片的请求头
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      page: 1,
      total: 0,
      pageSize: 10, // 每页大小
    }
  },
  created() {
    this.loadImagesList()
  },
  methods: {
    async loadImagesList(page = 1) {
      // 重置高亮页码
      this.page = page
      const { data: res } = await reqImagesList({
        collect: this.collect,
        page: this.page,
        per_page: this.pageSize,
      })
      if (res.message !== 'OK') {
        return this.$message.error('获取素材列表数据失败！')
      }
      // console.log(res)
      res.data.results.forEach((item) => {
        item.loading = false
      })
      this.total = res.data.total_count
      this.imageList = res.data.results
    },
    onUploadSuccess() {
      this.dialogUploadVisible = false
      this.loadImagesList(this.page)
    },
    onPageChange(page) {
      // console.log(page)
      this.page = page
      this.loadImagesList(page)
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.loadImagesList(this.page)
    },
    // 收藏操作的方法
    async onCollect(image) {
      image.loading = true
      // console.log(image)
      const { data: res } = await reqCollectImage(image.id, !image.is_collected)
      // console.log(res)
      if (res.message !== 'OK') {
        return this.$message.error(
          image.is_collected ? '取消收藏失败！' : '收藏失败！'
        )
      }
      image.is_collected = !image.is_collected
      image.loading = false
      this.$message.success(res.data.collect ? '收藏成功！' : '取消收藏！')
    },
    // 点击删除按钮删除素材
    async onDelImage(image) {
      image.loading = true
      const res = await reqDelImage(image.id)
      console.log(res)
      if (res.status !== 204) {
        return this.$message.error('删除素材失败！')
      }
      image.loading = false
      this.$message.success('删除素材成功！')
      this.loadImagesList(this.page)
    },
  },
}
</script>

<style lang='less' scoped>
.action-header {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-item {
  position: relative;
}
.image-action {
  height: 40px;
  background-color: rgba(204, 204, 204, 0.5);
  position: absolute;
  bottom: 2px;
  left: 5px;
  right: 5px;
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #fff;
}
</style>
