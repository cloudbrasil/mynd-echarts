import { onUnmounted, type Ref } from 'vue'
import type { ECharts } from 'echarts'

export type ChartEventHandler = (params: any) => void

export interface ChartEventMap {
  // Mouse events
  click?: ChartEventHandler
  dblclick?: ChartEventHandler
  mousedown?: ChartEventHandler
  mousemove?: ChartEventHandler
  mouseup?: ChartEventHandler
  mouseover?: ChartEventHandler
  mouseout?: ChartEventHandler
  globalout?: ChartEventHandler
  contextmenu?: ChartEventHandler
  
  // Action events
  highlight?: ChartEventHandler
  downplay?: ChartEventHandler
  selectchanged?: ChartEventHandler
  
  // Legend events
  legendselectchanged?: ChartEventHandler
  legendselected?: ChartEventHandler
  legendunselected?: ChartEventHandler
  legendselectall?: ChartEventHandler
  legendinverseselect?: ChartEventHandler
  legendscroll?: ChartEventHandler
  
  // Data events
  datazoom?: ChartEventHandler
  datarangeselected?: ChartEventHandler
  
  // Roam events
  graphroam?: ChartEventHandler
  georoam?: ChartEventHandler
  treeroam?: ChartEventHandler
  
  // Timeline events
  timelinechanged?: ChartEventHandler
  timelineplaychanged?: ChartEventHandler
  
  // Toolbox events
  restore?: ChartEventHandler
  dataviewchanged?: ChartEventHandler
  magictypechanged?: ChartEventHandler
  
  // Pie events
  pieselectchanged?: ChartEventHandler
  pieselected?: ChartEventHandler
  pieunselected?: ChartEventHandler
  
  // Map events
  mapselected?: ChartEventHandler
  mapunselected?: ChartEventHandler
  
  // Axis events
  axisareaselected?: ChartEventHandler
  
  // Brush events
  brush?: ChartEventHandler
  brushEnd?: ChartEventHandler
  brushselected?: ChartEventHandler
  
  // Rendering events
  rendered?: ChartEventHandler
  finished?: ChartEventHandler
  
  // Other events
  globalcursortaken?: ChartEventHandler
}

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