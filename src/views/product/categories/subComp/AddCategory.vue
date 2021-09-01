<template>
  <div>
    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%"
      @closed="closeCategoryDialog"
    >
      <el-form
        label-width="80px"
        :model="addCateParams"
        :rules="categoryRules"
        ref="categoryFormRef"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateParams.cat_name"></el-input>
        </el-form-item>
        <!-- 新增分类的所属分类，就是给新增分类指定父级分类 -->
        <el-form-item label="所属分类">
          <!-- 
          由于选中的选项值会默认双向绑定到元素的 checkedValue 属性上，
          所以没有使用 v-model 保存 
          -->
          <el-cascader
            ref="cascaderRef"
            :options="parentOptions"
            :props="{
              expandTrigger: 'hover',
              // 指定选项名称
              label: 'cat_name',
              // 指定子选项列表
              children: 'children',
              // 指定选中选项的值为当前对象 cat_id 属性
              value: 'cat_id',
              checkStrictly: true,
            }"
            @change="handleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryBtn"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddCategory',
  data() {
    return {
      addDialogVisible: false,
      // 验证规则
      categoryRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 父级分类的数组对象
      parentOptions: [],
      // 添加分类所需参数对象
      addCateParams: {
        // 分类父 ID。父级为id0，默认一级分类
        cat_pid: 0,
        // 分类名称
        cat_name: '',
        // 父类层级，0默认一级分类
        cat_level: 0,
      },
    }
  },
  methods: {
    //显示对话框
    async showAddCateDialog() {
      this.addDialogVisible = true
      const { data: result } = await this.$http({
        url: 'categories',
        params: {
          type: 2,
        },
      })

      if (result.meta.status !== 200) {
        return this.$message.error('分类列表获取失败')
      }
      this.parentOptions = result.data
    },

    // 级连选择器发生改变触发的方法
    handleChange(value) {
      //如果没有选择那么长度为0，添加的是一级分类
      if (value.length === 0) {
        this.addCateParams.cat_level = 0
        this.addCateParams.cat_pid = 0
      } else {
        // 如果选择了，需要拿到父类 id
        this.addCateParams.cat_pid = value[value.length - 1]
        // 父类层级
        this.addCateParams.cat_level = value.length
      }
    },

    //添加按钮
    addCategoryBtn() {
      this.$refs.categoryFormRef.validate(async boo => {
        if (!boo) return
        const { data: result } = await this.$http({
          method: 'post',
          url: 'categories',
          data: this.addCateParams,
        })

        if (result.meta.status !== 201) {
          return this.$message.error('分类添加失败')
        }

        this.$emit('getCategoryList')
        this.$message.success('分类添加成功')
        this.addDialogVisible = false
      })
    },

    // 对话框关闭方法
    closeCategoryDialog() {
      //清空表单
      this.$refs.categoryFormRef.resetFields()
      // checkedValue 保存的是默认选中的值（数组），清空只能赋值空数组
      this.$refs.cascaderRef.checkedValue = []
      this.addCateParams.cat_level = 0
      this.addCateParams.cat_pid = 0
    },
  },
}
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>