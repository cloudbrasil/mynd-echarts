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

// Optional helper for consumers using modular ECharts builds
export function registerEChartsModules(modules: any[]) {
  try {
    echarts.use(modules as any)
  } catch (err) {
    console.warn('[mynd-echarts] Failed to register ECharts modules:', err)
  }
}

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
  onInitError?: (error: unknown) => void
  onSetOptionError?: (error: unknown) => void
  rethrowOnSetOptionError?: boolean
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
    onInitError,
    onSetOptionError,
    rethrowOnSetOptionError = false,
    events = {}
  } = options

  const logj = (obj: any) => { try { console.log(JSON.stringify(obj)) } catch { console.log(obj) } }
  const warnj = (obj: any) => { try { console.warn(JSON.stringify(obj)) } catch { console.warn(obj) } }
  const errorj = (obj: any) => { try { console.error(JSON.stringify(obj)) } catch { console.error(obj) } }

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
    logj({ tag: '[useECharts] initChart called', hasElement: !!el, theme: currentTheme.value, locale: currentLocale.value })
    
    if (!el) {
      console.warn('[useECharts] No element to initialize chart')
      return
    }

    // Dispose existing instance if any
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      logj({ tag: '[useECharts] Disposing existing chart instance' })
      if (onDispose) {
        onDispose(chartInstance.value)
      }
      chartInstance.value.dispose()
    }

    // Initialize chart with merged options including locale
    try {
      logj({ tag: '[useECharts] Initializing new chart instance' })
      chartInstance.value = echarts.init(el, currentTheme.value as any, {
        renderer,
        locale: currentLocale.value,
        ...initOptions
      })
      logj({ tag: '[useECharts] Chart instance created successfully' })
    } catch (e) {
      console.error('[useECharts] Failed to initialize chart:', e)
      if (onInitError) onInitError(e)
      else console.error(e)
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
    let usedWindowResize = false
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
        usedWindowResize = true
        resizeObserver = null
      }
    } else {
      // Fallback to window resize event
      if (resizeHandler) {
        window.addEventListener('resize', resizeHandler)
      }
      usedWindowResize = true
    }
  }

  const setOption = (options: EChartsOption, opts?: SetOptionOpts) => {
    logj({ tag: '[useECharts] setOption called', hasInstance: !!chartInstance.value, isDisposed: chartInstance.value?.isDisposed(), optionKeys: Object.keys(options), opts })
    
    if (!chartInstance.value) {
      const el = unref(elRef)
      if (el) {
        logj({ tag: '[useECharts] No chart instance, initializing' })
        initChart()
      }
    }
    
    if (chartInstance.value && !chartInstance.value.isDisposed()) {
      try {
        logj({ tag: '[useECharts] Applying options to chart' })
        chartInstance.value.setOption(options, opts)
        logj({ tag: '[useECharts] Options applied successfully' })
      } catch (error) {
        errorj({ tag: '[useECharts] Error setting options', message: (error as any)?.message, stack: (error as any)?.stack })
        if (onSetOptionError) onSetOptionError(error)
        else console.warn('[mynd-echarts] Error setting options:', error)
        try {
          logj({ tag: '[useECharts] Attempting to clear and retry' })
          chartInstance.value.clear()
          chartInstance.value.setOption(options, opts)
          logj({ tag: '[useECharts] Retry successful after clear' })
        } catch (retryErr) {
          errorj({ tag: '[useECharts] Retry failed', message: (retryErr as any)?.message })
          if (rethrowOnSetOptionError) throw retryErr
        }
      }
    } else {
      console.warn('[useECharts] Cannot set options - no valid chart instance')
    }
  }

  const getOption = () => {
    return chartInstance.value?.getOption()
  }

  // Helper function to check if chart is ready for operations
  const isChartReady = (): boolean => {
    if (!chartInstance.value || chartInstance.value.isDisposed()) {
      return false
    }
    
    try {
      const opts = chartInstance.value.getOption()
      if (!opts || Object.keys(opts).length === 0) {
        return false
      }
      
      // Check if coordinate systems are initialized for charts that need them
      if (opts.series && opts.series.length > 0) {
        const needsCartesian = opts.series.some((s: any) => 
          ['line', 'bar', 'scatter', 'candlestick', 'heatmap', 'effectScatter', 'boxplot'].includes(s.type)
        )
        
        if (needsCartesian) {
          // For cartesian charts, we need both axes to be present
          if (!opts.xAxis || opts.xAxis.length === 0 || !opts.yAxis || opts.yAxis.length === 0) {
            return false
          }
          // Check if axis data is actually initialized
          const xAxis = opts.xAxis[0]
          const yAxis = opts.yAxis[0]
          if (!xAxis || !yAxis) {
            return false
          }
        }
        
        const needsRadar = opts.series.some((s: any) => s.type === 'radar')
        
        if (needsRadar && !opts.radar) {
          return false
        }
      }
      
      // Perform a safe operation to verify chart internals are ready
      // This is the ultimate test - if this works, the chart is truly ready
      try {
        // Try to get the width/height - this should always work if chart is ready
        const width = chartInstance.value.getWidth()
        const height = chartInstance.value.getHeight()
        if (!width || !height) {
          return false
        }
        
        // Try to convert a pixel coordinate - this will fail if coordinate systems aren't ready
        // We use a safe coordinate in the middle of the chart
        const testCoord = chartInstance.value.convertFromPixel({ seriesIndex: 0 }, [width / 2, height / 2])
        // If this didn't throw, coordinate systems are ready
        return true
      } catch (e) {
        // Coordinate system not ready yet
        return false
      }
    } catch (e) {
      return false
    }
  }
  
  // Wait for chart to be ready with polling
  const waitForChartReady = (callback: () => void, maxAttempts = 100, interval = 10) => {
    let attempts = 0
    
    const checkReady = () => {
      attempts++
      
      if (isChartReady()) {
    logj({ tag: '[useECharts] Chart ready', attempts, elapsedMs: attempts * interval }) 
        callback()
      } else if (attempts >= maxAttempts) {
    warnj({ tag: '[useECharts] Chart not ready', maxAttempts, elapsedMs: maxAttempts * interval })
        // Don't proceed if not ready - this prevents errors
      } else {
        setTimeout(checkReady, interval)
      }
    }
    
    checkReady()
  }
  
  const resize = (opts?: Parameters<ECharts['resize']>[0]) => {
    logj({ tag: '[useECharts] resize called', hasInstance: !!chartInstance.value, isDisposed: chartInstance.value?.isDisposed(), opts })
    
    if (!chartInstance.value || chartInstance.value.isDisposed()) {
      console.warn('[useECharts] Skipping resize - no valid chart instance')
      return
    }
    
    // Queue the resize to run after current execution context
    // This gives ECharts time to fully initialize its internal structures
    Promise.resolve().then(() => {
      // Wait for chart to be ready before resizing
      waitForChartReady(() => {
        try {
          if (!chartInstance.value || chartInstance.value.isDisposed()) {
            console.warn('[useECharts] Chart disposed during wait')
            return
          }
          
          const currentOpts = chartInstance.value.getOption()
          // Pre-resize series sanitization to avoid undefined series crashes
          try {
            if (currentOpts && Array.isArray(currentOpts.series)) {
              const cleaned = currentOpts.series.filter((s: any) => s && typeof s === 'object' && typeof s.type === 'string')
              if (cleaned.length !== currentOpts.series.length) {
                logj({ tag: '[useECharts] Sanitizing series before resize', before: currentOpts.series.length, after: cleaned.length })
                chartInstance.value.setOption({ series: cleaned } as any, { notMerge: true, lazyUpdate: false, silent: true } as any)
              }
            }
          } catch {}
          logj({ tag: '[useECharts] Performing resize', hasOptions: !!currentOpts, optionKeys: currentOpts ? Object.keys(currentOpts) : [], hasXAxis: !!(currentOpts?.xAxis && currentOpts.xAxis.length > 0), hasYAxis: !!(currentOpts?.yAxis && currentOpts.yAxis.length > 0), seriesCount: currentOpts?.series?.length || 0 })
          
          chartInstance.value.resize(opts)
          logj({ tag: '[useECharts] resize completed successfully' })
        } catch (error) {
          errorj({ tag: '[useECharts] Error during resize', message: (error as any)?.message, stack: (error as any)?.stack })
          // Don't throw the error to prevent breaking the app
        }
      })
    })
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
    if (resizeHandler) {
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