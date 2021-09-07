<template>
  <div>
    <el-table :data="goodsList" stripe border>
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="550">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)">
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
      <el-table-column prop="upd_time" label="创建时间" width="160">
      </el-table-column>
      <el-table-column prop="address" label="操作" width="120">
        <template v-slot:="rowProp">
          <el-button
            type="primary"
            class="el-icon-edit"
            size="small"
          ></el-button>
          <el-button
            type="danger"
            class="el-icon-delete"
            size="small"
            @click="deleteGoods(rowProp.row.goods_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'GoodsList',
  props: {
    goodsList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    async deleteGoods(id) {
      const res = await this.$messageBox
        .confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch(err => err)

      if (res !== 'confirm') {
        return this.$message.info('操作已取消')
      }

      const { data: result } = await this.$http({
        method: 'delete',
        url: {
          name: 'goodsID',
          params: {
            id,
          },
        },
      })
      if (result.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$emit('getGoodsList')
      this.$message.success('删除成功')
    },
  },
}
</script>

<style>
</style>