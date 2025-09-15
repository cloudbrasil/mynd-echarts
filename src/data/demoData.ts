import type { EChartsOption } from 'echarts'

interface ChartDemo {
  id: string
  name: string
  category: string
  type: string
  description: string
  options: EChartsOption
}

interface AdvancedExample {
  id: string
  name: string
  description: string
  tags: string[]
  options: EChartsOption
}

export const chartCategories = ['line', 'bar', 'pie', 'scatter', 'radar', 'heatmap', 'tree', 'graph', 'other']

export const showcaseCharts: ChartDemo[] = [
  // Line Charts
  {
    id: 'line-basic',
    name: 'Basic Line Chart',
    category: 'line',
    type: 'Line Chart',
    description: 'Simple line chart with smooth curves',
    options: {
      title: { text: 'Weekly Temperature', left: 'left', top: 10 },
      tooltip: { trigger: 'axis' },
      grid: { top: 60, bottom: 60, left: 60, right: 60 },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
          restore: { show: true },
          dataView: { show: true },
          dataZoom: { show: true },
          magicType: { show: true, type: ['line', 'bar'] }
        }
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: { type: 'value', name: 'Temperature (°C)' },
      series: [{
        name: 'Temperature',
        type: 'line',
        data: [20, 22, 21, 23, 25, 26, 23],
        smooth: true,
        // Color will be handled by theme
      }]
    }
  },
  {
    id: 'line-area',
    name: 'Area Chart',
    category: 'line',
    type: 'Area Chart',
    description: 'Line chart with gradient area fill',
    options: {
      title: { text: 'Sales Trend', left: 'left', top: 10 },
      tooltip: { trigger: 'axis' },
      grid: { top: 60, bottom: 60, left: 60, right: 60 },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
          restore: { show: true },
          dataView: { show: true },
          dataZoom: { show: true },
          magicType: { show: true, type: ['line', 'bar'] }
        }
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      yAxis: { type: 'value', name: 'Sales (k)' },
      series: [{
        name: 'Sales',
        type: 'line',
        data: [120, 132, 101, 134, 90, 130],
        smooth: true,
        areaStyle: {
          opacity: 0.3
        }
      }]
    }
  },
  {
    id: 'line-stack',
    name: 'Stacked Line Chart',
    category: 'line',
    type: 'Stacked Line',
    description: 'Multiple lines stacked to show total',
    options: {
      title: { text: 'Traffic Sources', left: 'left', top: 10 },
      tooltip: { trigger: 'axis' },
      grid: { top: 80, bottom: 60, left: 60, right: 60 },
      legend: { bottom: 0, data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'] },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
          restore: { show: true },
          dataView: { show: true },
          dataZoom: { show: true },
          magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] }
        }
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: 'Email',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210],
          areaStyle: {}
        },
        {
          name: 'Union Ads',
          type: 'line',
          stack: 'Total',
          data: [220, 182, 191, 234, 290, 330, 310],
          areaStyle: {}
        },
        {
          name: 'Video Ads',
          type: 'line',
          stack: 'Total',
          data: [150, 232, 201, 154, 190, 330, 410],
          areaStyle: {}
        }
      ]
    }
  },

  // Bar Charts
  {
    id: 'bar-basic',
    name: 'Basic Bar Chart',
    category: 'bar',
    type: 'Bar Chart',
    description: 'Simple vertical bar chart',
    options: {
      title: { text: 'Monthly Sales', left: 'left', top: 10 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { top: 60, bottom: 60, left: 60, right: 60 },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
          restore: { show: true },
          dataView: { show: true },
          magicType: { show: true, type: ['line', 'bar', 'stack'] }
        }
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      },
      yAxis: { type: 'value', name: 'Sales ($)' },
      series: [{
        name: 'Sales',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110],
        // Color will be handled by theme
      }]
    }
  },
  {
    id: 'bar-horizontal',
    name: 'Horizontal Bar Chart',
    category: 'bar',
    type: 'Horizontal Bar',
    description: 'Bar chart with horizontal orientation',
    options: {
      title: { text: 'Top Programming Languages', left: 'left', top: 10 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { top: 60, bottom: 60, left: 100, right: 60 },
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: ['JavaScript', 'Python', 'Java', 'TypeScript', 'C#', 'PHP']
      },
      series: [{
        name: 'Usage',
        type: 'bar',
        data: [65, 59, 52, 48, 45, 38],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ]
          }
        }
      }]
    }
  },
  {
    id: 'bar-stack',
    name: 'Stacked Bar Chart',
    category: 'bar',
    type: 'Stacked Bar',
    description: 'Multiple series stacked on top of each other',
    options: {
      title: { text: 'Sales by Channel', left: 'left', top: 10 },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { bottom: 0, data: ['Direct', 'Email', 'Affiliate'] },
      grid: { top: 60, bottom: 40, left: 60, right: 60 },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: { type: 'value' },
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

  // Pie Charts
  {
    id: 'pie-basic',
    name: 'Basic Pie Chart',
    category: 'pie',
    type: 'Pie Chart',
    description: 'Simple pie chart with labels',
    options: {
      title: { text: 'Browser Market Share', left: 'left', top: 10 },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{
        name: 'Browser',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Chrome' },
          { value: 735, name: 'Firefox' },
          { value: 580, name: 'Safari' },
          { value: 484, name: 'Edge' },
          { value: 300, name: 'Others' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
  },
  {
    id: 'pie-doughnut',
    name: 'Doughnut Chart',
    category: 'pie',
    type: 'Doughnut',
    description: 'Pie chart with hollow center',
    options: {
      title: { text: 'Budget Distribution', left: 'left', top: 10 },
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [{
        name: 'Budget',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: { show: false },
        data: [
          { value: 1048, name: 'Marketing' },
          { value: 735, name: 'Development' },
          { value: 580, name: 'Operations' },
          { value: 484, name: 'HR' },
          { value: 300, name: 'Other' }
        ]
      }]
    }
  },
  {
    id: 'pie-rose',
    name: 'Rose Chart',
    category: 'pie',
    type: 'Rose Chart',
    description: 'Nightingale rose diagram',
    options: {
      title: { text: 'Product Categories', left: 'left', top: 10 },
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [{
        name: 'Category',
        type: 'pie',
        radius: [50, 150],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: { borderRadius: 8 },
        data: [
          { value: 40, name: 'Electronics' },
          { value: 38, name: 'Clothing' },
          { value: 32, name: 'Food' },
          { value: 30, name: 'Books' },
          { value: 28, name: 'Sports' },
          { value: 26, name: 'Toys' },
          { value: 22, name: 'Home' },
          { value: 18, name: 'Beauty' }
        ]
      }]
    }
  },

  // Scatter Charts
  {
    id: 'scatter-basic',
    name: 'Basic Scatter Plot',
    category: 'scatter',
    type: 'Scatter Plot',
    description: 'Simple scatter plot showing correlation',
    options: {
      title: { text: 'Height vs Weight', left: 'left', top: 10 },
      grid: { top: 60, bottom: 60, left: 60, right: 60 },
      xAxis: { name: 'Height (cm)', nameLocation: 'middle', nameGap: 30 },
      yAxis: { name: 'Weight (kg)', nameLocation: 'middle', nameGap: 30 },
      series: [{
        type: 'scatter',
        symbolSize: 20,
        data: [
          [161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0],
          [155.8, 53.6], [170.0, 59.0], [159.1, 47.6], [166.0, 69.8],
          [176.2, 66.8], [160.2, 75.2], [172.5, 55.2], [170.9, 54.2],
          [172.9, 62.5], [153.4, 42.0], [160.0, 50.0]
        ],
        // Color will be handled by theme
      }]
    }
  },
  {
    id: 'scatter-bubble',
    name: 'Bubble Chart',
    category: 'scatter',
    type: 'Bubble Chart',
    description: 'Scatter plot with variable bubble sizes',
    options: {
      title: { text: 'Product Performance', left: 'left', top: 10 },
      grid: { top: 60, bottom: 60, left: 60, right: 60 },
      xAxis: { name: 'Price ($)', type: 'value', scale: true },
      yAxis: { name: 'Rating', type: 'value', scale: true },
      series: [{
        name: 'Products',
        type: 'scatter',
        data: [
          [10.0, 4.5, 150], [23.2, 4.2, 89], [23.8, 3.9, 120],
          [30.0, 4.8, 200], [12.4, 4.0, 60], [18.5, 4.7, 180],
          [35.3, 4.9, 250], [45.0, 3.5, 40], [60.2, 4.3, 90],
          [75.5, 4.6, 160]
        ].map(item => ({
          value: item,
          symbolSize: Math.sqrt(item[2]) * 3
        })),
        itemStyle: {
          // Color will be handled by theme
        }
      }]
    }
  },

  // Radar Charts
  {
    id: 'radar-basic',
    name: 'Basic Radar Chart',
    category: 'radar',
    type: 'Radar Chart',
    description: 'Multi-dimensional data visualization',
    options: {
      title: { text: 'Skills Assessment', left: 'left', top: 10 },
      legend: { bottom: 0, data: ['Current', 'Target'] },
      radar: {
        indicator: [
          { name: 'JavaScript', max: 100 },
          { name: 'Python', max: 100 },
          { name: 'React', max: 100 },
          { name: 'Node.js', max: 100 },
          { name: 'Database', max: 100 },
          { name: 'DevOps', max: 100 }
        ]
      },
      series: [{
        name: 'Skills',
        type: 'radar',
        data: [
          {
            value: [85, 75, 90, 80, 70, 65],
            name: 'Current',
            areaStyle: { opacity: 0.3 }
          },
          {
            value: [95, 85, 95, 90, 85, 80],
            name: 'Target',
            areaStyle: { opacity: 0.3 }
          }
        ]
      }]
    }
  },

  // Heatmap
  {
    id: 'heatmap-basic',
    name: 'Basic Heatmap',
    category: 'heatmap',
    type: 'Heatmap',
    description: 'Data density visualization',
    options: {
      title: { text: 'Activity Heatmap', left: 'left', top: 10 },
      tooltip: { position: 'top' },
      grid: { height: '50%', top: '10%' },
      xAxis: {
        type: 'category',
        data: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
        splitArea: { show: true }
      },
      yAxis: {
        type: 'category',
        data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        splitArea: { show: true }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'left',
        bottom: '15%'
      },
      series: [{
        name: 'Activity',
        type: 'heatmap',
        data: [
          [0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67],
          [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48],
          [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52],
          [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16],
          [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115],
          [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120],
          [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96],
          [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30]
        ].map(item => [item[0], item[1], item[2] || '-']),
        label: { show: true }
      }]
    }
  },

  // Tree
  {
    id: 'tree-basic',
    name: 'Basic Tree',
    category: 'tree',
    type: 'Tree Diagram',
    description: 'Hierarchical data structure',
    options: {
      title: { text: 'Organization Structure', left: 'left', top: 10 },
      tooltip: { trigger: 'item', triggerOn: 'mousemove' },
      series: [{
        type: 'tree',
        data: [{
          name: 'CEO',
          children: [
            {
              name: 'CTO',
              children: [
                { name: 'Dev Manager', children: [{ name: 'Dev Team' }] },
                { name: 'QA Manager', children: [{ name: 'QA Team' }] }
              ]
            },
            {
              name: 'CFO',
              children: [
                { name: 'Accounting' },
                { name: 'Finance' }
              ]
            },
            {
              name: 'CMO',
              children: [
                { name: 'Marketing' },
                { name: 'Sales' }
              ]
            }
          ]
        }],
        top: '10%',
        left: '20%',
        bottom: '10%',
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

  // Graph
  {
    id: 'graph-force',
    name: 'Force-Directed Graph',
    category: 'graph',
    type: 'Network Graph',
    description: 'Network relationship visualization',
    options: {
      title: { text: 'Network Topology', left: 'left', top: 10 },
      series: [{
        type: 'graph',
        layout: 'force',
        roam: true,
        data: [
          { id: '0', name: 'Node 1', symbolSize: 40, category: 0 },
          { id: '1', name: 'Node 2', symbolSize: 30, category: 1 },
          { id: '2', name: 'Node 3', symbolSize: 30, category: 1 },
          { id: '3', name: 'Node 4', symbolSize: 25, category: 2 },
          { id: '4', name: 'Node 5', symbolSize: 25, category: 2 },
          { id: '5', name: 'Node 6', symbolSize: 20, category: 3 }
        ],
        links: [
          { source: '0', target: '1' },
          { source: '0', target: '2' },
          { source: '1', target: '3' },
          { source: '2', target: '3' },
          { source: '2', target: '4' },
          { source: '3', target: '5' },
          { source: '4', target: '5' }
        ],
        categories: [
          { name: 'Primary' },
          { name: 'Secondary' },
          { name: 'Tertiary' },
          { name: 'Quaternary' }
        ],
        force: {
          repulsion: 100,
          edgeLength: [50, 100]
        }
      }]
    }
  },

  // Other Charts
  {
    id: 'gauge-basic',
    name: 'Gauge Chart',
    category: 'other',
    type: 'Gauge',
    description: 'Performance meter visualization',
    options: {
      title: { text: 'Performance Meter', left: 'left', top: 10 },
      series: [{
        name: 'Performance',
        type: 'gauge',
        progress: { show: true, width: 18 },
        axisLine: { lineStyle: { width: 18 } },
        axisTick: { show: false },
        splitLine: { length: 15, lineStyle: { width: 2 } },
        axisLabel: { distance: 25, fontSize: 14 },
        anchor: { show: true, showAbove: true, size: 25, itemStyle: { borderWidth: 10 } },
        detail: {
          valueAnimation: true,
          fontSize: 50,
          offsetCenter: [0, '70%'],
          formatter: '{value}%'
        },
        data: [{ value: 75 }]
      }]
    }
  },
  {
    id: 'funnel-basic',
    name: 'Funnel Chart',
    category: 'other',
    type: 'Funnel',
    description: 'Conversion funnel visualization',
    options: {
      title: { text: 'Sales Funnel', left: 'left', top: 10 },
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c}%' },
      legend: { bottom: 0 },
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
    id: 'sankey-basic',
    name: 'Sankey Diagram',
    category: 'other',
    type: 'Sankey',
    description: 'Flow visualization',
    options: {
      title: { text: 'Energy Flow', left: 'left', top: 10 },
      series: [{
        type: 'sankey',
        layout: 'none',
        top: 60,
        bottom: 20,
        left: 20,
        right: 120,
        emphasis: { focus: 'adjacency' },
        data: [
          { name: 'Coal' },
          { name: 'Gas' },
          { name: 'Oil' },
          { name: 'Electricity' },
          { name: 'Heat' },
          { name: 'Industry' },
          { name: 'Residential' }
        ],
        links: [
          { source: 'Coal', target: 'Electricity', value: 40 },
          { source: 'Gas', target: 'Electricity', value: 35 },
          { source: 'Gas', target: 'Heat', value: 25 },
          { source: 'Oil', target: 'Heat', value: 30 },
          { source: 'Electricity', target: 'Industry', value: 50 },
          { source: 'Electricity', target: 'Residential', value: 25 },
          { source: 'Heat', target: 'Industry', value: 25 },
          { source: 'Heat', target: 'Residential', value: 30 }
        ]
      }]
    }
  },

  // Charts with Formatter Functions
  {
    id: 'line-custom-tooltip',
    name: 'Line with Custom Tooltip',
    category: 'line',
    type: 'Line Chart',
    description: 'Line chart with custom tooltip formatter function',
    options: {
      title: { text: 'Temperature with Custom Tooltip', left: 'left', top: 10 },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const param = params[0];
          return `<div style="padding: 10px;">
            <strong>${param.name}</strong><br/>
            Temperature: <span style="color: ${param.color}; font-weight: bold;">${param.value}°C</span><br/>
            <small>Status: ${param.value > 25 ? '🔥 Hot' : param.value > 20 ? '☀️ Warm' : '❄️ Cool'}</small>
          </div>`;
        }
      },
      grid: { top: 60, bottom: 60, left: 60, right: 60 },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value',
        name: 'Temperature',
        axisLabel: {
          formatter: '{value}°C'
        }
      },
      series: [{
        name: 'Temperature',
        type: 'line',
        data: [18, 22, 25, 28, 27, 21, 19],
        smooth: true
      }]
    }
  },
  {
    id: 'bar-formatted-labels',
    name: 'Bar with Formatted Labels',
    category: 'bar',
    type: 'Bar Chart',
    description: 'Bar chart with formatted axis labels and values',
    options: {
      title: { text: 'Sales Performance', left: 'left', top: 10 },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          return params[0].name + '<br/>' +
            params.map(function(item) {
              return item.marker + ' ' + item.seriesName + ': $' +
                (item.value * 1000).toLocaleString();
            }).join('<br/>');
        }
      },
      grid: { top: 60, bottom: 60, left: 80, right: 60 },
      xAxis: {
        type: 'category',
        data: ['Q1', 'Q2', 'Q3', 'Q4']
      },
      yAxis: {
        type: 'value',
        name: 'Revenue (k)',
        axisLabel: {
          formatter: function(value) {
            return '$' + value + 'k';
          }
        }
      },
      series: [{
        name: 'Revenue',
        type: 'bar',
        data: [320, 430, 380, 520],
        label: {
          show: true,
          position: 'top',
          formatter: function(params) {
            return '$' + (params.value * 1000).toLocaleString();
          }
        }
      }]
    }
  },
  {
    id: 'pie-percentage-formatter',
    name: 'Pie with Percentage Labels',
    category: 'pie',
    type: 'Pie Chart',
    description: 'Pie chart with percentage calculation in formatter',
    options: {
      title: { text: 'Market Share Analysis', left: 'center', top: 10 },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return `<strong>${params.name}</strong><br/>
            Value: ${params.value}<br/>
            Percentage: ${params.percent}%<br/>
            Rank: #${params.dataIndex + 1}`;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: '15%'
      },
      series: [{
        name: 'Market Share',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: [
          { value: 335, name: 'Product A' },
          { value: 310, name: 'Product B' },
          { value: 234, name: 'Product C' },
          { value: 135, name: 'Product D' },
          { value: 88, name: 'Product E' }
        ],
        label: {
          formatter: function(params) {
            return params.name + '\n' + params.percent + '%';
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
  },
  {
    id: 'scatter-coordinate-formatter',
    name: 'Scatter with Coordinate Display',
    category: 'scatter',
    type: 'Scatter Plot',
    description: 'Scatter plot with coordinate formatter',
    options: {
      title: { text: 'Data Point Distribution', left: 'left', top: 10 },
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return `Point ${params.dataIndex + 1}<br/>
            X: ${params.value[0].toFixed(2)}<br/>
            Y: ${params.value[1].toFixed(2)}<br/>
            Size: ${params.value[2]}`;
        }
      },
      grid: { top: 60, bottom: 60, left: 60, right: 60 },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: function(value) {
            return value.toFixed(1);
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function(value) {
            return value.toFixed(1);
          }
        }
      },
      series: [{
        name: 'Data Points',
        type: 'scatter',
        symbolSize: function(data) {
          return Math.sqrt(data[2]) * 5;
        },
        data: [
          [10.5, 35.2, 100],
          [15.3, 42.1, 150],
          [20.8, 28.5, 200],
          [25.2, 50.3, 120],
          [30.1, 45.7, 180],
          [35.5, 38.2, 250],
          [40.2, 55.1, 140],
          [45.8, 48.3, 190]
        ]
      }]
    }
  }
]

export const advancedExamples: AdvancedExample[] = [
  {
    id: 'dashboard-1',
    name: 'Sales Dashboard',
    description: 'Comprehensive sales dashboard with revenue and growth metrics',
    tags: ['dashboard', 'business', 'interactive'],
    options: {
      title: {
        text: 'Sales Performance Dashboard',
        subtext: 'Q4 2023',
        left: 'left',
        top: 10
      },
      tooltip: { 
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['Revenue', 'Profit', 'Growth Rate'],
        bottom: 10
      },
      grid: {
        top: 80,
        bottom: 80,
        left: 80,
        right: 80,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisPointer: {
          type: 'shadow'
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Revenue ($M)',
          position: 'left',
          axisLabel: {
            formatter: '${value}M'
          }
        },
        {
          type: 'value',
          name: 'Growth Rate (%)',
          position: 'right',
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: 'Revenue',
          type: 'bar',
          data: [120, 132, 101, 134, 90, 230, 210, 182, 191, 234, 260, 280],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ]
            }
          }
        },
        {
          name: 'Profit',
          type: 'bar',
          data: [80, 88, 67, 89, 60, 153, 140, 121, 127, 156, 173, 186],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#90ec7d' },
                { offset: 0.5, color: '#73c0de' },
                { offset: 1, color: '#73c0de' }
              ]
            }
          }
        },
        {
          name: 'Growth Rate',
          type: 'line',
          yAxisIndex: 1,
          data: [10, 10.2, -5.3, 32.7, -11.2, 155.6, -8.7, -13.5, 4.9, 22.3, 11.1, 7.7],
          smooth: true,
          // Color will be handled by theme,
          lineStyle: { width: 3 },
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'Average' }
            ]
          }
        }
      ]
    }
  },
  {
    id: 'realtime-1',
    name: 'Real-time Monitoring',
    description: 'Live data streaming visualization with dynamic updates',
    tags: ['realtime', 'monitoring', 'animated'],
    options: {
      title: { text: 'System Performance Monitor', left: 'left', top: 10 },
      tooltip: { trigger: 'axis', axisPointer: { animation: false } },
      legend: { data: ['CPU', 'Memory', 'Network'], bottom: 0 },
      grid: {
        top: 60,
        bottom: 60,
        left: 60,
        right: 60
      },
      xAxis: {
        type: 'time',
        splitLine: { show: false }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: { show: false },
        max: 100
      },
      series: [
        {
          name: 'CPU',
          type: 'line',
          showSymbol: false,
          data: generateTimeData(),
          smooth: true,
          // Color will be handled by theme
        },
        {
          name: 'Memory',
          type: 'line',
          showSymbol: false,
          data: generateTimeData(),
          smooth: true,
          // Color will be handled by theme
        },
        {
          name: 'Network',
          type: 'line',
          showSymbol: false,
          data: generateTimeData(),
          smooth: true,
          // Color will be handled by theme
        }
      ]
    }
  },
  {
    id: 'geo-1',
    name: 'Regional Sales Heatmap',
    description: 'Sales performance visualization by region and quarter',
    tags: ['heatmap', 'geographic', 'sales'],
    options: {
      title: { text: 'Sales by Region', left: 'left', top: 10 },
      tooltip: { 
        trigger: 'item',
        formatter: (params: any) => {
          const value = params.value
          if (value && value.length === 3) {
            return `${params.name}<br/>Quarter: Q${value[0] + 1}<br/>Sales: $${value[2]}k`
          }
          return params.name
        }
      },
      grid: {
        top: 100,
        bottom: 100,
        left: 150,
        right: 100
      },
      xAxis: {
        type: 'category',
        data: ['Q1', 'Q2', 'Q3', 'Q4'],
        splitArea: { show: true }
      },
      yAxis: {
        type: 'category',
        data: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'],
        splitArea: { show: true }
      },
      visualMap: {
        min: 0,
        max: 1000,
        calculable: true,
        orient: 'horizontal',
        left: 'left',
        bottom: 20,
        inRange: {
          color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
        }
      },
      series: [{
        name: 'Sales',
        type: 'heatmap',
        data: [
          [0, 0, 850], [1, 0, 920], [2, 0, 780], [3, 0, 890],
          [0, 1, 720], [1, 1, 680], [2, 1, 750], [3, 1, 810],
          [0, 2, 680], [1, 2, 620], [2, 2, 700], [3, 2, 650],
          [0, 3, 550], [1, 3, 580], [2, 3, 520], [3, 3, 600],
          [0, 4, 480], [1, 4, 450], [2, 4, 490], [3, 4, 510],
          [0, 5, 420], [1, 5, 440], [2, 5, 410], [3, 5, 430],
          [0, 6, 380], [1, 6, 360], [2, 6, 390], [3, 6, 370],
          [0, 7, 320], [1, 7, 340], [2, 7, 310], [3, 7, 330]
        ],
        label: {
          show: true,
          formatter: (params: any) => `$${params.value[2]}`
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    }
  },
  {
    id: 'financial-1',
    name: 'Stock Analysis',
    description: 'Candlestick chart with moving averages',
    tags: ['financial', 'stocks', 'candlestick'],
    options: {
      title: { text: 'Stock Price Analysis', left: 'left', top: 10 },
      tooltip: { 
        trigger: 'axis', 
        axisPointer: { 
          type: 'cross' 
        }
      },
      legend: { 
        data: ['Stock Price', 'MA5', 'MA20'], 
        bottom: 10 
      },
      grid: {
        top: 80,
        bottom: 80,
        left: 80,
        right: 80,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: generateDates(30),
        scale: true,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false }
      },
      yAxis: {
        scale: true,
        splitArea: { show: true }
      },
      series: [
        {
          name: 'Stock Price',
          type: 'candlestick',
          data: generateCandlestickData(),
          itemStyle: {
            color: '#ef5350',
            color0: '#26a69a',
            borderColor: '#ef5350',
            borderColor0: '#26a69a'
          },
          markPoint: {
            data: [
              { type: 'max', name: 'Max', valueDim: 'highest' },
              { type: 'min', name: 'Min', valueDim: 'lowest' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: 'Average', valueDim: 'close' }
            ]
          }
        },
        {
          name: 'MA5',
          type: 'line',
          data: generateMA(5),
          smooth: true,
          lineStyle: { 
            opacity: 0.7,
            width: 2
          },
          itemStyle: {
            color: '#ffa726'
          }
        },
        {
          name: 'MA20',
          type: 'line',
          data: generateMA(20),
          smooth: true,
          lineStyle: { 
            opacity: 0.7,
            width: 2
          },
          itemStyle: {
            color: '#66bb6a'
          }
        }
      ]
    }
  }
]

// Helper functions
function generateTimeData(): Array<{ name: string; value: [string, number] }> {
  const data: Array<{ name: string; value: [string, number] }> = []
  const now = new Date()
  for (let i = 0; i < 20; i++) {
    const time = new Date(now.getTime() - (20 - i) * 1000)
    data.push({
      name: time.toString(),
      value: [
        time.toISOString(),
        Math.round(Math.random() * 100)
      ]
    })
  }
  return data
}

function generateDates(days: number): string[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = days; i > 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

function generateCandlestickData(): number[][] {
  const data: number[][] = []
  let basePrice = 100
  for (let i = 0; i < 30; i++) {
    const open = basePrice + Math.random() * 10 - 5
    const close = open + Math.random() * 10 - 5
    const low = Math.min(open, close) - Math.random() * 5
    const high = Math.max(open, close) + Math.random() * 5
    data.push([open, close, low, high])
    basePrice = close
  }
  return data
}

function generateMA(period: number): number[] {
  return Array(30).fill(0).map(() => 100 + Math.random() * 20)
}

function generateVolumeData(): number[] {
  return Array(30).fill(0).map(() => Math.random() * 1000000)
}