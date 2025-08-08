<template>
  <div class="mynd-echarts-wrapper">
    <!-- Custom Header -->
    <div v-if="chartTitle || chartSubtitle" class="mynd-echarts-header">
      <div class="mynd-echarts-title-section">
        <component 
          :is="titleLink ? 'a' : 'h3'" 
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
        v-if="showToolbox"
        :chart-instance="chartInstance"
        :chart-type="detectedChartTypes"
        :display-style="toolboxStyle"
        :toolbox-config="toolboxConfig"
        :options="props.options"
        :locale="props.locale"
        @action="handleToolboxAction"
      />
    </div>
    
    <!-- Chart Container -->
    <div class="mynd-echarts-container">
      <div ref="chartRef" class="mynd-echarts-chart" :style="computedStyle" :class="computedClass"></div>
    </div>
    <!-- Zoom bar under the chart -->
    <ZoomBar
      v-if="showZoomBar"
      :options="props.options"
      :start="zoomStart"
      :end="zoomEnd"
      @change="handleZoomBarChange"
    />
    
    <ConfigDialog 
      v-if="showConfig"
      v-model="showConfig" 
      :options="currentOptions"
      @update:options="handleConfigUpdate"
      @update:locale="handleLocaleUpdate"
    />
    
    <DataViewDialog
      v-model="showDataView"
      :options="props.options"
      :chart-instance="chartInstance"
      :locale="props.locale as SupportedLocale"
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

export interface MyndEchartsProps {
  /**
   * ECharts options configuration object
   */
  options: EChartsOption
  /**
   * Chart theme - can be a string name or custom theme object
   */
  theme?: string | object
  /**
   * Locale for chart UI elements (toolbox, etc.)
   */
  locale?: string
  /**
   * Show loading animation
   */
  loading?: boolean
  /**
   * Loading text
   */
  loadingOptions?: {
    text?: string
    color?: string
    textColor?: string
    maskColor?: string
    zlevel?: number
    fontSize?: number
    showSpinner?: boolean
    spinnerRadius?: number
    lineWidth?: number
  }
  /**
   * Custom inline styles
   */
  style?: CSSProperties
  /**
   * CSS class name(s)
   */
  className?: string | string[] | Record<string, boolean>
  /**
   * Enable automatic resize on container size change
   */
  autoResize?: boolean
  /**
   * Rendering mode
   */
  renderer?: 'canvas' | 'svg'
  /**
   * Chart initialization options
   */
  initOptions?: {
    devicePixelRatio?: number
    renderer?: 'canvas' | 'svg'
    width?: number | string
    height?: number | string
    locale?: string
  }
  /**
   * Merge options instead of replacing
   */
  notMerge?: boolean
  /**
   * Lazy update for better performance with frequent updates
   */
  lazyUpdate?: boolean
  /**
   * Update options silently (no animation)
   */
  silent?: boolean
  /**
   * Group name for chart connection
   */
  group?: string
  /**
   * Toolbox display mode
   * - 'auto': Use options from chart configuration
   * - 'fixed': Force specific positioning with static values
   * - 'disabled': Don't render toolbox
   */
  toolboxMode?: 'auto' | 'fixed' | 'disabled'
  /**
   * Toolbox position (numeric values only for JSON serialization)
   */
  toolboxPosition?: {
    right?: number
    left?: number
    top?: number
    bottom?: number
  }
  /**
   * Automatically fix toolbox overlap issues
   */
  fixToolboxOverlap?: boolean
  /**
   * Enable debug mode for toolbox troubleshooting
   */
  debugToolbox?: boolean
  /**
   * Show custom toolbox in header
   */
  showToolbox?: boolean
  /**
   * Toolbox display style
   */
  toolboxStyle?: 'toolbar' | 'menu'
}

const props = withDefaults(defineProps<MyndEchartsProps>(), {
  theme: 'default',
  locale: 'en',
  loading: false,
  autoResize: true,
  renderer: 'canvas',
  notMerge: false,
  lazyUpdate: false,
  silent: false,
  toolboxMode: 'auto',
  toolboxPosition: () => ({ right: 10, top: 10 }),
  fixToolboxOverlap: true,
  debugToolbox: false,
  showToolbox: true,
  toolboxStyle: 'toolbar'
})

const emit = defineEmits<{
  ready: [instance: ECharts]
  click: [params: any]
  dblclick: [params: any]
  mousedown: [params: any]
  mousemove: [params: any]
  mouseup: [params: any]
  mouseover: [params: any]
  mouseout: [params: any]
  globalout: [params: any]
  contextmenu: [params: any]
  highlight: [params: any]
  downplay: [params: any]
  selectchanged: [params: any]
  legendselectchanged: [params: any]
  legendselected: [params: any]
  legendunselected: [params: any]
  legendselectall: [params: any]
  legendinverseselect: [params: any]
  legendscroll: [params: any]
  datazoom: [params: any]
  datarangeselected: [params: any]
  graphroam: [params: any]
  georoam: [params: any]
  treeroam: [params: any]
  timelinechanged: [params: any]
  timelineplaychanged: [params: any]
  restore: [params: any]
  dataviewchanged: [params: any]
  magictypechanged: [params: any]
  pieselectchanged: [params: any]
  pieselected: [params: any]
  pieunselected: [params: any]
  mapselected: [params: any]
  mapunselected: [params: any]
  axisareaselected: [params: any]
  brush: [params: any]
  brushEnd: [params: any]
  brushselected: [params: any]
  globalcursortaken: [params: any]
  rendered: [params: any]
  finished: [params: any]
  'update:options': [options: EChartsOption]
  'update:locale': [locale: string]
  'toolbox-rendered': [info: { dom: HTMLElement, config: any }]
  'toolbox-overlap-detected': [info: { elements: number, measurements: any }]
  'toolbox-fixed': [info: { method: string, success: boolean }]
}>()

const chartRef = ref<HTMLElement>()
const showConfig = ref(false)
const showDataView = ref(false)
const currentOptions = ref<EChartsOption>(props.options || {})
// Store the processed options to maintain state
const processedOptionsCache = ref<EChartsOption | null>(null)
// Store base options for custom zoom windowing
const zoomBaseOptions = ref<EChartsOption | null>(null)
const showZoomBar = ref(false)
const zoomStart = ref(0)
const zoomEnd = ref(100)

// Observer refs
let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null

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
    style.color = config.textStyle.color
    style.fontSize = typeof config.textStyle.fontSize === 'number' 
      ? `${config.textStyle.fontSize}px` 
      : config.textStyle.fontSize
    style.fontWeight = config.textStyle.fontWeight
    style.fontFamily = config.textStyle.fontFamily
    style.fontStyle = config.textStyle.fontStyle
    style.lineHeight = config.textStyle.lineHeight
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
    style.color = config.subtextStyle.color
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
  // Remove title from options to prevent double display
  delete opts.title
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

const { chartInstance, setOption: rawSetOption, resize, dispose, clear, getOption } = useECharts(chartRef, {
  theme: computed(() => props.theme),
  locale: computed(() => props.locale),
  renderer: props.renderer,
  autoResize: props.autoResize,
  initOptions: initOptionsWithDefaults.value,
  onReady: async (instance) => {
    // Set initial options immediately when chart is ready
    if (props.options) {
      const processed = processChartOptions(props.options)
      instance.setOption(processed, {
        notMerge: props.notMerge,
        lazyUpdate: props.lazyUpdate,
        silent: props.silent
      })
    }
    
    emit('ready', instance)
    
    // Debug: emit toolbox-rendered event
    if (props.debugToolbox) {
      const chartDom = instance.getDom()
      // Now it's safe to get options since we've set them
      const currentOpts = instance.getOption()
      const toolboxConfig = currentOpts.toolbox?.[0]
      
      if (toolboxConfig?.show !== false) {
        debugLog('Render', 'Toolbox rendered', toolboxConfig)
        emit('toolbox-rendered', {
          dom: chartDom,
          config: toolboxConfig
        })
        
        // Check for overlap after render
        setTimeout(() => {
          checkToolboxOverlap()
          addDebugBorder()
        }, 100)
      }
    }
    
    // Set up observers after chart is ready
    setupObservers()
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

// Debug logging helper
const debugLog = (category: string, message: string, data?: any) => {
  if (props.debugToolbox) {
    console.log(`[MyndEcharts Debug - ${category}]`, message, data || '')
  }
}

// Check for toolbox overlap
const checkToolboxOverlap = () => {
  if (!chartInstance.value || !props.debugToolbox) return

  try {
    const chartDom = chartInstance.value.getDom()
    const toolboxElements = chartDom.querySelectorAll('[id*="toolbox"] > g, .echarts-toolbox > *')
    
    if (toolboxElements.length > 1) {
      const measurements: any[] = []
      let hasOverlap = false
      
      toolboxElements.forEach((el, index) => {
        const rect = (el as HTMLElement).getBoundingClientRect?.() || 
                     (el as SVGElement).getBBox?.()
        if (rect) {
          measurements.push({
            index,
            x: rect.x || rect.left,
            y: rect.y || rect.top,
            width: rect.width,
            height: rect.height
          })
          
          // Check for overlap with previous elements
          if (index > 0) {
            const prev = measurements[index - 1]
            if (Math.abs(prev.y - (rect.y || rect.top)) < 5) {
              // Elements are on same line, check horizontal overlap
              if (prev.x + prev.width > (rect.x || rect.left)) {
                hasOverlap = true
              }
            }
          }
        }
      })
      
      if (hasOverlap) {
        debugLog('Overlap', 'Toolbox overlap detected!', measurements)
        emit('toolbox-overlap-detected', {
          elements: toolboxElements.length,
          measurements
        })
      }
    }
  } catch (error) {
    debugLog('Error', 'Failed to check toolbox overlap', error)
  }
}

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
  
  // Remove title from options since we're displaying it in custom header
  delete processedOpts.title

  // Remove native toolbox since we handle it in custom header
  delete processedOpts.toolbox
  
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

// Set up observers for resize and DOM changes
const setupObservers = () => {
  if (!chartRef.value || !chartInstance.value) return

  // ResizeObserver to handle container size changes
  if (typeof ResizeObserver !== 'undefined') {
    let isFirstResize = true
    resizeObserver = new ResizeObserver((entries) => {
      // Skip the first resize trigger which happens immediately when observer is attached
      if (isFirstResize) {
        isFirstResize = false
        return
      }
      
      // Clear any pending resize timer
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }

      // Only resize if chart has been properly initialized with options
      if (chartInstance.value && !chartInstance.value.isDisposed()) {
        // Use a small debounce to avoid too many resize calls
        resizeTimer = setTimeout(() => {
          if (chartInstance.value && !chartInstance.value.isDisposed()) {
            chartInstance.value.resize()
          }
        }, 100)
      }
    })

    resizeObserver.observe(chartRef.value)
  }

  // MutationObserver to detect toolbox DOM changes
  if (typeof MutationObserver !== 'undefined' && chartInstance.value) {
    const chartDom = chartInstance.value.getDom()
    
    mutationObserver = new MutationObserver((mutations) => {
      // Check if any mutation affects the toolbox
      const toolboxChanged = mutations.some(mutation => {
        const target = mutation.target as HTMLElement
        // Check if the mutation is related to toolbox elements
        return target.closest?.('[id*="toolbox"]') || 
               target.querySelector?.('[id*="toolbox"]') ||
               mutation.addedNodes.length > 0 && 
               Array.from(mutation.addedNodes).some((node: any) => 
                 node.id?.includes?.('toolbox') || 
                 node.querySelector?.('[id*="toolbox"]')
               )
      })

      if (toolboxChanged) {
        // No longer need to fix toolbox position since we use custom toolbox
      }
    })

    // Observe the chart DOM for changes
    mutationObserver.observe(chartDom, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'transform']
    })
  }
}

// Clean up observers
const cleanupObservers = () => {
  // Clear any pending timer
  if (resizeTimer) {
    clearTimeout(resizeTimer)
    resizeTimer = null
  }

  // Disconnect ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  // Disconnect MutationObserver
  if (mutationObserver) {
    mutationObserver.disconnect()
    mutationObserver = null
  }
}

// Fix toolbox positioning - NO LONGER NEEDED since we use custom toolbox
const fixToolboxPosition = async () => {
  // This function is deprecated - we now use a custom toolbox in the header
  // Keeping it as a no-op for backward compatibility
  if (props.debugToolbox) {
    debugLog('Fix', 'fixToolboxPosition called but no longer needed - using custom toolbox')
  }
}

// Add visual debug border to toolbox
const addDebugBorder = () => {
  if (!props.debugToolbox || !chartInstance.value) return
  
  try {
    const chartDom = chartInstance.value.getDom()
    const toolboxElements = chartDom.querySelectorAll('[id*="toolbox"], .echarts-toolbox')
    
    toolboxElements.forEach((element: Element) => {
      const el = element as HTMLElement
      if (el.style) {
        el.style.border = '2px solid red'
        el.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)'
      }
    })
    
    // For SVG elements, add a rect with stroke
    const svgToolboxes = chartDom.querySelectorAll('svg g[id*="toolbox"]')
    svgToolboxes.forEach((group: Element) => {
      const bbox = (group as SVGGraphicsElement).getBBox()
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', String(bbox.x - 2))
      rect.setAttribute('y', String(bbox.y - 2))
      rect.setAttribute('width', String(bbox.width + 4))
      rect.setAttribute('height', String(bbox.height + 4))
      rect.setAttribute('fill', 'none')
      rect.setAttribute('stroke', 'red')
      rect.setAttribute('stroke-width', '2')
      rect.setAttribute('stroke-dasharray', '5,5')
      rect.setAttribute('data-debug', 'toolbox-border')
      group.appendChild(rect)
    })
    
    debugLog('Visual', 'Debug borders added to toolbox')
  } catch (error) {
    debugLog('Error', 'Failed to add debug borders', error)
  }
}

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
        zoomStart.value = 0
        zoomEnd.value = 100
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
        const seriesArr = Array.isArray(seriesOpt) ? seriesOpt : (seriesOpt ? [seriesOpt] : [])
        const newSeries = seriesArr.map((s: any) => {
          const sData = s?.data
          if (Array.isArray(sData) && sData.length === total) {
            return { ...s, data: sData.slice(startIdx, endIdx + 1) }
          }
          return s
        })
        const newOptions: any = { ...base }
        if (Array.isArray(base.xAxis)) newOptions.xAxis = [newXAxis]
        else newOptions.xAxis = newXAxis
        newOptions.series = newSeries
        rawSetOption(newOptions, { notMerge: true, lazyUpdate: false, silent: false })
      } catch (e) {
        console.warn('[MyndEcharts] Failed to apply custom zoom window:', e)
      }
      break
      
    case 'magicType':
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
      
    case 'brush':
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
        setOption(newOptions, {
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
  }
)

// Theme changes are now handled by the useECharts composable

// Watch for group changes
watchEffect(() => {
  if (chartInstance.value && props.group) {
    chartInstance.value.group = props.group
  }
})

// Watch for chart instance changes to re-setup observers
watch(chartInstance, (newInstance, oldInstance) => {
  if (oldInstance && oldInstance !== newInstance) {
    // Clean up old observers
    cleanupObservers()
  }
  if (newInstance) {
    // Set up new observers
    setupObservers()
  }
})

// Initialize chart on mount
onMounted(async () => {
  // Options are now set in the onReady callback to ensure proper initialization order
  // Just ensure observers are set up if needed
  if (chartInstance.value) {
    setupObservers()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  // Clean up observers first
  cleanupObservers()
  // Then dispose the chart
  dispose()
})

// Override resize
const resizeWithFix = async (opts?: Parameters<ECharts['resize']>[0]) => {
  resize(opts)
  await nextTick()
}


// Manually refresh toolbox by directly manipulating DOM
const refreshToolbox = () => {
  if (!chartInstance.value || chartInstance.value.isDisposed()) {
    console.warn('[mynd-echarts] Cannot refresh toolbox: chart not initialized')
    return false
  }

  try {
    const chartDom = chartInstance.value.getDom()
    if (!chartDom) return false

    // Find toolbox elements in the chart DOM
    const toolboxElements = chartDom.querySelectorAll('[id*="toolbox"], .echarts-toolbox, g[id*="group_toolbox"]')
    
    toolboxElements.forEach((element: Element) => {
      const el = element as HTMLElement
      
      // Apply CSS fixes directly to the element
      if (el.style) {
        el.style.display = 'flex'
        el.style.flexDirection = 'row'
        el.style.alignItems = 'center'
        el.style.gap = '10px'
      }

      // Fix child elements layout
      const children = el.children
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement
        if (child.style) {
          child.style.display = 'inline-block'
          child.style.verticalAlign = 'middle'
          child.style.marginRight = i < children.length - 1 ? '10px' : '0'
        }
      }
    })

    // Also check for SVG toolbox groups
    const svgGroups = chartDom.querySelectorAll('svg g[id*="toolbox"]')
    svgGroups.forEach((group: Element) => {
      // For SVG elements, we need to adjust transform attributes
      const children = group.children
      let xOffset = 0
      
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as SVGElement
        
        // Check if it's a group element containing toolbox items
        if (child.tagName === 'g' || child.tagName === 'rect' || child.tagName === 'path') {
          // Apply horizontal spacing using transform
          if (i > 0) {
            xOffset += 25 // Add spacing between items
          }
          
          const currentTransform = child.getAttribute('transform') || ''
          // Parse and update transform to ensure horizontal layout
          if (!currentTransform.includes('translate') || i > 0) {
            child.setAttribute('transform', `translate(${xOffset}, 0)`)
          }
        }
      }
    })

    // Force a reflow to ensure changes are applied
    void chartDom.offsetHeight

    // No longer need to fix toolbox position since we use custom toolbox

    if (props.debugToolbox) {
      debugLog('Refresh', 'Manual toolbox refresh completed')
      emit('toolbox-fixed', { method: 'refreshToolbox', success: true })
    }

    return true
  } catch (error) {
    console.error('[mynd-echarts] Error refreshing toolbox:', error)
    if (props.debugToolbox) {
      emit('toolbox-fixed', { method: 'refreshToolbox', success: false })
    }
    return false
  }
}

// Get the raw ECharts instance for advanced users
const getChartInstance = (): ECharts | undefined => {
  if (!chartInstance.value || chartInstance.value.isDisposed()) {
    return undefined
  }
  return chartInstance.value
}

// Override dispose to include observer cleanup
const disposeWithCleanup = () => {
  cleanupObservers()
  dispose()
}

// Expose chart methods for external use
defineExpose({
  chartInstance,
  setOption,
  getOption,
  resize: resizeWithFix,
  dispose: disposeWithCleanup,
  clear,
  openConfig,
  fixToolboxPosition,
  refreshToolbox,
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

<style>
/* Import toolbox fixes for proper icon display */
@import '../styles/echarts-toolbox.css';

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
  font-size: 18px;
  font-weight: 500;
  color: #333;
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
  color: #5470c6;
  text-decoration: underline;
}

/* Dark mode title color */
:root.dark .mynd-echarts-title,
html.dark .mynd-echarts-title,
.dark .mynd-echarts-title {
  color: #e2e8f0;
}

:root.dark a.mynd-echarts-title:hover,
html.dark a.mynd-echarts-title:hover,
.dark a.mynd-echarts-title:hover {
  color: #91d5ff;
}

.mynd-echarts-subtitle {
  margin: 4px 0 0 0;
  padding: 0;
  font-size: 14px;
  font-weight: 400;
  color: #666;
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
  color: #5470c6;
  text-decoration: underline;
}

/* Dark mode subtitle color */
:root.dark .mynd-echarts-subtitle,
html.dark .mynd-echarts-subtitle,
.dark .mynd-echarts-subtitle {
  color: #a0aec0;
}

:root.dark a.mynd-echarts-subtitle:hover,
html.dark a.mynd-echarts-subtitle:hover,
.dark a.mynd-echarts-subtitle:hover {
  color: #91d5ff;
}

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