import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useChartAnimation } from '../../../lib/composables/useChartAnimation'
import type { ECharts, EChartsOption } from 'echarts'

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16))

describe('useChartAnimation', () => {
  let mockChart: ECharts
  let mockDom: HTMLElement

  beforeEach(() => {
    vi.useFakeTimers()
    
    mockDom = {
      style: {
        opacity: '1',
        transition: ''
      }
    } as any
    
    mockChart = {
      setOption: vi.fn(),
      getDom: vi.fn(() => mockDom),
      resize: vi.fn(),
      dispose: vi.fn(),
      getOption: vi.fn(() => ({})),
      clear: vi.fn(),
      getWidth: vi.fn(() => 600),
      getHeight: vi.fn(() => 400)
    } as any
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  // Create test component to use the composable
  function createTestComponent() {
    return defineComponent({
      setup() {
        const chartInstance = ref<ECharts | undefined>(mockChart)
        const animation = useChartAnimation(chartInstance)
        
        return {
          chartInstance,
          ...animation
        }
      },
      render() {
        return h('div')
      }
    })
  }

  describe('Basic Functionality', () => {
    it('should initialize with default animation config', () => {
      const wrapper = mount(createTestComponent())
      
      expect(wrapper.vm.animationConfig).toEqual({
        enabled: true,
        duration: 1000,
        easing: 'cubicOut',
        delay: 0,
        update: true,
        updateDuration: 300,
        updateEasing: 'cubicOut',
        updateDelay: 0
      })
      expect(wrapper.vm.isAnimating).toBe(false)
    })

    it('should initialize with custom default animation', () => {
      const TestComponent = defineComponent({
        setup() {
          const chartInstance = ref<ECharts | undefined>(mockChart)
          const animation = useChartAnimation(chartInstance, {
            defaultAnimation: {
              enabled: false,
              duration: 2000,
              easing: 'linear'
            }
          })
          
          return {
            chartInstance,
            ...animation
          }
        },
        render() {
          return h('div')
        }
      })
      
      const wrapper = mount(TestComponent)
      
      expect(wrapper.vm.animationConfig).toMatchObject({
        enabled: false,
        duration: 2000,
        easing: 'linear'
      })
    })
  })

  describe('Animation Config Management', () => {
    it('should update animation config', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.setAnimationConfig({
        duration: 2000,
        easing: 'elasticOut'
      })
      
      expect(wrapper.vm.animationConfig).toMatchObject({
        enabled: true,
        duration: 2000,
        easing: 'elasticOut',
        delay: 0
      })
    })

    it('should enable animation', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.animationConfig.enabled = false
      wrapper.vm.enableAnimation()
      
      expect(wrapper.vm.animationConfig.enabled).toBe(true)
    })

    it('should disable animation', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.disableAnimation()
      
      expect(wrapper.vm.animationConfig.enabled).toBe(false)
    })
  })

  describe('Animate to Option', () => {
    it('should animate to new option with animation config', () => {
      const wrapper = mount(createTestComponent())
      const newOption: EChartsOption = {
        series: [{ type: 'line', data: [1, 2, 3] }]
      }
      
      wrapper.vm.animateToOption(newOption)
      
      expect(mockChart.setOption).toHaveBeenCalledWith(
        expect.objectContaining({
          ...newOption,
          animation: true,
          animationDuration: 1000,
          animationEasing: 'cubicOut',
          animationDelay: 0,
          animationDurationUpdate: 300,
          animationEasingUpdate: 'cubicOut',
          animationDelayUpdate: 0
        }),
        undefined
      )
      expect(wrapper.vm.isAnimating).toBe(true)
    })

    it('should set isAnimating to false after animation completes', () => {
      const wrapper = mount(createTestComponent())
      const newOption: EChartsOption = { series: [] }
      
      wrapper.vm.animateToOption(newOption)
      expect(wrapper.vm.isAnimating).toBe(true)
      
      vi.advanceTimersByTime(1000)
      
      expect(wrapper.vm.isAnimating).toBe(false)
    })

    it('should pass through setOption options', () => {
      const wrapper = mount(createTestComponent())
      const newOption: EChartsOption = { series: [] }
      const opts = { notMerge: true, lazyUpdate: true }
      
      wrapper.vm.animateToOption(newOption, opts)
      
      expect(mockChart.setOption).toHaveBeenCalledWith(
        expect.any(Object),
        opts
      )
    })

    it('should handle missing chart instance', () => {
      const wrapper = mount(createTestComponent())
      wrapper.vm.chartInstance = undefined
      
      expect(() => {
        wrapper.vm.animateToOption({ series: [] })
      }).not.toThrow()
      
      expect(mockChart.setOption).not.toHaveBeenCalled()
    })

    it('should use custom animation duration', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.setAnimationConfig({ duration: 500 })
      wrapper.vm.animateToOption({ series: [] })
      
      expect(wrapper.vm.isAnimating).toBe(true)
      
      vi.advanceTimersByTime(500)
      
      expect(wrapper.vm.isAnimating).toBe(false)
    })
  })

  describe('Transition Animation', () => {
    it('should transition between options', () => {
      const wrapper = mount(createTestComponent())
      const fromOption: EChartsOption = {
        series: [{ type: 'line', data: [1, 2, 3] }]
      }
      const toOption: EChartsOption = {
        series: [{ type: 'line', data: [4, 5, 6] }]
      }
      
      wrapper.vm.transitionTo(fromOption, toOption)
      
      expect(wrapper.vm.isAnimating).toBe(true)
      expect(mockChart.setOption).toHaveBeenCalled()
    })

    it('should complete transition after duration', () => {
      const wrapper = mount(createTestComponent())
      const fromOption: EChartsOption = { series: [] }
      const toOption: EChartsOption = { series: [] }
      
      wrapper.vm.transitionTo(fromOption, toOption, 500)
      
      // Advance through all animation frames with requestAnimationFrame
      for (let i = 0; i <= 60; i++) {
        vi.advanceTimersByTime(16) // Trigger requestAnimationFrame
      }
      
      expect(wrapper.vm.isAnimating).toBe(false)
      expect(mockChart.setOption).toHaveBeenLastCalledWith(toOption, true)
    })

    it('should interpolate numeric values', () => {
      const wrapper = mount(createTestComponent())
      const fromOption: EChartsOption = {
        series: [{ type: 'line', data: [0, 0, 0] }]
      }
      const toOption: EChartsOption = {
        series: [{ type: 'line', data: [100, 100, 100] }]
      }
      
      wrapper.vm.transitionTo(fromOption, toOption, 100)
      
      // Check that interpolated values are being set
      vi.advanceTimersByTime(50) // Half way through
      
      const calls = (mockChart.setOption as any).mock.calls
      const interpolatedCall = calls.find((call: any) => {
        const data = call[0]?.series?.[0]?.data
        return data && data[0] > 0 && data[0] < 100
      })
      
      expect(interpolatedCall).toBeDefined()
    })

    it('should handle missing chart instance', () => {
      const wrapper = mount(createTestComponent())
      wrapper.vm.chartInstance = undefined
      
      expect(() => {
        wrapper.vm.transitionTo({ series: [] }, { series: [] })
      }).not.toThrow()
    })

    it('should use default transition duration', () => {
      const TestComponent = defineComponent({
        setup() {
          const chartInstance = ref<ECharts | undefined>(mockChart)
          const animation = useChartAnimation(chartInstance, {
            transitionDuration: 600
          })
          
          return {
            chartInstance,
            ...animation
          }
        },
        render() {
          return h('div')
        }
      })
      
      const wrapper = mount(TestComponent)
      wrapper.vm.transitionTo({ series: [] }, { series: [] })
      
      expect(wrapper.vm.isAnimating).toBe(true)
    })
  })

  describe('Fade Animations', () => {
    it('should fade in the chart', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.fadeIn(500)
      
      expect(mockDom.style.opacity).toBe('0')
      expect(mockDom.style.transition).toBe('opacity 500ms ease-in-out')
      
      // Trigger next frame
      vi.advanceTimersByTime(16)
      
      expect(mockDom.style.opacity).toBe('1')
      
      // Clean up transition
      vi.advanceTimersByTime(500)
      expect(mockDom.style.transition).toBe('')
    })

    it('should use default duration for fade in', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.fadeIn()
      
      expect(mockDom.style.transition).toBe('opacity 1000ms ease-in-out')
    })

    it('should fade out the chart', async () => {
      const wrapper = mount(createTestComponent())
      
      const promise = wrapper.vm.fadeOut(300)
      
      expect(mockDom.style.transition).toBe('opacity 300ms ease-in-out')
      expect(mockDom.style.opacity).toBe('0')
      
      vi.advanceTimersByTime(300)
      await promise
      
      expect(mockDom.style.transition).toBe('')
    })

    it('should resolve immediately if no chart instance', async () => {
      const wrapper = mount(createTestComponent())
      wrapper.vm.chartInstance = undefined
      
      await expect(wrapper.vm.fadeOut()).resolves.toBeUndefined()
    })

    it('should handle missing chart instance for fade in', () => {
      const wrapper = mount(createTestComponent())
      wrapper.vm.chartInstance = undefined
      
      expect(() => {
        wrapper.vm.fadeIn()
      }).not.toThrow()
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle animation with delay function', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.setAnimationConfig({
        delay: (idx: number) => idx * 100,
        updateDelay: (idx: number) => idx * 50
      })
      
      const option: EChartsOption = { series: [] }
      wrapper.vm.animateToOption(option)
      
      expect(mockChart.setOption).toHaveBeenCalledWith(
        expect.objectContaining({
          animationDelay: expect.any(Function),
          animationDelayUpdate: expect.any(Function)
        }),
        undefined
      )
    })

    it('should handle non-numeric data in transition', () => {
      const wrapper = mount(createTestComponent())
      const fromOption: EChartsOption = {
        series: [{ 
          type: 'pie', 
          data: [
            { name: 'A', value: 10 },
            { name: 'B', value: 20 }
          ]
        }]
      }
      const toOption: EChartsOption = {
        series: [{ 
          type: 'pie', 
          data: [
            { name: 'A', value: 30 },
            { name: 'B', value: 40 }
          ]
        }]
      }
      
      expect(() => {
        wrapper.vm.transitionTo(fromOption, toOption)
      }).not.toThrow()
    })

    it('should handle array interpolation in transition', () => {
      const wrapper = mount(createTestComponent())
      const fromOption: EChartsOption = {
        series: [{ 
          type: 'line', 
          data: [[0, 0], [1, 1]] 
        }]
      }
      const toOption: EChartsOption = {
        series: [{ 
          type: 'line', 
          data: [[2, 2], [3, 3]] 
        }]
      }
      
      wrapper.vm.transitionTo(fromOption, toOption, 100)
      
      expect(wrapper.vm.isAnimating).toBe(true)
    })

    it('should handle missing series in transition', () => {
      const wrapper = mount(createTestComponent())
      const fromOption: EChartsOption = {}
      const toOption: EChartsOption = {
        series: [{ type: 'line', data: [1, 2, 3] }]
      }
      
      expect(() => {
        wrapper.vm.transitionTo(fromOption, toOption)
      }).not.toThrow()
    })

    it('should handle rapid animation calls', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.animateToOption({ series: [] })
      wrapper.vm.animateToOption({ series: [] })
      wrapper.vm.animateToOption({ series: [] })
      
      expect(mockChart.setOption).toHaveBeenCalledTimes(3)
    })
  })

  describe('Easing Function', () => {
    it('should apply easing to transition progress', () => {
      const wrapper = mount(createTestComponent())
      const fromOption: EChartsOption = {
        series: [{ type: 'line', data: [0] }]
      }
      const toOption: EChartsOption = {
        series: [{ type: 'line', data: [100] }]
      }
      
      wrapper.vm.transitionTo(fromOption, toOption, 300)
      
      // Simulate multiple animation frames
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(16)
      }
      
      // Check that interpolation is happening
      const calls = (mockChart.setOption as any).mock.calls
      const hasInterpolatedValue = calls.some((call: any) => {
        const data = call[0]?.series?.[0]?.data?.[0]
        return typeof data === 'number' && data > 0 && data < 100
      })
      
      expect(hasInterpolatedValue).toBe(true)
    })
  })
})