<!--
 * @Author: SummerJay__
 * @Date: 2021-08-12 22:12:50
 * @LastEditTime: 2021-08-13 15:06:08
 * @LastEditors: your name
 * @Description: 侧边栏组件
 * @FilePath: \toutiao-publish-admin\src\views\Layout\components\Aside.vue
-->

<template>
  <el-menu
    class="nav-menu"
    :default-active="$route.path"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
    :collapse-transition="false"
  >
    <div class="nav-header"></div>
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont iconimage"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont iconpublish"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="comment">
      <i class="iconfont iconcomment"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="el-icon-setting"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Aside',
  props: ['isCollapse'],
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>

<style lang='less' scoped>
.nav-menu {
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
  .nav-header {
    width: 100%;
    height: 60px;
    background: url('./logo_admin.png') no-repeat;
    margin-left: 15px;
    margin-top: 10px;
  }
}
</style>
