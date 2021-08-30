<template>
  <section>
    <!-- 面包屑导航 -->
    <breadcrumb :breadcrumbItem="['权限管理', '权限列表']" />

    <el-card>
      <!-- 权限列表 -->
      <rights-list :rightsList="rightsList" />
    </el-card>
  </section>
</template>

<script>
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb.vue'

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
    Breadcrumb,
    // 权限列表
    RightsList,
  },
}
</script>

<style lang="less" scoped>
</style>