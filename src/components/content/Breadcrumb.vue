<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in breadcrumbItem" :key="item">{{
      item
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    breadcrumbItem: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>

<style>
</style>