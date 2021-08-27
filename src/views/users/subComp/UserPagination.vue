<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[1, 2, 5, 8]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  >
  </el-pagination>
</template>

<script>
export default {
  name: 'UserPagination',
  props: {
    pagenum: {
      type: Number,
      default() {
        return 1
      },
    },
    pagesize: {
      type: Number,
      default() {
        return 5
      },
    },
    total: {
      type: Number,
    },
  },
  methods: {
    //监听每页面的数据条数（切换每页显示条数的菜单就会触发）
    handleSizeChange(pageSize) {
      this.$emit('update:pagesize', pageSize)
      sessionStorage.setItem('pageSize', pageSize)
      this.$emit('getUsers')
    },
    //监听页码值（当页码值发生改变就会触发）
    handleCurrentChange(currentPage) {
      this.$emit('update:pagenum', currentPage)
      this.$emit('getUsers')
    },
  },
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>