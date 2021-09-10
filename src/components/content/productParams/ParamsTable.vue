<template>
  <div>
    <el-table :data="tableData" border stripe>
      <!-- 展开列 -->
      <el-table-column width="50" type="expand">
        <!-- 展开列中的标签 -->
        <template v-slot:="propsVal">
          <el-tag
            :key="i"
            v-for="(tag, i) in propsVal.row.attr_vals"
            closable
            :disable-transitions="false"
            @close="handleClose(propsVal.row, i)"
          >
            {{ tag }}
          </el-tag>
          <!-- 输入文本框 -->
          <el-input
            ref="saveTagInput"
            class="input-new-tag"
            v-if="propsVal.row.inputVisible"
            v-model="propsVal.row.inputValue"
            size="small"
            @keyup.enter.native="handleInputConfirm(propsVal.row)"
            @blur="handleInputConfirm(propsVal.row)"
          >
          </el-input>
          <!-- 添加按钮 -->
          <el-button v-else size="small" @click="showInput(propsVal.row)"> + New Tag </el-button>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column label="#" width="50" type="index"> </el-table-column>
      <!-- 参数名称列 -->
      <el-table-column prop="attr_name" label="参数名称" width="180"> </el-table-column>
      <!-- 操作列 -->
      <el-table-column prop="a" label="操作">
        <template v-slot:="editProp">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="showDialog(editProp.row)"> 编辑 </el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteParams(editProp.row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑参数的对话框 -->
    <el-dialog title="编辑参数" :visible.sync="editDialogVisible" width="40%" @closed="$refs.ParamsForm.resetFields()">
      <el-form :model="editParamsForm" :rules="editParamsRules" label-width="80px" ref="ParamsForm" @submit.native.prevent>
        <el-form-item label="参数编辑" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsBtn"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ParamsTable',
  props: {
    // 表格数据
    tableData: {
      type: Array,
    },
    // 当前分类的id
    curCateId: {
      default() {
        return 0
      },
    },
    // 当前选中的参数类型
    activeName: {
      type: String,
    },
  },
  data() {
    return {
      editDialogVisible: false,
      // 表单规则对象
      editParamsRules: {
        attr_name: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
      // 表单数据对象
      editParamsForm: {
        attr_name: '',
      },
      //当前编辑的参数id
      attr_id: '',
    }
  },
  methods: {
    // 显示对话框并拿到相关参数
    showDialog(prop) {
      this.attr_id = prop.attr_id
      this.editParamsForm.attr_name = prop.attr_name
      this.editDialogVisible = true
    },

    // 编辑参数按钮
    editParamsBtn() {
      this.$refs.ParamsForm.validate(async boo => {
        if (!boo) return
        // 编辑操作
        const { data: result } = await this.$http({
          method: 'put',
          url: {
            name: 'editParams',
            params: {
              id: this.curCateId,
              attrId: this.attr_id,
            },
          },
          data: {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.activeName,
          },
        })
        if (result.meta.status !== 200) {
          return this.$message.error('参数编辑失败')
        }
        this.$message.success('参数编辑成功')

        this.$emit('getParamsList')

        this.editDialogVisible = false
      })
    },

    // 删除按钮
    async deleteParams(prop) {
      const res = await this.$messageBox
        .confirm('此操作将永久删除该参数, 是否继续?', '提示', {
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
          name: 'editParams',
          params: {
            id: this.curCateId,
            attrId: prop.attr_id,
          },
        },
      })

      if (result.meta.status !== 200) {
        return this.$message.error('参数删除失败')
      }
      this.$message.success('参数删除成功')
      // this.$emit('getParamsList')
      this.$listeners.getParamsList()
    },

    //显示 Input 框
    showInput(propRow) {
      propRow.inputVisible = true
      //会等待异步的dom渲染到页面上后立即执行，这样就能拿到渲染到页面上的input框的焦点
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 增加参数的tag标签
    handleInputConfirm(curTag) {
      if (curTag.inputValue.trim().length === 0) {
        curTag.inputVisible = false
        curTag.inputValue = ''
        return
      }
      // 将输入的内容push到数组中
      curTag.attr_vals.push(curTag.inputValue.trim())
      // 发起网络请求
      this.tagNetwork(curTag)
      curTag.inputVisible = false
      curTag.inputValue = ''
    },

    // 删除参数的tag标签
    handleClose(curTag, i) {
      // 删除数组中当前点击的元素
      curTag.attr_vals.splice(i, 1)
      // 发起网络请求
      this.tagNetwork(curTag)
    },

    // 增加、删除tag标签的网络请求
    async tagNetwork(curTag) {
      const { data: result } = await this.$http({
        method: 'put',
        url: {
          name: 'editParams',
          params: {
            id: this.curCateId,
            attrId: curTag.attr_id,
          },
        },
        data: {
          attr_name: curTag.attr_name,
          attr_sel: curTag.attr_sel,
          attr_vals: curTag.attr_vals.join(' '),
        },
      })
      if (result.meta.status !== 200) {
        return this.$message.error('参数属性修改失败')
      }
      this.$message.success('参数属性修改成功')
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 12px 12px 12px 0;
}

.input-new-tag {
  width: 90px;
}
</style>