/*
 * @Author: SummerJay__
 * @Date: 2021-08-11 22:29:33
 * @LastEditTime: 2021-08-16 10:35:14
 * @LastEditors: your name
 * @Description:
 * @FilePath: \toutiao-publish-admin\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Layout from '@/views/Layout'
import Article from '@/views/Article'
import Publish from '@/views/Publish'
import Image from '@/views/Images'
import Comment from '@/views/Comment'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '', // path 为空，会作为默认子路由渲染
        component: Home
      },
      {
        path: '/article',
        component: Article
      },
      {
        path: '/publish',
        component: Publish
      },
      {
        path: '/image',
        component: Image
      },
      {
        path: '/comment',
        component: Comment
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局路由前置守卫,所有页面的导航都会经过这里
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login,校验登陆状态
  // 如果没有登录，则跳转到登录页面
  // 如果登录了,则允许通过
  const user = JSON.parse(localStorage.getItem('USER_TOKEN'))
  if (to.path !== '/login') {
    if (user) {
      // 已登录
      next()
    } else {
      // 未登录
      next('/login')
    }
  } else {
    next()
  }
  // if (user) {
  //   if (to.path === '/login') {
  //     next('/')
  //   } else {
  //     next()
  //   }
  // } else {
  //   if (from.path === '/login') {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  // }
})

export default router
