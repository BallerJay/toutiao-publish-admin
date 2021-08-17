/*
 * @Author: SummerJay__
 * @Date: 2021-08-11 22:29:33
<<<<<<< HEAD
 * @LastEditTime: 2021-08-17 14:43:58
=======
 * @LastEditTime: 2021-08-17 10:33:58
>>>>>>> fans
 * @LastEditors: your name
 * @Description:
 * @FilePath: \toutiao-publish-admin\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入全局样式
import '@/style/index.less'
// 引入elementUi
import '@/plugins/element'
import { ElementTiptapPlugin } from 'element-tiptap'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'

// 安装 element-tiptap 插件
Vue.use(ElementTiptapPlugin, { /* 插件配置项 */ lang: 'zh' })
// 现在你已经在全局注册了 `el-tiptap` 组件。
Vue.config.productionTip = false

new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  router,
  render: h => h(App)
}).$mount('#app')
