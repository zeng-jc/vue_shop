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
      <select-goods-cate :cateList="cateList" />

      <params-tabs></params-tabs>
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
      cateList: [],
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