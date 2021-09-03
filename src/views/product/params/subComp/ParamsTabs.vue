<template>
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <!-- 第一个tab页签 -->
    <el-tab-pane label="动态参数" name="many">
      <el-button
        type="primary"
        size="small"
        :disabled="isDisabled"
        class="add-params-btn"
        @click="showDialog"
      >
        添加参数
      </el-button>
      <!-- 动态参数表格 -->
      <params-table
        :tableData="manyTableData"
        :curCateId="curCateId"
        :activeName="activeName"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </el-tab-pane>

    <!-- 第二个tab页签 -->
    <el-tab-pane label="静态属性" name="only">
      <el-button
        type="primary"
        size="small"
        :disabled="isDisabled"
        class="add-params-btn"
        @click="showDialog"
      >
        添加参数
      </el-button>
      <!-- 静态参数表格 -->
      <params-table
        :tableData="onlyTableData"
        :curCateId="curCateId"
        :activeName="activeName"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </el-tab-pane>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + paramsTitle"
      :visible.sync="addParamDialogVisible"
      width="40%"
      @closed="$refs.ParamsForm.resetFields()"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsRules"
        label-width="80px"
        ref="ParamsForm"
        @submit.native.prevent
      >
        <el-form-item :label="paramsTitle" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="paramsAddBtn"> 确 定 </el-button>
      </span>
    </el-dialog>
  </el-tabs>
</template>

<script>
// 中央事件总线
import eventBus from 'eventBus'

// 子组件 table
import ParamsTable from 'components/content/productParams/ParamsTable.vue'

export default {
  name: 'ParamsTabs',
  props: {
    // 静态属性的表格数据
    onlyTableData: {
      type: Array,
    },
    // 动态参数的表格数据
    manyTableData: {
      type: Array,
    },
    curCateId: {
      type: Number,
    },
  },

  data() {
    return {
      // 当前激活的页签
      activeName: 'many',
      // 通过这个值决定按钮是否禁用
      btnVal: true,
      // 添加参数对话框
      addParamDialogVisible: false,
      // 表单规则对象
      addParamsRules: {
        attr_name: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      // 表单数据对象
      addParamsForm: {
        attr_name: '',
      },
    }
  },

  methods: {
    // 显示对话框
    showDialog() {
      this.addParamDialogVisible = true
    },

    // tabs 页签点击事件的处理
    handleTabClick() {
      if (!this.btnVal) {
        this.$emit('getParamsList')
      }
    },

    // 参数(添加、编辑)按钮
    paramsAddBtn() {
      this.$refs.ParamsForm.validate(async boo => {
        if (!boo) return
        // 添加操作
        const { data: result } = await this.$http({
          method: 'post',
          url: {
            name: 'params',
            params: {
              id: this.curCateId,
            },
          },
          data: {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeName,
          },
        })
        if (result.meta.status !== 201) {
          return this.$message.error(this.paramsTitle + '添加失败')
        }
        this.$message.success(this.paramsTitle + '添加成功')
        this.$emit('getParamsList')
        this.addParamDialogVisible = false
      })
    },
  },

  computed: {
    // 处理按钮是否禁用
    isDisabled() {
      eventBus.$on('disabled', val => {
        this.btnVal = val
      })
      return this.btnVal
    },
    // 参数标题
    paramsTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    },
  },

  components: {
    ParamsTable,
  },
}
</script>

<style lang="less" scoped>
.add-params-btn {
  margin-bottom: 15px;
}
</style>