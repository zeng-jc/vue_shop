<template>
  <section>
    <breadcrumb :breadcrumbItem="['商品管理', '商品分类']" />
    <el-card> </el-card>
  </section>
</template>

<script>
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb.vue'

export default {
  name: 'Categories',
  components: {
    Breadcrumb,
  },
}
</script>

<style lang="less" scoped>
</style>