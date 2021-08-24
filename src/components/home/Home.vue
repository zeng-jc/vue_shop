<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div id="logo">
        <img src="~assets/logo.png" alt="" />
        <span>My-Admin</span>
      </div>
      <div class="user_info">
        Hi~
        <span>{{ username }}</span>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <!-- 身体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div @click="toggleCollapse" class="toggleBtn">
          <p ref="collapseRef">|||</p>
        </div>
        <!-- 菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="i + ''" v-for="(item, i) in menus" :key="item.id">
            <!-- 文本、图标区域 -->
            <template slot="title">
              <i :class="icons[i]" id="menuIcon"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="`/${subItem.path}`"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="setActiveMenu(`/${subItem.path}`)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 用户名
      username: this.$route.query.username,
      // 左侧菜单列表
      menus: null,
      // 菜单图标
      icons: [
        'iconfont icon-users',
        'iconfont icon-tijikongjian',
        'iconfont icon-shangpin',
        'iconfont icon-danju',
        'iconfont icon-baobiao',
      ],
      isCollapse: false,
      //当前活跃的地址
      activePath: '',
      total: '',
    }
  },

  created() {
    this.getMenus()
    //组件被创建的时候从 sessionStorage 中取出上一步存入的“活跃菜单地址”
    this.activePath = sessionStorage.getItem('activePath')
  },

  methods: {
    //退出登录
    logout() {
      sessionStorage.clear()
      this.$router.replace('/login')
    },

    //获取左侧菜单列表
    async getMenus() {
      const { data: result } = await this.$http({
        url: 'menus',
      })
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      this.menus = result.data
    },

    //展开折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.$refs.collapseRef.style =
          'transform: rotate(90deg) translateX(2px)'
      } else {
        this.$refs.collapseRef.style = 'transform: rotate(0deg)'
      }
    },
    //设置当前活跃的菜单，并将其存入 sessionStorage 中
    setActiveMenu(activePath) {
      this.activePath = activePath
      sessionStorage.setItem('activePath', activePath)
    },
  },
}
</script>

<style lang="less" scoped>
// 头部样式 --------------------------------
.el-header {
  background-color: #373d41;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;

  > #logo {
    img {
      width: 28px;
      vertical-align: middle;
    }
    span {
      margin-left: 15px;
      font-size: 16px;
    }
  }

  > .user_info > span {
    margin-right: 15px;
    color: #ffca84;
  }
}
.el-container {
  height: 100%;
}

// 主体样式 --------------------------------
.el-main {
  background-color: #eaedf1;
}

// 侧边栏样式 --------------------------------
.el-aside {
  background-color: #333744;
  text-align: center;
  user-select: none; //双击不会选中文字
  .toggleBtn {
    background-color: #4a5064;
    color: #909399;
    cursor: pointer;
    letter-spacing: 0.2em;
    overflow: hidden;
    p {
      line-height: 20px;
      height: 24px;
      margin: 5px;
      transition: 0.5s;
      font-size: 14px;
    }
  }

  .el-menu {
    border-right: none;
  }

  #menuIcon {
    margin-right: 10px;
    font-size: 20px;
  }
}
</style>