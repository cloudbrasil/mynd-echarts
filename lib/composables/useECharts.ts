import { ref, unref, watchEffect, watch, computed, isRef, onUnmounted, nextTick, type Ref, type ComputedRef } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts'
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
    chartInstance.value = echarts.init(el, currentTheme.value as any, {
      renderer,
      locale: currentLocale.value,
      ...initOptions
    })

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

    let isFirstResize = true
    
    // Create debounced resize handler
    resizeHandler = debounce(() => {
      if (chartInstance.value && !chartInstance.value.isDisposed()) {
        chartInstance.value.resize()
      }
    }, resizeDebounce)

    // Use ResizeObserver for better performance
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        // Skip the first resize which happens immediately when observer is attached
        if (isFirstResize) {
          isFirstResize = false
          return
        }
        // Call the debounced resize handler
        resizeHandler()
      })
      resizeObserver.observe(el)
    } else {
      // Fallback to window resize event
      window.addEventListener('resize', resizeHandler)
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
        // Don't try to recover automatically as it might cause more issues
        // Let the caller handle the error appropriately
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
      echarts.connect(group)
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

  const dispose = () => {
    // Clean up resize observer
    if (resizeObserver) {
      const el = unref(elRef)
      if (el) {
        resizeObserver.unobserve(el)
      }
      resizeObserver.disconnect()
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
    registerMap
  }
}