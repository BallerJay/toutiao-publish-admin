<!--
 * @Author: SummerJay__
 * @Date: 2021-08-15 15:02:36
 * @LastEditTime: 2021-08-18 09:41:33
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
      <!-- 图片列表 -->
      <ImgList />
    </el-card>
  </div>
</template>

<script>
import ImgList from '@/components/imgList.vue'
export default {
  name: 'Images',
  components: {
    ImgList,
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>

<style lang='less' scoped>
// .action-header {
//   padding-bottom: 20px;
//   display: flex;
//   justify-content: space-between;
// }
// .image-item {
//   position: relative;
// }
// .image-action {
//   height: 40px;
//   background-color: rgba(204, 204, 204, 0.5);
//   position: absolute;
//   bottom: 2px;
//   left: 5px;
//   right: 5px;
//   font-size: 25px;
//   display: flex;
//   justify-content: space-evenly;
//   align-items: center;
//   color: #fff;
// }
</style>
