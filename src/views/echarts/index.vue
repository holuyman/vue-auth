<template>
  <div>
    <div id="myChart" :style="{width: '100vw', height: '100vh'}"></div>
  </div>
</template>
<script>
export default {
  name: 'echarts',
  data() {
    return {
      charts: null,
      myChart: null,
    }
  },
  mounted() {
    // this.init()
    ;(this.myChart = this.$echarts.init(document.getElementById('myChart'))),
      this.sockets.subscribe('test', data => {
        this.msg = data.message
      })
  },
  sockets: {
    connect(data) {
      console.log(data)
      console.log('链接成功')
    },
    disconnect() {
      console.log('断开链接')
    },
    reconnect() {
      console.log('重新链接')
    },
    //客户端接收后台传输的socket事件
    events(data) {
      this.$notify({
        title: '新消息',
        message: data,
        type: 'warnning',
        duration: 5000,
      })
      console.log('data', data) //接收的消息
    },
    addCart(data) {
      console.log('1111' + data)
    },
    test(data) {
      // console.log(data)
      this.charts = data
      this.init()
      this.myChart.setOption({
        legend: {
          selected: {
            出口: false,
            入口: false,
          },
        },
      })
      this.myChart.setOption({
        legend: {
          selected: {
            出口: true,
            入口: true,
          },
        },
      })
    },
  },
  methods: {
    getMessage() {
      this.$socket.emit('events', {
        name: 'ajanuw',
      })
      this.$socket.emit('events', {
        name: 'alone',
      })

      this.$socket.emit('addCart', 'addCart')
      // this.sockets.unsubscribe('EVENT_NAME')
    },
    init() {
      // 基于准备好的dom，初始化echarts实例

      let charts = this.charts
      console.log(charts)
      // 绘制图表
      // charts = {
      //   unit: 'Kbps',
      //   names: ['出口', '入口'],
      //   lineX: [
      //     '2018-11-11 17:01',
      //     '2018-11-11 17:02',
      //     '2018-11-11 17:03',
      //     '2018-11-11 17:04',
      //     '2018-11-11 17:05',
      //     '2018-11-11 17:06',
      //     '2018-11-11 17:07',
      //     '2018-11-11 17:08',
      //     '2018-11-11 17:09',
      //     '2018-11-11 17:10',
      //     '2018-11-11 17:11',
      //     '2018-11-11 17:12',
      //     '2018-11-11 17:13',
      //     '2018-11-11 17:14',
      //     '2018-11-11 17:15',
      //     '2018-11-11 17:16',
      //     '2018-11-11 17:17',
      //     '2018-11-11 17:18',
      //     '2018-11-11 17:19',
      //     '2018-11-11 17:20',
      //   ],
      //   value: [
      //     [
      //       451,
      //       352,
      //       303,
      //       534,
      //       95,
      //       236,
      //       217,
      //       328,
      //       159,
      //       151,
      //       231,
      //       192,
      //       453,
      //       524,
      //       165,
      //       236,
      //       527,
      //       328,
      //       129,
      //       530,
      //     ],
      //   ],
      // }
      var max = Math.max(...charts.value[0])
      var min = Math.min(...charts.value[0])
      const percent25 = (max - min) * 0.25
      const percent50 = (max - min) * 0.5
      const percent75 = (max - min) * 0.75
      const peakPercent = (max - percent75) / max
      var color = ['rgba(23, 255, 243', 'rgba(255,100,97']
      var lineY = []

      for (var i = 0; i < charts.names.length; i++) {
        var x = i
        if (x > color.length - 1) {
          x = color.length - 1
        }
        var data = {
          name: charts.names[i],
          type: 'line',
          color: color[x] + ')',
          smooth: true,
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: color[x] + ', 0.3)',
                  },
                  {
                    offset: peakPercent,
                    color: color[x] + ', 0)',
                  },
                ],
                false,
              ),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10,
            },
          },
          symbol: 'circle',
          symbolSize: 5,
          data: charts.value[i],
        }
        lineY.push(data)
      }

      lineY[0].markLine = {
        silent: true,
        data: [
          {
            yAxis: percent25,
            label: {
              formatter() {
                return '25%'
              },
            },
          },
          {
            yAxis: percent50,
            label: {
              formatter() {
                return '50%'
              },
            },
          },
          {
            yAxis: percent75,
            label: {
              formatter() {
                return '75%'
              },
            },
          },
        ],
      }
      var option = {
        backgroundColor: '#1b2735',
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: charts.names,
          textStyle: {
            fontSize: 12,
            color: 'rgb(0,253,255,0.6)',
          },
          right: '4%',
        },
        grid: {
          top: '14%',
          left: '4%',
          right: '4%',
          bottom: '12%',
          containLabel: true,
        },
        visualMap: [
          {
            show: false,
            pieces: [
              {
                gt: 0,
                lt: 30,
                color: '#673CD1',
              },
              {
                gte: percent75,
                lt: max,
                color: 'rgba(23, 255, 243,0.3)',

                // backgroundColor: 'green',
              },
            ],

            outOfRange: {
              color: '#FF5D1D',
            },
          },
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: charts.lineX,
          axisLabel: {
            textStyle: {
              color: 'rgb(0,253,255,0.6)',
            },
            formatter: function(params) {
              return params.split(' ')[0] + '\n' + params.split(' ')[1]
            },
          },
        },
        yAxis: {
          name: charts.unit,
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: 'rgb(0,253,255,0.6)',
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgb(23,255,243,0.3)',
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgb(0,253,255,0.6)',
            },
          },
        },
        series: lineY,
      }
      this.myChart.setOption(option)
      // setInterval(() => {
      //   myChart.setOption({
      //     legend: {
      //       selected: {
      //         出口: false,
      //         入口: false,
      //       },
      //     },
      //   })
      //   myChart.setOption({
      //     legend: {
      //       selected: {
      //         出口: true,
      //         入口: true,
      //       },
      //     },
      //   })
      // }, 10000)
    },
  },
}
</script>