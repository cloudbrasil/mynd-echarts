/**
 * @fileoverview Composable for chart data management and transformation
 * @module mynd-echarts/composables/useChartData
 */

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'

/**
 * Data point type
 */
export type DataPoint = number | [number, number] | { value: number | number[]; [key: string]: any }

/**
 * Options for useChartData composable
 */
export interface UseChartDataConfig<T = any> {
  /** Initial data */
  initialData?: T[]
  /** Transform function for data */
  transformer?: (data: T[]) => DataPoint[]
  /** Validation function */
  validator?: (data: T[]) => boolean | string
  /** Enable data caching */
  cache?: boolean
  /** Maximum data points to keep */
  maxDataPoints?: number
  /** Enable real-time updates */
  realtime?: boolean
}

/**
 * Return type for useChartData composable
 */
export interface UseChartDataReturn<T = any> {
  /** Raw data */
  rawData: Ref<T[]>
  /** Transformed data ready for charts */
  chartData: ComputedRef<DataPoint[]>
  /** Data statistics */
  stats: ComputedRef<DataStats>
  /** Loading state */
  loading: Ref<boolean>
  /** Error state */
  error: Ref<string | null>
  /** Set new data */
  setData: (data: T[]) => void
  /** Append data */
  appendData: (data: T | T[]) => void
  /** Prepend data */
  prependData: (data: T | T[]) => void
  /** Update data at index */
  updateDataAt: (index: number, data: T) => void
  /** Remove data at index */
  removeDataAt: (index: number) => void
  /** Clear all data */
  clearData: () => void
  /** Filter data */
  filterData: (predicate: (item: T, index: number) => boolean) => void
  /** Sort data */
  sortData: (compareFn?: (a: T, b: T) => number) => void
  /** Get data slice */
  getDataSlice: (start: number, end?: number) => T[]
  /** Load data asynchronously */
  loadData: (loader: () => Promise<T[]>) => Promise<void>
}

/**
 * Data statistics interface
 */
export interface DataStats {
  count: number
  min: number | null
  max: number | null
  sum: number | null
  average: number | null
  median: number | null
  variance: number | null
  stdDev: number | null
}

/**
 * Composable for managing chart data with transformations and validations
 * 
 * @param config - Configuration options
 * @returns Chart data management functions
 * 
 * @example
 * ```typescript
 * const { chartData, setData, stats } = useChartData({
 *   transformer: (data) => data.map(d => d.value),
 *   maxDataPoints: 100
 * })
 * ```
 */
export function useChartData<T = any>(
  config: UseChartDataConfig<T> = {}
): UseChartDataReturn<T> {
  const {
    initialData = [],
    transformer,
    validator,
    cache = false,
    maxDataPoints
  } = config

  // State
  const rawData = ref<T[]>(initialData) as Ref<T[]>
  const loading = ref(false)
  const error = ref<string | null>(null)
  let cachedData: DataPoint[] | null = null

  // Computed
  const chartData = computed<DataPoint[]>(() => {
    if (cache && cachedData) {
      return cachedData
    }

    const data = transformer 
      ? transformer(rawData.value)
      : (rawData.value as unknown as DataPoint[])

    if (cache) {
      cachedData = data
    }

    return data
  })

  const stats = computed<DataStats>(() => {
    const data = chartData.value
    const numericValues: number[] = []

    // Extract numeric values
    data.forEach(point => {
      if (typeof point === 'number') {
        numericValues.push(point)
      } else if (Array.isArray(point) && typeof point[1] === 'number') {
        numericValues.push(point[1])
      } else if (typeof point === 'object' && 'value' in point) {
        const value = point.value
        if (typeof value === 'number') {
          numericValues.push(value)
        } else if (Array.isArray(value) && typeof value[1] === 'number') {
          numericValues.push(value[1])
        }
      }
    })

    if (numericValues.length === 0) {
      return {
        count: data.length,
        min: null,
        max: null,
        sum: null,
        average: null,
        median: null,
        variance: null,
        stdDev: null
      }
    }

    const sorted = [...numericValues].sort((a, b) => a - b)
    const sum = numericValues.reduce((acc, val) => acc + val, 0)
    const average = sum / numericValues.length
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]

    const variance = numericValues.reduce((acc, val) => {
      return acc + Math.pow(val - average, 2)
    }, 0) / numericValues.length

    return {
      count: data.length,
      min: Math.min(...numericValues),
      max: Math.max(...numericValues),
      sum,
      average,
      median,
      variance,
      stdDev: Math.sqrt(variance)
    }
  })

  // Methods
  const validateData = (data: T[]): boolean => {
    error.value = null

    if (validator) {
      const result = validator(data)
      if (result !== true) {
        error.value = typeof result === 'string' ? result : 'Data validation failed'
        return false
      }
    }

    return true
  }

  const setData = (data: T[]): void => {
    if (validateData(data)) {
      rawData.value = data
      cachedData = null
      
      if (maxDataPoints && data.length > maxDataPoints) {
        rawData.value = data.slice(-maxDataPoints)
      }
    }
  }

  const appendData = (data: T | T[]): void => {
    const newData = Array.isArray(data) ? data : [data]
    const combined = [...rawData.value, ...newData]
    
    if (maxDataPoints && combined.length > maxDataPoints) {
      setData(combined.slice(-maxDataPoints))
    } else {
      setData(combined)
    }
  }

  const prependData = (data: T | T[]): void => {
    const newData = Array.isArray(data) ? data : [data]
    const combined = [...newData, ...rawData.value]
    
    if (maxDataPoints && combined.length > maxDataPoints) {
      setData(combined.slice(0, maxDataPoints))
    } else {
      setData(combined)
    }
  }

  const updateDataAt = (index: number, data: T): void => {
    if (index >= 0 && index < rawData.value.length) {
      const newData = [...rawData.value]
      newData[index] = data
      setData(newData)
    }
  }

  const removeDataAt = (index: number): void => {
    if (index >= 0 && index < rawData.value.length) {
      const newData = [...rawData.value]
      newData.splice(index, 1)
      setData(newData)
    }
  }

  const clearData = (): void => {
    setData([])
  }

  const filterData = (predicate: (item: T, index: number) => boolean): void => {
    setData(rawData.value.filter(predicate))
  }

  const sortData = (compareFn?: (a: T, b: T) => number): void => {
    const sorted = [...rawData.value].sort(compareFn)
    setData(sorted)
  }

  const getDataSlice = (start: number, end?: number): T[] => {
    return rawData.value.slice(start, end)
  }

  const loadData = async (loader: () => Promise<T[]>): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const data = await loader()
      setData(data)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load data'
    } finally {
      loading.value = false
    }
  }

  // Watch for data changes
  if (!cache) {
    watch(rawData, () => {
      cachedData = null
    }, { deep: true })
  }

  return {
    rawData,
    chartData,
    stats,
    loading,
    error,
    setData,
    appendData,
    prependData,
    updateDataAt,
    removeDataAt,
    clearData,
    filterData,
    sortData,
    getDataSlice,
    loadData
  }
}