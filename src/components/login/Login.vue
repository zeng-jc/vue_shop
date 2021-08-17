<template>
  <section id="login">
    <div class="login_box">
      <!-- 表单头部 -->
      <h3 class="login_title">管理系统</h3>
      <!-- 表单输入区域 -->
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入内容"
            clearable
            prefix-icon="iconfont icon-zhanghao"
            @keyup.enter.native="login"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入内容"
            clearable
            prefix-icon="iconfont icon-mima"
            @keyup.enter.native="login"
          >
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-row type="flex" justify="end" class="login_btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-row>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      //表单的数据对象
      loginForm: {
        username: '',
        password: '',
      },
      //表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 4, max: 16, message: '账号格式错误', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码格式错误', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      //登录前需要对整个表单进行校验检查，需要使用 validate(Boolean,Object)
      this.$refs.loginFormRef.validate(async boo => {
        if (!boo) return
        const { data } = await this.$http({
          method: 'POST',
          url: 'login',
          params: this.loginForm,
        })
        if (data.meta.status !== 200) {
          this.$message.error('登录失败，账号或密码错误')
        } else {
          this.$message.success('登录成功')
          /**1.将token保存到 sessionStorage 中
           *  - token 只在当前网站打开期间生效，所以将 token 保存在 sessionStorage中
           *  - 项目中除了登录页面，其他页面只能在登陆后访问（通过导航守卫控制）
           */
          sessionStorage.setItem('token', data.data.token)
          //2.跳转到主页
          this.$router.push('/home')
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
#login {
  height: 100vh;
  overflow: hidden;
  background-color: #e5e5e5;
}

.login_box {
  width: 400px;
  height: 310px;
  background-color: #fff;
  box-shadow: 0 0 25px #e4e4e4;
  border-radius: 10px;
  border: 1px solid #eaeaea;
  margin: 10% auto 0;

  .login_title {
    color: #212121;
    text-align: center;
    margin: 30px 0;
  }

  .login_form {
    padding: 0 20px;
  }

  .login_btn {
    padding-top: 20px;
  }
}
</style>
