<template>
  <section>
    <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>

    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="40%"
      @closed="$refs.addRoleFormRef.resetFields()"
    >
      <el-form
        label-width="80px"
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'AddRoles',
  data() {
    return {
      dialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名长度2-10个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 添加角色按钮
    addRoles() {
      this.$refs.addRoleFormRef.validate(async boo => {
        if (!boo) return

        const { data: result } = await this.$http({
          method: 'post',
          url: 'roles',
          data: this.addRoleForm,
        })

        if (result.meta.status !== 201) {
          return this.$message.error('角色添加失败')
        }
        this.$emit('getRolesList')

        this.$message.success('角色添加失成功')

        this.dialogVisible = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
</style>