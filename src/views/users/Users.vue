<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb :breadcrumbItem="['用户管理', '用户列表']" />

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索、添加用户区域 -->
      <user-search-add
        @getUsers="getUsers()"
        @update:query="userParams.query = $event"
      />

      <!-- 用户列表区域 -->
      <user-list :users="users" :roles="roles" @getUsers="getUsers" />

      <!-- 分页 -->
      <user-pagination
        @getUsers="getUsers"
        :pagenum.sync="userParams.pagenum"
        @update:pagesize="pagesize = $event"
        :pagesize.sync="userParams.pagesize"
        :total="total"
      />
    </el-card>
  </div>
</template>

<script>
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb.vue'

//搜索、添加用户组件
import UserSearchAdd from './subComp/UserSearchAdd'
//用户列表组件
import UserList from './subComp/UserList'
//分页组件
import UserPagination from './subComp/UserPagination'

export default {
  name: 'Users',
  data() {
    return {
      // 所有用户数据
      users: null,
      // 用户列表请求的相关参数
      userParams: {
        //查询指定的用户信息，可以为空
        query: '',
        //请求的当前页
        pagenum: 1,
        //当前页面显示的数据长度
        pagesize: 8,
      },
      //一共多少条数据
      total: 0,

      //角色列表
      roles: [],
    }
  },
  created() {
    this.userParams.pagesize = +sessionStorage.getItem('pageSize') || 8
    this.getUsers()
    this.getRoles()
  },
  methods: {
    //获取用户
    async getUsers() {
      const { data: result } = await this.$http({
        url: 'users',
        params: this.userParams,
      })

      if (result.meta.status !== 200) {
        return this.$message.error('用户列表数据获取失败')
      }

      this.users = result.data.users
      this.total = result.data.total
    },
    //获取角色列表
    async getRoles() {
      const { data: result } = await this.$http({
        url: 'roles',
      })

      if (result.meta.status !== 200) {
        return this.$message.error('用户列表数据获取失败')
      }
      this.roles = result.data
    },
  },
  components: {
    Breadcrumb,
    //搜索、添加用户组件
    UserSearchAdd,
    //用户列表组件
    UserList,
    //分页组件
    UserPagination,
  },
}
</script>

<style lang="less" scoped>
</style>