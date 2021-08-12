<!--
 * @Author: SummerJay__
 * @Date: 2021-08-12 10:34:40
 * @LastEditTime: 2021-08-12 16:16:41
 * @LastEditors: your name
 * @Description: 登陆组件
 * @FilePath: \toutiao-publish-admin\src\views\Login\index.vue
-->

<template>
  <div class="login-container">
    <el-card shadow="always" :body-style="{ padding: '30px' }">
      <div slot="header">
        <span
          ><!-- card title -->
          <div class="login-header"></div>
        </span>
      </div>
      <!-- card body -->
      <el-form
        :model="loginForm"
        ref="loginFormRef"
        :rules="loginFormRules"
        size="normal"
      >
        <el-form-item prop="mobile">
          <el-input
            v-model="loginForm.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="loginForm.code"
            placeholder="请输入验证码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="loginForm.agree"
            >我已阅读并同意用户协议和隐私条款</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onLogin"
            style="width: 100%"
            :loading="loginLoading"
            >登陆</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { reqLogin } from '@/api/user.js'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        mobile: '',
        code: '',
        agree: false, // 是否同意协议
      },
      loginFormRules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号!',
            trigger: 'blur',
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: '请输入正确的手机号格式。长度为11',
            trigger: 'blur',
          },
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空!',
            trigger: 'blur',
          },
          {
            pattern: /^\d{6}$/,
            message: '请输入正确的验证码格式。长度为6',
          },
        ],
        agree: [
          {
            /**
             * 自定义校验规则
             * 验证通过: callback()
             * 验证失败: callback(new Error('错误消息'))
             */
            validator: (rule, value, callback) => {
              // console.log(rule, value)
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议。'))
              }
            },
            trigger: 'change',
          },
        ],
      },
      // 登陆时的 loading状态
      loginLoading: false,
    }
  },
  created() {},
  methods: {
    onLogin() {
      // console.log('submit!')
      // 获取表单数据,根据接口要求绑定数据
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 开启登陆的loading
        this.loginLoading = true
        try {
          const res = await reqLogin(this.loginForm)
          console.log(res)
          this.$message.success('登陆成功！')
          this.loginLoading = false
        } catch (error) {
          this.$message.error('登录失败,手机号或验证码错误！')
          this.loginLoading = false
        }
        // this.loginLoading = true
        // this.$http
        //   .post('/mp/v1_0/authorizations', this.loginForm)
        //   .then((res) => {
        //     console.log(res)
        //     this.$message.success('登陆成功！')
        //     this.loginLoading = false
        //   })
        //   .catch((err) => {
        //     console.log('登录失败！', err.message)
        //     this.$message.error('登录失败，手机号或验证码错误！')
        //     this.loginLoading = false
        //   })
      })
    },
  },
}
</script>

<style lang='less' scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('./login_bg.jpg') no-repeat;
  background-size: cover;
  .login-header {
    width: 300px;
    height: 57px;
    background: url('./logo_index.png') no-repeat;
    margin-left: 45px;
  }
  .el-form {
    min-width: 300px;
  }
}
</style>
