<template>
  <section>
    <!-- 用户列表区域 -->
    <el-table :data="users" border stripe>
      <!-- 下标 -->
      <el-table-column type="index" width="50"> </el-table-column>
      <!-- 姓名 -->
      <el-table-column label="姓名" prop="username"> </el-table-column>
      <!-- 邮箱 -->
      <el-table-column label="邮箱" prop="email"> </el-table-column>
      <!-- 电话 -->
      <el-table-column label="电话" prop="mobile"> </el-table-column>
      <!-- 角色 -->
      <el-table-column label="角色" prop="role_name"> </el-table-column>
      <!-- 状态 -->
      <el-table-column label="状态" width="80">
        <template v-slot:="slotProps">
          <!-- 
              elementUI对el-table-column这个元素内部设置了一个插槽(<slot>)
              并且在插槽上绑定了一个 :row 属性(v-bind动态绑定),值为当前当前表格整行的数据(值存储在子组件中)
              在当前的父级作用域中我们可以通过"slotProps"(作用域插槽)接收拿到子组件的值,变量名可自定义
            -->
          <el-switch
            v-model="slotProps.row.mg_state"
            @change="stateChange(slotProps.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template v-slot:="editSlot">
          <!-- 编辑用户 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small "
            @click="showDialog(editSlot.row)"
          ></el-button>
          <!-- 删除用户 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small "
            @click="deleteUser(editSlot.row)"
          ></el-button>
          <!-- 分配角色 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small "
              @click="showAllotDialog(editSlot.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="EditDialogVisible"
      width="40%"
      @close="$refs.userFormRef.resetFields()"
      :close-on-click-modal="false"
    >
      <!-- 表单区域 -->
      <el-form
        :model="editUserForm"
        :rules="editUserRules"
        label-width="70px"
        status-icon
        ref="userFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            type="text"
            v-model="editUserForm.username"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="text" v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model.number="editUserForm.mobile"></el-input>
        </el-form-item>

        <!-- 按钮区域 -->
        <el-row type="flex" justify="end">
          <el-button @click="EditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser"> 确 定 </el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="allotDialogVisible"
      width="40%"
      :close-on-click-modal="false"
      @close="selectRole = ''"
    >
      <p class="userInfoP">当前用户：{{ userInfo.username }}</p>
      <p class="userInfoP">当前角色：{{ userInfo.role_name }}</p>
      <p class="userInfoP">
        分配角色：
        <el-select v-model="selectRole" placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>

      <!-- 按钮区域 -->
      <el-row type="flex" justify="end">
        <el-button @click="allotDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRoleBtn"> 确 定 </el-button>
      </el-row>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'UserList',
  props: {
    // 所有用户数据
    users: {
      type: Array,
      default() {
        return []
      },
    },
    roles: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      //当前用户ID
      curUserId: '',
      EditDialogVisible: false,
      //表单数据对象
      editUserForm: {
        username: '',
        email: '',
        mobile: '',
      },
      //表单规则对象
      editUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 16, message: '账号格式错误', trigger: 'blur' },
        ],

        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式错误', trigger: 'blur' },
        ],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }],
      },

      /**
       * 分配角色
       */
      allotDialogVisible: false,
      userInfo: {
        username: '',
        role_name: '',
      },
      // 当前选择的角色(保存的是角色id)
      selectRole: '',
    }
  },
  methods: {
    // 显示对话框（同时拿到当前用户信息）
    showDialog(curUser) {
      this.EditDialogVisible = true
      // 拿到当前修改的用户 id
      this.curUserId = curUser.id
      // 当前点击的用户信息赋给对话框中的表单
      this.editUserForm.username = curUser.username
      this.editUserForm.email = curUser.email
      this.editUserForm.mobile = curUser.mobile
    },

    // 编辑用户（注意！！携带的是请求体参数，网络请求中使用data）
    editUser() {
      this.$refs.userFormRef.validate(async boo => {
        if (!boo) return

        const { data: result } = await this.$http({
          method: 'put',
          url: {
            name: 'usersEdit',
            params: {
              id: this.curUserId,
            },
          },
          data: this.editUserForm,
        })

        if (result.meta.status !== 200) {
          return this.$message.error('用户信息修改失败')
        }

        // 关闭对话框
        this.EditDialogVisible = false
        // 刷新用户列表
        this.$emit('getUsers')
        // 提示用户修改成功
        this.$message.success('用户信息修改成功')
      })
    },

    // 设置用户状态
    async stateChange(userinfo) {
      const { data: result } = await this.$http({
        method: 'put',
        //这里的动态接口写法模仿的是vue的动态路由
        //这里 params 携带的是动态参数 key 需要与 api 接口中的 :id、:type 对应
        //你只需要保证携带的参数 key 需要与 api 接口中的 :xx 一致
        url: {
          name: 'userState',
          params: {
            id: userinfo.id,
            type: userinfo.mg_state,
          },
        },
      })

      if (result.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('用户状态修改失败')
      }
      this.$message.success(result.meta.msg)
    },

    // 删除用户
    async deleteUser({ id }) {
      const res = await this.$messageBox
        .confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch(err => err)
      /**
       * res 会返回两种结果
       *  - 点击取消返回字符串：cancel
       *  - 点击确定返回字符串：confirm
       * 如果点击的是取消将不继续执行
       */
      if (res === 'cancel') {
        return this.$message.info('删除以取消')
      }

      const { data: result } = await this.$http({
        method: 'delete',
        url: {
          name: 'usersEdit',
          params: { id },
        },
      })

      if (result.meta.status !== 200) {
        return this.$message.error('系统故障，删除失败!')
      }
      //调用父组件的 getUsers 方法
      this.$emit('getUsers')
      this.$message.success('删除成功!')
    },

    // 显示分配对话框
    showAllotDialog(info) {
      this.userInfo.username = info.username
      this.userInfo.role_name = info.role_name
      this.curUserId = info.id
      this.allotDialogVisible = true
    },

    // 分配用户角色
    async allotRoleBtn() {
      const { data: result } = await this.$http({
        method: 'put',
        url: {
          name: 'userAllotRole',
          params: {
            id: this.curUserId,
          },
        },
        data: {
          rid: this.selectRole,
        },
      })
      if (result.meta.status !== 200) {
        return this.$message.error('用户角色分配失败')
      }

      // 关闭对话框
      this.allotDialogVisible = false
      // 刷新用户列表
      this.$emit('getUsers')
      // 提示用户修改成功
      this.$message.success('用户角色分配成功')
    },
  },
}
</script>

<style lang="less" scoped>
.userInfoP {
  margin-bottom: 15px;
}
</style>