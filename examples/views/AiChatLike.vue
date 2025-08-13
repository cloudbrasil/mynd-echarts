<template>
  <div class="ai-chat-like-container">
    <h1>AI Chat-like ECharts Wrapper Test</h1>
    <p>This mimics the same structure used in mynd-aichat/EChartsWrapper for testing MyndEcharts integration</p>
    
    <div class="controls">
      <button @click="toggleTheme" class="theme-toggle">
        {{ isDark ? '☀️ Light Mode' : '🌙 Dark Mode' }}
      </button>
      <button @click="toggleIsolation" class="isolation-toggle">
        Isolation: {{ useIsolation ? 'ON' : 'OFF' }}
      </button>
      <button @click="switchChart" class="chart-switch">
        Switch Chart ({{ currentChartIndex + 1 }}/{{ chartDataOptions.length }})
      </button>
    </div>

    <div 
      :class="['echarts-wrapper', useIsolation ? 'akamai-ui-echarts-container' : '']" 
      :data-theme="useIsolation ? (isDark ? 'dark' : 'light') : undefined" 
      ref="wrapperRef"
    >
      <div v-if="error" class="chart-error">
        <div class="warning-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
      </div>
      <MyndEcharts 
        v-else-if="chartContainerReady" 
        ref="chartRef" 
        :options="chartOption" 
        :theme="isDark ? 'dark' : 'default'" 
        :auto-resize="true"
        :render-header="true"
        :show-toolbox="true"
        :style="{ width: '100%', height: '100%' }" 
        class="chart" 
        @click="onChartClick"
        @toolbox-action="onToolboxAction"
      />
      <div v-else class="chart-placeholder" :style="{ width: '100%', height: '400px' }">
        <div class="loading">Loading chart...</div>
      </div>
    </div>

    <div class="debug-info">
      <h3>Debug Info</h3>
      <pre>{{ JSON.stringify({ 
        isDark, 
        useIsolation, 
        chartContainerReady, 
        hasError: !!error,
        currentChart: currentChartIndex + 1,
        containerWidth: containerWidth,
        containerHeight: containerHeight,
        dataZoomVisible: dataZoomVisible
      }, null, 2) }}</pre>
      
      <h3>Current Chart Data</h3>
      <details>
        <summary>Click to view raw data</summary>
        <pre>{{ JSON.stringify(currentChartData, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick, onErrorCaptured } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, ScatterChart, RadarChart, HeatmapChart } from 'echarts/charts'
import { 
  TitleComponent, 
  TooltipComponent, 
  LegendComponent, 
  GridComponent, 
  DataZoomComponent, 
  ToolboxComponent
} from 'echarts/components'
import { MyndEcharts } from '@lib/index'

// Single-line copyable logger
const clog = (...args: any[]) => {
  try {
    const line = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ')
    console.log(line)
  } catch {
    console.log(String(args))
  }
}

// Register ECharts components
use([
  CanvasRenderer, 
  BarChart, 
  LineChart, 
  PieChart, 
  ScatterChart, 
  RadarChart, 
  HeatmapChart, 
  TitleComponent, 
  TooltipComponent, 
  LegendComponent, 
  GridComponent, 
  DataZoomComponent, 
  ToolboxComponent
])

// Multiple chart data options for testing
const chartDataOptions = [
  // Temperature chart - simplified without markPoint/markLine for now
  {
    "title": {
      "text": "Weekly Temperature",
      "left": "center"
    },
    "tooltip": {
      "trigger": "axis"
    },
    "xAxis": {
      "type": "category",
      "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    "yAxis": {
      "type": "value",
      "name": "Temperature (°C)"
    },
    "series": [
      {
        "name": "Temperature",
        "type": "line",
        "data": [20, 22, 21, 23, 25, 26, 23],
        "smooth": true
      }
    ]
  },
  // Additional test chart with dataZoom
  {
    "title": {
      "text": "Sales Data with Zoom",
      "left": "left"
    },
    "tooltip": {
      "trigger": "axis",
      "axisPointer": {
        "type": "cross"
      }
    },
    "legend": {
      "data": ["Product A", "Product B"],
      "bottom": 10
    },
    "toolbox": {
      "feature": {
        "saveAsImage": { "show": true },
        "restore": { "show": true },
        "dataView": { "show": true },
        "dataZoom": { "show": true }
      }
    },
    "xAxis": {
      "type": "category",
      "boundaryGap": false,
      "data": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    },
    "yAxis": {
      "type": "value",
      "name": "Sales ($)"
    },
    "dataZoom": [
      {
        "type": "slider",
        "show": true,
        "start": 0,
        "end": 100,
        "height": 36,
        "bottom": 0
      },
      {
        "type": "inside",
        "start": 0,
        "end": 100
      }
    ],
    "series": [
      {
        "name": "Product A",
        "type": "line",
        "smooth": true,
        "data": [120, 132, 101, 134, 90, 230, 210, 220, 182, 191, 234, 260]
      },
      {
        "name": "Product B",
        "type": "line",
        "smooth": true,
        "data": [80, 82, 91, 94, 120, 110, 125, 145, 122, 165, 122, 137]
      }
    ]
  },
  // Bar chart without explicit grid
  {
    "title": {
      "text": "Category Sales"
    },
    "tooltip": {},
    "xAxis": {
      "type": "category",
      "data": ["Electronics", "Clothing", "Food", "Books", "Sports"]
    },
    "yAxis": {
      "type": "value"
    },
    "series": [
      {
        "type": "bar",
        "data": [320, 240, 360, 180, 220],
        "itemStyle": {
          "color": "#5470c6"
        }
      }
    ]
  }
]

const currentChartIndex = ref(0)
const chartRef = ref()
const wrapperRef = ref<HTMLElement | null>(null)
const error = ref<string | null>(null)
const chartContainerReady = ref(false)
const isDark = ref(false)
const useIsolation = ref(true)
const containerWidth = ref(0)
const containerHeight = ref(0)
const isDev = import.meta.env.DEV
const dataZoomVisible = ref(false)

const currentChartData = computed(() => chartDataOptions[currentChartIndex.value])

const chartOption = computed(() => {
  clog('[AiChatLike] Computing chartOption for chart index', currentChartIndex.value)
  try {
    const data = currentChartData.value
    if (!data) throw new Error('No chart data provided')
    
    // Deep clone to ensure plain JSON for MyndEcharts/ECharts
    const option: any = JSON.parse(JSON.stringify(data))
    
    // Debug: log incoming raw data
    if (isDev) clog('[AiChatLike] raw input', data)

    // Normalize title to object and alignment (same as EChartsWrapper)
    const applyTitle = (t: any) => {
      const base = (typeof t === 'string' ? { text: t } : (t || {}))
      const { fontSize, fontWeight, textStyle, left, ...rest } = base
      const mergedTextStyle = {
        ...(textStyle || {}),
        ...(typeof fontSize !== 'undefined' ? { fontSize } : {}),
        ...(typeof fontWeight !== 'undefined' ? { fontWeight } : {}),
        color: isDark.value ? '#ffffff' : '#111111'
      }
      return {
        ...rest,
        text: base.text,
        left: 'left',
        textStyle: mergedTextStyle
      }
    }

    if (Array.isArray(option.title)) {
      option.title = option.title.map((t: any) => applyTitle(t))
    } else if (option.title) {
      option.title = applyTitle(option.title)
    }

    // Force toolbox icon colors for dark/light (same as EChartsWrapper)
    if (option.toolbox) {
      const forceIconStyle = (obj: any) => {
        if (!obj) return
        obj.iconStyle = {
          ...(obj.iconStyle || {}),
          color: isDark.value ? '#ffffff' : '#111111',
          borderColor: isDark.value ? '#ffffff' : '#111111'
        }
        if (obj.emphasis) {
          obj.emphasis.iconStyle = {
            ...(obj.emphasis.iconStyle || {}),
            color: isDark.value ? '#ffffff' : '#111111',
            borderColor: isDark.value ? '#ffffff' : '#111111'
          }
        }
      }
      // Top-level toolbox
      forceIconStyle(option.toolbox)
      // Features may contain nested iconStyle overrides
      if (option.toolbox.feature && typeof option.toolbox.feature === 'object') {
        Object.values(option.toolbox.feature).forEach((feature: any) => forceIconStyle(feature))
      }
    }

    if (!option.series || !Array.isArray(option.series)) throw new Error('Invalid series data')

    // Simply ensure grid uses containLabel for automatic spacing
    // Let ECharts handle the layout naturally
    if (!option.grid) {
      option.grid = { 
        containLabel: true
      }
    } else if (typeof option.grid === 'object' && !Array.isArray(option.grid)) {
      option.grid = { 
        ...option.grid,
        containLabel: true
      }
    }
    
    // Toolbox-driven dataZoom visibility handling
    const ensureSlider = () => ({
      type: 'slider', show: true, start: 0, end: 100, height: 36, bottom: 0, xAxisIndex: [0], filterMode: 'filter', realtime: true
    })
    let dzArray: any[] = []
    if (Array.isArray(option.dataZoom)) dzArray = option.dataZoom.slice()
    else if (option.dataZoom) dzArray = [option.dataZoom]

    if (dataZoomVisible.value) {
      const hasSlider = dzArray.some(z => (z.type === 'slider' || !z.type))
      if (!hasSlider) dzArray.push(ensureSlider())
      // If legend at bottom, nudge slider up a bit
      if (option.legend?.bottom !== undefined) {
        dzArray = dzArray.map((z: any) => (z.type === 'slider' || !z.type) ? { bottom: 40, ...z } : z)
      }
    } else if (dzArray.length) {
      // Hide sliders when toggled off
      dzArray = dzArray.map((z: any) => (z.type === 'slider' || !z.type) ? { ...z, show: false } : z)
    }
    if (dzArray.length) option.dataZoom = dzArray
    
    error.value = null
    
    // Debug: log the final options sent to MyndEcharts
    if (isDev) clog('[AiChatLike] options', option)
    
    return option
  } catch (err: any) {
    console.error('Chart option error:', err)
    error.value = err.message || 'Invalid chart configuration'
    return {}
  }
})

function onChartClick(params: any) {
  clog('Chart clicked:', params)
}

function onToolboxAction(evt: any) {
  const { action } = evt || {}
  if (action === 'dataZoom') {
    dataZoomVisible.value = !dataZoomVisible.value
  } else if (action === 'restore') {
    dataZoomVisible.value = false
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  document.body.classList.toggle('dark', isDark.value)
  clog('[AiChatLike] Theme toggled')
  // No need to manually resize - theme change triggers chart recreation
}

function toggleIsolation() {
  useIsolation.value = !useIsolation.value
}

function switchChart() {
  currentChartIndex.value = (currentChartIndex.value + 1) % chartDataOptions.length
  clog('[AiChatLike] switchChart - changed to chart', currentChartIndex.value)
  // No need to manually resize - options change triggers resize
}

watch(isDark, () => { 
  clog('[AiChatLike] isDark changed')
  // No need to manually resize - theme change triggers chart recreation
})

// Ensure container has non-zero size before mounting ECharts (same as EChartsWrapper)
let ro: ResizeObserver | null = null

onMounted(() => {
  clog('[AiChatLike] Component mounted')
  // Set initial theme
  document.documentElement.classList.toggle('dark', isDark.value)
  document.body.classList.toggle('dark', isDark.value)
  
  const ensureReady = () => {
    const el = wrapperRef.value as HTMLElement | null
    if (!el) return false
    const hasSize = el.clientWidth > 0 && el.clientHeight >= 0 // height may be auto; chart has fixed 400px
    if (hasSize) {
      containerWidth.value = el.clientWidth
      containerHeight.value = el.clientHeight
      chartContainerReady.value = true
      clog('[AiChatLike] Container ready')
      // No need to manually resize - ResizeController handles it
      return true
    }
    return false
  }
  
  if (!ensureReady()) {
    ro = new ResizeObserver(() => {
      const el = wrapperRef.value as HTMLElement | null
      if (el) {
        containerWidth.value = el.clientWidth
        containerHeight.value = el.clientHeight
      }
      if (ensureReady() && ro) {
        ro.disconnect()
        ro = null
      }
    })
    if (wrapperRef.value) ro.observe(wrapperRef.value)
    // Fallback: kick a resize after load
    window.addEventListener('load', ensureReady, { once: true })
  }
})

onBeforeUnmount(() => { 
  if (ro) { 
    ro.disconnect()
    ro = null 
  } 
})

// Capture child errors (including potential setOption errors from MyndEcharts)
onErrorCaptured((err, _instance, info) => {
  console.error('[AiChatLike] child error captured:', err, '\ninfo:', info)
  try { 
    error.value = (err as any)?.message || String(err) 
  } catch {}
  // Do not stop propagation; return false to allow further handling
  return false
})
</script>

<style>
/* Global styles for theme */
body {
  margin: 0;
  padding: 0;
  transition: background 0.3s ease;
}

body.dark {
  background: #1a1a1a;
}

body:not(.dark) {
  background: #f5f5f5;
}
</style>

<style scoped>
.ai-chat-like-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.ai-chat-like-container h1 {
  color: #333;
  margin-bottom: 10px;
}

body.dark .ai-chat-like-container h1 {
  color: #e5e5e5;
}

.ai-chat-like-container p {
  color: #666;
  margin-bottom: 20px;
}

body.dark .ai-chat-like-container p {
  color: #999;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.theme-toggle,
.isolation-toggle,
.chart-switch {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

body.dark .theme-toggle,
body.dark .isolation-toggle,
body.dark .chart-switch {
  background: #2a2a2a;
  color: #e5e5e5;
  border-color: #444;
}

.theme-toggle:hover,
.isolation-toggle:hover,
.chart-switch:hover {
  background: #f0f0f0;
  border-color: #999;
}

body.dark .theme-toggle:hover,
body.dark .isolation-toggle:hover,
body.dark .chart-switch:hover {
  background: #3a3a3a;
  border-color: #666;
}

/* Exact same styles as EChartsWrapper.vue */
.echarts-wrapper {
  width: 100%;
  min-height: 400px; /* Minimum height */
  height: auto; /* Allow content to determine height */
  margin: 1em 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: visible; /* Don't clip content */
  background: white;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

body.dark .echarts-wrapper {
  border-color: rgba(255, 255, 255, 0.1);
  background: #2a2a2a;
}

.echarts-wrapper.akamai-ui-echarts-container[data-theme="dark"] {
  background: #1e1e1e;
  border-color: rgba(255, 255, 255, 0.1);
}

.chart {
  width: 100%;
  flex: 1 1 auto;
  min-height: 400px; /* Ensure minimum height for chart */
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  height: 400px;
}

body.dark .chart-placeholder {
  background: #2a2a2a;
}

.loading {
  color: #999;
  font-size: 18px;
}

.chart-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background-color: rgba(244, 67, 54, 0.05);
  text-align: center;
}

body.dark .chart-error {
  background-color: rgba(244, 67, 54, 0.1);
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.error-message {
  color: #f44336;
  font-size: 16px;
}

.debug-info {
  margin-top: 30px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

body.dark .debug-info {
  background: #2a2a2a;
  color: #e5e5e5;
}

.debug-info h3 {
  margin-top: 0;
  color: #666;
  margin-bottom: 10px;
}

body.dark .debug-info h3 {
  color: #999;
}

.debug-info pre {
  background: white;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}

body.dark .debug-info pre {
  background: #1a1a1a;
  color: #e5e5e5;
}

.debug-info details {
  margin-top: 10px;
}

.debug-info summary {
  cursor: pointer;
  color: #666;
  user-select: none;
}

body.dark .debug-info summary {
  color: #999;
}

.debug-info summary:hover {
  color: #333;
}

body.dark .debug-info summary:hover {
  color: #ccc;
}
</style>