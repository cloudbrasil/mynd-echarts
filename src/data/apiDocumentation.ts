export const apiDocumentation = {
  examples: `
# Examples

## Setup in Your Project

### 1. Import Styles (Important!)

\`\`\`javascript
// In your main.js or App.vue
import '@docbrasil/mynd-echarts/dist/style.css'
\`\`\`

### 2. Global Registration

\`\`\`javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { MyndEcharts } from '@docbrasil/mynd-echarts'
import '@docbrasil/mynd-echarts/dist/style.css'

const app = createApp(App)
app.component('MyndEcharts', MyndEcharts)
app.mount('#app')
\`\`\`

### 3. Local Registration

\`\`\`vue
<template>
  <MyndEcharts :options="chartOptions" />
</template>

<script setup>
import { MyndEcharts } from '@docbrasil/mynd-echarts'
import '@docbrasil/mynd-echarts/dist/style.css'

const chartOptions = {
  title: { text: 'My Chart' },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150] }]
}
</script>
\`\`\`

## Common Examples

### Basic Bar Chart

\`\`\`vue
<template>
  <div class="chart-container">
    <MyndEcharts 
      :options="barChartOptions" 
      :style="{ width: '100%', height: '400px' }"
    />
  </div>
</template>

<script setup>
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const barChartOptions = {
  title: {
    text: 'Monthly Sales',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  yAxis: {
    type: 'value',
    name: 'Sales ($)'
  },
  series: [{
    name: 'Sales',
    type: 'bar',
    data: [12000, 19000, 15000, 25000, 22000, 30000],
    itemStyle: {
      color: '#5470c6'
    }
  }]
}
</script>
\`\`\`

### Line Chart with Multiple Series

\`\`\`vue
<template>
  <MyndEcharts 
    :options="lineChartOptions"
    :loading="isLoading"
    class-name="my-line-chart"
  />
</template>

<script setup>
import { ref } from 'vue'
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const isLoading = ref(false)

const lineChartOptions = {
  title: { text: 'Temperature Trends' },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Max Temp', 'Min Temp'],
    bottom: 0
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value',
    name: 'Temperature (°C)'
  },
  series: [
    {
      name: 'Max Temp',
      type: 'line',
      data: [28, 29, 31, 30, 29, 27, 26],
      smooth: true
    },
    {
      name: 'Min Temp',
      type: 'line',
      data: [18, 19, 20, 21, 19, 17, 16],
      smooth: true
    }
  ]
}
</script>
\`\`\`

### Pie Chart with Custom Theme

\`\`\`vue
<template>
  <MyndEcharts 
    :options="pieChartOptions"
    :theme="customTheme"
    renderer="svg"
  />
</template>

<script setup>
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const customTheme = {
  color: ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53'],
  backgroundColor: '#f7f7f7'
}

const pieChartOptions = {
  title: {
    text: 'Market Share',
    left: 'center',
    top: 20
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [{
    name: 'Market Share',
    type: 'pie',
    radius: '50%',
    data: [
      { value: 1048, name: 'Product A' },
      { value: 735, name: 'Product B' },
      { value: 580, name: 'Product C' },
      { value: 484, name: 'Product D' },
      { value: 300, name: 'Product E' }
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
</script>
\`\`\`

### Dynamic Updates with Reactive Data

\`\`\`vue
<template>
  <div>
    <MyndEcharts 
      ref="chartRef"
      :options="chartOptions"
      :not-merge="false"
      @ready="onChartReady"
      @click="handleChartClick"
    />
    <button @click="updateData">Update Data</button>
    <button @click="addSeries">Add Series</button>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const chartRef = ref()
const chartData = reactive({
  values: [120, 200, 150, 80, 70, 110, 130]
})

const chartOptions = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    data: chartData.values
  }]
})

// Watch for data changes
watch(() => chartData.values, (newValues) => {
  chartOptions.value.series[0].data = [...newValues]
}, { deep: true })

const onChartReady = (instance) => {
  console.log('Chart is ready!', instance)
}

const handleChartClick = (params) => {
  console.log('Clicked:', params.name, params.value)
}

const updateData = () => {
  chartData.values = chartData.values.map(() => 
    Math.floor(Math.random() * 300)
  )
}

const addSeries = () => {
  chartOptions.value = {
    ...chartOptions.value,
    series: [
      ...chartOptions.value.series,
      {
        type: 'line',
        data: [100, 150, 200, 120, 90, 160, 110]
      }
    ]
  }
}
</script>
\`\`\`

### Chart with Fixed Toolbox (Prevents Overlap Issues)

\`\`\`vue
<template>
  <MyndEcharts 
    :options="chartWithToolbox"
    toolbox-mode="fixed"
    :toolbox-position="{ right: 20, top: 20 }"
    :fix-toolbox-overlap="true"
    :debug-toolbox="isDevelopment"
    @toolbox-overlap-detected="handleOverlap"
  />
</template>

<script setup>
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const isDevelopment = process.env.NODE_ENV === 'development'

const chartWithToolbox = {
  title: { text: 'Sales Dashboard' },
  toolbox: {
    show: true,
    feature: {
      dataZoom: { show: true },
      dataView: { show: true },
      magicType: { 
        show: true,
        type: ['line', 'bar', 'stack'] 
      },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  xAxis: {
    type: 'category',
    data: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    data: [320, 302, 301, 334]
  }]
}

const handleOverlap = (event) => {
  console.warn('Toolbox overlap detected:', event)
  // Could trigger manual fix if needed
  chartRef.value?.refreshToolbox()
}
</script>
\`\`\`

### Responsive Chart with Auto-Resize

\`\`\`vue
<template>
  <div class="responsive-container">
    <MyndEcharts 
      :options="responsiveChart"
      :auto-resize="true"
      :style="{ width: '100%', height: '100%' }"
    />
  </div>
</template>

<script setup>
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const responsiveChart = {
  title: {
    text: 'Responsive Chart',
    left: 'center'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D', 'E']
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    data: [10, 22, 28, 23, 19],
    smooth: true,
    areaStyle: {}
  }]
}
</script>

<style scoped>
.responsive-container {
  width: 100%;
  height: 50vh;
  min-height: 300px;
  max-height: 600px;
}
</style>
\`\`\`

### Loading State with Custom Options

\`\`\`vue
<template>
  <MyndEcharts 
    :options="chartOptions"
    :loading="isLoading"
    :loading-options="loadingConfig"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const isLoading = ref(true)

const loadingConfig = {
  text: 'Loading chart data...',
  color: '#4299e1',
  textColor: '#333',
  maskColor: 'rgba(255, 255, 255, 0.9)',
  zlevel: 0,
  fontSize: 14,
  showSpinner: true,
  spinnerRadius: 10,
  lineWidth: 3
}

const chartOptions = ref({
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [] }]
})

onMounted(async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  chartOptions.value = {
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr']
    },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: [100, 120, 90, 140]
    }]
  }
  
  isLoading.value = false
})
</script>
\`\`\`

### Connected Charts (Synchronized)

\`\`\`vue
<template>
  <div class="charts-grid">
    <MyndEcharts 
      :options="chart1Options"
      group="sales-group"
      :style="{ height: '300px' }"
    />
    <MyndEcharts 
      :options="chart2Options"
      group="sales-group"
      :style="{ height: '300px' }"
    />
  </div>
</template>

<script setup>
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const chart1Options = {
  title: { text: 'Revenue' },
  xAxis: {
    type: 'category',
    data: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    data: [250, 300, 280, 320]
  }]
}

const chart2Options = {
  title: { text: 'Profit' },
  xAxis: {
    type: 'category',
    data: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    data: [50, 80, 60, 95]
  }]
}
</script>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
</style>
\`\`\`

### Export Chart as Image

\`\`\`vue
<template>
  <div>
    <MyndEcharts 
      ref="exportChart"
      :options="chartOptions"
    />
    <div class="export-buttons">
      <button @click="exportPNG">Export as PNG</button>
      <button @click="exportSVG">Export as SVG</button>
      <button @click="exportHighRes">Export High Resolution</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const exportChart = ref()

const chartOptions = {
  title: { text: 'Export Example' },
  xAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D']
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    data: [10, 20, 30, 40]
  }]
}

const downloadImage = (url, filename) => {
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
}

const exportPNG = () => {
  const url = exportChart.value.getDataURL({
    type: 'png',
    backgroundColor: '#fff'
  })
  downloadImage(url, 'chart.png')
}

const exportSVG = () => {
  const url = exportChart.value.getDataURL({
    type: 'svg',
    backgroundColor: '#fff'
  })
  downloadImage(url, 'chart.svg')
}

const exportHighRes = () => {
  const url = exportChart.value.getDataURL({
    type: 'png',
    pixelRatio: 3,
    backgroundColor: '#fff'
  })
  downloadImage(url, 'chart-hd.png')
}
</script>

<style scoped>
.export-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
\`\`\`

### Dark Mode Support

\`\`\`vue
<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <button @click="toggleTheme">Toggle Theme</button>
    <MyndEcharts 
      :options="chartOptions"
      :theme="currentTheme"
      :key="themeKey"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const isDarkMode = ref(false)
const themeKey = ref(0)

const lightTheme = {
  color: ['#5470c6', '#91cc75', '#fac858'],
  backgroundColor: '#ffffff'
}

const darkTheme = {
  color: ['#73c0de', '#5470c6', '#c4ccd3'],
  backgroundColor: '#1a1a1a',
  textStyle: {
    color: '#ffffff'
  },
  axisLine: {
    lineStyle: {
      color: '#555'
    }
  },
  splitLine: {
    lineStyle: {
      color: '#333'
    }
  }
}

const currentTheme = computed(() => 
  isDarkMode.value ? darkTheme : lightTheme
)

const chartOptions = {
  title: { text: 'Theme Example' },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    data: [150, 230, 224, 218, 135]
  }]
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  themeKey.value++ // Force re-render
}
</script>

<style scoped>
.dark-mode {
  background: #1a1a1a;
  color: white;
  padding: 20px;
}
</style>
\`\`\`

### Complex Dashboard Example

\`\`\`vue
<template>
  <div class="dashboard">
    <h1>Analytics Dashboard</h1>
    
    <div class="metrics-row">
      <div class="metric-card">
        <h3>Total Sales</h3>
        <div class="metric-value">$125,430</div>
      </div>
      <div class="metric-card">
        <h3>Growth Rate</h3>
        <div class="metric-value">+23.5%</div>
      </div>
      <div class="metric-card">
        <h3>Active Users</h3>
        <div class="metric-value">8,234</div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <MyndEcharts 
          :options="salesTrendChart"
          :auto-resize="true"
        />
      </div>
      <div class="chart-card">
        <MyndEcharts 
          :options="categoryChart"
          :auto-resize="true"
        />
      </div>
    </div>

    <div class="chart-card full-width">
      <MyndEcharts 
        :options="detailedChart"
        :auto-resize="true"
        toolbox-mode="fixed"
      />
    </div>
  </div>
</template>

<script setup>
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const salesTrendChart = {
  title: { text: 'Sales Trend' },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    data: [65, 78, 82, 91, 102, 125],
    smooth: true,
    areaStyle: {
      opacity: 0.3
    }
  }]
}

const categoryChart = {
  title: { text: 'Sales by Category' },
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [
      { value: 35, name: 'Electronics' },
      { value: 30, name: 'Clothing' },
      { value: 20, name: 'Food' },
      { value: 15, name: 'Other' }
    ]
  }]
}

const detailedChart = {
  title: { text: 'Detailed Performance Metrics' },
  tooltip: { trigger: 'axis' },
  legend: {
    data: ['Revenue', 'Profit', 'Expenses']
  },
  toolbox: {
    feature: {
      dataView: { show: true },
      magicType: { show: true, type: ['line', 'bar'] },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  xAxis: {
    type: 'category',
    data: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: 'Revenue',
      type: 'bar',
      data: [250, 300, 280, 320]
    },
    {
      name: 'Profit',
      type: 'bar',
      data: [50, 80, 60, 95]
    },
    {
      name: 'Expenses',
      type: 'bar',
      data: [200, 220, 220, 225]
    }
  ]
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f5f5f5;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #5470c6;
  margin-top: 10px;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-height: 400px;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

@media (max-width: 768px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}
</style>
\`\`\`
`,
  props: `
# Props

## Required

### options
- **Type**: \`EChartsOption\`

\`\`\`vue
<template>
  <MyndEcharts :options="chartOptions" />
</template>

<script setup>
const chartOptions = {
  title: { text: 'Sales Data' },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150] }]
}
</script>
\`\`\`

## Appearance & sizing

### style
- **Type**: \`CSSProperties\`

### className
- **Type**: \`string | string[] | Record<string, boolean>\`

### chartHeight
- **Type**: \`number\` (default: 400)

### aspectRatio
- **Type**: \`number | string\` (e.g. \`16:9\`)

## Theme & locale

### theme
- **Type**: \`string | object\` (default: \`'default'\`)

### isDarkMode
- **Type**: \`boolean\`

### preferThemeDefaults
- **Type**: \`boolean\` (default: \`false\`)

### locale / v-model:locale
- **Type**: \`string\` (default: \`'en'\`)

## Rendering & updates

### renderer
- **Type**: \`'canvas' | 'svg'\` (default: \`'canvas'\`)

### initOptions
- **Type**: \`EChartsInitOpts\`

### autoResize
- **Type**: \`boolean\` (default: \`true\`)

### notMerge
- **Type**: \`boolean\` (default: \`false\`)

### lazyUpdate
- **Type**: \`boolean\` (default: \`false\`)

### silent
- **Type**: \`boolean\` (default: \`false\`)

## Header & toolbox

### renderHeader
- **Type**: \`boolean\` (default: \`true\`)

### showToolbox
- **Type**: \`boolean\` (default: \`true\`)

### toolboxStyle
- **Type**: \`'toolbar' | 'menu'\` (default: \`'toolbar'\`)

### showZoomBar
- **Type**: \`boolean\` (default: \`false\`)

## Syncing

### group
- **Type**: \`string\`

> Deprecated props kept for backward compatibility: \`toolboxMode\`, \`toolboxPosition\`, \`fixToolboxOverlap\`, \`debugToolbox\` (no longer used).
`,
  events: `
# Events

### ready
- **Payload**: \`ECharts\`

### rendered
### finished
### click
### dblclick
### datazoom

### update:options
- **Payload**: \`EChartsOption\`

### update:locale
- **Payload**: \`string\`

### toolbox-action
- **Payload**: \`{ action: string, payload?: any }\`

> For full native ECharts events, attach listeners to \`getChartInstance()\` or use \`useECharts\`.
`,
  methods: `
# Instance Methods

Use a template ref:

\`\`\`vue
<MyndEcharts ref="chartRef" :options="options" />
\`\`\`

- \`setOption(options, opts?)\`
- \`resize(opts?)\`
- \`dispose()\`
- \`getChartInstance()\` → \`ECharts | undefined\`
- \`getWidth()\`, \`getHeight()\`, \`getDom()\`
- \`getDataURL(opts?)\`, \`getConnectedDataURL(opts?)\`
- \`convertToPixel(finder, value)\`, \`convertFromPixel(finder, value)\`, \`containPixel(finder, value)\`
- \`dispatchAction(action)\`
- \`isDisposed()\`
- \`openConfig()\`

Notes:
- \`getOption()\` is intentionally not exposed by the wrapper. Keep source options in your app state.
- \`clear()\` is a no-op. Use \`setOption(..., { notMerge: true })\` to fully replace.
`,
}
