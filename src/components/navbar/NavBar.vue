<template>
  <!-- 头部 -->
  <section id="nav_bar">
    <div id="logo">
      <img src="~assets/logo.png" alt="" />
      <span>My-Admin</span>
    </div>
    <div class="user_info">
      Hi~
      <span>{{ username }}</span>
      <el-button type="info" @click="logout">退出</el-button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      // 用户名
      username: sessionStorage.getItem('username'),
    }
  },
  methods: {
    //退出登录
    logout() {
      sessionStorage.clear()
      this.$router.replace('/login')
    },
  },
}
</script>

<style lang="less" scoped>
// 头部样式 --------------------------------
#nav_bar {
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;

  > #logo {
    display: flex;
    align-items: center;
    img {
      width: 28px;
    }
    span {
      margin-left: 15px;
    }
  }

  > .user_info > span {
    margin-right: 15px;
    color: #ffca84;
  }
}
</style>