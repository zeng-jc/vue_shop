<template>
  <el-row>
    <el-col :span="8">
      <el-input
        placeholder="请输入内容"
        v-model="inputValue"
        clearable
        @blur="getOrderList"
        @clear="getOrderList"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchBtn"
        ></el-button>
      </el-input>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'OrderSearch',
  data() {
    return {
      inputValue: '',
    }
  },
  methods: {
    searchBtn() {
      this.$emit('update:query', this.inputValue)
      this.$emit('getOrderList')
      this.$message.success('搜索成功')
    },
    getOrderList() {
      this.$emit('getOrderList')
    },
  },
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
</style>