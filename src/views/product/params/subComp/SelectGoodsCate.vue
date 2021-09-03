<template>
  <div>
    选择商品分类：
    <el-cascader
      v-model="cateId"
      ref="cateCascader"
      :options="cateList"
      clearable
      :props="{
        expandTrigger: 'hover',
        children: 'children',
        label: 'cat_name',
        value: 'cat_id',
      }"
      @change="handleChange"
    ></el-cascader>
  </div>
</template>

<script>
// 中央事件总线
import eventBus from 'eventBus'

export default {
  name: 'SelectGoodsCate',
  data() {
    return {
      cateId: [],
    }
  },
  props: {
    cateList: {
      type: Array,
    },
  },
  methods: {
    async handleChange(value) {
      // 选中的不是三级分类，发出一个事件通知兄弟组件按钮不能点击
      if (value.length !== 3) {
        // 清空当前选中的分类
        this.cateId = []
        eventBus.$emit('disabled', true)
        this.$emit('clearTable', [])
        return
      }

      // 选择的是三级分类，则发出事件让按钮可用
      eventBus.$emit('disabled', false)
      // 拿到需要使用的三级id
      this.cateId = this.cateId[this.cateId.length - 1]
      // 调用父组件的方法
      this.$emit('getParamsList')
    },
  },
}
</script>

<style lang="less" scoped>
</style>