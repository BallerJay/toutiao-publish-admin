<!--
 * @Author: SummerJay__
 * @Date: 2021-08-17 14:28:40
 * @LastEditTime: 2021-08-17 14:31:18
 * @LastEditors: your name
 * @Description: 粉丝列表组件开发
 * @FilePath: \toutiao-publish-admin\src\views\Fans\component\fans.vue
-->

<template>
  <div>
    <!-- 粉丝列表数据区域 -->
    <el-row :gutter="20">
      <el-col v-for="(item, index) in fansList" :key="index">
        <div class="fanBorder">
          <img
            src="http://toutiao-img.itheima.net/Fmtl3oZn-GJMa76hD9VR6E0w6yPA"
            alt=""
            class="avator"
          />
          <p>{{ item.name }}</p>
          <el-tag>+ 关注</el-tag>
        </div>
      </el-col>
    </el-row>
    <Map />
    <!-- 分页器区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page"
      :page-sizes="[20, 30, 40, 50]"
      :page-size.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { reqFansList } from '@/api/user'

export default {
  name: 'FansList',
  data() {
    return {
      fansOpt: '粉丝列表',
      page: 1,
      pageSize: 20,
      fansList: [],
      total: 0,
    }
  },
  created() {
    this.loadFansList()
  },
  methods: {
    async loadFansList(page = 1) {
      this.page = page
      const { data: res } = await reqFansList({
        page: this.page,
        // 注意此处传per_page大小的时候，后台接口规定只能在20-50之间
        per_page: this.pageSize,
      })
      // console.log(res)
      if (res.message !== 'OK') {
        return this.$message.error('获取粉丝列表数据失败！')
      }
      this.fansList = res.data.results
      this.total = res.data.total_count
      this.$message.success('获取粉丝列表数据成功！')
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.loadFansList(this.page)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.loadFansList(val)
    },
  },
}
</script>

<style lang='less' scoped>
.el-row {
  margin-top: 20px;
}
.fanBorder {
  width: 150px;
  height: 180px;
  border: 1px solid #ccc;
  text-align: center;
  .avator {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-top: 25px;
  }
}
</style>
