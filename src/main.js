/*
 * @Author: SummerJay__
 * @Date: 2021-08-11 22:29:33
 * @LastEditTime: 2021-08-12 15:54:24
 * @LastEditors: your name
 * @Description:
 * @FilePath: \toutiao-publish-admin\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局样式
import '@/style/index.less'
// 引入elementUi
import '@/plugins/element'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
