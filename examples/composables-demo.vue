<template>
  <div class="composables-demo">
    <h1>mynd-echarts Composables Demo</h1>
    
    <!-- Theme Switcher -->
    <div class="controls">
      <label>
        Theme:
        <select v-model="currentTheme" @change="handleThemeChange">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      
      <button @click="toggleAnimation">
        {{ animationConfig.enabled ? 'Disable' : 'Enable' }} Animation
      </button>
      
      <button @click="loadNewData">Load New Data</button>
      
      <span v-if="loading">Loading...</span>
      <span v-if="error" class="error">{{ error }}</span>
    </div>

    <!-- Chart Info -->
    <div class="info">
      <p>Data Points: {{ stats.count }}</p>
      <p>Average: {{ stats.average?.toFixed(2) || 'N/A' }}</p>
      <p>Min/Max: {{ stats.min?.toFixed(2) || 'N/A' }} / {{ stats.max?.toFixed(2) || 'N/A' }}</p>
      <p>Valid Options: {{ isValid ? '✅' : '❌' }}</p>
    </div>

    <!-- Main Chart -->
    <div ref="chartRef" class="chart-container"></div>

    <!-- Event Log -->
    <div class="event-log">
      <h3>Event Log</h3>
      <ul>
        <li v-for="(event, index) in eventLog" :key="index">
          {{ event }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  useECharts,
  useChartTheme,
  useChartResize,
  useChartEvents,
  useChartAnimation,
  useChartOptions,
  useChartData,
  type EChartsOption
} from '@lib/index'

// Template refs
const chartRef = ref<HTMLElement>()
const eventLog = ref<string[]>([])

// Theme management
const { currentTheme, setTheme, registerTheme } = useChartTheme({
  defaultTheme: 'light'
})

// Register custom theme
registerTheme('custom', {
  color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
  backgroundColor: '#2c3e50',
  textStyle: {
    color: '#ecf0f1'
  },
  title: {
    textStyle: {
      color: '#ecf0f1'
    }
  },
  legend: {
    textStyle: {
      color: '#ecf0f1'
    }
  }
})

// Data management
const { 
  chartData, 
  stats, 
  loading, 
  error, 
  setData, 
  appendData, 
  loadData 
} = useChartData({
  transformer: (data: any[]) => data.map((d, i) => [i, d.value]),
  maxDataPoints: 50,
  validator: (data) => {
    if (!Array.isArray(data)) return 'Data must be an array'
    if (data.length === 0) return 'Data cannot be empty'
    return true
  }
})

// Options management with validation
const { 
  options, 
  isValid, 
  errors, 
  setOptions, 
  updateOption, 
  mergeOptions 
} = useChartOptions({
  title: {
    text: 'Composables Demo Chart',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const param = Array.isArray(params) ? params[0] : params
      return `Point ${param.dataIndex}<br/>Value: ${param.value[1]}`
    }
  },
  xAxis: {
    type: 'value',
    name: 'Index'
  },
  yAxis: {
    type: 'value',
    name: 'Value'
  },
  series: [{
    name: 'Demo Data',
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 8,
    data: []
  }]
}, {
  validateOptions: true,
  deepWatch: true
})

// Chart instance
const { 
  chartInstance, 
  setOption, 
  resize, 
  dispose 
} = useECharts(chartRef, {
  theme: currentTheme.value,
  autoResize: true,
  onReady: (instance) => {
    logEvent('Chart initialized')
  }
})

// Resize handling
const { isResizing } = useChartResize(
  chartRef,
  () => {
    resize()
    logEvent('Chart resized')
  },
  {
    mode: 'debounce',
    delay: 300
  }
)

// Event handling
const { on, once, clearAllEvents } = useChartEvents(chartInstance, {
  click: (params) => logEvent(`Clicked: ${params.name || params.dataIndex}`),
  mouseover: (params) => logEvent(`Hover: ${params.name || params.dataIndex}`),
  finished: () => logEvent('Rendering finished')
})

// Animation control
const { 
  animationConfig, 
  setAnimationConfig, 
  animateToOption 
} = useChartAnimation(chartInstance, {
  defaultAnimation: {
    enabled: true,
    duration: 1000,
    easing: 'cubicOut'
  }
})

// Methods
const logEvent = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  eventLog.value.unshift(`[${timestamp}] ${message}`)
  if (eventLog.value.length > 10) {
    eventLog.value.pop()
  }
}

const handleThemeChange = () => {
  setTheme(currentTheme.value)
  // Re-apply options after theme change
  if (chartInstance.value) {
    setOption(options.value)
  }
}

const toggleAnimation = () => {
  setAnimationConfig({
    enabled: !animationConfig.value.enabled
  })
  logEvent(`Animation ${animationConfig.value.enabled ? 'enabled' : 'disabled'}`)
}

const loadNewData = async () => {
  await loadData(async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return Array.from({ length: 20 }, () => ({
      value: Math.random() * 100
    }))
  })
  
  // Update chart with new data
  mergeOptions({
    series: [{
      data: chartData.value
    }]
  })
  
  animateToOption(options.value)
  logEvent('New data loaded')
}

// Watch for data changes
watch(chartData, () => {
  if (chartInstance.value) {
    mergeOptions({
      series: [{
        data: chartData.value
      }]
    })
    setOption(options.value, { lazyUpdate: true })
  }
})

// Lifecycle
onMounted(async () => {
  // Load initial data
  await loadNewData()
  
  // Set up periodic data updates
  const interval = setInterval(() => {
    appendData({
      value: Math.random() * 100
    })
  }, 3000)
  
  // Clean up on unmount
  onUnmounted(() => {
    clearInterval(interval)
    clearAllEvents()
    dispose()
  })
})
</script>

<style scoped>
.composables-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.controls select,
.controls button {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.controls button:hover {
  background: #f0f0f0;
}

.error {
  color: #ff4444;
  font-weight: bold;
}

.info {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.info p {
  margin: 0;
  font-size: 14px;
}

.chart-container {
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.event-log {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
}

.event-log h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.event-log ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-family: monospace;
}

.event-log li {
  padding: 0.25rem 0;
  color: #666;
}
</style>