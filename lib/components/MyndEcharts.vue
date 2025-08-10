<template>
  <div class="mynd-echarts-wrapper" :data-theme="effectiveDarkMode ? 'dark' : 'light'" :class="computedClass">
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
    <div class="mynd-echarts-container" @mousedown.stop @touchstart.stop>
      <div ref="chartRef" class="mynd-echarts-chart" :style="computedStyle" :class="computedClass"></div>
    </div>
    <!-- Zoom bar under the chart -->
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
import { useECharts } from '../composables/useECharts'
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
  /** @deprecated Native toolbox mode no longer used */
  toolboxMode?: 'auto' | 'fixed' | 'disabled'
  /** @deprecated Native toolbox position no longer used */
  toolboxPosition?: { right?: number; left?: number; top?: number; bottom?: number }
  /** @deprecated Native toolbox overlap fix no longer used */
  fixToolboxOverlap?: boolean
  /** @deprecated Debug toolbox diagnostics no longer used */
  debugToolbox?: boolean
}

const props = withDefaults(defineProps<ExtendedMyndEchartsProps>(), {
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
  renderHeader: true
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
const showConfig = ref(false)
const showDataView = ref(false)
const currentOptions = ref<EChartsOption>(props.options || {})
// Store the processed options to maintain state
const processedOptionsCache = ref<EChartsOption | null>(null)
// Store base options for custom zoom windowing
const zoomBaseOptions = ref<EChartsOption | null>(null)
const showZoomBar = ref(false)
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

const computedStyle = computed<CSSProperties>(() => ({
  width: '100%',
  height: '100%',
  position: 'relative',
  ...props.style
}))

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
  if (themeName === 'dark' || themeName === 'light') {
    return themeName
  }
  // Map default/undefined to current effective dark mode
  // so chart content follows UI theme
  return effectiveDarkMode.value ? 'dark' : 'light'
})

const { chartInstance, setOption: rawSetOption, resize, dispose, clear, getOption } = useECharts(chartRef, {
  theme: resolvedTheme,
  locale: computed(() => props.locale),
  renderer: props.renderer,
  autoResize: props.autoResize,
  initOptions: initOptionsWithDefaults.value,
  onInitError: (e) => { console.error(e) },
  onSetOptionError: (e) => { console.error(e) },
  onReady: async (instance) => {
    // Set initial options immediately when chart is ready
    if (props.options) {
      try {
        // Respect renderHeader behavior
        const initialOptions = props.renderHeader ? processedOptions.value : props.options
        rawSetOption(initialOptions, {
          notMerge: props.notMerge,
          lazyUpdate: props.lazyUpdate,
          silent: props.silent
        })
      } catch (e) {
        console.error(e)
      }
    }
    // Respect initial loading state
    if (props.loading) {
      instance.showLoading('default', props.loadingOptions)
    }
    
    emit('ready', instance)
    
    // Observers handled in useECharts; nothing extra needed here
  },
  events: {
    click: (params) => emit('click', params),
    dblclick: (params) => emit('dblclick', params),
    mousedown: (params) => emit('mousedown', params),
    mousemove: (params) => emit('mousemove', params),
    mouseup: (params) => emit('mouseup', params),
    mouseover: (params) => emit('mouseover', params),
    mouseout: (params) => emit('mouseout', params),
    globalout: (params) => emit('globalout', params),
    contextmenu: (params) => emit('contextmenu', params),
    highlight: (params) => emit('highlight', params),
    downplay: (params) => emit('downplay', params),
    selectchanged: (params) => emit('selectchanged', params),
    legendselectchanged: (params) => emit('legendselectchanged', params),
    legendselected: (params) => emit('legendselected', params),
    legendunselected: (params) => emit('legendunselected', params),
    legendselectall: (params) => emit('legendselectall', params),
    legendinverseselect: (params) => emit('legendinverseselect', params),
    legendscroll: (params) => emit('legendscroll', params),
    datazoom: (params) => emit('datazoom', params),
    datarangeselected: (params) => emit('datarangeselected', params),
    graphroam: (params) => emit('graphroam', params),
    georoam: (params) => emit('georoam', params),
    treeroam: (params) => emit('treeroam', params),
    timelinechanged: (params) => emit('timelinechanged', params),
    timelineplaychanged: (params) => emit('timelineplaychanged', params),
    restore: (params) => emit('restore', params),
    dataviewchanged: (params) => emit('dataviewchanged', params),
    magictypechanged: (params) => emit('magictypechanged', params),
    pieselectchanged: (params) => emit('pieselectchanged', params),
    pieselected: (params) => emit('pieselected', params),
    pieunselected: (params) => emit('pieunselected', params),
    mapselected: (params) => emit('mapselected', params),
    mapunselected: (params) => emit('mapunselected', params),
    axisareaselected: (params) => emit('axisareaselected', params),
    brush: (params) => emit('brush', params),
    brushEnd: (params) => emit('brushEnd', params),
    brushselected: (params) => emit('brushselected', params),
    globalcursortaken: (params) => emit('globalcursortaken', params),
    rendered: (params) => emit('rendered', params),
    finished: (params) => emit('finished', params)
  }
})

// Removed debug helpers and overlap checks – native toolbox UI not used

// Process options to ensure JSON serializability and apply toolbox fixes
const processChartOptions = (options: EChartsOption): EChartsOption => {
  // Deep clone to ensure plain JSON (strips functions)
  let processedOpts: any
  try {
    processedOpts = JSON.parse(JSON.stringify(options))
  } catch (error) {
    console.warn('[mynd-echarts] Failed to serialize options, using shallow copy:', error)
    processedOpts = { ...options }
  }
  
  // Remove title/toolbox from options since we're displaying them in custom header
  if (props.renderHeader) {
    delete (processedOpts as any).title
    delete processedOpts.toolbox
  }

  // If preferThemeDefaults is enabled, strip color-like overrides so theme can apply
  if (props.preferThemeDefaults) {
    try {
      // Top-level color palette
      if ('color' in processedOpts) delete (processedOpts as any).color
      // Clean title colors in case header rendering is disabled
      const titles = Array.isArray((processedOpts as any).title) ? (processedOpts as any).title : [(processedOpts as any).title]
      titles.filter(Boolean).forEach((t: any) => {
        if (t?.textStyle?.color) delete t.textStyle.color
        if (t?.subtextStyle?.color) delete t.subtextStyle.color
      })
      // Legend/tooltip colors
      if ((processedOpts as any).legend?.textStyle?.color) delete (processedOpts as any).legend.textStyle.color
      if ((processedOpts as any).tooltip?.textStyle?.color) delete (processedOpts as any).tooltip.textStyle.color
      if ((processedOpts as any).tooltip?.backgroundColor) delete (processedOpts as any).tooltip.backgroundColor
      // Axis label and split line colors
      const normalizeAxis = (axis: any) => Array.isArray(axis) ? axis : (axis ? [axis] : [])
      normalizeAxis((processedOpts as any).xAxis).forEach((ax: any) => {
        if (ax?.axisLabel?.color) delete ax.axisLabel.color
        if (ax?.axisLine?.lineStyle?.color) delete ax.axisLine.lineStyle.color
        if (ax?.splitLine?.lineStyle?.color) delete ax.splitLine.lineStyle.color
      })
      normalizeAxis((processedOpts as any).yAxis).forEach((ay: any) => {
        if (ay?.axisLabel?.color) delete ay.axisLabel.color
        if (ay?.axisLine?.lineStyle?.color) delete ay.axisLine.lineStyle.color
        if (ay?.splitLine?.lineStyle?.color) delete ay.splitLine.lineStyle.color
      })
      // Series item/line/area color overrides
      const seriesArr = Array.isArray((processedOpts as any).series) ? (processedOpts as any).series : ((processedOpts as any).series ? [(processedOpts as any).series] : [])
      seriesArr.forEach((s: any) => {
        if (!s) return
        if ('color' in s) delete s.color
        if (s?.itemStyle?.color) delete s.itemStyle.color
        if (s?.lineStyle?.color) delete s.lineStyle.color
        if (s?.areaStyle?.color) delete s.areaStyle.color
      })
      // Restore original shape
      if (!Array.isArray((processedOpts as any).series) && seriesArr.length) {
        ;(processedOpts as any).series = seriesArr[0]
      }
    } catch {}
  }
  
  // Ensure a valid coordinate system exists for common cartesian series
  try {
    const seriesOpt = processedOpts.series
    const seriesArr = Array.isArray(seriesOpt) ? seriesOpt : (seriesOpt ? [seriesOpt] : [])
    const needsCartesian = seriesArr.some((s: any) => s && ['line', 'bar', 'scatter', 'candlestick', 'effectScatter'].includes(s.type))
    const hasAnyCoordSys = !!(processedOpts.xAxis || processedOpts.yAxis || processedOpts.polar || processedOpts.singleAxis || processedOpts.radar || processedOpts.geo || processedOpts.parallel)
    if (needsCartesian && !(processedOpts.xAxis || processedOpts.yAxis)) {
      // Add minimal default axes to prevent coordSys being undefined
      if (!processedOpts.xAxis) processedOpts.xAxis = { type: 'category' }
      if (!processedOpts.yAxis) processedOpts.yAxis = { type: 'value' }
    }
    
    // Normalize axes shape to arrays when indexes are used
    const normalizeAxis = (axis: any) => Array.isArray(axis) ? axis : (axis ? [axis] : [])
    const xAxes = normalizeAxis(processedOpts.xAxis)
    const yAxes = normalizeAxis(processedOpts.yAxis)

    const clampIndex = (idx: any, max: number) => {
      const n = typeof idx === 'number' ? idx : 0
      return n >= 0 && n < max ? n : 0
    }

    processedOpts.series = seriesArr.map((s: any) => {
      if (!s) return s
      if (['line', 'bar', 'scatter', 'candlestick', 'effectScatter'].includes(s.type)) {
        // Default to cartesian when unspecified
        if (!s.coordinateSystem && !processedOpts.polar && !processedOpts.singleAxis) {
          s = { coordinateSystem: 'cartesian2d', ...s }
        }
        // Ensure a grid exists for cartesian charts
        if (!processedOpts.grid) {
          processedOpts.grid = {}
        }
        // Ensure valid axis indexes
        if (xAxes.length) {
          const xi = clampIndex((s as any).xAxisIndex, xAxes.length)
          if ((s as any).xAxisIndex !== undefined && xi !== (s as any).xAxisIndex) {
            s = { ...s, xAxisIndex: xi }
          }
        }
        if (yAxes.length) {
          const yi = clampIndex((s as any).yAxisIndex, yAxes.length)
          if ((s as any).yAxisIndex !== undefined && yi !== (s as any).yAxisIndex) {
            s = { ...s, yAxisIndex: yi }
          }
        }
      }
      return s
    })
    // Preserve original shape (array vs object)
    if (!Array.isArray(seriesOpt)) processedOpts.series = processedOpts.series[0]
  } catch {}
  
  // Don't remove dataZoom if it's already configured in the options
  // We'll only add/remove it when user clicks the zoom button
  
  // Cache the processed options for later use
  processedOptionsCache.value = processedOpts
  
  return processedOpts
}

// Wrapped setOption that always processes options
const setOption = (options: EChartsOption, opts?: any, skipProcessing = false) => {
  const processed = skipProcessing ? options : processChartOptions(options)
  rawSetOption(processed, opts)
}

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

// Handle toolbox actions
const handleToolboxAction = (action: string, payload?: any) => {
  if (!chartInstance.value || chartInstance.value.isDisposed()) return
  
  switch (action) {
    case 'restore':
      // Restore to original options
      if (props.options) {
        // Process options fresh to ensure we have clean state
        const processed = processChartOptions(props.options)
        // Use rawSetOption to avoid double processing
        rawSetOption(processed, {
          notMerge: true,
          lazyUpdate: false
        })
        // Reset zoom state and hide zoom bar
        zoomBaseOptions.value = null
        zoomStart.value = 20 // Changed from 0 to 20 for better initial positioning
        zoomEnd.value = 80 // Changed from 100 to 80 for better initial positioning
        showZoomBar.value = false
      }
      break
      
    case 'dataView':
      // Show data view dialog
      showDataView.value = true
      break
      
    case 'dataZoom':
      // Enable custom zoom controls; cache base options for windowing
      if (!zoomBaseOptions.value) {
        zoomBaseOptions.value = processChartOptions(props.options)
      }
      showZoomBar.value = !showZoomBar.value
      break
    case 'dataZoomSet':
      // Custom windowing: slice xAxis/series data by start/end percent
      try {
        const base = JSON.parse(JSON.stringify(zoomBaseOptions.value || processChartOptions(props.options))) as any
        const xAxisOpt = Array.isArray(base.xAxis) ? base.xAxis[0] : base.xAxis
        const categories: any[] = xAxisOpt?.data || []
        const total = categories.length
        if (!total) break
        let startPct = Math.max(0, Math.min(100, payload?.start ?? 0))
        let endPct = Math.max(0, Math.min(100, payload?.end ?? 100))
        if (startPct > endPct) [startPct, endPct] = [endPct, startPct]
        const startIdx = Math.floor((startPct / 100) * (total - 1))
        const endIdx = Math.floor((endPct / 100) * (total - 1))
        zoomStart.value = startPct
        zoomEnd.value = endPct
        const newXAxis = { ...(xAxisOpt || {}), data: categories.slice(startIdx, endIdx + 1) }
        const seriesOpt = base.series
        const seriesArr = (Array.isArray(seriesOpt) ? seriesOpt : (seriesOpt ? [seriesOpt] : [])).filter(Boolean)
        if (!seriesArr.length) break
        const newSeries = seriesArr.map((s: any) => {
          if (!s || !s.type) return s
          const sData = s.data
          if (Array.isArray(sData) && sData.length === total) {
            return { ...s, data: sData.slice(startIdx, endIdx + 1) }
          }
          return { ...s }
        })
        const newOptions: any = { ...base }
        if (Array.isArray(base.xAxis)) newOptions.xAxis = [newXAxis]
        else newOptions.xAxis = newXAxis
        // Preserve original shape (array vs object)
        newOptions.series = Array.isArray(seriesOpt) ? newSeries : newSeries[0]
        rawSetOption(newOptions, { notMerge: true, lazyUpdate: false, silent: false })
      } catch (e) {
        console.warn('[MyndEcharts] Failed to apply custom zoom window:', e)
      }
      break
      
    case 'magicType': {
      // Switch between configured types or default line/bar
      const opts = chartInstance.value.getOption()
      const currentSeries = opts.series as any[]
      
      if (currentSeries && currentSeries.length > 0) {
        // Get configured types from toolbox config
        const magicTypeConfig = toolboxConfig.value?.feature?.magicType
        const availableTypes = magicTypeConfig?.type || ['line', 'bar']
        
        // Find current type index and switch to next
        const currentType = currentSeries[0].type || 'line'
        const currentIndex = availableTypes.indexOf(currentType)
        const nextIndex = (currentIndex + 1) % availableTypes.length
        const newType = availableTypes[nextIndex]
        
        const newSeries = currentSeries.map(s => ({
          ...s,
          type: newType
        }))
        
        setOption({
          ...opts,
          series: newSeries
        }, { notMerge: true })
      }
      break
    }
      
    case 'brush': {
      // Toggle brush selection
      const brushOpts = chartInstance.value.getOption()
      const hasBrush = brushOpts.brush && brushOpts.brush.length > 0
      
      if (!hasBrush) {
        setOption({
          ...brushOpts,
          brush: {
            toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
            xAxisIndex: 0
          }
        }, { notMerge: true })
      } else {
        setOption({
          ...brushOpts,
          brush: {}
        }, { notMerge: true })
      }
      break
    }
  }
}

// Handle change events from bottom ZoomBar
const handleZoomBarChange = (payload: { start: number, end: number }) => {
  handleToolboxAction('dataZoomSet', payload)
}

// Track if initial options have been set
let initialOptionsSet = false

// Watch for option changes
watch(
  () => props.options,
  async (newOptions) => {
    if (newOptions) {
      // Update currentOptions
      currentOptions.value = newOptions
      
      // Skip the first run if chart hasn't been initialized yet
      // The onReady callback will handle the initial options
      if (!initialOptionsSet) {
        initialOptionsSet = true
        return
      }
      
      // Set options if chart instance exists
      if (chartInstance.value && !chartInstance.value.isDisposed()) {
        const nextOptions = props.renderHeader ? processedOptions.value : newOptions
        rawSetOption(nextOptions, {
          notMerge: props.notMerge,
          lazyUpdate: props.lazyUpdate,
          silent: props.silent
        })
      }
    }
  },
  { deep: true, immediate: true }
)

// Watch for loading state changes
watch(
  () => props.loading,
  (loading) => {
    if (chartInstance.value) {
      if (loading) {
        chartInstance.value.showLoading('default', props.loadingOptions)
      } else {
        chartInstance.value.hideLoading()
      }
    }
  },
  { immediate: true }
)

// Theme changes are now handled by the useECharts composable

// Watch for group changes
watchEffect(() => {
  if (chartInstance.value && props.group) {
    chartInstance.value.group = props.group
  }
})

// No local observers to manage; handled by useECharts

// Initialize chart on mount
onMounted(async () => {
  // Setup dark mode detection (fallback when no explicit prop/theme provided)
  updateDarkMode()
  
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
  
  // Options are set in the onReady callback
})

// Cleanup on unmount
onUnmounted(() => {
  // Dispose the chart
  try { dispose() } catch (e) { console.error(e) }
  
  // Clean up dark mode observer
  if (darkModeObserver) {
    darkModeObserver.disconnect()
    darkModeObserver = null
  }
})

// Override resize
const resizeWithFix = async (opts?: Parameters<ECharts['resize']>[0]) => {
  resize(opts)
  await nextTick()
}


// Removed manual toolbox DOM refresh – native toolbox UI not used

// Get the raw ECharts instance for advanced users
const getChartInstance = (): ECharts | undefined => {
  if (!chartInstance.value || chartInstance.value.isDisposed()) {
    return undefined
  }
  return chartInstance.value
}

// Override dispose – no local observers anymore
const disposeWithCleanup = () => {
  dispose()
}

// Expose chart methods for external use
defineExpose({
  get chartInstance() { return chartInstance.value },
  getChartInstance,
  setOption,
  getOption,
  resize: resizeWithFix,
  dispose: disposeWithCleanup,
  clear,
  openConfig,
  getChartInstance,
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