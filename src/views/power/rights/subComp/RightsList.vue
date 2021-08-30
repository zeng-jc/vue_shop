<template>
  <el-table :data="rightsList" stripe border>
    <el-table-column type="index" width="50"> </el-table-column>
    <el-table-column prop="authName" label="权限名称" width="200">
    </el-table-column>
    <el-table-column prop="path" label="路径"> </el-table-column>
    <el-table-column prop="level" label="权限等级" v-slot:="slotRow">
      <el-tag v-if="slotRow.row.level === '0'">一级</el-tag>
      <el-tag type="success" v-else-if="slotRow.row.level === '1'">二级</el-tag>
      <el-tag type="warning" v-else>三级</el-tag>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'RightsList',
  props: {
    rightsList: {
      type: Array,
      default() {
        return []
      },
    },
  },
}
</script>

<style lang="less" scoped>
</style>