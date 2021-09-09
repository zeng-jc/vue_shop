<template>
  <div id="main" style="width: 850px; height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      // 指定图表的配置项和数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
      },
    }
  },
  async mounted() {
    const { data: result } = await this.$http({
      url: 'reports',
    })
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'))
    // 合并请求的数据与配置项
    Object.assign(this.options, result.data)
    this.options.xAxis[0].boundaryGap = false

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.options)
  },
  methods: {},
}
</script>

<style>
</style>