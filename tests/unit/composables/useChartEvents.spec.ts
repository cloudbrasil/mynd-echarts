import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useChartEvents } from '../../../lib/composables/useChartEvents'
import type { ECharts } from 'echarts'

describe('useChartEvents', () => {
  let mockChart: ECharts
  let registeredEvents: Map<string, Set<Function>>

  beforeEach(() => {
    registeredEvents = new Map()
    
    mockChart = {
      on: vi.fn((event: string, handler: Function) => {
        if (!registeredEvents.has(event)) {
          registeredEvents.set(event, new Set())
        }
        registeredEvents.get(event)!.add(handler)
      }),
      off: vi.fn((event: string, handler?: Function) => {
        if (handler) {
          registeredEvents.get(event)?.delete(handler)
        } else {
          registeredEvents.delete(event)
        }
      }),
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      getOption: vi.fn(() => ({})),
      clear: vi.fn(),
      getWidth: vi.fn(() => 600),
      getHeight: vi.fn(() => 400)
    } as any
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  // Create test component to use the composable
  function createTestComponent(eventMap = {}) {
    return defineComponent({
      setup() {
        const chartInstance = ref<ECharts | undefined>(mockChart)
        const events = useChartEvents(chartInstance, eventMap)
        
        return {
          chartInstance,
          ...events
        }
      },
      render() {
        return h('div')
      }
    })
  }

  describe('Event Registration', () => {
    it('should register event handlers', () => {
      const wrapper = mount(createTestComponent())
      const handler = vi.fn()
      
      wrapper.vm.on('click', handler)
      
      expect(mockChart.on).toHaveBeenCalledWith('click', handler)
      expect(registeredEvents.has('click')).toBe(true)
      expect(registeredEvents.get('click')?.has(handler)).toBe(true)
    })

    it('should register initial events from eventMap', () => {
      const clickHandler = vi.fn()
      const mouseoverHandler = vi.fn()
      
      const wrapper = mount(createTestComponent({
        click: clickHandler,
        mouseover: mouseoverHandler
      }))
      
      expect(mockChart.on).toHaveBeenCalledWith('click', clickHandler)
      expect(mockChart.on).toHaveBeenCalledWith('mouseover', mouseoverHandler)
    })

    it('should register multiple handlers for same event', () => {
      const wrapper = mount(createTestComponent())
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      wrapper.vm.on('click', handler1)
      wrapper.vm.on('click', handler2)
      
      expect(mockChart.on).toHaveBeenCalledTimes(2)
      expect(registeredEvents.get('click')?.size).toBe(2)
    })

    it('should handle missing chart instance', () => {
      const wrapper = mount(createTestComponent())
      wrapper.vm.chartInstance = undefined
      
      expect(() => {
        wrapper.vm.on('click', vi.fn())
      }).not.toThrow()
      
      expect(mockChart.on).not.toHaveBeenCalled()
    })
  })

  describe('Event Removal', () => {
    it('should remove specific event handler', () => {
      const wrapper = mount(createTestComponent())
      const handler = vi.fn()
      
      wrapper.vm.on('click', handler)
      wrapper.vm.off('click', handler)
      
      expect(mockChart.off).toHaveBeenCalledWith('click', handler)
      expect(registeredEvents.get('click')?.has(handler)).toBe(false)
    })

    it('should remove all handlers for an event', () => {
      const wrapper = mount(createTestComponent())
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      wrapper.vm.on('click', handler1)
      wrapper.vm.on('click', handler2)
      wrapper.vm.off('click')
      
      expect(mockChart.off).toHaveBeenCalledWith('click')
      expect(registeredEvents.has('click')).toBe(false)
    })

    it('should handle missing chart instance', () => {
      const wrapper = mount(createTestComponent())
      wrapper.vm.chartInstance = undefined
      
      expect(() => {
        wrapper.vm.off('click')
      }).not.toThrow()
      
      expect(mockChart.off).not.toHaveBeenCalled()
    })
  })

  describe('Once Event Handler', () => {
    it('should register handler that fires only once', () => {
      const wrapper = mount(createTestComponent())
      const handler = vi.fn()
      
      wrapper.vm.once('click', handler)
      
      // Get the wrapped handler
      const wrappedHandler = (mockChart.on as any).mock.calls[0][1]
      
      // Simulate event firing
      wrappedHandler({ type: 'click' })
      
      expect(handler).toHaveBeenCalledWith({ type: 'click' })
      expect(handler).toHaveBeenCalledTimes(1)
      
      // Should auto-remove after first call
      expect(mockChart.off).toHaveBeenCalled()
    })
  })

  describe('Event Emission', () => {
    it('should emit events to registered handlers', () => {
      const wrapper = mount(createTestComponent())
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      
      wrapper.vm.on('custom', handler1)
      wrapper.vm.on('custom', handler2)
      
      wrapper.vm.emit('custom', { data: 'test' })
      
      expect(handler1).toHaveBeenCalledWith({ data: 'test' })
      expect(handler2).toHaveBeenCalledWith({ data: 'test' })
    })

    it('should handle emit with no registered handlers', () => {
      const wrapper = mount(createTestComponent())
      
      expect(() => {
        wrapper.vm.emit('nonexistent', {})
      }).not.toThrow()
    })
  })

  describe('Batch Operations', () => {
    it('should register multiple events at once', () => {
      const wrapper = mount(createTestComponent())
      const handlers = {
        click: vi.fn(),
        mouseover: vi.fn(),
        mouseout: vi.fn()
      }
      
      wrapper.vm.registerEvents(handlers)
      
      expect(mockChart.on).toHaveBeenCalledWith('click', handlers.click)
      expect(mockChart.on).toHaveBeenCalledWith('mouseover', handlers.mouseover)
      expect(mockChart.on).toHaveBeenCalledWith('mouseout', handlers.mouseout)
    })

    it('should unregister multiple events at once', () => {
      const wrapper = mount(createTestComponent())
      const handlers = {
        click: vi.fn(),
        mouseover: vi.fn()
      }
      
      wrapper.vm.registerEvents(handlers)
      wrapper.vm.unregisterEvents(['click', 'mouseover'])
      
      expect(mockChart.off).toHaveBeenCalledWith('click')
      expect(mockChart.off).toHaveBeenCalledWith('mouseover')
    })

    it('should skip undefined handlers in batch registration', () => {
      const wrapper = mount(createTestComponent())
      const handlers = {
        click: vi.fn(),
        mouseover: undefined
      }
      
      wrapper.vm.registerEvents(handlers as any)
      
      expect(mockChart.on).toHaveBeenCalledWith('click', handlers.click)
      expect(mockChart.on).not.toHaveBeenCalledWith('mouseover', undefined)
    })
  })

  describe('Event Management', () => {
    it('should get all registered events', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.on('click', vi.fn())
      wrapper.vm.on('mouseover', vi.fn())
      wrapper.vm.on('mouseout', vi.fn())
      
      const events = wrapper.vm.getRegisteredEvents()
      
      expect(events).toContain('click')
      expect(events).toContain('mouseover')
      expect(events).toContain('mouseout')
      expect(events).toHaveLength(3)
    })

    it('should clear all events', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.on('click', vi.fn())
      wrapper.vm.on('mouseover', vi.fn())
      
      wrapper.vm.clearAllEvents()
      
      expect(mockChart.off).toHaveBeenCalledWith('click')
      expect(mockChart.off).toHaveBeenCalledWith('mouseover')
      expect(wrapper.vm.getRegisteredEvents()).toHaveLength(0)
    })
  })

  describe('Lifecycle', () => {
    it('should clean up events on unmount', () => {
      const wrapper = mount(createTestComponent())
      
      wrapper.vm.on('click', vi.fn())
      wrapper.vm.on('mouseover', vi.fn())
      
      wrapper.unmount()
      
      expect(mockChart.off).toHaveBeenCalled()
    })
  })

  describe('Event Types', () => {
    it('should handle mouse events', () => {
      const wrapper = mount(createTestComponent({
        click: vi.fn(),
        dblclick: vi.fn(),
        mousedown: vi.fn(),
        mousemove: vi.fn(),
        mouseup: vi.fn(),
        mouseover: vi.fn(),
        mouseout: vi.fn(),
        contextmenu: vi.fn()
      }))
      
      expect(mockChart.on).toHaveBeenCalledTimes(8)
    })

    it('should handle legend events', () => {
      const wrapper = mount(createTestComponent({
        legendselectchanged: vi.fn(),
        legendselected: vi.fn(),
        legendunselected: vi.fn()
      }))
      
      expect(mockChart.on).toHaveBeenCalledTimes(3)
    })

    it('should handle data events', () => {
      const wrapper = mount(createTestComponent({
        datazoom: vi.fn(),
        datarangeselected: vi.fn()
      }))
      
      expect(mockChart.on).toHaveBeenCalledTimes(2)
    })

    it('should handle rendering events', () => {
      const wrapper = mount(createTestComponent({
        rendered: vi.fn(),
        finished: vi.fn()
      }))
      
      expect(mockChart.on).toHaveBeenCalledTimes(2)
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle multiple handlers and removal', () => {
      const wrapper = mount(createTestComponent())
      const handler1 = vi.fn()
      const handler2 = vi.fn()
      const handler3 = vi.fn()
      
      // Register handlers
      wrapper.vm.on('click', handler1)
      wrapper.vm.on('click', handler2)
      wrapper.vm.on('mouseover', handler3)
      
      // Test emission
      wrapper.vm.emit('click', { x: 100 })
      expect(handler1).toHaveBeenCalledWith({ x: 100 })
      expect(handler2).toHaveBeenCalledWith({ x: 100 })
      
      // Remove one handler
      wrapper.vm.off('click', handler1)
      
      // Test emission again
      wrapper.vm.emit('click', { x: 200 })
      expect(handler1).toHaveBeenCalledTimes(1) // Not called again
      expect(handler2).toHaveBeenCalledTimes(2) // Called again
    })

    it('should handle event handler that modifies other events', () => {
      const wrapper = mount(createTestComponent())
      
      const handler1 = vi.fn(() => {
        wrapper.vm.off('mouseover')
      })
      
      const handler2 = vi.fn()
      
      wrapper.vm.on('click', handler1)
      wrapper.vm.on('mouseover', handler2)
      
      // Click should remove mouseover
      wrapper.vm.emit('click', {})
      
      expect(mockChart.off).toHaveBeenCalledWith('mouseover')
    })

    it('should maintain event handler order', () => {
      const wrapper = mount(createTestComponent())
      const callOrder: number[] = []
      
      const handler1 = vi.fn(() => callOrder.push(1))
      const handler2 = vi.fn(() => callOrder.push(2))
      const handler3 = vi.fn(() => callOrder.push(3))
      
      wrapper.vm.on('test', handler1)
      wrapper.vm.on('test', handler2)
      wrapper.vm.on('test', handler3)
      
      wrapper.vm.emit('test', {})
      
      expect(callOrder).toEqual([1, 2, 3])
    })
  })
})