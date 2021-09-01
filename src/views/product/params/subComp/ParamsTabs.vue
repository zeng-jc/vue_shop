<template>
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <!-- 第一个tab页签 -->
    <el-tab-pane label="动态参数" name="first">
      <el-button type="primary" size="small" :disabled="isDisabled">
        添加参数
      </el-button>
      <el-table :data="tableData" border>
        <el-table-column width="50"> </el-table-column>
        <el-table-column label="#" width="50"> </el-table-column>
        <el-table-column prop="paramName" label="参数名称" width="180">
        </el-table-column>
        <el-table-column prop="a" label="操作"> </el-table-column>
      </el-table>
    </el-tab-pane>
    <!-- 第二个tab页签 -->
    <el-tab-pane label="静态属性" name="second">
      <el-button type="primary" size="small" :disabled="isDisabled">
        添加参数
      </el-button>
      <el-table :data="tableData" border>
        <el-table-column width="50"> </el-table-column>
        <el-table-column label="#" width="50"> </el-table-column>
        <el-table-column prop="paramName" label="参数名称" width="180">
        </el-table-column>
        <el-table-column prop="a" label="操作"> </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
// 中央事件总线
import eventBus from 'eventBus'

export default {
  name: 'ParamsTabs',
  data() {
    return {
      // 当前激活的页签
      activeName: 'first',
      tableData: [],
      // 通过这个值决定按钮是否禁用
      btnVal: true,
    }
  },
  methods: {
    // tab 页签点击事件的处理
    handleTabClick() {},
  },
  computed: {
    isDisabled() {
      eventBus.$on('disabled', val => {
        this.btnVal = val
      })
      return this.btnVal
    },
  },
}
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
</style>