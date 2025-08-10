import { ref, unref, watchEffect, watch, computed, isRef, onUnmounted, nextTick, type Ref, type ComputedRef } from 'vue'
// Use monolithic ECharts entry to simplify mocking in tests and typing consistency
import * as echarts from 'echarts'
import type { ECharts, SetOptionOpts, EChartsOption } from 'echarts'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent,
  AxisPointerComponent,
  BrushComponent,
  // Optional extra components you might enable later
  // PolarComponent,
  // SingleAxisComponent,
  // GraphicComponent,
  // TimelineComponent,
  // VisualMapComponent
} from 'echarts/components'
// ECharts 5 axis components
import {
  LineChart,
  BarChart,
  ScatterChart,
  CandlestickChart,
  EffectScatterChart,
  PieChart,
  RadarChart,
  HeatmapChart,
  TreeChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  SankeyChart,
  TreemapChart,
  SunburstChart,
  ParallelChart,
  ThemeRiverChart
} from 'echarts/charts'

// Register required charts, components, axes, and renderers
// Default registration of common charts/components. Consumers can extend via registerModules.
echarts.use([
  // Charts
  LineChart,
  BarChart,
  ScatterChart,
  CandlestickChart,
  EffectScatterChart,
  PieChart,
  RadarChart,
  HeatmapChart,
  TreeChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  SankeyChart,
  TreemapChart,
  SunburstChart,
  ParallelChart,
  ThemeRiverChart,
  // Components
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent,
  AxisPointerComponent,
  BrushComponent,
  // Renderers
  CanvasRenderer,
  SVGRenderer
])
import { debounce } from '../utils'

export interface UseEChartsOptions {
  theme?: string | object | Ref<string | object> | ComputedRef<string | object>
  locale?: string | Ref<string> | ComputedRef<string>
  renderer?: 'canvas' | 'svg'
  autoResize?: boolean
  resizeDebounce?: number
  initOptions?: {
    devicePixelRatio?: number
    renderer?: 'canvas' | 'svg'
    width?: number | string
    height?: number | string
    locale?: string
    useDirtyRect?: boolean
  }
  onReady?: (instance: ECharts) => void
  onDispose?: (instance: ECharts) => void
  events?: Record<string, (params: any) => void>
}

export interface UseEChartsReturn {
  chartInstance: Ref<ECharts | undefined>
  setOption: (options: EChartsOption, opts?: SetOptionOpts) => void
  getOption: () => any
  resize: (opts?: Parameters<ECharts['resize']>[0]) => void
  clear: () => void
  dispose: () => void
  showLoading: (type?: string, opts?: any) => void
  hideLoading: () => void
  dispatchAction: (action: any) => void
  on: (eventName: string, handler: Function) => void
  off: (eventName: string, handler?: Function) => void
  getDataURL: (opts?: Parameters<ECharts['getDataURL']>[0]) => string | undefined
  getConnectedDataURL: (opts?: Parameters<ECharts['getConnectedDataURL']>[0]) => string | undefined
  connect: (group: string | ECharts[]) => void
  disconnect: (group: string) => void
  registerTheme: (name: string, theme: object) => void
  registerMap: (mapName: string, geoJson: any, specialAreas?: any) => void
  registerModules: (modules: any[]) => void
}

export function useECharts(
  elRef: Ref<HTMLElement | undefined>,
  options: UseEChartsOptions = {}
): UseEChartsReturn {
  const {
    theme = 'default',
    locale = 'en',
    renderer = 'canvas',
    autoResize = true,
    resizeDebounce = 200,
    initOptions = {},
    onReady,
    onDispose,
    events = {}
  } = options

  const chartInstance = ref<ECharts>()
  let resizeObserver: ResizeObserver | null = null
  let resizeHandler: (() => void) | null = null
  let eventHandlers: Map<string, Function[]> = new Map()
  
  // Create computed refs for theme and locale to handle both static and reactive values
  const currentTheme = computed(() => {
    if (isRef(theme)) {
      return unref(theme)
    }
    return theme
  })
  
  const currentLocale = computed(() => {
    if (isRef(locale)) {
      return unref(locale)
    }
    return locale
  })

  const initChart = () => {
    const el = unref(elRef)
    if (!el) return

    // Dispose existing instance if any
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      if (onDispose) {
        onDispose(chartInstance.value)
      }
      chartInstance.value.dispose()
    }

    // Initialize chart with merged options including locale
    try {
      chartInstance.value = echarts.init(el, currentTheme.value as any, {
        renderer,
        locale: currentLocale.value,
        ...initOptions
      })
    } catch (e) {
      console.error(e)
      return
    }

    // Register initial event handlers
    Object.entries(events).forEach(([eventName, handler]) => {
      chartInstance.value?.on(eventName, handler)
      // Track handlers for cleanup
      if (!eventHandlers.has(eventName)) {
        eventHandlers.set(eventName, [])
      }
      eventHandlers.get(eventName)!.push(handler)
    })

    // Call ready callback
    if (onReady) {
      onReady(chartInstance.value)
    }

    // Set up resize handling
    if (autoResize) {
      setupResizeHandler()
    }
  }

  const setupResizeHandler = () => {
    const el = unref(elRef)
    if (!el || !chartInstance.value) return

    // Create debounced resize handler
    resizeHandler = debounce(() => {
      if (chartInstance.value && !chartInstance.value.isDisposed()) {
        chartInstance.value.resize()
      }
    }, resizeDebounce)

    // Use ResizeObserver for better performance
    if (typeof ResizeObserver !== 'undefined') {
      try {
        // @ts-expect-error: Mocked in tests, may not fully implement types
        resizeObserver = new ResizeObserver((entries: any) => {
          // Call the debounced resize handler
          resizeHandler && resizeHandler()
        }) as unknown as ResizeObserver
      } catch {}

      if (resizeObserver && typeof (resizeObserver as any).observe === 'function') {
        ;(resizeObserver as any).observe(el)
      } else {
        // Fallback to window resize event when mock is incomplete
        if (resizeHandler) {
          window.addEventListener('resize', resizeHandler)
        }
      }
    } else {
      // Fallback to window resize event
      if (resizeHandler) {
        window.addEventListener('resize', resizeHandler)
      }
    }
  }

  const setOption = (options: EChartsOption, opts?: SetOptionOpts) => {
    if (!chartInstance.value) {
      const el = unref(elRef)
      if (el) {
        initChart()
      }
    }
    
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      try {
        chartInstance.value.setOption(options, opts)
      } catch (error) {
        console.warn('[mynd-echarts] Error setting options:', error)
        try {
          // Attempt to recover by clearing and retrying once
          chartInstance.value.clear()
          chartInstance.value.setOption(options, opts)
        } catch {}
      }
    }
  }

  const getOption = () => {
    return chartInstance.value?.getOption()
  }

  const resize = (opts?: Parameters<ECharts['resize']>[0]) => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      chartInstance.value.resize(opts)
    }
  }

  const clear = () => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      chartInstance.value.clear()
    }
  }

  const showLoading = (type?: string, opts?: any) => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      chartInstance.value.showLoading(type, opts)
    }
  }

  const hideLoading = () => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      chartInstance.value.hideLoading()
    }
  }

  const dispatchAction = (action: any) => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      chartInstance.value.dispatchAction(action)
    }
  }

  const on = (eventName: string, handler: Function) => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      chartInstance.value.on(eventName, handler as any)
      // Track handler for cleanup
      if (!eventHandlers.has(eventName)) {
        eventHandlers.set(eventName, [])
      }
      eventHandlers.get(eventName)!.push(handler)
    }
  }

  const off = (eventName: string, handler?: Function) => {
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      if (handler) {
        chartInstance.value.off(eventName, handler as any)
        // Remove from tracked handlers
        const handlers = eventHandlers.get(eventName)
        if (handlers) {
          const index = handlers.indexOf(handler)
          if (index > -1) {
            handlers.splice(index, 1)
          }
        }
      } else {
        chartInstance.value.off(eventName)
        eventHandlers.delete(eventName)
      }
    }
  }

  const getDataURL = (opts?: Parameters<ECharts['getDataURL']>[0]) => {
    return chartInstance.value?.getDataURL(opts)
  }

  const getConnectedDataURL = (opts?: Parameters<ECharts['getConnectedDataURL']>[0]) => {
    return chartInstance.value?.getConnectedDataURL(opts)
  }

  const connect = (group: string | ECharts[]) => {
    if (chartInstance.value) {
      echarts.connect(group as any)
    }
  }

  const disconnect = (group: string) => {
    echarts.disconnect(group)
  }

  const registerTheme = (name: string, theme: object) => {
    echarts.registerTheme(name, theme)
  }

  const registerMap = (mapName: string, geoJson: any, specialAreas?: any) => {
    echarts.registerMap(mapName, geoJson, specialAreas)
  }

  const registerModules = (modules: any[]) => {
    try {
      echarts.use(modules as any)
    } catch (err) {
      console.warn('[mynd-echarts] Failed to register ECharts modules:', err)
    }
  }

  const dispose = () => {
    // Clean up resize observer
    if (resizeObserver) {
      const el = unref(elRef)
      if (el) {
        try { (resizeObserver as any).unobserve?.(el) } catch {}
      }
      try { (resizeObserver as any).disconnect?.() } catch {}
      resizeObserver = null
    }

    // Remove window resize listener if used
    if (resizeHandler && !resizeObserver) {
      window.removeEventListener('resize', resizeHandler)
    }
    resizeHandler = null

    // Clear event handlers
    eventHandlers.clear()

    // Dispose chart instance
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      if (onDispose) {
        onDispose(chartInstance.value)
      }
      chartInstance.value.dispose()
      chartInstance.value = undefined
    }
  }

  // Watch for theme changes
  watch(
    currentTheme,
    (newTheme, oldTheme) => {
      if (newTheme !== oldTheme && chartInstance.value && !chartInstance.value.isDisposed()) {
        const currentOptions = getOption()
        const el = unref(elRef)
        if (el && currentOptions) {
          // Store the full options before disposal
          const fullOptions = JSON.parse(JSON.stringify(currentOptions))
          
          // Dispose and recreate with new theme
          dispose()
          
          // Use nextTick to ensure DOM is updated
          nextTick(() => {
            initChart()
            
            // Restore options after chart is ready
            if (chartInstance.value && !chartInstance.value.isDisposed()) {
              try {
                chartInstance.value.setOption(fullOptions, { notMerge: true })
              } catch (error) {
                console.warn('[mynd-echarts] Error restoring options after theme change:', error)
              }
            }
          })
        }
      }
    }
  )

  // Watch for locale changes and recreate chart similar to theme changes
  watch(
    currentLocale,
    (newLocale, oldLocale) => {
      if (newLocale !== oldLocale && chartInstance.value && !chartInstance.value.isDisposed()) {
        const currentOptions = getOption()
        const el = unref(elRef)
        if (el && currentOptions) {
          const fullOptions = JSON.parse(JSON.stringify(currentOptions))
          dispose()
          nextTick(() => {
            initChart()
            if (chartInstance.value && !chartInstance.value.isDisposed()) {
              try {
                chartInstance.value.setOption(fullOptions, { notMerge: true })
              } catch (error) {
                console.warn('[mynd-echarts] Error restoring options after locale change:', error)
              }
            }
          })
        }
      }
    }
  )

  // Initialize chart when element is available
  watchEffect(() => {
    const el = unref(elRef)
    if (el && !chartInstance.value) {
      initChart()
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    dispose()
  })

  return {
    chartInstance,
    setOption,
    getOption,
    resize,
    clear,
    dispose,
    showLoading,
    hideLoading,
    dispatchAction,
    on,
    off,
    getDataURL,
    getConnectedDataURL,
    connect,
    disconnect,
    registerTheme,
    registerMap,
    registerModules
  }
}