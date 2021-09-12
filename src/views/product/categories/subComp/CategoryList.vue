<template>
  <div>
    <el-table
      :data="categoryList"
      border
      row-key="cat_id"
      :header-cell-style="{ background: '#EBEEF5', color: '#606266' }"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column label="#" width="50"> </el-table-column>
      <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template v-slot:="deleteProp">
          <i class="el-icon-success" style="color: #67c23a" v-if="deleteProp.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: #f56c6c" v-else></i>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template v-slot:="levelProp">
          <el-tag v-if="levelProp.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="levelProp.row.cat_level === 1" type="success"> 二级 </el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:="propEdit">
          <el-button size="small" type="primary" icon="el-icon-edit" @click="showCateEditDialog(propEdit.row)"> 编辑 </el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteCate(propEdit.row.cat_id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑分类名称" :visible.sync="cateEditDialog" width="40%" @close="$refs.cateEditFormRef.resetFields()">
      <el-form :model="cateEditForm" :rules="cateEditRules" label-width="80px" ref="cateEditFormRef" @submit.native.prevent>
        <el-form-item prop="cat_name" label="分类名">
          <el-input v-model="cateEditForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cateEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCateNameBtn"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CategoryList',
  props: {
    categoryList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      // 对话框显示与隐藏
      cateEditDialog: false,
      // 表单数据
      cateEditForm: {
        cat_name: '',
      },
      // 表单规则
      cateEditRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      // 当前分类的id
      curId: '',
    }
  },
  methods: {
    // 显示对话框并拿到id
    showCateEditDialog(curCateInfo) {
      this.curId = curCateInfo.cat_id
      this.cateEditForm.cat_name = curCateInfo.cat_name
      this.cateEditDialog = true
    },
    // 编辑分类按钮
    editCateNameBtn() {
      this.$refs.cateEditFormRef.validate(async boo => {
        if (!boo) return
        const { data: result } = await this.$http({
          method: 'put',
          url: {
            name: 'categoriesID',
            params: {
              id: this.curId,
            },
          },
          data: this.cateEditForm,
        })

        if (result.meta.status !== 200) {
          return this.$message.error('分类编辑失败')
        }

        this.$message.success('分类编辑成功')
        this.$emit('getCategoryList')
        this.cateEditDialog = false
      })
    },
    //删除分类
    async deleteCate(id) {
      this.curId = id
      const res = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)

      if (res !== 'confirm') {
        return this.$message.info('操作已取消')
      }

      const { data: result } = await this.$http({
        method: 'delete',
        url: {
          name: 'categoriesID',
          params: {
            id: this.curId,
          },
        },
      })

      if (result.meta.status !== 200) {
        return this.$message.error('删除失败')
      }

      this.$emit('getCategoryList')
      this.$message.success('删除成功')
    },
  },
}
</script>

<style lang="less" scoped>
</style>