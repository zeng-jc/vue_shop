<template>
  <el-input
    placeholder="请输入内容"
    v-model="searchInput"
    @keyup.enter.native="getGoods"
    clearable
    @clear="getGoods"
    @blur="getGoods"
  >
    <el-button
      slot="append"
      icon="el-icon-search"
      @click="getGoods"
    ></el-button>
  </el-input>
</template>

<script>
export default {
  name: 'AddSearchGoods',
  data() {
    return {
      searchInput: '',
    }
  },
  methods: {
    getGoods() {
      // 1.先改变query参数
      this.$emit('update:query', this.searchInput)
      // 2.再发起请求
      this.$emit('getGoodsList')
    },
  },
}
</script>

<style lang="less" scoped>
</style>