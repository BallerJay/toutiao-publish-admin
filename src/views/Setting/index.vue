<!--
 * @Author: SummerJay__
 * @Date: 2021-08-16 14:02:43
 * @LastEditTime: 2021-08-17 09:34:17
 * @LastEditors: your name
 * @Description: 个人设置组件开发
 * @FilePath: \toutiao-publish-admin\src\views\Setting\index.vue
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
            <el-breadcrumb-item>个人设置</el-breadcrumb-item>
          </el-breadcrumb>
        </span>
      </div>
      <!-- card body -->
      <el-row :gutter="20">
        <el-col :span="15"
          ><el-form
            :model="userInfo"
            label-width="70px"
            size="normal"
            ref="userInfoRef"
            :rules="userInfoRules"
          >
            <el-form-item label="编号">{{ userInfo.id }}</el-form-item>
            <el-form-item label="手机"> {{ userInfo.mobile }}</el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="userInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="userInfo.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="onUpdateUserInfo"
                :loading="updateProfileLoading"
                >保存</el-button
              >
            </el-form-item>
          </el-form></el-col
        >
        <el-col :span="6" :offset="2">
          <el-avatar
            shape="square"
            :size="200"
            fit="cover"
            :src="userInfo.photo"
          ></el-avatar>
          <p @click="$refs.file.click()" class="updateAvator">点击修改头像</p>
          <input type="file" ref="file" hidden @change="onFileChange" />

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
        </el-col>
      </el-row>
    </el-card>

    <!-- 修改头像的对话框 -->
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="30%"
      @opened="onDialogOpened"
    >
      <div class="preview-image-wrap">
        <img class="preview-image" :src="previewImage" ref="previewImage" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onUpdateAvator"
          :loading="updatePhotoLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reqUserProfile, reqUpdateUser, reqUpdateUserInfo } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'Setting',
  data() {
    return {
      userInfo: {
        id: '',
        name: '',
        mobile: '',
        intro: '',
        email: '',
        photo: '',
      }, // 用于存储用户资料
      userInfoRules: {
        name: [
          { required: true, message: '请输入媒体名称。', trigger: 'blur' },
          { min: 1, max: 7, message: '媒体名称的长度为1-7', trigger: 'blur' },
        ],
      },
      dialogVisible: false, // 控制修改头像对话框的显示与隐藏
      previewImage: '', // 预览图片
      cropper: null, // 裁切器实例
      updatePhotoLoading: false, // 更新用户头像loading状态
      updateProfileLoading: false, // 更新用户基本信息loading状态
    }
  },
  created() {
    this.loadUserInfo()
  },
  methods: {
    async loadUserInfo() {
      const { data: res } = await reqUserProfile()
      // console.log(res)
      if (res.message !== 'OK') {
        return this.$message.error('获取用户信息失败！')
      }
      this.userInfo = res.data
      this.$message.success('获取用户信息成功！')
    },
    onFileChange() {
      // 处理图片预览
      const file = this.$refs.file
      // console.log(file.files[0])
      const blobData = window.URL.createObjectURL(file.files[0])
      // console.log(blobData)
      this.previewImage = blobData
      this.dialogVisible = true

      // 解决选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },
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
        viewMode: 1,
        dragMode: 'none',
        aspectRatio: 1,
        cropBoxResizable: false,
        // 移动裁切器，会触发 crop 方法
        // crop(event) {
        // console.log(event.detail.x)
        // console.log(event.detail.y)
        // console.log(event.detail.width)
        // console.log(event.detail.height)
        // console.log(event.detail.rotate)
        // console.log(event.detail.scaleX)
        // console.log(event.detail.scaleY)
        // },
      })
    },
    // onDialogClosed() {
    //   // 对话框关闭，销毁裁切器
    //   this.cropper.destroy()
    //   this.dialogVisible = false
    // },

    onUpdateAvator() {
      // this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(async (file) => {
        // console.log(file)
        const fd = new FormData()
        fd.append('photo', file)
        // 请求提交 fd
        const { data: res } = await reqUpdateUser(fd)
        // console.log(res)
        if (res.message !== 'OK') {
          return this.$message.error('修改头像失败！')
        }
        this.dialogVisible = false
        // 直接把服务端返回的图片进行展示有点慢
        // this.userInfo.photo = res.data.photo
        // 建议直接把裁切结果的文件对象转为 blob 数据本地预览
        this.user.photo = window.URL.createObjectURL(file)
        // this.updatePhotoLoading = false
      })
    },
    onUpdateUserInfo() {
      this.$refs.userInfoRef.validate(async (valid) => {
        if (!valid) return
        this.updateProfileLoading = true
        const { data: res } = await reqUpdateUserInfo(this.userInfo)
        // console.log(res)
        if (res.message !== 'OK') {
          return this.$message.error('修改用户信息成功！')
        }
        this.$message.success('修改用户信息成功！')
        // 触发全局事件总线
        this.$bus.$emit('update-user', this.userInfo)
        this.updateProfileLoading = false
      })
    },
  },
}
</script>

<style lang='less' scoped>
.updateAvator:hover {
  cursor: pointer;
}
.preview-image-wrap {
  /* Ensure the size of the image fit the container perfectly */
  .preview-image {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
}
</style>
