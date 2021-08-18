# Vue-黑马头条项目

## 发表文章组件

- // 请注意在此处点击按钮发表文章的时候，title的值为5-30个字符

## 处理删除文章时，文章列表数据的id超出最大长度的就解决方案

1. 安装 json-bigint  

```jsx
npm install json-bigint@0.3.0 -S
此处我安装的是低版本，
安装最新版本后，我的项目出现错误，所以我选择安装低版本
```

1. 在我们封装的axios文件中，我这里是request.js 文件中

```jsx
const instance = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  timeout: 20000,

	// 这里是我们要添加的代码
  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [
    function(data) {
      // Do whatever you want to transform the data
      // console.log(data)

      // 后端返回的数据可能不是 JSON 格式字符串
      // 如果不是的话，那么 JSONbig.parse 调用就会报错
      // 所以我们使用 try-catch 来捕获异常，处理异常的发生
      try {
        // 如果转换成功，则直接把结果返回
        return JSONBig.parse(data)
      } catch (err) {
        console.log('转换失败', err)
        // 如果转换失败了，则进入这里
        // 我们在这里把数据原封不动的直接返回给请求使用
        return data
      }

      // axios 默认在内部使用 JSON.parse 来转换处理原始数据
      // return JSON.parse(data)
    }
  ]
})
```

然后我们就会发现我们的article组件中获取到的所有文章列表articles中的id是一个对象了

1. 在我们点击删除按钮的点击事件中，修改代码

```jsx
onDeleteArticle(articleId) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
					//这里就是我们要修改的代码，把Id转换成字符串
          const res = await reqDelArticle(articleId.toString())
          // console.log(res)
          if (res.status !== 204) {
            this.$message.error('删除文章失败！')
          }
          this.$message({
            type: 'success',
            message: '删除文章成功!',
          })
          this.loadArticles(this.page)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
```

## 发布文章时的本地图片上传处理

- element-tiptap 富文本插件的使用

![image](https://github.com/BallerJay/toutiao-publish-admin/blob/master/images/Untitled.png)

上图描述了我们上传文件的时候，服务器与客户端之间的处理程序，以下的配置是为了当内容里面有图片地址的时候，我们把本地图片的地址封装成一个网络地址，另发请求，加快图片的加载速度

- 第一步，封装数据接口

```jsx
在接口文件中配置的上传文件的接口
// 上传图片素材
export const reqUploadImage = imageInfo => {
/**
   * 一般文件上传的接口都要求把请求头中的 Content-type 设置为 multipart/form-data
   * 但是我们使用 axios 上传文件的话不需要手动设置，你只要给 data 一个 FormData 对象即可
   */
  return request.post('/mp/v1_0/user/images', imageInfo)
}
```

- 默认是没有引入Image组件的

```jsx
import { Image } from 'element-tiptap'

// 在extensions中的Image配置很关键
extensions: [
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
```

## 个人设置里面头像修改和图片预览的处理方法

- 头像修改

```jsx
// 第一种方法
<el-avatar
    shape="square"
    :size="150"
    fit="cover"
    :src="userInfo.photo"
  ></el-avatar>
  <p @click="$refs.file.click()" class="updateAvator">点击修改头像</p>
  <input type="file" ref="file" hidden @change="onFileChange" />

// 第二种方法
  <!-- <label for="file">
    <el-avatar
      shape="square"
      :size="150"
      fit="cover"
      :src="user.photo"
    ></el-avatar>
    <p>点击修改头像</p>
  </label>
  <input
    id="file"
    type="file"
    ref="file"
    hidden
    @change="onFileChange"
  > -->
```

- 图片预览

```jsx
// 处理图片预览
  const file = this.$refs.file
  // console.log(file.files[0])
	// HTML5 新增的方法
  const blobData = window.URL.createObjectURL(file.files[0])
  // console.log(blobData)
```

## 图片裁切器

- 在这个项目里我们使用的是cropperjs

[GitHub - fengyuanchen/cropperjs: JavaScript image cropper.](https://github.com/fengyuanchen/cropperjs)

```jsx
// 第一步，把img放在一个div里面
<!-- Wrap the image or canvas element with a block element (container) -->
<div class="preview-image-wrap">
  <img class="preview-image" :src="previewImage" ref="previewImage" />
</div>

// 第二步 设置css
.preview-image-wrap {
  /* Ensure the size of the image fit the container perfectly */
  .preview-image {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
}

// 第三步 初始化裁切器
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

// 因为我们这个项目里是在ElementUI的Dialog组件中显示，所以我们为Dialog定义了一个opened事件
onDialogOpened() {
      // 图片裁切器必须基于 img 进行初始化
      // 注意: img 必须是可见状态才能正常完成初始化
      // 因为我们这里是要在对话框里面初始化裁切器
      // 所以这个初始化代码必须放在对话框完全打开的状态去初始化
      // 获取图片Dom节点
      const image = this.$refs.previewImage
      const cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        crop(event) {
          console.log(event.detail.x)
          console.log(event.detail.y)
          console.log(event.detail.width)
          console.log(event.detail.height)
          console.log(event.detail.rotate)
          console.log(event.detail.scaleX)
          console.log(event.detail.scaleY)
        },
      })
    },
```

- 解决在使用裁切器时图片不更新的问题

```jsx
/**
   * 第一次初始化好了以后，当预览裁切的图片发生了改变，裁切器默认是不会更新的
   * 如果需要预览图片发生变化更新方法如下:
   * 方法一: 裁切器 .replace 方法
   * 方法二: 销毁裁切器，重新初始化
   */
方法一: 给Dialog对话框定义一个closed事件 @closed="onDialogClosed"
onDialogClosed() {
   // 对话框关闭，销毁裁切器
   this.cropper.destroy()
   this.dialogVisible = false
 },

方法二: 在Dialog组件的opened事件中添加一个判断
onDialogOpened() {
  // 图片裁切器必须基于 img 进行初始化
  // 注意: img 必须是可见状态才能正常完成初始化
  // 因为我们这里是要在对话框里面初始化裁切器
  // 所以这个初始化代码必须放在对话框完全打开的状态去初始化
  // 获取图片Dom节点
  const image = this.$refs.previewImage

  /**
   * 第一次初始化好了以后，当预览裁切的图片发生了改变，裁切器默认是不会更新的
   * 如果需要预览图片发生变化更新方法如下:
   * 方法一: 裁切器 .replace 方法
   * 方法二: 销毁裁切器，重新初始化
   */
  if (this.cropper) {
    this.cropper.replace(this.previewImage)
    return
  }
  this.cropper = new Cropper(image, {
    aspectRatio: 16 / 9,
    crop(event) {
      console.log(event.detail.x)
      console.log(event.detail.y)
      console.log(event.detail.width)
      console.log(event.detail.height)
      console.log(event.detail.rotate)
      console.log(event.detail.scaleX)
      console.log(event.detail.scaleY)
    },
  })
},

// 方法二在效率方面要比方法一好
```

## GitHub Pages的使用

- 概念
    - GitHub Paes 是 GitHub 提供的一种免费托管静态网站的服务功能。什么是静态网站？他只能处理存粹的静态文件，例如 html、css、js、图片等资源，它不提供java、PHP、Node.js、Python等动态服务
