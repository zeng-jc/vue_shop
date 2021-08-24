<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索、添加用户区域 -->
      <el-row :gutter="20" class="search_add">
        <el-col :span="8">
          <el-input
            placeholder="请输入用户名"
            v-model="userParams.query"
            @keyup.enter.native="getUsers"
            clearable
            @clear="getUsers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="showDialog">添加用户</el-button>
        </el-col>
      </el-row>

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
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small "
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small "
            ></el-button>
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
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userParams.pagenum"
        :page-sizes="[1, 2, 5, 8]"
        :page-size="userParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 对话框 -->
    <user-dialog ref="userDialog" />
  </div>
</template>

<script>
import UserDialog from './subComp/UserDialog.vue'

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
        pagesize: 2,
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

    //监听每页面的数据条数（切换每页显示条数的菜单就会触发）
    handleSizeChange(pageSize) {
      this.userParams.pagesize = pageSize
      sessionStorage.setItem('pageSize', pageSize)
      this.getUsers()
    },
    //监听页码值（当页码值发生改变就会触发）
    handleCurrentChange(currentPage) {
      this.userParams.pagenum = currentPage
      this.getUsers()
    },

    //设置用户状态
    async stateChange(userinfo) {
      console.log(userinfo)
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

    //点击显示对话框
    showDialog() {
      this.$refs.userDialog.dialogVisible = true
    },
  },
  components: {
    UserDialog,
  },
}
</script>

<style lang="less" scoped>
// 面包屑导航 -------------------------------
.el-breadcrumb {
  margin-bottom: 15px;
}

// 卡片区域 -------------------------------
.el-card {
  .search_add {
    margin-bottom: 15px;
  }
  .el-pagination {
    margin-top: 15px;
  }
}
</style>