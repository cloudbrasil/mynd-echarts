<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <div ref="chartRef" :style="computedStyle" :class="computedClass"></div>
    <ConfigDialog 
      v-if="showConfig"
      v-model="showConfig" 
      :options="currentOptions"
      @update:options="handleConfigUpdate"
      @update:locale="handleLocaleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, watchEffect, type CSSProperties } from 'vue'
import type { EChartsOption, ECharts } from 'echarts'
import { useECharts } from '../composables/useECharts'
import { provideLocale } from '../composables/useLocale'
import type { SupportedLocale } from '../locales/types'
import ConfigDialog from './ConfigDialog.vue'

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
}

const props = withDefaults(defineProps<MyndEchartsProps>(), {
  theme: 'default',
  locale: 'en',
  loading: false,
  autoResize: true,
  renderer: 'canvas',
  notMerge: false,
  lazyUpdate: false,
  silent: false
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
}>()

const chartRef = ref<HTMLElement>()
const showConfig = ref(false)
const currentOptions = ref<EChartsOption>(props.options || {})

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

const { chartInstance, setOption, resize, dispose, clear, getOption } = useECharts(chartRef, {
  theme: computed(() => props.theme),
  locale: computed(() => props.locale),
  renderer: props.renderer,
  autoResize: props.autoResize,
  initOptions: initOptionsWithDefaults.value,
  onReady: (instance) => emit('ready', instance),
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

// Config dialog methods
const openConfig = () => {
  // Always use the props.options as the source of truth
  // because getOption() returns processed options with many internal properties
  if (props.options) {
    currentOptions.value = JSON.parse(JSON.stringify(props.options))
  }
  showConfig.value = true
}

const handleConfigUpdate = (newOptions: EChartsOption) => {
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

// Watch for option changes
watch(
  () => props.options,
  (newOptions) => {
    if (newOptions) {
      // Update currentOptions whenever props change
      currentOptions.value = JSON.parse(JSON.stringify(newOptions))
      
      if (chartInstance.value) {
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

// Initialize chart on mount
onMounted(() => {
  if (props.options) {
    setOption(props.options, {
      notMerge: props.notMerge,
      lazyUpdate: props.lazyUpdate,
      silent: props.silent
    })
  }
})

// Cleanup on unmount
onUnmounted(() => {
  dispose()
})

// Expose chart methods for external use
defineExpose({
  chartInstance,
  setOption,
  getOption,
  resize,
  dispose,
  clear,
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