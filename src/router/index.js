/*
 * @Author: SummerJay__
 * @Date: 2021-08-11 22:29:33
 * @LastEditTime: 2021-08-12 10:38:11
 * @LastEditors: your name
 * @Description:
 * @FilePath: \toutiao-publish-admin\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
