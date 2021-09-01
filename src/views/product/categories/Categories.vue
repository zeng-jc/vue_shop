<template>
  <section>
    <breadcrumb :breadcrumbItem="['商品管理', '商品分类']" />
    <el-card>
      <!-- 添加分类 -->
      <add-category @getCategoryList="getCategoryList" />
      <!-- 分类列表 -->
      <category-list
        :categoryList="categoryList"
        @getCategoryList="getCategoryList"
      />
      <!-- 分页 -->
      <pagination
        :pagenum.sync="categoryParams.pagenum"
        :pagesize.sync="categoryParams.pagesize"
        :total="total"
        @getDate="getCategoryList"
        :pageSizeName="catePageSize"
      />
    </el-card>
  </section>
</template>

<script>
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb.vue'
import Pagination from 'components/content/Pagination'

/**
 * 子组件
 */
import AddCategory from './subComp/AddCategory'
import CategoryList from './subComp/CategoryList'

export default {
  name: 'Categories',
  data() {
    return {
      categoryList: [],
      categoryParams: {
        type: 3,
        pagenum: 1,
        pagesize: 4,
      },
      //一共多少条数据
      total: 0,

      // 分类 pageSize
      catePageSize: 'catePageSize',
    }
  },
  created() {
    // 刷新当前页面 pagesize 依然不变
    this.categoryParams.pagesize =
      +sessionStorage.getItem(this.catePageSize) || 4

    this.getCategoryList()
  },
  methods: {
    // 获取分类列表
    async getCategoryList() {
      const { data: result } = await this.$http({
        url: 'categories',
        params: this.categoryParams,
      })

      if (result.meta.status !== 200) {
        return this.$message.error('商品列表获取失败')
      }
      this.categoryList = result.data.result
      this.total = result.data.total
    },
  },
  components: {
    /**
     * 公共组件
     */
    Breadcrumb,
    Pagination,
    /**
     * 子组件
     */
    AddCategory,
    CategoryList,
  },
}
</script>

<style lang="less" scoped>
</style>