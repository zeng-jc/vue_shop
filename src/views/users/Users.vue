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
      <pagination
        :pagenum.sync="userParams.pagenum"
        :pagesize.sync="userParams.pagesize"
        :total="total"
        @getDate="getUsers"
        :pageSizeName="UserPageSize"
      />
    </el-card>
  </div>
</template>

<script>
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb.vue'
import Pagination from 'components/content/Pagination'

//搜索、添加用户组件
import UserSearchAdd from './subComp/UserSearchAdd'
//用户列表组件
import UserList from './subComp/UserList'

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
        pagesize: 4,
      },
      //一共多少条数据
      total: 0,

      //角色列表
      roles: [],

      // 用户 pageSize
      UserPageSize: 'UserPageSize',
    }
  },
  created() {
    this.userParams.pagesize = +sessionStorage.getItem(this.UserPageSize) || 4
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
    /**
     * 公共组件
     */
    Breadcrumb,
    Pagination,

    //搜索、添加用户组件
    UserSearchAdd,
    //用户列表组件
    UserList,
  },
}
</script>

<style lang="less" scoped>
</style>