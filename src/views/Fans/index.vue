<!--
 * @Author: SummerJay__
 * @Date: 2021-08-17 09:39:56
 * @LastEditTime: 2021-08-17 14:36:10
 * @LastEditors: your name
 * @Description: 粉丝管理组价的开发
 * @FilePath: \toutiao-publish-admin\src\views\Fans\index.vue
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
            <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
          </el-breadcrumb></span
        >
      </div>
      <!-- card body -->
      <el-radio-group v-model="value" size="small" @change="onHandleClick">
        <el-radio-button label="/fanlist">粉丝列表</el-radio-button>
        <el-radio-button label="/map">粉丝画像</el-radio-button>
      </el-radio-group>
      <router-view></router-view>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Fans',
  data() {
    return {
      value: '/fanslist',
    }
  },
  created() {},
  methods: {
    onHandleClick(value) {
      // console.log(value)
      this.$router.push(value + '')
    },
  },
}
</script>

<style lang='less' scoped>
</style>
