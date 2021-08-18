<!--
 * @Author: SummerJay__
 * @Date: 2021-08-14 10:38:53
 * @LastEditTime: 2021-08-18 11:33:02
 * @LastEditors: your name
 * @Description: 发布文章组件
 * @FilePath: \toutiao-publish-admin\src\views\Publish\index.vue
-->

<template>
  <div class="publish-container">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <span
          ><!-- card title -->
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{
              $route.query.id ? '修改文章' : '发表文章'
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <!-- card body -->
      <el-form
        :model="publishForm"
        label-width="60px"
        :inline="false"
        :rules="publishFormRules"
        ref="publishFormRef"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="publishForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="publishForm.content"></el-input> -->
          <el-tiptap
            v-model="publishForm.content"
            :extensions="extensions"
            height="350"
            placeholder="请输入文章内容"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="publishForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <template v-if="publishForm.cover.type > 0">
            <!-- <UploadCover
              v-for="(cover, index) in publishForm.cover.type"
              :key="cover"
              @updateCover="onUpdateCover(index, $event)"
              :coverImage="publishForm.cover.images[index]"
            /> -->
            <!-- 当你给子组件提供的数据即要使用还要修改，
            这个时候我们可以使用 v-model 简化数据绑定
            v-model="publishForm.cover.images[index]"
            相当于给子组件传递了一个名字叫value的数据
            :value='publishForm.cover.images[index]'
            默认监听 input 事件
            当事件发生时，它会让绑定数据 = 事件参数
            @input='publishForm.cover.images[index] = 事件参数'
            -->
            <UploadCover
              v-for="(cover, index) in publishForm.cover.type"
              :key="cover"
              v-model="publishForm.cover.images[index]"
            />
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="publishForm.channel_id" placeholder="请选择频道">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in channels"
              :key="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">{{
            $route.query.id ? '修改' : '发表'
          }}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  reqArticleChannels,
  reqAddArticle,
  reqUpdateArticle,
  reqGetArticle,
} from '@/api/article'
// import { ElementTiptap } from 'element-tiptap'
// import element-tiptap 样式
// import 'element-tiptap/lib/index.css'
import {
  // 需要的 extensions
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
} from 'element-tiptap'
import { reqUploadImage } from '@/api/image'
import UploadCover from './component/uploadCover.vue'
export default {
  name: 'Publish',
  components: {
    // 富文本编辑器
    'el-tiptap': ElementTiptap,
    UploadCover,
  },
  data() {
    return {
      publishForm: {
        title: '',
        content: '',
        cover: {
          type: 0, // -1-自动 0-无图 1-1张 3-3张
          images: [],
        },
        channel_id: null,
      },
      publishFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'blur',
          },
        ],
        content: [
          // { required: true, message: '请输入文章内容', trigger: 'change' },
          {
            validator(rule, value, callback) {
              if (value === '<p></p>') {
                callback(new Error('请输入文章内容'))
              } else {
                callback()
              }
            },
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' },
        ],
        channel_id: [{ required: true, message: '请选择文章频道！' }],
      },
      channels: [],
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image({
          // 默认会把图片生成base64字符串和内容存储在一起
          // 如果需要自定义图片上传
          async uploadRequest(file) {
            // console.log(file)
            // FormData 发送数据时会和form表单一样编码类型被设为 "multipart/form-data"
            const fd = new FormData()
            fd.append('image', file)
            const { data: res } = await reqUploadImage(fd)
            // console.log(res)
            return res.data.url
          }, // 图片的上传方法，返回一个 Promise<url>
        }),
      ],
    }
  },
  created() {
    this.loadChannels()
    // 由于我们发布和编辑共用的是同一个组件，所以要判断
    // 如果路由路径参数中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticleInfo()
    }
  },
  methods: {
    async loadChannels() {
      const { data: res } = await reqArticleChannels()
      // console.log(res)
      if (res.message !== 'OK') {
        return this.$message.error('获取频道列表数据失败！')
      }
      this.channels = res.data.channels
      this.$message.success('获取频道列表数据成功！')
    },
    // 点击发表按钮，发表文章
    onPublish(draft = false) {
      this.$refs.publishFormRef.validate(async (valid) => {
        if (!valid) return

        // 请注意在此处点击按钮发表文章的时候，title的值为5-30个字符
        // 如果是修改文章，则执行修改操作，否则执行添加操作
        if (this.$route.query.id) {
          // 执行修改操作
          const { data: res } = await reqUpdateArticle(
            this.$route.query.id,
            this.publishForm,
            draft
          )
          if (res.message !== 'OK') {
            return this.$message.error(draft ? '存入草稿' : '发布' + '成功！')
          }
          // console.log(res)
          this.$message.success(draft ? '存入草稿' : '发布' + '成功！')
          this.$router.push('/article')
        } else {
          const { data: res } = await reqAddArticle(this.publishForm, draft)
          // console.log(res)
          if (res.message !== 'OK') {
            return this.$message.error(draft ? '存入草稿' : '发布' + '成功！')
          }
          this.$message.success(draft ? '存入草稿' : '发布' + '成功！')
          this.$router.push('/article')
        }
      })
    },

    // 展示文章内容
    async loadArticleInfo() {
      const { data: res } = await reqGetArticle(this.$route.query.id)
      // console.log(res)
      if (res.message !== 'OK') {
        return this.$message.error('获取指定文章失败！')
      }
      this.$message.success('获取指定文章成功！')
      this.publishForm = res.data
    },
    onUpdateCover(index, url) {
      // console.log(url)
      this.publishForm.cover.images[index] = url
    },
  },
}
</script>

<style lang='less' scoped>
</style>
