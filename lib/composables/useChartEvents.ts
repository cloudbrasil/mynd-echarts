import { onUnmounted, type Ref } from 'vue'
import type { ECharts } from 'echarts'
import type { ChartEventHandler, ChartEventMap } from '../types/component'

export { ChartEventHandler, ChartEventMap }

export function useChartEvents(
  chartInstance: Ref<ECharts | undefined>,
  eventMap: ChartEventMap = {}
) {
  const eventHandlers = new Map<string, Set<ChartEventHandler>>()

  const on = (eventName: string, handler: ChartEventHandler) => {
    if (!chartInstance.value) return

    chartInstance.value.on(eventName, handler)
    
    if (!eventHandlers.has(eventName)) {
      eventHandlers.set(eventName, new Set())
    }
    eventHandlers.get(eventName)!.add(handler)
  }

  const off = (eventName: string, handler?: ChartEventHandler) => {
    if (!chartInstance.value) return

    if (handler) {
      chartInstance.value.off(eventName, handler)
      eventHandlers.get(eventName)?.delete(handler)
    } else {
      chartInstance.value.off(eventName)
      eventHandlers.delete(eventName)
    }
  }

  const once = (eventName: string, handler: ChartEventHandler) => {
    const wrappedHandler = (params: any) => {
      handler(params)
      off(eventName, wrappedHandler)
    }
    on(eventName, wrappedHandler)
  }

  const emit = (eventName: string, params?: any) => {
    const handlers = eventHandlers.get(eventName)
    if (handlers) {
      handlers.forEach(handler => handler(params))
    }
  }

  // Register initial events
  Object.entries(eventMap).forEach(([eventName, handler]) => {
    if (handler) {
      on(eventName, handler)
    }
  })

  // Batch event registration
  const registerEvents = (events: ChartEventMap) => {
    Object.entries(events).forEach(([eventName, handler]) => {
      if (handler) {
        on(eventName, handler)
      }
    })
  }

  // Batch event removal
  const unregisterEvents = (events: string[]) => {
    events.forEach(eventName => {
      off(eventName)
    })
  }

  // Get all registered events
  const getRegisteredEvents = () => {
    return Array.from(eventHandlers.keys())
  }

  // Clear all events
  const clearAllEvents = () => {
    eventHandlers.forEach((_, eventName) => {
      off(eventName)
    })
    eventHandlers.clear()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    clearAllEvents()
  })

  return {
    on,
    off,
    once,
    emit,
    registerEvents,
    unregisterEvents,
    getRegisteredEvents,
    clearAllEvents
  }
}