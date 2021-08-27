<template>
  <div>
    <!-- 面包屑导航 -->
    <user-breadcrumb />

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索、添加用户区域 -->
      <user-search-add
        @getUsers="getUsers()"
        @update:query="userParams.query = $event"
      />

      <!-- 用户列表区域 -->
      <user-table :users="users" @getUsers="getUsers" />

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
//面包屑导航组件
import UserBreadcrumb from './subComp/UserBreadcrumb'
//搜索、添加用户组件
import UserSearchAdd from './subComp/UserSearchAdd'
//用户列表组件
import UserTable from './subComp/UserTable'
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
        pagesize: 5,
      },
      //一共多少条数据
      total: 0,
    }
  },
  created() {
    this.userParams.pagesize = +sessionStorage.getItem('pageSize') || 5
    this.getUsers()
  },
  methods: {
    //获取用户
    async getUsers() {
      const { data: result } = await this.$http({
        url: 'users',
        params: this.userParams,
      })

      this.users = result.data.users
      this.total = result.data.total
    },
  },
  components: {
    //面包屑导航组件
    UserBreadcrumb,
    //搜索、添加用户组件
    UserSearchAdd,
    //用户列表组件
    UserTable,
    //分页组件
    UserPagination,
  },
}
</script>

<style lang="less" scoped>
</style>