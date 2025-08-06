/**
 * Example ECharts options for each chart type
 */

import type { EChartsOption } from 'echarts'

export interface ChartExample {
  name: string
  category: string
  option: EChartsOption
}

export const chartExamples: ChartExample[] = [
  {
    name: 'Basic Line Chart',
    category: 'line',
    option: {
      title: {
        text: 'Weekly Temperature',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value',
        name: 'Temperature (°C)'
      },
      series: [{
        name: 'Temperature',
        type: 'line',
        data: [20, 22, 21, 23, 25, 26, 23],
        smooth: true,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Average' }]
        }
      }]
    }
  },
  {
    name: 'Stacked Bar Chart',
    category: 'bar',
    option: {
      title: {
        text: 'Sales by Region'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['Direct', 'Email', 'Affiliate', 'Video Ads', 'Search Engine']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Direct',
          type: 'bar',
          stack: 'total',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: 'Email',
          type: 'bar',
          stack: 'total',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Affiliate',
          type: 'bar',
          stack: 'total',
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    }
  },
  {
    name: 'Nested Pie Chart',
    category: 'pie',
    option: {
      title: {
        text: 'Browser Market Share',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Browser',
          type: 'pie',
          radius: [0, '30%'],
          label: {
            position: 'inner',
            fontSize: 14
          },
          data: [
            { value: 1548, name: 'Chrome' },
            { value: 775, name: 'Firefox' },
            { value: 679, name: 'Safari', selected: true }
          ]
        },
        {
          name: 'Version',
          type: 'pie',
          radius: ['45%', '60%'],
          labelLine: {
            length: 30
          },
          data: [
            { value: 1048, name: 'Chrome v89' },
            { value: 335, name: 'Chrome v88' },
            { value: 310, name: 'Firefox v87' },
            { value: 251, name: 'Firefox v86' },
            { value: 234, name: 'Safari v14.0' },
            { value: 147, name: 'Safari v13.1' }
          ]
        }
      ]
    }
  },
  {
    name: 'Bubble Scatter Chart',
    category: 'scatter',
    option: {
      title: {
        text: 'Height vs Weight'
      },
      xAxis: {
        name: 'Height (cm)',
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        name: 'Weight (kg)',
        nameLocation: 'middle',
        nameGap: 30
      },
      series: [{
        name: 'Male',
        type: 'scatter',
        symbolSize: (data: number[]) => Math.sqrt(data[2]) * 5,
        data: [[161.2, 51.6, 10], [167.5, 59.0, 12], [159.5, 49.2, 8], [157.0, 63.0, 15], [155.8, 53.6, 11]],
        itemStyle: {
          color: '#5470c6'
        }
      }, {
        name: 'Female',
        type: 'scatter',
        symbolSize: (data: number[]) => Math.sqrt(data[2]) * 5,
        data: [[168.2, 54.1, 9], [162.5, 58.2, 13], [160.0, 50.0, 7], [163.2, 55.9, 10], [165.5, 60.0, 14]],
        itemStyle: {
          color: '#fc8452'
        }
      }]
    }
  },
  {
    name: 'Radar Chart',
    category: 'radar',
    option: {
      title: {
        text: 'Skills Assessment'
      },
      legend: {
        data: ['Current Level', 'Target Level']
      },
      radar: {
        indicator: [
          { name: 'JavaScript', max: 100 },
          { name: 'TypeScript', max: 100 },
          { name: 'Vue.js', max: 100 },
          { name: 'React', max: 100 },
          { name: 'Node.js', max: 100 },
          { name: 'Python', max: 100 }
        ]
      },
      series: [{
        name: 'Skills',
        type: 'radar',
        data: [
          {
            value: [85, 80, 90, 70, 75, 60],
            name: 'Current Level',
            areaStyle: {
              opacity: 0.3
            }
          },
          {
            value: [95, 90, 95, 85, 85, 80],
            name: 'Target Level',
            areaStyle: {
              opacity: 0.3
            }
          }
        ]
      }]
    }
  },
  {
    name: 'Heatmap Calendar',
    category: 'heatmap',
    option: {
      title: {
        text: 'Activity Heatmap'
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          return `${params.data[0]}:00 ${params.data[1]}<br/>Value: ${params.data[2]}`
        }
      },
      grid: {
        height: '50%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [{
        name: 'Activity',
        type: 'heatmap',
        data: [[0,0,10],[0,1,20],[0,2,30],[1,0,40],[1,1,50],[1,2,60],[2,0,70],[2,1,80],[2,2,90]],
        label: {
          show: true
        }
      }]
    }
  },
  {
    name: 'Candlestick Chart',
    category: 'candlestick',
    option: {
      title: {
        text: 'Stock Price'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        type: 'category',
        data: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
        boundaryGap: false
      },
      yAxis: {
        type: 'value',
        scale: true
      },
      series: [{
        type: 'candlestick',
        data: [
          [20, 34, 10, 38], // open, close, lowest, highest
          [40, 35, 30, 50],
          [31, 38, 33, 44],
          [38, 15, 5, 42],
          [15, 25, 10, 30]
        ]
      }]
    }
  },
  {
    name: 'Funnel Chart',
    category: 'funnel',
    option: {
      title: {
        text: 'Sales Funnel'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
      },
      legend: {
        data: ['Visit', 'Click', 'Inquiry', 'Order', 'Payment']
      },
      series: [{
        name: 'Conversion',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: [
          { value: 100, name: 'Visit' },
          { value: 80, name: 'Click' },
          { value: 60, name: 'Inquiry' },
          { value: 40, name: 'Order' },
          { value: 20, name: 'Payment' }
        ]
      }]
    }
  },
  {
    name: 'Gauge Chart',
    category: 'gauge',
    option: {
      title: {
        text: 'Performance Meter'
      },
      series: [{
        name: 'Performance',
        type: 'gauge',
        progress: {
          show: true,
          width: 18
        },
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 15,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 25,
          color: '#999',
          fontSize: 14
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 25,
          itemStyle: {
            borderWidth: 10
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 50,
          offsetCenter: [0, '70%'],
          formatter: '{value}%'
        },
        data: [{
          value: 75,
          name: 'Score'
        }]
      }]
    }
  },
  {
    name: 'Sunburst Chart',
    category: 'sunburst',
    option: {
      title: {
        text: 'File System Structure'
      },
      series: [{
        type: 'sunburst',
        data: [{
          name: 'root',
          children: [{
            name: 'src',
            value: 15,
            children: [{
              name: 'components',
              value: 8
            }, {
              name: 'utils',
              value: 7
            }]
          }, {
            name: 'public',
            value: 10,
            children: [{
              name: 'images',
              value: 5
            }, {
              name: 'css',
              value: 5
            }]
          }]
        }],
        radius: [0, '90%'],
        label: {
          rotate: 'radial'
        }
      }]
    }
  },
  {
    name: 'Tree Chart',
    category: 'tree',
    option: {
      title: {
        text: 'Organization Chart'
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [{
        type: 'tree',
        data: [{
          name: 'CEO',
          children: [{
            name: 'CTO',
            children: [{
              name: 'Dev Manager'
            }, {
              name: 'QA Manager'
            }]
          }, {
            name: 'CFO',
            children: [{
              name: 'Accounting'
            }, {
              name: 'Finance'
            }]
          }]
        }],
        top: '1%',
        left: '20%',
        bottom: '1%',
        right: '20%',
        symbolSize: 7,
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          fontSize: 14
        }
      }]
    }
  },
  {
    name: 'Sankey Diagram',
    category: 'sankey',
    option: {
      title: {
        text: 'Energy Flow'
      },
      series: [{
        type: 'sankey',
        data: [
          { name: 'Coal' },
          { name: 'Oil' },
          { name: 'Gas' },
          { name: 'Electricity' },
          { name: 'Heat' },
          { name: 'Industry' },
          { name: 'Residential' }
        ],
        links: [
          { source: 'Coal', target: 'Electricity', value: 50 },
          { source: 'Oil', target: 'Heat', value: 30 },
          { source: 'Gas', target: 'Electricity', value: 40 },
          { source: 'Gas', target: 'Heat', value: 20 },
          { source: 'Electricity', target: 'Industry', value: 60 },
          { source: 'Electricity', target: 'Residential', value: 30 },
          { source: 'Heat', target: 'Industry', value: 20 },
          { source: 'Heat', target: 'Residential', value: 30 }
        ]
      }]
    }
  },
  {
    name: 'Graph Network',
    category: 'graph',
    option: {
      title: {
        text: 'Network Topology'
      },
      series: [{
        type: 'graph',
        layout: 'force',
        roam: true,
        data: [
          { id: '0', name: 'Node 1', symbolSize: 30, category: 0 },
          { id: '1', name: 'Node 2', symbolSize: 20, category: 1 },
          { id: '2', name: 'Node 3', symbolSize: 20, category: 1 },
          { id: '3', name: 'Node 4', symbolSize: 20, category: 2 },
          { id: '4', name: 'Node 5', symbolSize: 20, category: 2 }
        ],
        links: [
          { source: '0', target: '1' },
          { source: '0', target: '2' },
          { source: '1', target: '3' },
          { source: '2', target: '3' },
          { source: '2', target: '4' }
        ],
        categories: [
          { name: 'Primary' },
          { name: 'Secondary' },
          { name: 'Tertiary' }
        ],
        force: {
          repulsion: 100,
          edgeLength: 50
        }
      }]
    }
  },
  {
    name: 'Mixed Chart',
    category: 'mixed',
    option: {
      title: {
        text: 'Sales and Growth Rate'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Sales', 'Growth Rate']
      },
      xAxis: [{
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisPointer: {
          type: 'shadow'
        }
      }],
      yAxis: [{
        type: 'value',
        name: 'Sales',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} k'
        }
      }, {
        type: 'value',
        name: 'Growth Rate',
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: {
          formatter: '{value} %'
        }
      }],
      series: [{
        name: 'Sales',
        type: 'bar',
        data: [120, 132, 101, 134, 90, 230]
      }, {
        name: 'Growth Rate',
        type: 'line',
        yAxisIndex: 1,
        data: [10, 12, 8, 15, 7, 20],
        smooth: true
      }]
    }
  }
]

// Get examples by category
export function getExamplesByCategory(category: string): ChartExample[] {
  return chartExamples.filter(example => example.category === category)
}

// Get all categories
export function getCategories(): string[] {
  return [...new Set(chartExamples.map(example => example.category))]
}