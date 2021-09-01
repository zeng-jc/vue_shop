<template>
  <div>
    选择商品分类：
    <el-cascader
      v-model="cascaderVal"
      ref="cateCascader"
      :options="cateList"
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
      cascaderVal: [],
    }
  },
  props: {
    cateList: {
      type: Array,
    },
  },
  methods: {
    handleChange(value) {
      if (value.length !== 3) {
        this.cascaderVal = []
        eventBus.$emit('disabled', true)
      } else {
        // 如果级连选择器的值长度为 3，则让按钮可用
        eventBus.$emit('disabled', false)
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>