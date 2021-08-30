<template>
  <section>
    <!-- 面包屑导航 -->
    <breadcrumb :breadcrumbItem="['权限管理', '角色列表']" />

    <el-card>
      <!-- 添加用户 -->
      <add-roles @getRolesList="getRolesList" />
      <!-- 角色列表 -->
      <roles-list
        :rolesList="rolesList"
        :rightsTree="rightsTree"
        @getRolesList="getRolesList"
      />
    </el-card>
  </section>
</template>

<script>
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb.vue'

// 添加角色
import AddRoles from './subComp/AddRoles'
// 角色列表
import RolesList from './subComp/RolesList'
export default {
  name: 'Roles',
  data() {
    return {
      //角色列表
      rolesList: [],
      //权限树
      rightsTree: [],
    }
  },
  created() {
    this.getRolesList()
    this.getRightsTree()
  },
  methods: {
    async getRolesList() {
      //获取角色列表
      const { data: result } = await this.$http({
        url: 'roles',
      })
      if (result.meta.status !== 200) {
        return this.$message.error('角色列表数据获取失败')
      }
      this.rolesList = result.data
    },
    async getRightsTree() {
      //获取权限树
      const { data: result } = await this.$http({
        url: 'rightsTree',
      })

      if (result.meta.status !== 200) {
        return this.$message.error('权限列表数据获取失败')
      }
      this.rightsTree = result.data
    },
  },
  components: {
    Breadcrumb,
    AddRoles,
    RolesList,
  },
}
</script>

<style lang="less" scoped>
</style>