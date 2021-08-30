<template>
  <section>
    <!-- 面包屑导航 -->
    <rights-breadcrumb />
    <el-card>
      <!-- 权限列表 -->
      <rights-list :rightsList="rightsList" />
    </el-card>
  </section>
</template>

<script>
// 面包屑导航
import RightsBreadcrumb from './subComp/RightsBreadcrumb'
// 权限列表
import RightsList from './subComp/RightsList'

export default {
  name: 'Rights',
  data() {
    return {
      rightsList: [],
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: result } = await this.$http({
        url: 'rightsList',
      })

      if (result.meta.status !== 200) {
        return this.$message.error('权限列表数据获取失败')
      }
      this.rightsList = result.data
    },
  },
  components: {
    // 面包屑导航
    RightsBreadcrumb,
    // 权限列表
    RightsList,
  },
}
</script>

<style lang="less" scoped>
</style>