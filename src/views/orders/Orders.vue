<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb :breadcrumbItem="['订单管理', '订单列表']" />
    <el-card>
      <order-search
        @update:query="orderParams.query = $event"
        @getOrderList="getOrderList"
      />
      <order-list :orderList="orderList" />
      <pagination
        :total="total"
        :pagenum.sync="orderParams.pagenum"
        :pagesize.sync="orderParams.pagesize"
        @getDate="getOrderList"
        :pageSizeName="pageSizeName"
      />
    </el-card>
  </div>
</template>

<script>
/**
 * 公共工具
 */
import { dateFormart } from 'common/utils.js'
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb'
import Pagination from 'components/content/Pagination'

import OrderSearch from './subComp/OrderSearch'
import OrderList from './subComp/OrderList'

export default {
  name: 'Order',
  data() {
    return {
      orderParams: {
        query: '',
        pagenum: 1,
        pagesize: 8,
      },
      orderList: [],
      total: 0,
      pageSizeName: 'orders',
    }
  },
  created() {
    this.orderParams.pagesize = +sessionStorage.getItem('orders') || 8
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: result } = await this.$http({
        url: 'orders',
        params: this.orderParams,
      })

      if (result.meta.status !== 200) {
        return this.$message.error('订单列表获取失败')
      }
      console.log(result.data)
      this.orderList = result.data.goods
      this.total = result.data.total

      this.orderList.forEach(item => {
        item.create_time = dateFormart(item.create_time)
      })
    },
  },
  components: {
    /**
     * 公共组件
     */
    Breadcrumb,
    Pagination,

    OrderSearch,
    OrderList,
  },
}
</script>

<style>
</style>