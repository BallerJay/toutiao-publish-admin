<!--
 * @Author: SummerJay__
 * @Date: 2021-08-17 09:39:56
 * @LastEditTime: 2021-08-18 14:32:46
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
      <el-tabs v-model="activeName">
        <el-tab-pane label="粉丝列表" name="list">
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
        </el-tab-pane>
        <el-tab-pane label="粉丝图像" name="map">
          <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
          <div
            id="main"
            style="width: 600px; height: 400px; margin-top: 20px"
          ></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { reqFansList } from '@/api/user'
import * as echarts from 'echarts'

export default {
  name: 'Fans',
  data() {
    return {
      activeName: 'list',
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
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    var option = {
      title: {
        text: 'ECharts 入门示例',
      },
      tooltip: {},
      legend: {
        data: ['销量'],
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
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
  margin-top: 15px;
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
