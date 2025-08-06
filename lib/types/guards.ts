/**
 * @fileoverview Type guards and utility functions for type checking
 * @module mynd-echarts/types/guards
 */

import type { 
  ECharts, 
  EChartsOption,
  SeriesOption,
  LineSeriesOption,
  BarSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
  RadarSeriesOption,
  GaugeSeriesOption
} from './echarts'

/**
 * Type guard to check if a value is an ECharts instance
 * @param value - Value to check
 * @returns True if value is an ECharts instance
 */
export function isEChartsInstance(value: any): value is ECharts {
  return value && 
    typeof value.setOption === 'function' &&
    typeof value.resize === 'function' &&
    typeof value.dispose === 'function' &&
    typeof value.getOption === 'function'
}

/**
 * Type guard to check if an option is a valid ECharts option
 * @param value - Value to check
 * @returns True if value is an EChartsOption
 */
export function isEChartsOption(value: any): value is EChartsOption {
  return value && 
    typeof value === 'object' &&
    (value.series !== undefined ||
     value.xAxis !== undefined ||
     value.yAxis !== undefined ||
     value.grid !== undefined ||
     value.title !== undefined ||
     value.legend !== undefined ||
     value.tooltip !== undefined)
}

/**
 * Type guard to check if a series is a line series
 * @param series - Series to check
 * @returns True if series is a LineSeriesOption
 */
export function isLineSeries(series: SeriesOption): series is LineSeriesOption {
  return series.type === 'line'
}

/**
 * Type guard to check if a series is a bar series
 * @param series - Series to check
 * @returns True if series is a BarSeriesOption
 */
export function isBarSeries(series: SeriesOption): series is BarSeriesOption {
  return series.type === 'bar'
}

/**
 * Type guard to check if a series is a pie series
 * @param series - Series to check
 * @returns True if series is a PieSeriesOption
 */
export function isPieSeries(series: SeriesOption): series is PieSeriesOption {
  return series.type === 'pie'
}

/**
 * Type guard to check if a series is a scatter series
 * @param series - Series to check
 * @returns True if series is a ScatterSeriesOption
 */
export function isScatterSeries(series: SeriesOption): series is ScatterSeriesOption {
  return series.type === 'scatter' || series.type === 'effectScatter'
}

/**
 * Type guard to check if a series is a radar series
 * @param series - Series to check
 * @returns True if series is a RadarSeriesOption
 */
export function isRadarSeries(series: SeriesOption): series is RadarSeriesOption {
  return series.type === 'radar'
}

/**
 * Type guard to check if a series is a gauge series
 * @param series - Series to check
 * @returns True if series is a GaugeSeriesOption
 */
export function isGaugeSeries(series: SeriesOption): series is GaugeSeriesOption {
  return series.type === 'gauge'
}

/**
 * Check if a value is a valid chart renderer
 * @param value - Value to check
 * @returns True if value is 'canvas' or 'svg'
 */
export function isValidRenderer(value: any): value is 'canvas' | 'svg' {
  return value === 'canvas' || value === 'svg'
}

/**
 * Check if a value is a valid chart theme
 * @param value - Value to check
 * @returns True if value is a string or object
 */
export function isValidTheme(value: any): value is string | object {
  return typeof value === 'string' || (value && typeof value === 'object' && !Array.isArray(value))
}

/**
 * Check if the browser supports ResizeObserver
 * @returns True if ResizeObserver is supported
 */
export function supportsResizeObserver(): boolean {
  return typeof ResizeObserver !== 'undefined'
}

/**
 * Check if the browser supports IntersectionObserver
 * @returns True if IntersectionObserver is supported
 */
export function supportsIntersectionObserver(): boolean {
  return typeof IntersectionObserver !== 'undefined'
}

/**
 * Type guard to check if an element is an HTMLElement
 * @param element - Element to check
 * @returns True if element is an HTMLElement
 */
export function isHTMLElement(element: any): element is HTMLElement {
  return element instanceof HTMLElement
}

/**
 * Type guard to check if a value is a valid color string
 * @param value - Value to check
 * @returns True if value is a valid color string
 */
export function isColorString(value: any): value is string {
  if (typeof value !== 'string') return false
  
  // Check for hex colors
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(value)) return true
  
  // Check for rgb/rgba
  if (/^rgba?\(/.test(value)) return true
  
  // Check for hsl/hsla
  if (/^hsla?\(/.test(value)) return true
  
  // Check for named colors (basic list)
  const namedColors = [
    'red', 'green', 'blue', 'black', 'white', 'gray', 'yellow', 
    'cyan', 'magenta', 'orange', 'purple', 'brown', 'pink'
  ]
  
  return namedColors.includes(value.toLowerCase())
}

/**
 * Check if a value is a valid numeric value for charts
 * @param value - Value to check
 * @returns True if value is a valid number
 */
export function isValidNumeric(value: any): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Check if an array contains only numeric values
 * @param arr - Array to check
 * @returns True if all values are numeric
 */
export function isNumericArray(arr: any): arr is number[] {
  return Array.isArray(arr) && arr.every(isValidNumeric)
}

/**
 * Deep freeze an object to prevent mutations
 * @param obj - Object to freeze
 * @returns Frozen object
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj)
  
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop]
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value)
    }
  })
  
  return obj
}