<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-sizes="[2, 4, 8, 12]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  >
  </el-pagination>
</template>

<script>
export default {
  name: 'CategoryPagination',
  props: {
    pagenum: {
      type: Number,
    },
    pagesize: {
      type: Number,
    },
    total: {
      type: Number,
    },
    pageSizeName: {
      type: String,
    },
  },
  methods: {
    //监听每页面的数据条数（切换每页显示条数的菜单就会触发）
    handleSizeChange(pageSize) {
      this.$emit('update:pagesize', pageSize)
      sessionStorage.setItem(this.pageSizeName, pageSize)
      this.$emit('getDate')
    },
    //监听页码值（当页码值发生改变就会触发）
    handleCurrentChange(currentPage) {
      this.$emit('update:pagenum', currentPage)
      this.$emit('getDate')
    },
  },
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>