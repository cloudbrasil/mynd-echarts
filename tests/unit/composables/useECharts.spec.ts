import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useECharts } from '../../../lib/composables/useECharts'
import type { EChartsOption } from 'echarts'

// Mock echarts
vi.mock('echarts')

describe('useECharts', () => {
  let mockChartInstance: any
  let elementRef: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Create a mock DOM element
    const element = document.createElement('div')
    element.style.width = '600px'
    element.style.height = '400px'
    elementRef = ref(element)

    // Setup mock chart instance
    mockChartInstance = {
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      clear: vi.fn(),
      getOption: vi.fn(() => ({ series: [] })),
      getWidth: vi.fn(() => 600),
      getHeight: vi.fn(() => 400),
      getDom: vi.fn(() => element),
      on: vi.fn(),
      off: vi.fn(),
      showLoading: vi.fn(),
      hideLoading: vi.fn(),
      isDisposed: vi.fn(() => false),
      group: ''
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Helper component for testing
  function createTestComponent(setupFn: () => any) {
    return defineComponent({
      setup() {
        const result = setupFn()
        return { ...result }
      },
      render() {
        return h('div', { ref: 'chart' })
      }
    })
  }

  describe('Initialization', () => {
    it('should initialize chart with default options', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      let chartResult: any
      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef)
        return { elementRef }
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(echarts.init).toHaveBeenCalledWith(
        elementRef.value,
        'default',
        expect.objectContaining({
          renderer: 'canvas',
          locale: 'en'
        })
      )
      expect(chartResult.chartInstance.value).toStrictEqual(mockChartInstance)

      wrapper.unmount()
    })

    it('should initialize with custom theme and locale', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, {
          theme: 'dark',
          locale: 'zh-CN'
        })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(echarts.init).toHaveBeenCalledWith(
        elementRef.value,
        'dark',
        expect.objectContaining({
          locale: 'zh-CN'
        })
      )

      wrapper.unmount()
    })

    it('should handle initialization options', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const initOptions = {
        renderer: 'svg' as const,
        devicePixelRatio: 2,
        width: 800,
        height: 600,
        useDirtyRect: true
      }

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { initOptions })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(echarts.init).toHaveBeenCalledWith(
        elementRef.value,
        'default',
        expect.objectContaining({
          ...initOptions,
          locale: 'en'
        })
      )

      wrapper.unmount()
    })

    it('should call onReady callback', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const onReady = vi.fn()
      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { onReady })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(onReady).toHaveBeenCalledWith(mockChartInstance)

      wrapper.unmount()
    })
  })

  describe('Chart Operations', () => {
    it('should set options on chart', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      let chartResult: any
      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef)
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      const options: EChartsOption = {
        series: [{ type: 'line', data: [1, 2, 3] }]
      }

      chartResult.setOption(options)

      expect(mockChartInstance.setOption).toHaveBeenCalledWith(options, undefined)

      wrapper.unmount()
    })

    it('should set options with custom settings', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      let chartResult: any
      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef)
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      const options: EChartsOption = {
        series: [{ type: 'bar', data: [4, 5, 6] }]
      }
      const opts = { notMerge: false, lazyUpdate: true }

      chartResult.setOption(options, opts)

      expect(mockChartInstance.setOption).toHaveBeenCalledWith(options, opts)

      wrapper.unmount()
    })

    it('should get current options', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const mockOptions = { series: [{ type: 'pie', data: [] }] }
      mockChartInstance.getOption.mockReturnValue(mockOptions)

      let chartResult: any
      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef)
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      const options = chartResult.getOption()

      expect(options).toEqual(mockOptions)
      expect(mockChartInstance.getOption).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('should resize chart', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      let chartResult: any
      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef)
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      chartResult.resize({ width: 800, height: 600 })

      expect(mockChartInstance.resize).toHaveBeenCalledWith({ width: 800, height: 600 })

      wrapper.unmount()
    })

    it('should clear chart', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      let chartResult: any
      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef)
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      chartResult.clear()

      expect(mockChartInstance.clear).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('should dispose chart', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      let chartResult: any
      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef)
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      chartResult.dispose()

      expect(mockChartInstance.dispose).toHaveBeenCalled()

      wrapper.unmount()
    })
  })

  describe('Event Handling', () => {
    it('should register event handlers', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const onClick = vi.fn()
      const onMouseover = vi.fn()
      const events = { click: onClick, mouseover: onMouseover }

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { events })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(mockChartInstance.on).toHaveBeenCalledWith('click', onClick)
      expect(mockChartInstance.on).toHaveBeenCalledWith('mouseover', onMouseover)

      wrapper.unmount()
    })

    it('should handle event callbacks', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const onClick = vi.fn()
      let chartResult: any

      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef, { events: { click: onClick } })
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      // Simulate event being triggered
      const eventCallback = mockChartInstance.on.mock.calls[0][1]
      const eventParams = { componentType: 'series', seriesIndex: 0 }
      eventCallback(eventParams)

      expect(onClick).toHaveBeenCalledWith(eventParams)

      wrapper.unmount()
    })

    it('should cleanup event handlers on dispose', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const onClick = vi.fn()
      const events = { click: onClick }

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { events })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      // Event handler should be registered
      expect(mockChartInstance.on).toHaveBeenCalledWith('click', onClick)

      wrapper.unmount()

      // Chart should be disposed (event handlers are cleared internally)
      expect(mockChartInstance.dispose).toHaveBeenCalled()
    })
  })

  describe('Auto Resize', () => {
    it('should setup resize observer when autoResize is true', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)
      
      // Track ResizeObserver creation
      const mockObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn()
      }
      const ResizeObserverMock = vi.fn(() => mockObserver)
      ;(global as any).ResizeObserver = ResizeObserverMock

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { autoResize: true })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(ResizeObserverMock).toHaveBeenCalled()
      expect(mockObserver.observe).toHaveBeenCalledWith(elementRef.value)

      wrapper.unmount()
    })

    it('should not setup resize observer when autoResize is false', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)
      
      // Track ResizeObserver creation
      const ResizeObserverMock = vi.fn()
      ;(global as any).ResizeObserver = ResizeObserverMock

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { autoResize: false })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(ResizeObserverMock).not.toHaveBeenCalled()

      wrapper.unmount()
    })

    it('should handle resize events with debounce', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)
      vi.useFakeTimers()

      let resizeCallback: any
      ;(global as any).ResizeObserver = vi.fn((callback) => {
        resizeCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn()
        }
      })

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { autoResize: true, resizeDebounce: 100 })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      // Trigger resize
      resizeCallback([{ target: elementRef.value }])

      // Should not resize immediately
      expect(mockChartInstance.resize).not.toHaveBeenCalled()

      // Fast forward past debounce
      vi.advanceTimersByTime(100)

      expect(mockChartInstance.resize).toHaveBeenCalled()

      vi.useRealTimers()
      wrapper.unmount()
    })

    it('should cleanup resize observer on dispose', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const mockDisconnect = vi.fn()
      ;(global as any).ResizeObserver = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: mockDisconnect
      }))

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { autoResize: true })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      wrapper.unmount()

      expect(mockDisconnect).toHaveBeenCalled()
    })
  })

  describe('Theme Changes', () => {
    it('should recreate chart when theme changes', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const theme = ref('light')
      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { theme })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(echarts.init).toHaveBeenCalledTimes(1)

      // Change theme
      theme.value = 'dark'
      await nextTick()

      expect(mockChartInstance.dispose).toHaveBeenCalled()
      expect(echarts.init).toHaveBeenCalledTimes(2)
      expect(echarts.init).toHaveBeenLastCalledWith(
        elementRef.value,
        'dark',
        expect.any(Object)
      )

      wrapper.unmount()
    })

    it('should preserve options when theme changes', async () => {
      const echarts = await import('echarts')
      const mockOptions = { series: [{ type: 'line', data: [1, 2, 3] }] }
      mockChartInstance.getOption.mockReturnValue(mockOptions)
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const theme = ref('light')
      let chartResult: any

      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef, { theme })
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      // Set some options
      chartResult.setOption(mockOptions)

      // Change theme
      theme.value = 'dark'
      await nextTick()

      // Options should be restored
      expect(mockChartInstance.setOption).toHaveBeenCalledWith(mockOptions, undefined)

      wrapper.unmount()
    })
  })

  describe('Locale Changes', () => {
    it('should pass locale to init options', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef, { locale: 'zh-CN' })
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(echarts.init).toHaveBeenCalledWith(
        elementRef.value,
        'default',
        expect.objectContaining({ locale: 'zh-CN' })
      )

      wrapper.unmount()
    })
  })

  describe('Error Handling', () => {
    it('should handle null element ref', async () => {
      const echarts = await import('echarts')
      const nullRef = ref(null)

      const TestComponent = createTestComponent(() => {
        return useECharts(nullRef)
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(echarts.init).not.toHaveBeenCalled()

      wrapper.unmount()
    })

    it('should handle chart initialization errors', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockImplementation(() => {
        throw new Error('Init failed')
      })

      const TestComponent = createTestComponent(() => {
        return useECharts(elementRef)
      })

      // Expect the component to throw during mount
      expect(() => mount(TestComponent)).toThrow('Init failed')
      
      expect(echarts.init).toHaveBeenCalled()
    })

    it('should handle setOption errors gracefully', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      // First call throws, second call (after clear) succeeds
      let callCount = 0
      mockChartInstance.setOption.mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          throw new Error('SetOption failed')
        }
      })

      let chartResult: any
      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef)
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      // Should not throw
      expect(() => chartResult.setOption({})).not.toThrow()
      expect(consoleWarn).toHaveBeenCalledWith('[mynd-echarts] Error setting options:', expect.any(Error))
      expect(mockChartInstance.clear).toHaveBeenCalled()
      expect(mockChartInstance.setOption).toHaveBeenCalledTimes(2)

      consoleWarn.mockRestore()
      wrapper.unmount()
    })

    it('should handle disposed chart gracefully', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)
      mockChartInstance.isDisposed.mockReturnValue(true)

      let chartResult: any
      const TestComponent = createTestComponent(() => {
        chartResult = useECharts(elementRef)
        return chartResult
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      // Operations should not throw on disposed chart
      expect(() => chartResult.setOption({})).not.toThrow()
      expect(() => chartResult.resize()).not.toThrow()
      expect(() => chartResult.clear()).not.toThrow()

      wrapper.unmount()
    })
  })

  describe('Element Change', () => {
    it('should initialize chart with provided element', async () => {
      const echarts = await import('echarts')
      vi.mocked(echarts.init).mockReturnValue(mockChartInstance)

      const element1 = document.createElement('div')
      const elRef = ref(element1)

      const TestComponent = createTestComponent(() => {
        return useECharts(elRef)
      })

      const wrapper = mount(TestComponent)
      await nextTick()

      expect(echarts.init).toHaveBeenCalledTimes(1)
      expect(echarts.init).toHaveBeenCalledWith(element1, 'default', expect.objectContaining({ locale: 'en', renderer: 'canvas' }))

      wrapper.unmount()
    })
  })
})