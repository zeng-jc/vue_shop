<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb :breadcrumbItem="['商品管理', '添加商品']" />
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- steps区域 -->
      <el-steps
        :space="200"
        :active="+activeIndex"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs区域 -->
      <el-form
        :model="addGoodsForm"
        :rules="addGoodsRules"
        label-position="top"
        ref="addGoodsFormRef"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          @tab-click="tabClick"
          :before-leave="tabBeforeLeave"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="Number">
              <el-input
                v-model="addGoodsForm.goods_price"
                type="Number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsForm.goods_weight"
                type="Number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsForm.goods_number"
                type="Number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="options"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  children: 'children',
                  value: 'cat_id',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyDate"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox
                  :label="cb"
                  border
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyDate"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片（上传图片） -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
              :headers="headersObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-dialog
              title="图片预览"
              :visible.sync="dialogVisible"
              width="40%"
            >
              <img :src="previewUrl" alt="" style="width: 100%" />
            </el-dialog>
          </el-tab-pane>
          <!-- 商品内容（富文本编辑框） -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce" />
            <!-- 添加商品按钮按钮 -->
            <el-button
              type="primary"
              @click="addGoodsBtn"
              style="margin-top: 15px"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/**
 * 公共组件
 */
import Breadcrumb from 'components/content/Breadcrumb.vue'

export default {
  data() {
    return {
      // steps当前活跃的下标
      activeIndex: '',
      // 表单数据对象
      addGoodsForm: {
        // 基本信息
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        // 选中商品分类数组（级连选择器绑定的值）
        goods_cat: [],
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        // 动态参数和静态属性
        attrs: [],
      },
      // 表单规则对象
      addGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
      // 级连选择器选项
      options: [],
      // 动态参数列表
      manyDate: [],
      // 静态参数列表
      onlyDate: [],
      // 当前选中的id
      curCateId: '',
      // 文件上传的地址
      uploadURL: 'http://1.117.1.94:8889/api/private/v1/upload',
      // 图片上传请求头
      headersObj: {
        Authorization: sessionStorage.getItem('token'),
      },
      // 图片预览对话框
      dialogVisible: false,
      // 预览图片的地址
      previewUrl: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取分类列表
    async getCateList() {
      this.addGoodsDialogVisible = true
      const { data: result } = await this.$http({
        url: 'categories',
      })
      if (result.meta.status !== 200) {
        return this.$message.error('商品分类数据获取失败')
      }
      this.options = result.data
    },

    // 级连选择器选择方法
    handleChange() {
      // 只能选择三级分类
      if (this.addGoodsForm.goods_cat.length !== 3) {
        return (this.addGoodsForm.goods_cat = [])
      }
      // 当前选中的id
      this.curCateId = this.addGoodsForm.goods_cat[2]
    },

    // tab 切换前调用
    tabBeforeLeave(activeName, oldActiveName) {
      if (this.addGoodsForm.goods_cat.length !== 3 && oldActiveName === '0') {
        this.$message.error('请选择商品分类，再进行切换！')
        return false
      }
    },
    // tab 点击事件
    async tabClick() {
      if (this.activeIndex === '1') {
        // 获取动态参数列表
        const { data: result } = await this.$http({
          url: {
            name: 'params',
            params: {
              id: this.curCateId,
            },
          },
          params: {
            sel: 'many',
          },
        })
        if (result.meta.status !== 200) {
          return this.$message.error('商品动态参数列表获取失败')
        }
        // 拆分成一个数组
        result.data.forEach(item => {
          // 如果长度字符串长度为0，返回一个空数组
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })

        this.manyDate = result.data
      } else if (this.activeIndex === '2') {
        // 获取静态属性列表
        const { data: result } = await this.$http({
          url: {
            name: 'params',
            params: {
              id: this.curCateId,
            },
          },
          params: {
            sel: 'only',
          },
        })
        if (result.meta.status !== 200) {
          return this.$message.error('静态商品静态属性列表获取失败')
        }
        this.onlyDate = result.data
      }
    },
    // 图片预览方法
    handlePreview(file) {
      this.dialogVisible = true
      // 保存预览图片的地址
      this.previewUrl = file.response.data.url
    },
    // 文件移除时调用
    handleRemove(file) {
      const res = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex(item => {
        return item.pic === res
      })
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 文件上传成功时调用
    handleSuccess(res) {
      this.addGoodsForm.pics.push({ pic: res.data.tmp_path })
    },
    // 添加商品按钮
    addGoodsBtn() {
      this.$refs.addGoodsFormRef.validate(async boo => {
        if (!boo) {
          return this.$message.error('请按需填写商品信息')
        }
        const form = JSON.parse(JSON.stringify(this.addGoodsForm))
        form.goods_cat = form.goods_cat.join(',')

        console.log(this.manyDate)
        console.log(this.onlyDate)

        this.manyDate.forEach(item => {
          const objInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addGoodsForm.attrs.push(objInfo)
        })

        this.onlyDate.forEach(item => {
          const objInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addGoodsForm.attrs.push(objInfo)
        })
        form.attrs = this.addGoodsForm.attrs
        const { data: result } = await this.$http({
          method: 'post',
          url: 'goods',
          data: form,
        })
        if (result.meta.status !== 201) {
          return this.$message.error('商品添加失败')
        }
        this.$message.success('商品添加成功')
        this.$router.back()
      })
    },
  },
  components: {
    Breadcrumb,
  },
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
</style>