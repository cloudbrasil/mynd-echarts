import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import MyndEcharts from '../../../lib/components/MyndEcharts.vue'
import type { EChartsOption } from 'echarts'
import { createMockEChartsInstance } from '../../test-helpers'

// Mock echarts module
vi.mock('echarts', () => ({
  init: vi.fn(),
  registerTheme: vi.fn(),
  use: vi.fn()
}))

// Import echarts after mocking
import * as echarts from 'echarts'

describe('MyndEcharts', () => {
  let mockChartInstance: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockChartInstance = createMockEChartsInstance()
    vi.mocked(echarts.init).mockReturnValue(mockChartInstance as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Component Mounting and Props', () => {
    it('should mount successfully with required props', async () => {
      const options: EChartsOption = {
        xAxis: { type: 'category', data: ['A', 'B', 'C'] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [1, 2, 3] }]
      }

      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()
      expect(wrapper.exists()).toBe(true)
      expect(echarts.init).toHaveBeenCalled()
    })

    it('should accept all optional props', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: {
          options,
          theme: 'dark',
          locale: 'zh-CN',
          loading: true,
          loadingOptions: { text: 'Loading...' },
          style: { width: '500px', height: '300px' },
          className: 'my-chart',
          autoResize: false,
          renderer: 'svg',
          initOptions: { devicePixelRatio: 2 },
          notMerge: true,
          lazyUpdate: true,
          silent: true,
          group: 'myGroup'
        }
      })

      await nextTick()
      expect(wrapper.props()).toMatchObject({
        theme: 'dark',
        locale: 'zh-CN',
        loading: true,
        autoResize: false,
        renderer: 'svg'
      })
    })

    it('should handle different className formats', async () => {
      const options: EChartsOption = { series: [] }
      
      // String className
      let wrapper = mount(MyndEcharts, {
        props: { options, className: 'my-chart' }
      })
      expect(wrapper.find('.my-chart').exists()).toBe(true)

      // Array className
      wrapper = mount(MyndEcharts, {
        props: { options, className: ['chart-1', 'chart-2'] }
      })
      const element = wrapper.find('div').element
      expect(element.classList.contains('chart-1')).toBe(true)
      expect(element.classList.contains('chart-2')).toBe(true)

      // Object className
      wrapper = mount(MyndEcharts, {
        props: { 
          options, 
          className: { 'active': true, 'disabled': false, 'custom': true } 
        }
      })
      const el = wrapper.find('div').element
      expect(el.classList.contains('active')).toBe(true)
      expect(el.classList.contains('custom')).toBe(true)
      expect(el.classList.contains('disabled')).toBe(false)
    })
  })

  describe('ECharts Instance Lifecycle', () => {
    it('should initialize ECharts on mount', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()
      expect(echarts.init).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        'default',
        expect.objectContaining({
          renderer: 'canvas',
          locale: 'en'
        })
      )
      expect(mockChartInstance.setOption).toHaveBeenCalledWith(options, {
        notMerge: false,
        lazyUpdate: false,
        silent: false
      })
    })

    it('should dispose ECharts instance on unmount', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()
      expect(mockChartInstance.dispose).not.toHaveBeenCalled()

      wrapper.unmount()
      expect(mockChartInstance.dispose).toHaveBeenCalled()
    })

    it('should handle theme changes', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options, theme: 'light' }
      })

      await nextTick()
      vi.clearAllMocks()

      // Change theme
      await wrapper.setProps({ theme: 'dark' })
      await nextTick()

      // Should dispose old instance and create new one
      expect(mockChartInstance.dispose).toHaveBeenCalled()
      expect(echarts.init).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        'dark',
        expect.any(Object)
      )
    })

    it('should handle loading state', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options, loading: false }
      })

      await nextTick()
      expect(mockChartInstance.showLoading).not.toHaveBeenCalled()

      // Enable loading
      await wrapper.setProps({ loading: true })
      expect(mockChartInstance.showLoading).toHaveBeenCalledWith('default', undefined)

      // Disable loading
      await wrapper.setProps({ loading: false })
      expect(mockChartInstance.hideLoading).toHaveBeenCalled()
    })

    it('should handle loading with custom options', async () => {
      const loadingOptions = {
        text: 'Custom Loading...',
        color: '#ff0000',
        textColor: '#000000'
      }
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options, loading: true, loadingOptions }
      })

      await nextTick()
      expect(mockChartInstance.showLoading).toHaveBeenCalledWith('default', loadingOptions)
    })
  })

  describe('Event Handling', () => {
    it('should emit ready event with chart instance', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()
      expect(wrapper.emitted('ready')).toBeTruthy()
      expect(wrapper.emitted('ready')?.[0]).toEqual([mockChartInstance])
    })

    it('should handle chart events and emit them', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      // Simulate chart events
      const events = ['click', 'dblclick', 'mouseover', 'mouseout', 'mousemove']
      
      for (const eventName of events) {
        const handler = mockChartInstance.on.mock.calls.find(
          call => call[0] === eventName
        )?.[1]
        
        expect(handler).toBeDefined()
        
        const params = { seriesIndex: 0, dataIndex: 1 }
        handler(params)
        
        expect(wrapper.emitted(eventName)).toBeTruthy()
        expect(wrapper.emitted(eventName)?.[0]).toEqual([params])
      }
    })

    it('should handle special chart events', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      // Test legend events
      const legendEvents = ['legendselectchanged', 'legendselected', 'legendunselected']
      
      for (const eventName of legendEvents) {
        const handler = mockChartInstance.on.mock.calls.find(
          call => call[0] === eventName
        )?.[1]
        
        const params = { name: 'Series 1', selected: { 'Series 1': true } }
        handler(params)
        
        expect(wrapper.emitted(eventName)?.[0]).toEqual([params])
      }
    })

    it('should emit update:options when config is updated', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      // Access the exposed openConfig method
      const vm = wrapper.vm as any
      vm.openConfig()
      await nextTick()

      // Find ConfigDialog and emit update
      const configDialog = wrapper.findComponent({ name: 'ConfigDialog' })
      const newOptions = { ...options, title: { text: 'New Title' } }
      configDialog.vm.$emit('update:options', newOptions)

      expect(wrapper.emitted('update:options')?.[0]).toEqual([newOptions])
    })
  })

  describe('Reactive Updates', () => {
    it('should update chart when options change', async () => {
      const options: EChartsOption = {
        series: [{ type: 'line', data: [1, 2, 3] }]
      }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()
      vi.clearAllMocks()

      // Update options
      const newOptions: EChartsOption = {
        series: [{ type: 'line', data: [4, 5, 6] }]
      }
      await wrapper.setProps({ options: newOptions })
      await nextTick()

      expect(mockChartInstance.setOption).toHaveBeenCalledWith(newOptions, {
        notMerge: false,
        lazyUpdate: false,
        silent: false
      })
    })

    it('should handle option update with custom merge settings', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { 
          options,
          notMerge: true,
          lazyUpdate: true,
          silent: true
        }
      })

      await nextTick()
      vi.clearAllMocks()

      const newOptions: EChartsOption = { series: [{ type: 'bar' }] }
      await wrapper.setProps({ options: newOptions })
      await nextTick()

      expect(mockChartInstance.setOption).toHaveBeenCalledWith(newOptions, {
        notMerge: true,
        lazyUpdate: true,
        silent: true
      })
    })

    it('should update group when prop changes', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      await wrapper.setProps({ group: 'newGroup' })
      await nextTick()

      expect(mockChartInstance.group).toBe('newGroup')
    })

    it('should handle locale changes', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options, locale: 'en' }
      })

      await nextTick()
      vi.clearAllMocks()

      // Change locale
      await wrapper.setProps({ locale: 'zh-CN' })
      await nextTick()

      // Should reinitialize chart with new locale
      expect(mockChartInstance.dispose).toHaveBeenCalled()
      expect(echarts.init).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.any(String),
        expect.objectContaining({ locale: 'zh-CN' })
      )
    })
  })

  describe('Auto Resize', () => {
    it('should setup resize observer when autoResize is true', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options, autoResize: true }
      })

      await nextTick()

      expect(global.ResizeObserver).toHaveBeenCalled()
      const resizeObserver = (global.ResizeObserver as any).mock.results[0].value
      expect(resizeObserver.observe).toHaveBeenCalledWith(expect.any(HTMLElement))
    })

    it('should not setup resize observer when autoResize is false', async () => {
      vi.clearAllMocks()
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options, autoResize: false }
      })

      await nextTick()

      expect(global.ResizeObserver).not.toHaveBeenCalled()
    })

    it('should handle resize callback', async () => {
      const options: EChartsOption = { series: [] }
      let resizeCallback: any

      ;(global.ResizeObserver as any).mockImplementation((callback: any) => {
        resizeCallback = callback
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn()
        }
      })

      const wrapper = mount(MyndEcharts, {
        props: { options, autoResize: true }
      })

      await nextTick()

      // Trigger resize
      resizeCallback([{ contentRect: { width: 800, height: 600 } }])
      await nextTick()

      expect(mockChartInstance.resize).toHaveBeenCalled()
    })
  })

  describe('Exposed Methods', () => {
    it('should expose chart instance and methods', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      const exposed = wrapper.vm as any

      // Test exposed properties and methods
      expect(exposed.chartInstance).toBe(mockChartInstance)
      expect(typeof exposed.setOption).toBe('function')
      expect(typeof exposed.getOption).toBe('function')
      expect(typeof exposed.resize).toBe('function')
      expect(typeof exposed.dispose).toBe('function')
      expect(typeof exposed.clear).toBe('function')
      expect(typeof exposed.openConfig).toBe('function')
    })

    it('should expose utility methods', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      const exposed = wrapper.vm as any

      // Test getWidth
      expect(exposed.getWidth()).toBe(600)
      expect(mockChartInstance.getWidth).toHaveBeenCalled()

      // Test getHeight
      expect(exposed.getHeight()).toBe(400)
      expect(mockChartInstance.getHeight).toHaveBeenCalled()

      // Test getDom
      expect(exposed.getDom()).toBeInstanceOf(HTMLElement)
      expect(mockChartInstance.getDom).toHaveBeenCalled()

      // Test getDataURL
      const dataUrl = exposed.getDataURL({ type: 'png' })
      expect(dataUrl).toBe('data:image/png;base64,test')
      expect(mockChartInstance.getDataURL).toHaveBeenCalledWith({ type: 'png' })

      // Test convertToPixel
      const pixel = exposed.convertToPixel('grid', [10, 20])
      expect(pixel).toEqual([100, 200])

      // Test dispatchAction
      const action = { type: 'highlight', seriesIndex: 0 }
      exposed.dispatchAction(action)
      expect(mockChartInstance.dispatchAction).toHaveBeenCalledWith(action)

      // Test isDisposed
      expect(exposed.isDisposed()).toBe(false)
    })

    it('should handle resize method', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      const exposed = wrapper.vm as any
      exposed.resize()

      expect(mockChartInstance.resize).toHaveBeenCalled()
    })

    it('should handle clear method', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      const exposed = wrapper.vm as any
      exposed.clear()

      expect(mockChartInstance.clear).toHaveBeenCalled()
    })
  })

  describe('Error Scenarios', () => {
    it('should handle chart initialization failure gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      ;(echarts.init as any).mockImplementationOnce(() => {
        throw new Error('Failed to initialize chart')
      })

      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()
      
      // Component should still mount
      expect(wrapper.exists()).toBe(true)
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })

    it('should handle null chart element gracefully', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options },
        // Simulate scenario where chart element is not available
        global: {
          stubs: {
            teleport: true
          }
        }
      })

      // Remove the chart element
      const chartEl = wrapper.find('[ref="chartRef"]')
      if (chartEl.exists()) {
        (wrapper.vm.$refs.chartRef as any) = null
      }

      await nextTick()

      // Should not throw error
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle setOption failure gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockChartInstance.setOption.mockImplementationOnce(() => {
        throw new Error('Invalid option')
      })

      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      expect(consoleError).toHaveBeenCalled()
      expect(wrapper.exists()).toBe(true)

      consoleError.mockRestore()
    })

    it('should handle dispose errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockChartInstance.dispose.mockImplementationOnce(() => {
        throw new Error('Dispose failed')
      })

      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      // Unmount should not throw
      expect(() => wrapper.unmount()).not.toThrow()
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })
  })

  describe('ConfigDialog Integration', () => {
    it('should open config dialog', async () => {
      const options: EChartsOption = { 
        title: { text: 'Test Chart' },
        series: [] 
      }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      const exposed = wrapper.vm as any
      expect(wrapper.findComponent({ name: 'ConfigDialog' }).props('modelValue')).toBe(false)

      exposed.openConfig()
      await nextTick()

      expect(wrapper.findComponent({ name: 'ConfigDialog' }).props('modelValue')).toBe(true)
    })

    it('should pass current options to config dialog', async () => {
      const options: EChartsOption = { 
        title: { text: 'Original Title' },
        series: [] 
      }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()

      const exposed = wrapper.vm as any
      exposed.openConfig()
      await nextTick()

      const configDialog = wrapper.findComponent({ name: 'ConfigDialog' })
      expect(configDialog.props('options')).toEqual(options)
    })

    it('should handle locale updates from config dialog', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options, locale: 'en' }
      })

      await nextTick()

      const exposed = wrapper.vm as any
      exposed.openConfig()
      await nextTick()

      const configDialog = wrapper.findComponent({ name: 'ConfigDialog' })
      configDialog.vm.$emit('update:locale', 'zh-CN')

      expect(wrapper.emitted('update:locale')?.[0]).toEqual(['zh-CN'])
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle rapid option updates', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()
      vi.clearAllMocks()

      // Rapid updates
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({ 
          options: { series: [{ type: 'line', data: [i, i+1, i+2] }] } 
        })
      }

      await nextTick()

      // Should have called setOption multiple times
      expect(mockChartInstance.setOption.mock.calls.length).toBeGreaterThan(0)
    })

    it('should handle simultaneous prop updates', async () => {
      const options: EChartsOption = { series: [] }
      const wrapper = mount(MyndEcharts, {
        props: { options }
      })

      await nextTick()
      vi.clearAllMocks()

      // Update multiple props at once
      await wrapper.setProps({
        options: { series: [{ type: 'bar' }] },
        loading: true,
        group: 'newGroup'
      })

      await nextTick()

      expect(mockChartInstance.setOption).toHaveBeenCalled()
      expect(mockChartInstance.showLoading).toHaveBeenCalled()
      expect(mockChartInstance.group).toBe('newGroup')
    })

    it('should maintain chart state during theme switch', async () => {
      const options: EChartsOption = { 
        series: [{ type: 'line', data: [1, 2, 3] }] 
      }
      const wrapper = mount(MyndEcharts, {
        props: { options, theme: 'light' }
      })

      await nextTick()

      // Store original options
      const originalCalls = mockChartInstance.setOption.mock.calls.length

      // Switch theme
      await wrapper.setProps({ theme: 'dark' })
      await nextTick()

      // Should recreate chart and restore options
      expect(mockChartInstance.dispose).toHaveBeenCalled()
      expect(echarts.init).toHaveBeenCalledTimes(2)
      expect(mockChartInstance.setOption.mock.calls.length).toBeGreaterThan(originalCalls)
    })
  })
})