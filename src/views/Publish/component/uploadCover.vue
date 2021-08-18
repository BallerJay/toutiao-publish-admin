<!--
 * @Author: SummerJay__
 * @Date: 2021-08-17 15:00:44
 * @LastEditTime: 2021-08-18 11:34:56
 * @LastEditors: your name
 * @Description: 上传封面的组件
 * @FilePath: \toutiao-publish-admin\src\views\Publish\component\uploadCover.vue
-->

<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img class="cover-img" ref="coverImg" :src="value" />
    </div>

    <el-dialog
      title="选择封面"
      :visible.sync="uploadDialogVisible"
      width="50%"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="first">
          <ImgList
            :isShowAdd="false"
            :isShowAction="false"
            :isShowSelected="true"
            ref="imageList"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input type="file" @change="onFileChange" ref="file" />
          <img width="200" ref="previewImage" />
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImgList from '@/components/imgList.vue'
import { reqUploadImage } from '@/api/image'
export default {
  name: 'UploadCover',
  components: {
    ImgList,
  },
  props: ['value'],
  data() {
    return {
      uploadDialogVisible: false,
      activeName: 'first',
    }
  },
  created() {},
  methods: {
    showCoverSelect() {
      this.uploadDialogVisible = true
    },
    onFileChange() {
      // 实现图片预览功能
      const file = this.$refs.file.files[0]
      const blob = window.URL.createObjectURL(file)
      this.$refs.previewImage.src = blob
      // 防止用户选择同一个文件不触发 change 事件
      // this.$refs.file.value = ''
    },
    async onCoverConfirm() {
      // 如果
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          return this.$message.warning('请选择文件!')
        }
        const fd = new FormData()
        fd.append('image', file)
        const { data: res } = await reqUploadImage(fd)
        // console.log(res)
        if (res.message !== 'OK') {
          return this.$message.error('上传封面素材失败！')
        }
        // this.$refs.coverImg.src = res.data.url
        this.uploadDialogVisible = false
        // this.$emit('updateCover', res.data.url)
        this.$emit('input', res.data.url)
      } else if (this.activeName === 'first') {
        const imageList = this.$refs.imageList
        const selected = imageList.selected
        if (selected === null) {
          return this.$message.error('请选择封面图片！')
        }
        this.uploadDialogVisible = false
        this.$emit('input', imageList.imageList[selected].url)
      }
    },
  },
}
</script>

<style lang='less' scoped>
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-img {
    height: 120px;
    max-width: 100%;
  }
}
</style>
