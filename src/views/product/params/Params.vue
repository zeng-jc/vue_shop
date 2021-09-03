<template>
  <section>
    <breadcrumb :breadcrumbItem="['商品管理', '参数列表']" />
    <el-card>
      <!-- 提示信息 -->
      <el-alert
        title="注意：只允许为三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品类型 -->
      <select-goods-cate
        :cateList="cateList"
        ref="selectCate"
        @getParamsList="getParamsList"
        @clearTable="clearTable"
      />
      <!-- 参数页签 -->
      <params-tabs
        ref="paramsTabs"
        @getParamsList="getParamsList"
        :onlyTableData="onlyTableData"
        :manyTableData="manyTableData"
        :curCateId="curCateId"
      />
    </el-card>
  </section>
</template>

<script>
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb.vue'

import SelectGoodsCate from './subComp/SelectGoodsCate.vue'
import ParamsTabs from './subComp/ParamsTabs.vue'

export default {
  name: 'Params',
  data() {
    return {
      // 分类列表数据
      cateList: [],
      // 静态参数列表数据
      onlyTableData: [],
      // 动态参数列表数据
      manyTableData: [],
      // 当前选中的分类id
      curCateId: 0,
      // 当前的参数类型
      curSel: '',
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表，将获取到的数据传给子组件
    async getCateList() {
      const { data: result } = await this.$http({
        url: 'categories',
      })
      if (result.meta.status !== 200) {
        return this.$message.error('分类列表数据获取失败')
      }
      this.cateList = result.data
    },

    // 获取参数列表
    async getParamsList() {
      this.curCateId = this.$refs.selectCate.cateId
      this.curSel = this.$refs.paramsTabs.activeName
      const { data: result } = await this.$http({
        url: {
          name: 'params',
          params: {
            id: this.curCateId,
          },
        },
        params: {
          sel: this.curSel,
        },
      })

      if (result.meta.status !== 200) {
        return this.$message.error('商品参数获取失败')
      }

      let data = result.data
      data.forEach(item => {
        // 将参数的可选项拆分成一个数组
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        //给 每一个参数的可选项绑定自己的 inputVisible 与 inputValue
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.curSel === 'many') {
        this.manyTableData = data
      } else {
        this.onlyTableData = data
      }
    },

    // 清空参数列表
    clearTable(val) {
      this.manyTableData = val
      this.onlyTableData = val
    },
  },
  components: {
    Breadcrumb,
    SelectGoodsCate,
    ParamsTabs,
  },
}
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}
</style>