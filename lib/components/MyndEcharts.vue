<template>
  <div ref="rootRef" class="mynd-echarts-wrapper" :data-theme="effectiveDarkMode ? 'dark' : 'light'" :class="computedClass">
    <!-- Custom Header -->
    <div v-if="props.renderHeader && (chartTitle || chartSubtitle)" class="mynd-echarts-header">
      <div class="mynd-echarts-title-section">
        <component 
          :is="titleLink ? 'a' : 'div'" 
          v-if="chartTitle" 
          class="mynd-echarts-title" 
          :style="titleStyle"
          :href="titleLink"
          :target="titleTarget"
        >
          {{ chartTitle }}
        </component>
        <component 
          :is="subtitleLink ? 'a' : 'p'" 
          v-if="chartSubtitle" 
          class="mynd-echarts-subtitle" 
          :style="subtitleStyle"
          :href="subtitleLink"
          :target="subtitleTarget"
        >
          {{ chartSubtitle }}
        </component>
      </div>
      <!-- Custom Toolbox -->
      <ChartToolbox
        v-if="props.renderHeader && showToolbox"
        :chart-instance="chartInstance"
        :chart-type="detectedChartTypes"
        :display-style="toolboxStyle"
        :toolbox-config="toolboxConfig"
        :options="props.options"
        :locale="props.locale"
        :is-dark-mode="effectiveDarkMode"
        @action="handleToolboxAction"
      />
    </div>
    
    <!-- Chart Container -->
    <div class="mynd-echarts-container" :style="containerStyle" @mousedown.stop @touchstart.passive.stop>
      <EChartsCoreView
        ref="coreRef"
        :options="canvasOptions"
        :theme="resolvedTheme === 'dark' ? 'dark' : undefined"
        :locale="props.locale"
        :auto-resize="props.autoResize"
        :diagnostics="props.debugToolbox ?? false"
        class="mynd-echarts-chart"
        :style="computedStyle"
        @ready="onCoreReady"
        @error="onCoreError"
        @click="(p:any)=>emit('click',p)"
        @dblclick="(p:any)=>emit('dblclick',p)"
        @datazoom="(p:any)=>emit('datazoom',p)"
        @rendered="(p:any)=>emit('rendered',p)"
        @finished="(p:any)=>emit('finished',p)"
      />
    </div>
    <ZoomBar
      v-if="showZoomBar"
      :options="props.options"
      :start="zoomStart"
      :end="zoomEnd"
      :is-dark-mode="effectiveDarkMode"
      @change="handleZoomBarChange"
    />
    
    <ConfigDialog 
      v-if="showConfig"
      v-model="showConfig" 
      :options="currentOptions"
      :is-dark-mode="effectiveDarkMode"
      @update:options="handleConfigUpdate"
      @update:locale="handleLocaleUpdate"
    />
    
    <DataViewDialog
      v-if="showDataView"
      v-model="showDataView"
      :options="props.options"
      :chart-instance="chartInstance"
      :locale="props.locale as SupportedLocale"
      :is-dark-mode="effectiveDarkMode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, watchEffect, nextTick, type CSSProperties } from 'vue'
import type { EChartsOption, ECharts } from 'echarts'
import EChartsCoreView from './internal/EChartsCoreView.vue'
import { provideLocale } from '../composables/useLocale'
import type { SupportedLocale } from '../locales/types'
import ConfigDialog from './ConfigDialog.vue'
import ChartToolbox from './ChartToolbox.vue'
import ZoomBar from './ZoomBar.vue'
import DataViewDialog from './DataViewDialog.vue'
import type { MyndEchartsProps as CoreMyndEchartsProps, MyndEchartsEmits as CoreMyndEchartsEmits } from '../types/component'

type ExtendedMyndEchartsProps = CoreMyndEchartsProps & {
  /** Locale for chart UI elements (toolbox, etc.) */
  locale?: string
  /** Show custom toolbox in header */
  showToolbox?: boolean
  /** Toolbox display style */
  toolboxStyle?: 'toolbar' | 'menu'
  /** Render custom header (title/toolbox) instead of ECharts native */
  renderHeader?: boolean
  /** Show custom bottom zoom bar (native ECharts dataZoom is disabled) */
  showZoomBar?: boolean
  /** @deprecated Native toolbox mode no longer used */
  toolboxMode?: 'auto' | 'fixed' | 'disabled'
  /** @deprecated Native toolbox position no longer used */
  toolboxPosition?: { right?: number; left?: number; top?: number; bottom?: number }
  /** @deprecated Native toolbox overlap fix no longer used */
  fixToolboxOverlap?: boolean
  /** @deprecated Debug toolbox diagnostics no longer used */
  debugToolbox?: boolean
}

const props = withDefaults(defineProps<ExtendedMyndEchartsProps & { chartHeight?: number; aspectRatio?: number | string }>(), {
  theme: 'default',
  locale: 'en',
  loading: false,
  autoResize: true,
  renderer: 'canvas',
  notMerge: false,
  lazyUpdate: false,
  silent: false,
  showToolbox: true,
  toolboxStyle: 'toolbar',
  renderHeader: true,
  showZoomBar: false,
  chartHeight: 400,
  aspectRatio: undefined
})

type ExtendedEmits = CoreMyndEchartsEmits & {
  'update:options': (options: EChartsOption) => void
  'update:locale': (locale: string) => void
  /** @deprecated Emitted only in legacy debug mode; no longer used */
  'toolbox-rendered': (info: { dom: HTMLElement, config: any }) => void
  /** @deprecated Emitted only in legacy debug mode; no longer used */
  'toolbox-overlap-detected': (info: { elements: number, measurements: any }) => void
  /** @deprecated Emitted only in legacy debug mode; no longer used */
  'toolbox-fixed': (info: { method: string, success: boolean }) => void
}

const emit = defineEmits<ExtendedEmits>()

// Dark mode detection
const isDarkMode = ref(false)
const effectiveDarkMode = computed(() => {
  // 1) Explicit prop override
  if (typeof props.isDarkMode === 'boolean') return props.isDarkMode
  // 2) Theme name hint
  if (typeof props.theme === 'string') {
    const t = props.theme.toLowerCase()
    if (t === 'dark') return true
    if (t === 'light') return false
  }
  // 3) Fallback to DOM detection
  return isDarkMode.value
})

const updateDarkMode = () => {
  if (typeof document !== 'undefined') {
    isDarkMode.value = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark')
  }
}

// Setup dark mode observer
let darkModeObserver: MutationObserver | null = null

const chartRef = ref<HTMLElement>()
const coreRef = ref<InstanceType<typeof EChartsCoreView> | null>(null)
const chartInstance = ref<ECharts | null>(null)
// Handle core events
function onCoreReady(instance: ECharts) {
  ;(chartInstance as any).value = instance
  if (props.loading) instance.showLoading('default', props.loadingOptions)
  emit('ready', instance)
}

function onCoreError(e: any) {
  console.error(e)
}
const showConfig = ref(false)
const showDataView = ref(false)
const currentOptions = ref<EChartsOption>(props.options || {})
// Store the processed options to maintain state
const processedOptionsCache = ref<EChartsOption | null>(null)
// Store base options for custom zoom windowing
const zoomBaseOptions = ref<EChartsOption | null>(null)
const showZoomBar = ref<boolean>(props.showZoomBar)
// Ensure a resize after zoom bar toggles to preserve chart area height
watch(showZoomBar, async () => {
  await nextTick()
  setTimeout(() => resizeWithFix(), 0)
})
const zoomStart = ref(20) // Changed from 0 to 20 for better initial positioning
const zoomEnd = ref(80) // Changed from 100 to 80 for better initial positioning

// Resize/mutation observers removed; handled by useECharts

// Extract title configuration from options
const extractTitleConfig = (options: EChartsOption) => {
  const title = options.title as any
  if (!title) return { text: '', subtext: '', titleConfig: {} }
  
  // Handle array of titles (ECharts supports multiple titles)
  const titleObj = Array.isArray(title) ? title[0] : title
  
  return {
    text: titleObj?.text || '',
    subtext: titleObj?.subtext || '',
    titleConfig: titleObj || {}
  }
}

// Extract toolbox configuration from options
const extractToolboxConfig = (options: EChartsOption) => {
  const toolbox = options.toolbox as any
  if (!toolbox) return null
  
  // Handle array of toolboxes (though rare)
  const toolboxObj = Array.isArray(toolbox) ? toolbox[0] : toolbox
  
  // If toolbox is disabled, return null
  if (toolboxObj?.show === false) return null
  
  return toolboxObj
}

// Title computed properties
const titleInfo = computed(() => extractTitleConfig(props.options))
const chartTitle = computed(() => titleInfo.value.text)
const chartSubtitle = computed(() => titleInfo.value.subtext)
const titleLink = computed(() => titleInfo.value.titleConfig?.link)
const titleTarget = computed(() => titleInfo.value.titleConfig?.target || '_blank')
const subtitleLink = computed(() => titleInfo.value.titleConfig?.sublink)
const subtitleTarget = computed(() => titleInfo.value.titleConfig?.subtarget || '_blank')

// Title styles based on ECharts title configuration
const titleStyle = computed(() => {
  const config = titleInfo.value.titleConfig
  const style: any = {}
  
  // Map ECharts title properties to CSS
  if (config.textStyle) {
    // Only set color if explicitly provided, otherwise let CSS handle theming
    if (config.textStyle.color) {
      style.color = config.textStyle.color
    }
    style.fontSize = typeof config.textStyle.fontSize === 'number' 
      ? `${config.textStyle.fontSize}px` 
      : config.textStyle.fontSize
    style.fontWeight = config.textStyle.fontWeight
    style.fontFamily = config.textStyle.fontFamily
    style.fontStyle = config.textStyle.fontStyle
    style.lineHeight = config.textStyle.lineHeight
  } else {
    // Default styles when no textStyle is provided
    style.fontWeight = 'bold'
    style.fontSize = '14px'
  }
  
  // Handle text alignment
  if (config.left === 'center') {
    style.textAlign = 'center'
  } else if (config.left === 'right') {
    style.textAlign = 'right'
  } else {
    style.textAlign = 'left'
  }
  
  return style
})

const subtitleStyle = computed(() => {
  const config = titleInfo.value.titleConfig
  const style: any = {}
  
  // Map ECharts subtitle properties to CSS
  if (config.subtextStyle) {
    // Only set color if explicitly provided, otherwise let CSS handle theming
    if (config.subtextStyle.color) {
      style.color = config.subtextStyle.color
    }
    style.fontSize = typeof config.subtextStyle.fontSize === 'number' 
      ? `${config.subtextStyle.fontSize}px` 
      : config.subtextStyle.fontSize
    style.fontWeight = config.subtextStyle.fontWeight
    style.fontFamily = config.subtextStyle.fontFamily
    style.fontStyle = config.subtextStyle.fontStyle
    style.lineHeight = config.subtextStyle.lineHeight
  }
  
  // Inherit alignment from title
  if (config.left === 'center') {
    style.textAlign = 'center'
  } else if (config.left === 'right') {
    style.textAlign = 'right'
  } else {
    style.textAlign = 'left'
  }
  
  return style
})

// Process options to remove title (since we're showing it in custom header)
const processedOptions = computed(() => {
  const opts = { ...props.options }
  if (props.renderHeader) {
    // Remove native header UI when rendering custom header
    delete (opts as any).title
    delete (opts as any).toolbox
  }
  return opts
})

// Detect chart types from series
const detectedChartTypes = computed(() => {
  const types: string[] = []
  const series = props.options?.series
  
  if (series) {
    const seriesArray = Array.isArray(series) ? series : [series]
    seriesArray.forEach((s: any) => {
      if (s.type) {
        // Check if it's a line chart with area style (area chart)
        if (s.type === 'line' && s.areaStyle) {
          if (!types.includes('area')) {
            types.push('area')
          }
        }
        if (!types.includes(s.type)) {
          types.push(s.type)
        }
      }
    })
  }
  
  // Default to 'line' if no type is specified
  return types.length > 0 ? types : ['line']
})

// Extract toolbox configuration
const toolboxConfig = computed(() => {
  const config = extractToolboxConfig(props.options)
  // Only use extracted config if showToolbox is true
  return props.showToolbox ? config : null
})

// Provide locale context for child components
const localeContext = provideLocale(props.locale as SupportedLocale)

// Update locale when prop changes
watch(() => props.locale, (newLocale) => {
  if (newLocale) {
    localeContext.setLocale(newLocale as SupportedLocale)
  }
})

const containerStyle = computed<CSSProperties>(() => {
  // Use adaptive height when no explicit height is provided
  const heightValue = computedChartHeight.value 
    ? `${computedChartHeight.value}px`
    : 'auto'
    
  return {
    width: '100%',
    minHeight: '300px', // Ensure minimum height
    height: heightValue,
    position: 'relative',
  }
})

const computedStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  ...props.style
}))

// Responsive chart height based on aspect ratio
const rootRef = ref<HTMLElement | null>(null)
const computedChartHeight = ref<number>(props.chartHeight || 400) // Ensure default height
let ro: ResizeObserver | null = null

function parseAspectRatio(ar?: number | string): number | undefined {
  if (!ar) return undefined
  if (typeof ar === 'number' && isFinite(ar) && ar > 0) return ar
  if (typeof ar === 'string') {
    const m = ar.match(/^(\d+)\s*[:/]\s*(\d+)$/)
    if (m) {
      const w = parseFloat(m[1]); const h = parseFloat(m[2])
      if (h > 0) return w / h
    }
    const n = parseFloat(ar)
    if (isFinite(n) && n > 0) return n
  }
  return undefined
}

function updateResponsiveHeight() {
  const ratio = parseAspectRatio(props.aspectRatio)
  const root = rootRef.value
  
  if (!root) {
    // If no root, use provided height or calculate based on viewport
    computedChartHeight.value = props.chartHeight || Math.round(window.innerHeight * 0.5)
    return
  }
  
  const width = root.clientWidth || 0
  
  if (ratio && width > 0) {
    // Calculate height based on aspect ratio
    const target = Math.max(300, Math.round(width / ratio))
    if (Math.abs(target - (computedChartHeight.value || 0)) > 1) {
      computedChartHeight.value = target
      // Reschedule resize after DOM updates
      setTimeout(() => resizeWithFix(), 0)
    }
  } else if (!props.chartHeight) {
    // No aspect ratio and no explicit height - use adaptive height
    const target = Math.max(300, Math.round(width * 0.6)) // 60% of width as default
    computedChartHeight.value = target
  } else {
    // Use provided chart height
    computedChartHeight.value = props.chartHeight
  }
}

const computedClass = computed(() => {
  if (typeof props.className === 'string') {
    return props.className
  }
  if (Array.isArray(props.className)) {
    return props.className.join(' ')
  }
  if (typeof props.className === 'object') {
    return Object.entries(props.className)
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(' ')
  }
  return ''
})

const initOptionsWithDefaults = computed(() => ({
  renderer: props.renderer,
  ...props.initOptions
}))

const resolvedTheme = computed(() => {
  const themeProp = props.theme
  // If a theme object is provided, use it as-is
  if (themeProp && typeof themeProp === 'object') {
    return themeProp
  }
  const themeName = (themeProp as string | undefined)?.toLowerCase()
  // If explicit dark/light provided, respect it
  if (themeName === 'dark') return 'dark'
  if (themeName === 'light') return undefined
  // Map default/undefined to current effective dark mode
  // so chart content follows UI theme
  return effectiveDarkMode.value ? 'dark' : undefined
})

// Removed debug helpers and overlap checks – native toolbox UI not used

// Track if dataZoom was added via toolbox and its configuration
const hasToolboxDataZoom = ref(false)
const toolboxDataZoomConfig = ref<any>(null)

// Canvas options: strip native title/toolbox and disable native dataZoom; apply custom slicing when zoom bar is shown
const canvasOptions = computed(() => {
  try {
    const opts: any = JSON.parse(JSON.stringify(props.options || {}))
    if (props.renderHeader) {
      delete opts.title
      delete opts.toolbox
    }
    // Always disable native dataZoom to avoid conflicts with custom zoom bar
    if (opts.dataZoom) delete opts.dataZoom

    // Apply custom windowing when zoom bar is visible and xAxis has categories
    try {
      if (showZoomBar.value && opts && opts.xAxis) {
        const xAxisOpt = Array.isArray(opts.xAxis) ? opts.xAxis[0] : opts.xAxis
        const categories: any[] = xAxisOpt?.data || []
        const total = categories.length
        if (total > 0) {
          let s = Math.max(0, Math.min(100, zoomStart.value))
          let e = Math.max(0, Math.min(100, zoomEnd.value))
          if (s > e) { const t = s; s = e; e = t }
          const startIdx = Math.floor((s / 100) * (total - 1))
          const endIdx = Math.floor((e / 100) * (total - 1))
          const slicedCats = categories.slice(startIdx, endIdx + 1)
          if (Array.isArray(opts.xAxis)) opts.xAxis = [{ ...xAxisOpt, data: slicedCats }]
          else opts.xAxis = { ...(xAxisOpt || {}), data: slicedCats }
          const seriesOpt = opts.series
          const seriesArr = (Array.isArray(seriesOpt) ? seriesOpt : (seriesOpt ? [seriesOpt] : [])).filter(Boolean)
          const newSeries = seriesArr.map((srs: any) => {
            const sData = srs?.data
            if (Array.isArray(sData) && sData.length === total) {
              return { ...srs, data: sData.slice(startIdx, endIdx + 1) }
            }
            return { ...srs }
          })
          opts.series = Array.isArray(seriesOpt) ? newSeries : newSeries[0]
        }
      }
    } catch {}

    // Safeguard: ensure cartesian axes and clamp series axis indexes
    try {
      const seriesOpt = opts.series
      const seriesArr = Array.isArray(seriesOpt) ? seriesOpt : (seriesOpt ? [seriesOpt] : [])
      const isCartesianType = (t: any) => ['line','bar','scatter','candlestick','effectScatter'].includes(t)
      const hasCartesian = seriesArr.some((s: any) => s && isCartesianType(s.type))
      if (hasCartesian) {
        // Ensure axes exist
        if (!opts.xAxis) opts.xAxis = { type: 'category' }
        if (!opts.yAxis) opts.yAxis = { type: 'value' }
        const normalizeAxis = (ax: any) => Array.isArray(ax) ? ax : (ax ? [ax] : [])
        const xAxes = normalizeAxis(opts.xAxis)
        const yAxes = normalizeAxis(opts.yAxis)
        const clampIndex = (idx: any, max: number) => {
          const n = typeof idx === 'number' ? idx : 0
          return n >= 0 && n < max ? n : 0
        }
        const clamped = seriesArr.map((s: any) => {
          if (!s || !isCartesianType(s.type)) return s
          const ni: any = { ...s }
          if (xAxes.length && ni.xAxisIndex !== undefined) ni.xAxisIndex = clampIndex(ni.xAxisIndex, xAxes.length)
          if (yAxes.length && ni.yAxisIndex !== undefined) ni.yAxisIndex = clampIndex(ni.yAxisIndex, yAxes.length)
          return ni
        })
        opts.series = Array.isArray(seriesOpt) ? clamped : clamped[0]
        if (!opts.grid) opts.grid = {}
      }
    } catch {}
    processedOptionsCache.value = opts
    return opts as EChartsOption
  } catch {
    const shallow: any = { ...(props.options || {}) }
    if (props.renderHeader) { delete shallow.title; delete shallow.toolbox }
    if (shallow.dataZoom) delete shallow.dataZoom
    processedOptionsCache.value = shallow
    return shallow as EChartsOption
  }
})

// Removed local observer setup/cleanup – handled in useECharts

// Removed deprecated toolbox functions and visual debug borders

// Config dialog methods
const openConfig = () => {
  // Always use the props.options as the source of truth
  // because getOption() returns processed options with many internal properties
  if (props.options) {
    currentOptions.value = JSON.parse(JSON.stringify(props.options))
  }
  showConfig.value = true
}

const handleConfigUpdate = async (newOptions: EChartsOption) => {
  currentOptions.value = newOptions
  setOption(newOptions, {
    notMerge: true,
    lazyUpdate: false
  })
  emit('update:options', newOptions)
}

const handleLocaleUpdate = (newLocale: string) => {
  emit('update:locale', newLocale)
}

// Handle toolbox actions: emit intent, handle dataView locally
const handleToolboxAction = (action: string, payload?: any) => {
  if (action === 'dataView') {
    showDataView.value = true
  } else if (action === 'dataZoom') {
    // Toggle custom zoom bar
    showZoomBar.value = !showZoomBar.value
    // When turning off, reset to full window
    if (!showZoomBar.value) {
      zoomStart.value = 0
      zoomEnd.value = 100
    } else {
      // Reset to reasonable initial window when enabling
      zoomStart.value = 20
      zoomEnd.value = 80
    }
  } else if (action === 'restore') {
    // Hide custom zoom bar and reset window
    showZoomBar.value = false
    zoomStart.value = 0
    zoomEnd.value = 100
  }
  emit('toolbox-action' as any, { action, payload })
}

// Handle change events from bottom ZoomBar
const handleZoomBarChange = (payload: { start: number, end: number }) => {
  zoomStart.value = Math.max(0, Math.min(100, payload.start))
  zoomEnd.value = Math.max(0, Math.min(100, payload.end))
}

// Track if initial options have been set
let initialOptionsSet = false

// Watch for option identity changes; CoreView consumes via canvasOptions
watch(() => props.options, (newOptions) => { if (newOptions) currentOptions.value = newOptions }, { deep: false })

// Watch for loading state changes
watch(
  () => props.loading,
  (loading) => {
    const inst = chartInstance.value
    if (inst) {
      if (loading) inst.showLoading('default', props.loadingOptions)
      else inst.hideLoading()
    }
  },
  { immediate: true }
)

// Theme changes handled via CoreView props

// Watch for group changes
watchEffect(() => {
  if (chartInstance.value && props.group) {
    chartInstance.value.group = props.group
  }
})

// No local observers to manage

// Initialize chart on mount
onMounted(async () => {
  // Setup dark mode detection (fallback when no explicit prop/theme provided)
  updateDarkMode()
  // Aspect ratio responsive height
  try {
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateResponsiveHeight())
      if (rootRef.value) ro.observe(rootRef.value)
    }
    updateResponsiveHeight()
  } catch {}
  
  if (typeof document !== 'undefined') {
    darkModeObserver = new MutationObserver(() => {
      updateDarkMode()
    })
    
    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    darkModeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
  
  // CoreView sets options from props
  try { console.log(JSON.stringify({ tag: '[MyndEcharts] Component mounted' })) } catch { console.log('[MyndEcharts] Component mounted') }
})

// Cleanup on unmount
onUnmounted(() => {
  // Dispose the chart
  try { coreRef.value?.dispose() } catch (e) { console.error(e) }
  
  // Clean up dark mode observer
  if (darkModeObserver) {
    darkModeObserver.disconnect()
    darkModeObserver = null
  }
  if (ro) { try { ro.disconnect() } catch {}; ro = null }
})

// Override resize: delegate to CoreView
const resizeWithFix = async () => { await coreRef.value?.resize() }


// Removed manual toolbox DOM refresh – native toolbox UI not used

// Get the raw ECharts instance for advanced users
const getChartInstance = (): ECharts | undefined => chartInstance.value && !chartInstance.value.isDisposed() ? chartInstance.value : undefined

// Override dispose – no local observers anymore
const disposeWithCleanup = () => { coreRef.value?.dispose() }

// Expose chart methods for external use
defineExpose({
  get chartInstance() { return chartInstance.value },
  getChartInstance,
  setOption: (opt: EChartsOption, o?: any) => coreRef.value?.setOption(opt, o),
  getOption: () => undefined,
  resize: resizeWithFix,
  dispose: disposeWithCleanup,
  clear: () => {},
  openConfig,
  getWidth: () => chartInstance.value?.getWidth(),
  getHeight: () => chartInstance.value?.getHeight(),
  getDom: () => chartInstance.value?.getDom(),
  getDataURL: (opts?: {
    type?: 'png' | 'jpeg' | 'svg'
    pixelRatio?: number
    backgroundColor?: string
    excludeComponents?: string[]
  }) => chartInstance.value?.getDataURL(opts),
  getConnectedDataURL: (opts?: {
    type?: 'png' | 'jpeg' | 'svg'
    pixelRatio?: number
    backgroundColor?: string
    excludeComponents?: string[]
  }) => chartInstance.value?.getConnectedDataURL(opts),
  convertToPixel: (finder: any, value: any) => chartInstance.value?.convertToPixel(finder, value),
  convertFromPixel: (finder: any, value: any) => chartInstance.value?.convertFromPixel(finder, value),
  containPixel: (finder: any, value: any) => chartInstance.value?.containPixel(finder, value),
  dispatchAction: (action: any) => chartInstance.value?.dispatchAction(action),
  isDisposed: () => chartInstance.value?.isDisposed()
})
</script>

<style scoped>

/* Wrapper to isolate chart from external CSS */
.mynd-echarts-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  /* Reset common properties that might be inherited */
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  /* Isolate from external transforms */
  transform: none;
  /* Create a new stacking context */
  z-index: 0;
  display: flex;
  flex-direction: column;
  /* Define CSS variables for theme colors */
  --mynd-echarts-title-color: #333;
  --mynd-echarts-title-hover-color: #5470c6;
  --mynd-echarts-subtitle-color: #666;
  --mynd-echarts-subtitle-hover-color: #5470c6;
}

/* Dark mode variable overrides */
.mynd-echarts-wrapper[data-theme="dark"] {
  --mynd-echarts-title-color: #e2e8f0;
  --mynd-echarts-title-hover-color: #91d5ff;
  --mynd-echarts-subtitle-color: #a0aec0;
  --mynd-echarts-subtitle-hover-color: #91d5ff;
}

/* Custom header for title and toolbox */
.mynd-echarts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: transparent;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.mynd-echarts-title-section {
  flex: 1;
  min-width: 0;
}

.mynd-echarts-title {
  margin: 0;
  padding: 0;
  /* Default styles - can be overridden by inline styles from options */
  font-size: 14px;
  font-weight: bold;
  color: var(--mynd-echarts-title-color, #333);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
  text-decoration: none;
  display: block;
}

/* Link styles for title */
a.mynd-echarts-title:hover {
  color: var(--mynd-echarts-title-hover-color, #5470c6);
  text-decoration: underline;
}

/* No need for additional dark mode overrides here since variables are set at wrapper level */

.mynd-echarts-subtitle {
  margin: 4px 0 0 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  color: var(--mynd-echarts-subtitle-color, #666);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
  text-decoration: none;
  display: block;
}

/* Link styles for subtitle */
a.mynd-echarts-subtitle:hover {
  color: var(--mynd-echarts-subtitle-hover-color, #5470c6);
  text-decoration: underline;
}

/* No need for additional dark mode overrides here since variables are set at wrapper level */

/* Toolbox styling is handled by ChartToolbox component */

/* Container for the actual chart */
.mynd-echarts-container {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 0;
  /* Ensure proper box model */
  box-sizing: border-box;
  /* Prevent overflow issues */
  overflow: hidden;
}

/* The chart element itself */
.mynd-echarts-chart {
  width: 100%;
  height: 100%;
  position: relative;
  /* Ensure chart fills container */
  display: block;
  /* Reset any inherited text properties */
  font-size: inherit;
  line-height: normal;
}

/* Ensure ECharts canvas/svg fills the container */
.mynd-echarts-chart > div,
.mynd-echarts-chart > canvas,
.mynd-echarts-chart > svg {
  width: 100% !important;
  height: 100% !important;
}
</style>