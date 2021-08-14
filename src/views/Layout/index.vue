<!--
 * @Author: SummerJay__
 * @Date: 2021-08-12 21:48:29
 * @LastEditTime: 2021-08-13 14:54:11
 * @LastEditors: your name
 * @Description: 布局组局
 * @FilePath: \toutiao-publish-admin\src\views\Layout\index.vue
-->

<template>
  <el-container class="home-contaniner">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <Aside class="aside-menu" :isCollapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse,
            }"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>SummerJay头条后台管理</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img :src="user.photo" alt="" class="avatar" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!-- <span>
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item @click.native="userLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from './components/Aside.vue'
import { reqUserProfile } from '@/api/user'
export default {
  name: 'Layout',
  components: {
    Aside,
  },
  data() {
    return {
      user: {}, // 当前登陆用户信息
      isCollapse: false, // 侧边菜单栏的展示状态
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      const { data: res } = await reqUserProfile()
      // console.log(res)
      this.user = res.data
    },
    userLogout() {
      this.$confirm('确认退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          localStorage.removeItem('USER_TOKEN')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
      // 此点击事件需要添加 .native 修饰符，把组件的自定义事件转换为原生dom事件
      // console.log('log')
      // localStorage.removeItem('USER_TOKEN')
      // this.$router.push('/login')
    },
  },
}
</script>

<style lang='less' scoped>
.home-contaniner {
  // position: fixed;
  // top: 0;
  // left: 0;
  // bottom: 0;
  // right: 0;
  height: 100%;
}

.el-aside {
  background-color: #d3dce6;
  .aside-menu {
    height: 100%;
  }
}
.el-header {
  // background-color: #b3c0d1;
  border-bottom: 1px solid #ccc;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 15px;
  .avatar-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
.el-main {
  background-color: #e9eef3;
}
</style>
