/**
 * @fileoverview Component-specific type definitions for mynd-echarts
 * @module mynd-echarts/types/component
 */

import type { CSSProperties, Ref } from 'vue'
import type { 
  ECharts, 
  EChartsOption, 
  SetOptionOpts,
  EChartsInitOpts,
  AnimationEasing,
  ZRColor
} from './echarts'

/**
 * Props interface for the MyndEcharts component
 */
export interface MyndEchartsProps {
  /**
   * ECharts options configuration object
   * @see https://echarts.apache.org/en/option.html
   */
  options: EChartsOption

  /**
   * Chart theme - can be a registered theme name or custom theme object
   * @default 'default'
   */
  theme?: string | object

  /**
   * Show loading animation
   * @default false
   */
  loading?: boolean

  /**
   * Loading animation options
   */
  loadingOptions?: MyndEchartsLoadingOptions

  /**
   * Custom inline styles for the chart container
   */
  style?: CSSProperties

  /**
   * CSS class name(s) for the chart container
   * Can be a string, array of strings, or object with boolean values
   */
  className?: string | string[] | Record<string, boolean>

  /**
   * Enable automatic resize when container size changes
   * @default true
   */
  autoResize?: boolean

  /**
   * Chart rendering mode
   * @default 'canvas'
   */
  renderer?: 'canvas' | 'svg'

  /**
   * Chart initialization options
   */
  initOptions?: EChartsInitOpts

  /**
   * Whether to merge new options with existing ones
   * @default false
   */
  notMerge?: boolean

  /**
   * Enable lazy update for better performance with frequent updates
   * @default false
   */
  lazyUpdate?: boolean

  /**
   * Update options without animation
   * @default false
   */
  silent?: boolean

  /**
   * Group name for connecting charts
   */
  group?: string
}

/**
 * Loading animation options
 */
export interface MyndEchartsLoadingOptions {
  /** Loading text */
  text?: string
  /** Loading spinner color */
  color?: ZRColor
  /** Loading text color */
  textColor?: ZRColor
  /** Loading mask background color */
  maskColor?: ZRColor
  /** Z-level for loading overlay */
  zlevel?: number
  /** Font size for loading text */
  fontSize?: number
  /** Whether to show spinner */
  showSpinner?: boolean
  /** Spinner radius */
  spinnerRadius?: number
  /** Spinner line width */
  lineWidth?: number
  /** Font family for loading text */
  fontFamily?: string
  /** Font weight for loading text */
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number
  /** Font style for loading text */
  fontStyle?: 'normal' | 'italic' | 'oblique'
}

/**
 * Events emitted by the MyndEcharts component
 */
export interface MyndEchartsEmits {
  /** Emitted when chart instance is ready */
  ready: (instance: ECharts) => void
  /** Mouse click event */
  click: (params: any) => void
  /** Mouse double click event */
  dblclick: (params: any) => void
  /** Mouse down event */
  mousedown: (params: any) => void
  /** Mouse move event */
  mousemove: (params: any) => void
  /** Mouse up event */
  mouseup: (params: any) => void
  /** Mouse over event */
  mouseover: (params: any) => void
  /** Mouse out event */
  mouseout: (params: any) => void
  /** Global mouse out event */
  globalout: (params: any) => void
  /** Context menu event */
  contextmenu: (params: any) => void
  /** Series highlight event */
  highlight: (params: any) => void
  /** Series downplay event */
  downplay: (params: any) => void
  /** Selection changed event */
  selectchanged: (params: any) => void
  /** Legend selection changed event */
  legendselectchanged: (params: any) => void
  /** Legend selected event */
  legendselected: (params: any) => void
  /** Legend unselected event */
  legendunselected: (params: any) => void
  /** Legend select all event */
  legendselectall: (params: any) => void
  /** Legend inverse select event */
  legendinverseselect: (params: any) => void
  /** Legend scroll event */
  legendscroll: (params: any) => void
  /** Data zoom event */
  datazoom: (params: any) => void
  /** Data range selected event */
  datarangeselected: (params: any) => void
  /** Graph roam event */
  graphroam: (params: any) => void
  /** Geo roam event */
  georoam: (params: any) => void
  /** Tree roam event */
  treeroam: (params: any) => void
  /** Timeline changed event */
  timelinechanged: (params: any) => void
  /** Timeline play state changed event */
  timelineplaychanged: (params: any) => void
  /** Restore event */
  restore: (params: any) => void
  /** Data view changed event */
  dataviewchanged: (params: any) => void
  /** Magic type changed event */
  magictypechanged: (params: any) => void
  /** Pie selection changed event */
  pieselectchanged: (params: any) => void
  /** Pie selected event */
  pieselected: (params: any) => void
  /** Pie unselected event */
  pieunselected: (params: any) => void
  /** Map selected event */
  mapselected: (params: any) => void
  /** Map unselected event */
  mapunselected: (params: any) => void
  /** Axis area selected event */
  axisareaselected: (params: any) => void
  /** Brush event */
  brush: (params: any) => void
  /** Brush end event */
  brushEnd: (params: any) => void
  /** Brush selected event */
  brushselected: (params: any) => void
  /** Global cursor taken event */
  globalcursortaken: (params: any) => void
  /** Chart rendered event */
  rendered: (params: any) => void
  /** Chart finished rendering event */
  finished: (params: any) => void
}

/**
 * Methods exposed by the MyndEcharts component instance
 */
export interface MyndEchartsInstance {
  /** Chart instance reference */
  chartInstance: Ref<ECharts | undefined>
  /** Set chart options */
  setOption: (options: EChartsOption, opts?: SetOptionOpts) => void
  /** Get current chart options */
  getOption: () => any
  /** Resize chart */
  resize: (opts?: Parameters<ECharts['resize']>[0]) => void
  /** Dispose chart instance */
  dispose: () => void
  /** Clear chart content */
  clear: () => void
  /** Get chart width */
  getWidth: () => number | undefined
  /** Get chart height */
  getHeight: () => number | undefined
  /** Get chart DOM element */
  getDom: () => HTMLElement | undefined
  /** Get chart data URL */
  getDataURL: (opts?: Parameters<ECharts['getDataURL']>[0]) => string | undefined
  /** Get connected charts data URL */
  getConnectedDataURL: (opts?: Parameters<ECharts['getConnectedDataURL']>[0]) => string | undefined
  /** Convert value to pixel coordinates */
  convertToPixel: (finder: any, value: any) => any
  /** Convert pixel coordinates to value */
  convertFromPixel: (finder: any, value: any) => any
  /** Check if point is in specific area */
  containPixel: (finder: any, value: any) => boolean | undefined
  /** Dispatch action to chart */
  dispatchAction: (action: any) => void
  /** Check if chart is disposed */
  isDisposed: () => boolean | undefined
}

/**
 * Configuration for chart resize behavior
 */
export interface ChartResizeConfig {
  /** Resize mode: debounce or throttle */
  mode?: 'debounce' | 'throttle'
  /** Delay in milliseconds */
  delay?: number
  /** Also observe parent element */
  observeParent?: boolean
  /** Custom resize callback */
  onResize?: (entry: ResizeObserverEntry) => void
}

/**
 * Configuration for chart animations
 */
export interface ChartAnimationConfig {
  /** Enable animations */
  enabled?: boolean
  /** Animation duration in milliseconds */
  duration?: number
  /** Animation easing function */
  easing?: AnimationEasing
  /** Animation delay */
  delay?: number | ((idx: number) => number)
  /** Enable update animations */
  update?: boolean
  /** Update animation duration */
  updateDuration?: number
  /** Update animation easing */
  updateEasing?: AnimationEasing
  /** Update animation delay */
  updateDelay?: number | ((idx: number) => number)
}

/**
 * Theme configuration object
 */
export interface ChartThemeConfig {
  /** Theme name */
  name: string
  /** Theme configuration object or reference to registered theme */
  theme: object | string
}

/**
 * Event handler function type
 */
export type ChartEventHandler<T = any> = (params: T) => void

/**
 * Map of all available chart events
 */
export interface ChartEventMap {
  [eventName: string]: ChartEventHandler
}