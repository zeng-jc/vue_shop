<template>
  <el-dialog
    title="添加用户"
    :visible.sync="dialogVisible"
    width="40%"
    @close="cleanForm"
    :close-on-click-modal="false"
  >
    <!-- 表单区域 -->
    <el-form
      :model="addUserForm"
      :rules="addUserRules"
      label-width="70px"
      status-icon
      ref="userFormRef"
    >
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="addUserForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="addUserForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" v-model="addUserForm.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model.number="addUserForm.mobile"></el-input>
      </el-form-item>

      <!-- 按钮区域 -->
      <el-row type="flex" justify="end">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"> 确 定 </el-button>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
const validMobile = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入电话号码'))
  } else if (value.toString().length <= 5) {
    callback(new Error('请输入正确位数手机号码'))
  } else {
    callback()
  }
}

import axios from 'axios'

export default {
  name: 'Dialog',
  data() {
    return {
      //控制对话框的显示隐藏
      dialogVisible: false,
      //表单数据对象
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //表单规则对象
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 16, message: '账号格式错误', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码格式错误', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 关闭时调用，关闭时清空表单
    cleanForm() {
      this.$refs.userFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.userFormRef.validate(async boo => {
        if (!boo) return

        const { data: result } = await this.$http({
          method: 'post',
          url: 'users',
          data: this.addUserForm,
        })

        console.log(result)

        if (result.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }

        this.$message.success('添加用户成功')
        this.dialogVisible = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>