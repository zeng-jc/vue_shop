<template>
  <el-container class="layout-container">
    <!-- 头部 -->
    <el-header><nav-bar></nav-bar></el-header>
    <el-container>
      <!-- 菜单 -->
      <aside-menus></aside-menus>
      <!-- 右侧内容主体 -->
      <el-main>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
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
.layout-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
}
</style>