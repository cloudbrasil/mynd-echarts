<template>
  <div ref="rootRef" class="echarts-core-view" :style="containerStyle">
    <div ref="chartElRef" class="echarts-core-canvas" :style="canvasStyle" @touchstart.passive></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick, type CSSProperties } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption, SetOptionOpts } from 'echarts'
import { OperationQueue } from '../../utils/operationQueue'
import { sanitizeOptions } from '../../utils/optionSanitizer'
import { throttle } from '../../utils/throttle'

// Register custom dark theme with #121213 background
const customDarkTheme = {
  backgroundColor: '#121213',
  textStyle: {
    color: '#eee'
  },
  title: {
    textStyle: {
      color: '#eee'
    },
    subtextStyle: {
      color: '#aaa'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(50, 50, 50, 0.95)',
    borderColor: '#333',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    textStyle: {
      color: '#ccc'
    }
  },
  dataZoom: {
    textStyle: {
      color: '#ccc'
    }
  },
  grid: {
    borderColor: '#444'
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: '#666'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#666'
      }
    },
    axisLabel: {
      color: '#ccc'
    },
    splitLine: {
      lineStyle: {
        color: '#333'
      }
    }
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: '#666'
      }
    },
    axisTick: {
      lineStyle: {
        color: '#666'
      }
    },
    axisLabel: {
      color: '#ccc'
    },
    splitLine: {
      lineStyle: {
        color: '#333'
      }
    }
  }
}

// Register the custom dark theme
echarts.registerTheme('mynd-dark', customDarkTheme)

interface Props {
  options: EChartsOption
  theme?: 'dark' | 'light' | object
  locale?: string
  autoResize?: boolean
  width?: string | number
  height?: string | number
  aspectRatio?: string | number
  diagnostics?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoResize: true,
  diagnostics: false
})

const emit = defineEmits<{
  (e: 'ready', instance: ECharts): void
  (e: 'error', error: any): void
  (e: 'click', p: any): void
  (e: 'dblclick', p: any): void
  (e: 'mousedown', p: any): void
  (e: 'mousemove', p: any): void
  (e: 'mouseup', p: any): void
  (e: 'mouseover', p: any): void
  (e: 'mouseout', p: any): void
  (e: 'contextmenu', p: any): void
  (e: 'datazoom', p: any): void
  (e: 'rendered', p: any): void
  (e: 'finished', p: any): void
  (e: 'legendselectchanged', p: any): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const chartElRef = ref<HTMLElement | null>(null)
const chart = ref<ECharts | null>(null)
const opQueue = new OperationQueue()
let resizeObserver: ResizeObserver | null = null
let lastOptions: EChartsOption | null = null
let throttledResize: (() => void) | null = null

const containerStyle = computed<CSSProperties>(() => {
  // Calculate adaptive height
  let heightValue: string | number = 'auto'
  let minHeightValue = '400px' // Good default minimum
  
  if (typeof props.height === 'number') {
    heightValue = `${props.height}px`
    minHeightValue = `${Math.min(props.height, 400)}px`
  } else if (props.height) {
    heightValue = props.height
  } else if (props.aspectRatio) {
    // If aspect ratio is provided, let it be calculated dynamically
    heightValue = 'auto'
  } else {
    // Default adaptive height
    heightValue = 'auto'
  }
  
  return {
    width: typeof props.width === 'number' ? `${props.width}px` : (props.width || '100%'),
    height: heightValue,
    minHeight: minHeightValue,
    position: 'relative',
    display: 'block'
  }
})

const canvasStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  display: 'block'
}))

const logj = (obj: any) => { if (!props.diagnostics) return; try { console.log(JSON.stringify(obj)) } catch { console.log(obj) } }
const errorj = (obj: any) => { if (!props.diagnostics) return; try { console.error(JSON.stringify(obj)) } catch { console.error(obj) } }

function hasSize(el: HTMLElement | null) {
  return !!el && el.clientWidth > 0 && el.clientHeight > 0
}

function initChart() {
  const el = chartElRef.value
  if (!el || chart.value) return

  try {
    // Use custom dark theme when 'dark' is passed as string
    const themeToUse = props.theme === 'dark' ? 'mynd-dark' : props.theme
    // Initialize chart even if size is 0 - ECharts will handle it
    chart.value = echarts.init(el, themeToUse as any, { locale: props.locale })
    bindEvents(chart.value)
    emit('ready', chart.value)
    logj({ tag: '[EChartsCoreView] init ok' })
  } catch (e) {
    errorj({ tag: '[EChartsCoreView] init failed', message: (e as any)?.message })
    emit('error', e)
  }
}

function disposeChart() {
  if (chart.value) {
    try { chart.value.dispose() } catch {}
    chart.value = null
  }
}

function bindEvents(instance: ECharts) {
  const forward = (name: string) => instance.on(name, (p: any) => emit(name as any, p))
  ;[
    'click','dblclick','mousedown','mousemove','mouseup','mouseover','mouseout','contextmenu',
    'datazoom','rendered','finished','legendselectchanged'
  ].forEach(forward)
}

async function applyOptions(options: EChartsOption, opts?: SetOptionOpts) {
  await opQueue.enqueue(async () => {
    if (!chart.value) initChart()
    if (!chart.value) return

    const sanitized = sanitizeOptions(options)
    lastOptions = sanitized
    try {
      chart.value.setOption(sanitized, opts)
      logj({ tag: '[EChartsCoreView] setOption', keys: Object.keys(sanitized || {}) })
    } catch (e) {
      errorj({ tag: '[EChartsCoreView] setOption error', message: (e as any)?.message })
      emit('error', e)
    }
  })
}

// Resize implementation following vue-echarts approach
function resize() {
  if (chart.value && !chart.value.isDisposed()) {
    try {
      chart.value.resize()
      logj({ tag: '[EChartsCoreView] resize completed' })
    } catch (e) {
      // Silently ignore "main process" errors
      const msg = (e as any)?.message || ''
      if (!msg.includes('should not be called during main process')) {
        errorj({ tag: '[EChartsCoreView] resize error', message: msg })
      }
    }
  }
}

// Setup autoresize following vue-echarts pattern with adaptive height
function setupAutoresize() {
  if (!props.autoResize || !rootRef.value) return
  
  // Clean up existing observer
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  
  // Create throttled resize function (100ms default like vue-echarts)
  throttledResize = throttle(() => {
    if (!rootRef.value || !chart.value) return
    
    // Calculate adaptive height if needed
    const container = rootRef.value
    let targetHeight = container.offsetHeight
    
    // If height is percentage-based and container has no explicit height
    if (targetHeight === 0 || (!props.height && !container.style.height)) {
      // Calculate based on aspect ratio or use default
      if (props.aspectRatio) {
        const ratio = typeof props.aspectRatio === 'string' 
          ? parseFloat(props.aspectRatio) 
          : props.aspectRatio
        targetHeight = Math.round(container.offsetWidth / (ratio || 1.5))
      } else {
        // Use a reasonable default based on width
        targetHeight = Math.max(300, Math.round(container.offsetWidth * 0.6))
      }
      
      // Apply calculated height to container
      container.style.height = `${targetHeight}px`
    }
    
    resize()
  }, 100)
  
  // Track initial dimensions
  let lastWidth = rootRef.value.offsetWidth
  let lastHeight = rootRef.value.offsetHeight
  
  resizeObserver = new ResizeObserver((entries) => {
    const el = rootRef.value
    if (!el) return
    
    const entry = entries[0]
    const { width, height } = entry.contentRect
    
    // Skip if dimensions haven't changed significantly
    if (Math.abs(width - lastWidth) < 1 && Math.abs(height - lastHeight) < 1) {
      return
    }
    
    // Skip if container has zero width (height can be zero initially)
    if (width === 0) {
      return
    }
    
    lastWidth = width
    lastHeight = height
    
    // Call throttled resize
    throttledResize!()
  })
  
  resizeObserver.observe(rootRef.value)
  logj({ tag: '[EChartsCoreView] Autoresize setup complete' })
}

onMounted(() => {
  // Ensure container has initial height for auto-height containers
  if (rootRef.value) {
    const width = rootRef.value.offsetWidth || rootRef.value.clientWidth
    
    // Only set explicit height if container has auto height and no explicit height prop
    if (width > 0 && !props.height && rootRef.value.style.height === 'auto') {
      // Calculate initial height
      const initialHeight = props.aspectRatio 
        ? Math.round(width / (typeof props.aspectRatio === 'string' ? parseFloat(props.aspectRatio) : props.aspectRatio))
        : Math.max(400, Math.min(600, Math.round(width * 0.5))) // 50% of width, capped at 600px
      
      rootRef.value.style.minHeight = `${initialHeight}px`
      // Let the chart determine its actual height, but ensure minimum
    }
  }
  
  // Initialize chart
  initChart()
  
  if (chart.value) {
    // Apply initial options
    if (props.options) {
      applyOptions(props.options, { notMerge: true })
    }
    
    // Setup autoresize after initialization (vue-echarts pattern)
    if (props.autoResize) {
      nextTick(() => {
        // Initial resize to ensure proper dimensions
        resize()
        // Setup resize observer
        setupAutoresize()
      })
    }
  } else if (chartElRef.value) {
    // If chart didn't initialize, wait for element to be ready
    const observer = new ResizeObserver(() => {
      if (!chart.value && chartElRef.value) {
        initChart()
        if (chart.value) {
          if (props.options) {
            applyOptions(props.options, { notMerge: true })
          }
          if (props.autoResize) {
            nextTick(() => {
              resize()
              setupAutoresize()
            })
          }
          observer.disconnect()
        }
      }
    })
    observer.observe(chartElRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  throttledResize = null
  disposeChart()
  opQueue.clear()
})

// React to identity changes only (avoid deep watch churn)
watch(() => props.options, (val) => {
  if (val) applyOptions(val, { notMerge: true })
})

watch(() => props.theme, () => {
  // Recreate chart with new theme, restore options
  const opts = lastOptions
  disposeChart()
  nextTick(() => {
    initChart()
    if (opts) applyOptions(opts, { notMerge: true })
  })
})

watch(() => props.locale, () => {
  const opts = lastOptions
  disposeChart()
  nextTick(() => {
    initChart()
    if (opts) applyOptions(opts, { notMerge: true })
  })
})

// Expose imperative methods
const getInstance = () => chart.value || undefined
const setOption = (opt: EChartsOption, o?: SetOptionOpts) => applyOptions(opt, o)
const resizeChart = () => resize() // Expose resize method
const dispose = () => disposeChart()

defineExpose({ getInstance, setOption, resize: resizeChart, dispose })
</script>

<style scoped>
/* Following vue-echarts CSS approach with adaptive height */
.echarts-core-view { 
  display: block;
  width: 100%; 
  height: auto;
  min-width: 0; /* Prevent layout issues */
  min-height: 400px; /* Ensure minimum height */
}
.echarts-core-canvas { 
  display: block;
  width: 100%; 
  height: 100%;
  min-height: 400px; /* Ensure chart has minimum height */
}
</style>
