/**
 * @fileoverview Utility types and helper functions for mynd-echarts
 * @module mynd-echarts/types/utilities
 */

import type { EChartsOption, SeriesOption } from './echarts'
import type { SeriesTypeMap } from './generics'

/**
 * Merge multiple chart options into one
 * @param options - Array of chart options to merge
 * @returns Merged chart option
 */
export function mergeOptions(...options: Partial<EChartsOption>[]): EChartsOption {
  const result: EChartsOption = {}
  
  for (const option of options) {
    Object.keys(option).forEach(key => {
      const value = (option as any)[key]
      const existingValue = (result as any)[key]
      
      if (Array.isArray(value)) {
        (result as any)[key] = existingValue ? [...existingValue, ...value] : [...value]
      } else if (value && typeof value === 'object' && !isSeriesOption(value)) {
        (result as any)[key] = existingValue 
          ? { ...existingValue, ...value }
          : { ...value }
      } else {
        (result as any)[key] = value
      }
    })
  }
  
  return result
}

/**
 * Check if an object is a series option
 * @param obj - Object to check
 * @returns True if object is a series option
 */
function isSeriesOption(obj: any): obj is SeriesOption {
  return obj && typeof obj.type === 'string' && obj.data !== undefined
}

/**
 * Create a responsive chart option
 * @param baseOption - Base chart option
 * @param mediaQueries - Media query configurations
 * @returns Chart option with media queries
 */
export function createResponsiveOption(
  baseOption: EChartsOption,
  mediaQueries: Array<{
    minWidth?: number
    maxWidth?: number
    option: Partial<EChartsOption>
  }>
): EChartsOption {
  return {
    ...baseOption,
    media: mediaQueries.map(({ minWidth, maxWidth, option }) => ({
      query: {
        minWidth,
        maxWidth
      },
      option
    }))
  }
}

/**
 * Generate chart data with optional formatting
 * @param data - Raw data array
 * @param formatter - Optional formatter function
 * @returns Formatted chart data
 */
export function formatChartData<T, R = T>(
  data: T[],
  formatter?: (item: T, index: number) => R
): R[] {
  return formatter ? data.map(formatter) : (data as unknown as R[])
}

/**
 * Create axis configuration for time series
 * @param options - Time axis options
 * @returns Axis configuration
 */
export function createTimeAxis(options: {
  name?: string
  format?: string
  interval?: number
  min?: string | number | Function
  max?: string | number | Function
} = {}) {
  return {
    type: 'time' as const,
    name: options.name,
    axisLabel: {
      formatter: options.format
    },
    interval: options.interval,
    min: options.min,
    max: options.max
  }
}

/**
 * Create axis configuration for categories
 * @param categories - Category names
 * @param options - Additional axis options
 * @returns Axis configuration
 */
export function createCategoryAxis(
  categories: string[],
  options: {
    name?: string
    rotate?: number
    interval?: number | 'auto'
  } = {}
) {
  return {
    type: 'category' as const,
    data: categories,
    name: options.name,
    axisLabel: {
      rotate: options.rotate,
      interval: options.interval
    }
  }
}

/**
 * Create axis configuration for values
 * @param options - Value axis options
 * @returns Axis configuration
 */
export function createValueAxis(options: {
  name?: string
  min?: number | 'dataMin' | Function
  max?: number | 'dataMax' | Function
  interval?: number
  formatter?: string | Function
} = {}) {
  return {
    type: 'value' as const,
    name: options.name,
    min: options.min,
    max: options.max,
    interval: options.interval,
    axisLabel: {
      formatter: options.formatter
    }
  }
}

/**
 * Generate color palette
 * @param baseColors - Base colors to generate palette from
 * @param count - Number of colors to generate
 * @returns Array of color strings
 */
export function generateColorPalette(baseColors: string[], count: number): string[] {
  if (baseColors.length >= count) {
    return baseColors.slice(0, count)
  }
  
  const palette: string[] = []
  
  for (let i = 0; i < count; i++) {
    const baseIndex = i % baseColors.length
    const step = Math.floor(i / baseColors.length)
    const opacity = 1 - (step * 0.2)
    
    palette.push(adjustColorOpacity(baseColors[baseIndex], opacity))
  }
  
  return palette
}

/**
 * Adjust color opacity
 * @param color - Color string (hex or rgb)
 * @param opacity - Opacity value (0-1)
 * @returns Color with adjusted opacity
 */
function adjustColorOpacity(color: string, opacity: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  
  // Handle rgb colors
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
  }
  
  return color
}

/**
 * Format number with abbreviations (K, M, B)
 * @param num - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function formatNumber(num: number, decimals: number = 1): string {
  const abs = Math.abs(num)
  const sign = num < 0 ? '-' : ''
  
  if (abs >= 1e9) {
    return sign + (abs / 1e9).toFixed(decimals) + 'B'
  }
  if (abs >= 1e6) {
    return sign + (abs / 1e6).toFixed(decimals) + 'M'
  }
  if (abs >= 1e3) {
    return sign + (abs / 1e3).toFixed(decimals) + 'K'
  }
  return sign + abs.toFixed(decimals)
}

/**
 * Create tooltip formatter function
 * @param options - Formatter options
 * @returns Formatter function
 */
export function createTooltipFormatter(options: {
  prefix?: string
  suffix?: string
  decimals?: number
  dateFormat?: string
} = {}) {
  return (params: any) => {
    if (Array.isArray(params)) {
      return params.map(item => {
        const value = options.decimals !== undefined
          ? Number(item.value).toFixed(options.decimals)
          : item.value
        return `${item.marker} ${item.seriesName}: ${options.prefix || ''}${value}${options.suffix || ''}`
      }).join('<br/>')
    } else {
      const value = options.decimals !== undefined
        ? Number(params.value).toFixed(options.decimals)
        : params.value
      return `${params.name}<br/>${params.marker} ${params.seriesName}: ${options.prefix || ''}${value}${options.suffix || ''}`
    }
  }
}

/**
 * Deep clone an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any
  }
  
  if (obj instanceof Object) {
    const clonedObj: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * Type-safe series creator
 * @template T - Series type
 * @param type - Series type
 * @param config - Series configuration
 * @returns Typed series option
 */
export function createSeries<T extends keyof SeriesTypeMap>(
  type: T,
  config: Omit<SeriesTypeMap[T], 'type'>
): SeriesTypeMap[T] {
  return {
    ...config,
    type
  } as SeriesTypeMap[T]
}