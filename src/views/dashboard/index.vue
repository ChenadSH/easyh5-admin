<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <!-- 签到饼图 -->
    <div :id="id" class="chartContainer" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
// var echarts = require('echarts/lib/echarts')
import { getChartsInfo } from '@/api/user'
export default {
  name: 'Dashboard',
  data() {
    return {
      id: 'chart',
      chart: null
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      console.log(echarts)
      this.chart = echarts.init(document.getElementById(this.id))
      getChartsInfo({})
        .then((response) => {
          // console.log(response)
          this.setOptions(response.data)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    setOptions(response) {
      this.chart.setOption({
        title: {
          text: '签到用户信息总览',
          subtext: '媒体总数:' + response.total1+',来宾总数:'+response.total2, // +' '+',打开总人数:' + response.total
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '人数',
            type: 'pie',
            radius: '50%',
            data: [
              // { value: response.checked, name: '已签到人数:'+response.checked },
              {
                value: response.unchecked1,
                name: '媒体未签到:' + response.unchecked1
              },
              {
                value: response.unchecked2,
                name: '来宾未签到:' + response.unchecked2
              },
              {
                value: response.checked1,
                name: '媒体已签到:' + response.checked1
              },
              {
                value: response.checked2,
                name: '来宾已签到:' + response.checked2
              }
              // { value: 484, name: 'Union Ads' },
              // { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

@media screen and (max-width: 1000px) {
  .chartContainer {
    width: 120%;
    height: 500px;
  }
  .dashboard-container {
    margin: 3vw;
  }
  .chartContainer div {
    margin-right: 0 !important;
  }
}
@media screen and (min-width: 1000px) {
  .chartContainer {
    width: 500px;
    height: 500px;
  }
}
</style>
