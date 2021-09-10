<template>
  <div>
    <el-table :data="orderList" stripe>
      <!-- 索引列 -->
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <!-- 订单编号 -->
      <el-table-column prop="order_number" label="订单编号" width="240">
      </el-table-column>
      <!-- 订单价格 -->
      <el-table-column prop="order_price" label="订单价格"> </el-table-column>
      <!-- 是否付款 -->
      <el-table-column prop="pay_status" label="是否付款">
        <template v-slot:="rowProp">
          <el-tag type="danger" v-if="rowProp.row.order_pay === '0'">
            未付款
          </el-tag>
          <el-tag type="success" v-else>已付款</el-tag>
        </template>
      </el-table-column>
      <!-- 是否发货 -->
      <el-table-column prop="is_send" label="是否发货"> </el-table-column>
      <!-- 下单时间 -->
      <el-table-column prop="create_time" label="下单时间" width="160">
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template v-slot:="rowProp">
          <!-- 修改订单地址 -->
          <el-tooltip
            content="修改订单地址"
            placement="top"
            effect="light"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(rowProp.row.order_number)"
            ></el-button>
          </el-tooltip>

          <!-- 物流进度 -->
          <el-tooltip
            content="查看物流进度"
            placement="top"
            effect="light"
            :enterable="false"
          >
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showLogisticsDialog(rowProp.row.order_number)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑订单对话框 -->
    <el-dialog
      title="修改订单地址"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="$refs.editFormRef.resetFields()"
    >
      <el-form
        label-width="100px"
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
      >
        <el-form-item label="订单号">
          <el-input v-model="editForm.order_number" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editForm.address1"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input type="text" v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAddress"> 确 定 </el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="logisticsDialogVisible"
      width="40%"
    >
      <el-timeline reverse>
        <el-timeline-item
          v-for="(item, index) in logisticsInfo"
          :key="index"
          :timestamp="item.ftime"
        >
          {{ item.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 公共工具
 */
import citydata from 'common/citydata.js'

export default {
  name: 'OrderList',
  props: {
    orderList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      // 编辑对话框
      editDialogVisible: false,
      // 表单数据对象
      editForm: {
        order_number: '',
        // 级连选择器选择的地址
        address1: '',
        // 详细地址
        address2: '',
      },
      // 表单规则对象
      editRules: {
        address1: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      // 城市数据
      citydata,
      // 物流进度对话框
      logisticsDialogVisible: false,
      // 物流信息
      logisticsInfo: '',
    }
  },
  methods: {
    // 显示编辑对话框
    showEditDialog(order_number) {
      this.editDialogVisible = true
      this.editForm.order_number = order_number
    },
    // 显示物流进度对话框
    async showLogisticsDialog() {
      this.logisticsDialogVisible = true
      const { data: result } = await this.$http({
        url: {
          name: 'kuaidi',
          params: {
            id: '1106975712662',
          },
        },
      })
      console.log(result.data)
      this.logisticsInfo = result.data
    },
    // 更新地址
    updateAddress() {
      this.$refs.editFormRef.validate(boo => {
        if (!boo) {
          return this.$message.error('请填写完整信息')
        }
        this.$message.success('修改成功')
        this.editDialogVisible = false
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.el-timeline {
  font-size: 13px;
}
</style>