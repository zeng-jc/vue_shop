<template>
  <section>
    <breadcrumb :breadcrumbItem="['商品管理', '商品列表']" />
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索用户区域 -->
        <el-col :span="8">
          <search-goods
            @getGoodsList="getGoodsList"
            @update:query="goodsParams.query = $event"
          />
        </el-col>
        <!-- 添加用户区域 -->
        <el-col :span="1">
          <el-button type="primary" @click="goAddPage"> 添加商品 </el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <goods-list
        :goodsList="goodsList"
        @getGoodsList="getGoodsList"
      ></goods-list>
      <!-- 分页区域 -->
      <pagination
        :pagenum.sync="goodsParams.pagenum"
        :pagesize.sync="goodsParams.pagesize"
        :total="total"
        :pageSizeName="pageSizeName"
        @getDate="getGoodsList"
      />
    </el-card>
  </section>
</template>

<script>
/**
 * 公共工具
 */
import { dateFormart } from 'common/utils.js'
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb.vue'
import Pagination from 'components/content/Pagination.vue'

import SearchGoods from './subComp/SearchGoods.vue'
import GoodsList from './subComp/GoodsList.vue'

export default {
  name: 'Goods',
  data() {
    return {
      // 商品列表数据
      goodsList: [],
      // 请求商品列表所携带的参数
      goodsParams: {
        query: '',
        pagenum: 1,
        pagesize: 8,
      },
      // 总共数据条数
      total: 0,
      // 每页显示几条数据，从此名字中取值
      pageSizeName: 'goodsSize',
    }
  },
  created() {
    this.goodsParams.pagesize = +sessionStorage.getItem(this.pageSizeName) || 8
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: result } = await this.$http({
        url: 'goods',
        params: this.goodsParams,
      })

      if (result.meta.status !== 200) {
        return this.$message.error('商品列表数据获取失败')
      }
      this.goodsList = result.data.goods
      this.total = result.data.total

      this.goodsList.forEach(item => {
        item.upd_time = dateFormart(item.upd_time)
      })
    },
    goAddPage() {
      this.$router.push('/goods/add_goods')
    },
  },
  components: {
    Breadcrumb,
    Pagination,
    SearchGoods,
    GoodsList,
  },
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
</style>