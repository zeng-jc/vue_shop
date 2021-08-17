<template>
  <div>
    <el-button @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      sessionStorage.clear()
      this.$router.replace('/login')
    },
  },
}
</script>

<style lang="less" scoped>
</style>