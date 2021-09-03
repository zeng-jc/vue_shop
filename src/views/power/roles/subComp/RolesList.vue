<template>
  <section>
    <el-table :data="rolesList" stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template v-slot:="propsChild">
          <el-row
            v-for="item in propsChild.row.children"
            :key="item.id"
            class="roles_border"
          >
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="handleClose(propsChild.row, item.id)">
                {{ item.authName }}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级、三级权限 -->
            <el-col :span="19">
              <!-- 二级权限 -->
              <el-row
                v-for="(itemTwo, indexTwo) in item.children"
                :key="itemTwo.id"
                :class="
                  indexTwo === item.children.length - 1 ? '' : 'roles_border'
                "
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="handleClose(propsChild.row, itemTwo.id)"
                  >
                    {{ itemTwo.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <!-- 三级权限 -->
                  <el-tag
                    type="warning"
                    v-for="itemThree in itemTwo.children"
                    :key="itemThree.id"
                    closable
                    @close="handleClose(propsChild.row, itemThree.id)"
                  >
                    {{ itemThree.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot:="roleProps">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="
              editDialogVisible = true
              editRoleId = roleProps.row.id
            "
            >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteRole(roleProps.row.id)"
          >
            删除
          </el-button>
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-setting"
            @click="ShowAssignRightsDialog(roleProps.row)"
          >
            分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- AssignRightsDialog 分配权限对话框 -->
    <el-dialog
      @closed="
        refresh = 1
        checkedIds = []
      "
      title="权限分配列表"
      :visible.sync="allotDialogVisible"
      width="40%"
    >
      <!-- 
      为了减少网络请求 tree 的数据是在父组件中获取并传入该组件
      所以每次显示对话框要使用 v-if 来重新创建 tree，来达到更新页面的效果
     -->
      <el-tree
        ref="tree"
        :key="refresh"
        :default-checked-keys="checkedIds"
        :data="rightsTree"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
      >
      </el-tree>
      <el-row type="flex" justify="end">
        <el-button @click="allotDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRightsBtn"> 确 定 </el-button>
      </el-row>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editDialogVisible"
      width="40%"
      @closed="$refs.editRoleFormRef.resetFields()"
    >
      <el-form
        label-width="80px"
        :model="editRoleForm"
        :rules="editRoleRules"
        ref="editRoleFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'RolesList',
  props: {
    //角色列表
    rolesList: {
      type: Array,
      default() {
        return []
      },
    },
    //权限树（列表）
    rightsTree: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      // 刷新 tree
      refresh: '',
      //对话框的显示与隐藏
      allotDialogVisible: false,
      //权限树的 子节点 和 label
      treeProps: {
        children: 'children',
        label: 'authName',
      },
      //选中的 id
      checkedIds: [],
      // 点击分配权限时，当前用户的id
      curRoleId: '',

      // 编辑角色的id
      editRoleId: '',
      // 显示编辑对话框
      editDialogVisible: false,
      editRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 10, message: '角色名长度2-10个字符', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 删除角色
    async deleteRole(id) {
      const res = await this.$messageBox
        .confirm('是否删除该权限', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch(err => err)

      if (res !== 'confirm') {
        return this.$message.info('操作已取消')
      }

      const { data: result } = await this.$http({
        method: 'delete',
        url: {
          name: 'rolesID',
          params: {
            id,
          },
        },
      })

      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('角色删除失败')
      }

      this.$emit('getRolesList')
      this.$message.success('角色删除成功')
    },

    // 编辑角色
    editRole() {
      this.$refs.editRoleFormRef.validate(async boo => {
        if (!boo) return
        const { data: result } = await this.$http({
          method: 'put',
          url: {
            name: 'rolesID',
            params: {
              id: this.editRoleId,
            },
          },
          data: this.editRoleForm,
        })
        if (result.meta.status !== 200) {
          return this.$message.error('角色编辑失败')
        }
        this.$emit('getRolesList')

        this.$message.success('角色编辑成功')

        this.editDialogVisible = false
      })
    },

    // 删除权限
    async handleClose(role, rightId) {
      const res = await this.$messageBox
        .confirm('是否删除该权限', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch(err => err)

      if (res !== 'confirm') {
        return this.$message.info('操作已取消')
      }
      // 删除角色指定权限
      const { data: result } = await this.$http({
        method: 'delete',
        url: {
          name: 'deleteRolesRights',
          params: {
            roleId: role.id,
            rightId: rightId,
          },
        },
      })

      if (result.meta.status !== 200) {
        return this.$message.error('权限取消失败')
      }
      /**
       * 直接重新获取所有数据，会造成整个列表重新渲染，导致下拉列表需要重新打开
       * 所以后台会返回删除后下拉列表的最新数据
       * 由于role是响应式数据所以可以children直接赋值
       */
      role.children = result.data
      this.$message.success('权限取消成功')
    },

    // 分配权限对话框
    ShowAssignRightsDialog(curRole) {
      this.refresh = ''
      //保存用户id
      this.curRoleId = curRole.id
      this.getCheckedIds(curRole, this.checkedIds)
      this.allotDialogVisible = true
    },

    // 通过递归，获取角色选中的权限的 id
    getCheckedIds(node, arr) {
      // 如果没有 children 属性，说明节点为三级权限，直接return并push
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getCheckedIds(item, arr))
    },

    // 确定分配权限的按钮
    async allotRightsBtn() {
      const RightIds = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys(),
      ]
      const strIds = RightIds.join(',')
      const { data: result } = await this.$http({
        method: 'post',
        url: {
          name: 'addRights',
          params: {
            roleId: this.curRoleId,
          },
        },
        data: {
          rids: strIds,
        },
      })
      if (result.meta.status !== 200) {
        return this.$message.error('权限更新失败')
      }

      this.$message.success('权限更新成功')
      // 分配完成后从新获取角色列表的数据
      this.$emit('getRolesList')

      this.allotDialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
.el-row {
  align-items: center;
  display: flex;
}
.roles_border {
  border-bottom: 1px solid #ebeef5;
}
.el-tag {
  margin: 7px;
}
</style>