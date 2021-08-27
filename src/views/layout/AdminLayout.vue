<template>
  <el-container>
    <!-- 头部 -->
    <el-header><nav-bar></nav-bar></el-header>
    <el-container>
      <!-- 菜单 -->
      <aside-menus></aside-menus>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavBar from 'components/navbar/NavBar.vue'
import AsideMenus from 'components/asideMenus/AsideMenus.vue'

export default {
  name: 'Home',

  components: {
    NavBar,
    AsideMenus,
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
  }
}
</style>