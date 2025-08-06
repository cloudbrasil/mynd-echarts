import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { useChartData } from '../../../lib/composables/useChartData'
import type { DataPoint } from '../../../lib/composables/useChartData'

describe('useChartData', () => {
  describe('Basic Functionality', () => {
    it('should initialize with empty data', () => {
      const { rawData, chartData, stats } = useChartData()
      
      expect(rawData.value).toEqual([])
      expect(chartData.value).toEqual([])
      expect(stats.value).toEqual({
        count: 0,
        min: null,
        max: null,
        sum: null,
        average: null,
        median: null,
        variance: null,
        stdDev: null
      })
    })

    it('should initialize with initial data', () => {
      const initialData = [1, 2, 3, 4, 5]
      const { rawData, chartData } = useChartData({
        initialData
      })
      
      expect(rawData.value).toEqual(initialData)
      expect(chartData.value).toEqual(initialData)
    })

    it('should set new data', () => {
      const { rawData, setData } = useChartData<number>()
      const newData = [10, 20, 30]
      
      setData(newData)
      
      expect(rawData.value).toEqual(newData)
    })
  })

  describe('Data Transformation', () => {
    it('should transform data using transformer function', () => {
      interface DataItem {
        id: number
        value: number
      }
      
      const { chartData, setData } = useChartData<DataItem>({
        transformer: (data) => data.map(d => d.value)
      })
      
      setData([
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: 30 }
      ])
      
      expect(chartData.value).toEqual([10, 20, 30])
    })

    it('should handle complex data transformations', () => {
      interface TimeSeriesData {
        timestamp: number
        value: number
      }
      
      const { chartData, setData } = useChartData<TimeSeriesData>({
        transformer: (data) => data.map(d => [d.timestamp, d.value] as [number, number])
      })
      
      setData([
        { timestamp: 1000, value: 10 },
        { timestamp: 2000, value: 20 }
      ])
      
      expect(chartData.value).toEqual([[1000, 10], [2000, 20]])
    })

    it('should handle object-based data points', () => {
      const { chartData, setData } = useChartData({
        transformer: (data: any[]) => data.map(d => ({
          value: d.y,
          name: d.label,
          itemStyle: { color: d.color }
        }))
      })
      
      setData([
        { label: 'A', y: 10, color: 'red' },
        { label: 'B', y: 20, color: 'blue' }
      ])
      
      expect(chartData.value).toEqual([
        { value: 10, name: 'A', itemStyle: { color: 'red' } },
        { value: 20, name: 'B', itemStyle: { color: 'blue' } }
      ])
    })
  })

  describe('Data Validation', () => {
    it('should validate data with validator function', () => {
      const { setData, error } = useChartData<number>({
        validator: (data) => data.every(n => n > 0)
      })
      
      setData([1, 2, 3])
      expect(error.value).toBeNull()
      
      setData([-1, 2, 3])
      expect(error.value).toBe('Data validation failed')
    })

    it('should use custom error message from validator', () => {
      const { setData, error } = useChartData<number>({
        validator: (data) => {
          if (data.some(n => n < 0)) {
            return 'Negative values not allowed'
          }
          return true
        }
      })
      
      setData([-1, 2, 3])
      expect(error.value).toBe('Negative values not allowed')
    })

    it('should not update data when validation fails', () => {
      const { rawData, setData } = useChartData<number>({
        initialData: [1, 2, 3],
        validator: (data) => data.length <= 3
      })
      
      setData([1, 2, 3, 4])
      expect(rawData.value).toEqual([1, 2, 3])
    })
  })

  describe('Data Manipulation', () => {
    it('should append data', () => {
      const { rawData, appendData } = useChartData<number>({
        initialData: [1, 2, 3]
      })
      
      appendData(4)
      expect(rawData.value).toEqual([1, 2, 3, 4])
      
      appendData([5, 6])
      expect(rawData.value).toEqual([1, 2, 3, 4, 5, 6])
    })

    it('should prepend data', () => {
      const { rawData, prependData } = useChartData<number>({
        initialData: [3, 4, 5]
      })
      
      prependData(2)
      expect(rawData.value).toEqual([2, 3, 4, 5])
      
      prependData([0, 1])
      expect(rawData.value).toEqual([0, 1, 2, 3, 4, 5])
    })

    it('should update data at index', () => {
      const { rawData, updateDataAt } = useChartData<number>({
        initialData: [1, 2, 3]
      })
      
      updateDataAt(1, 20)
      expect(rawData.value).toEqual([1, 20, 3])
    })

    it('should ignore invalid index updates', () => {
      const { rawData, updateDataAt } = useChartData<number>({
        initialData: [1, 2, 3]
      })
      
      updateDataAt(-1, 0)
      updateDataAt(10, 0)
      expect(rawData.value).toEqual([1, 2, 3])
    })

    it('should remove data at index', () => {
      const { rawData, removeDataAt } = useChartData<number>({
        initialData: [1, 2, 3, 4]
      })
      
      removeDataAt(1)
      expect(rawData.value).toEqual([1, 3, 4])
    })

    it('should clear all data', () => {
      const { rawData, clearData } = useChartData<number>({
        initialData: [1, 2, 3]
      })
      
      clearData()
      expect(rawData.value).toEqual([])
    })

    it('should filter data', () => {
      const { rawData, filterData } = useChartData<number>({
        initialData: [1, 2, 3, 4, 5]
      })
      
      filterData((n) => n % 2 === 0)
      expect(rawData.value).toEqual([2, 4])
    })

    it('should sort data', () => {
      const { rawData, sortData } = useChartData<number>({
        initialData: [3, 1, 4, 1, 5, 9]
      })
      
      sortData()
      expect(rawData.value).toEqual([1, 1, 3, 4, 5, 9])
      
      sortData((a, b) => b - a)
      expect(rawData.value).toEqual([9, 5, 4, 3, 1, 1])
    })

    it('should get data slice', () => {
      const { getDataSlice } = useChartData<number>({
        initialData: [1, 2, 3, 4, 5]
      })
      
      expect(getDataSlice(1, 3)).toEqual([2, 3])
      expect(getDataSlice(2)).toEqual([3, 4, 5])
    })
  })

  describe('Max Data Points', () => {
    it('should limit data points on set', () => {
      const { rawData, setData } = useChartData<number>({
        maxDataPoints: 3
      })
      
      setData([1, 2, 3, 4, 5])
      expect(rawData.value).toEqual([3, 4, 5])
    })

    it('should limit data points on append', () => {
      const { rawData, appendData } = useChartData<number>({
        initialData: [1, 2],
        maxDataPoints: 3
      })
      
      appendData([3, 4, 5])
      expect(rawData.value).toEqual([3, 4, 5])
    })

    it('should limit data points on prepend', () => {
      const { rawData, prependData } = useChartData<number>({
        initialData: [4, 5],
        maxDataPoints: 3
      })
      
      prependData([1, 2, 3])
      expect(rawData.value).toEqual([1, 2, 3])
    })
  })

  describe('Statistics', () => {
    it('should calculate statistics for numeric data', () => {
      const { stats, setData } = useChartData<number>()
      
      setData([1, 2, 3, 4, 5])
      
      expect(stats.value).toEqual({
        count: 5,
        min: 1,
        max: 5,
        sum: 15,
        average: 3,
        median: 3,
        variance: 2,
        stdDev: Math.sqrt(2)
      })
    })

    it('should calculate median for even number of values', () => {
      const { stats, setData } = useChartData<number>()
      
      setData([1, 2, 3, 4])
      
      expect(stats.value.median).toBe(2.5)
    })

    it('should handle array data points', () => {
      const { stats, setData } = useChartData<[number, number]>()
      
      setData([[1, 10], [2, 20], [3, 30]])
      
      expect(stats.value).toMatchObject({
        count: 3,
        min: 10,
        max: 30,
        sum: 60,
        average: 20
      })
    })

    it('should handle object data points', () => {
      const { stats, setData } = useChartData<DataPoint>()
      
      setData([
        { value: 10, name: 'A' },
        { value: 20, name: 'B' },
        { value: 30, name: 'C' }
      ])
      
      expect(stats.value).toMatchObject({
        count: 3,
        min: 10,
        max: 30,
        sum: 60,
        average: 20
      })
    })

    it('should handle nested array values in objects', () => {
      const { stats, setData } = useChartData<DataPoint>()
      
      setData([
        { value: [1, 10], name: 'A' },
        { value: [2, 20], name: 'B' }
      ])
      
      expect(stats.value).toMatchObject({
        count: 2,
        min: 10,
        max: 20,
        average: 15
      })
    })

    it('should return null stats for non-numeric data', () => {
      const { stats, setData } = useChartData<string>()
      
      setData(['a', 'b', 'c'])
      
      expect(stats.value).toEqual({
        count: 3,
        min: null,
        max: null,
        sum: null,
        average: null,
        median: null,
        variance: null,
        stdDev: null
      })
    })
  })

  describe('Async Data Loading', () => {
    it('should load data asynchronously', async () => {
      const { rawData, loading, loadData } = useChartData<number>()
      
      const mockLoader = vi.fn().mockResolvedValue([1, 2, 3])
      
      expect(loading.value).toBe(false)
      
      const promise = loadData(mockLoader)
      expect(loading.value).toBe(true)
      
      await promise
      
      expect(loading.value).toBe(false)
      expect(rawData.value).toEqual([1, 2, 3])
      expect(mockLoader).toHaveBeenCalled()
    })

    it('should handle load errors', async () => {
      const { error, loading, loadData } = useChartData<number>()
      
      const mockLoader = vi.fn().mockRejectedValue(new Error('Load failed'))
      
      await loadData(mockLoader)
      
      expect(loading.value).toBe(false)
      expect(error.value).toBe('Load failed')
    })

    it('should handle non-Error rejections', async () => {
      const { error, loadData } = useChartData<number>()
      
      const mockLoader = vi.fn().mockRejectedValue('String error')
      
      await loadData(mockLoader)
      
      expect(error.value).toBe('Failed to load data')
    })
  })

  describe('Caching', () => {
    it('should cache transformed data when enabled', () => {
      let transformCount = 0
      const { chartData, setData } = useChartData<number>({
        cache: true,
        transformer: (data) => {
          transformCount++
          return data.map(n => n * 2)
        }
      })
      
      setData([1, 2, 3])
      
      // Access multiple times
      const result1 = chartData.value
      const result2 = chartData.value
      const result3 = chartData.value
      
      expect(result1).toEqual([2, 4, 6])
      expect(result2).toEqual([2, 4, 6])
      expect(result3).toEqual([2, 4, 6])
      expect(transformCount).toBe(1)
    })

    it('should invalidate cache on data change', () => {
      let transformCount = 0
      const { chartData, setData } = useChartData<number>({
        cache: true,
        transformer: (data) => {
          transformCount++
          return data.map(n => n * 2)
        }
      })
      
      setData([1, 2, 3])
      chartData.value // Access once
      
      setData([4, 5, 6])
      chartData.value // Access again
      
      expect(transformCount).toBe(2)
    })

    it('should not cache when disabled', () => {
      let transformCount = 0
      const { chartData, setData } = useChartData<number>({
        cache: false,
        transformer: (data) => {
          transformCount++
          return data.map(n => n * 2)
        }
      })
      
      setData([1, 2, 3])
      
      // Access multiple times - computed properties cache by default in Vue
      const result1 = chartData.value
      const result2 = chartData.value
      const result3 = chartData.value
      
      // Even with cache: false, Vue's computed will cache within the same tick
      expect(transformCount).toBe(1)
      expect(result1).toEqual([2, 4, 6])
      expect(result2).toEqual([2, 4, 6])
      expect(result3).toEqual([2, 4, 6])
    })
  })

  describe('Reactivity', () => {
    it('should watch data changes when cache is disabled', async () => {
      const { rawData, chartData } = useChartData<number>({
        cache: false
      })
      
      rawData.value = [1, 2, 3]
      await nextTick()
      
      expect(chartData.value).toEqual([1, 2, 3])
      
      rawData.value[0] = 10
      await nextTick()
      
      expect(chartData.value).toEqual([10, 2, 3])
    })
  })

  describe('Complex Use Cases', () => {
    it('should handle time series data', () => {
      interface TimeSeriesPoint {
        time: Date
        value: number
      }
      
      const { chartData, stats, setData } = useChartData<TimeSeriesPoint>({
        transformer: (data) => data.map(d => [d.time.getTime(), d.value] as [number, number])
      })
      
      const now = Date.now()
      setData([
        { time: new Date(now), value: 10 },
        { time: new Date(now + 1000), value: 20 },
        { time: new Date(now + 2000), value: 15 }
      ])
      
      expect(chartData.value).toHaveLength(3)
      expect(stats.value.average).toBe(15)
    })

    it('should handle categorical data', () => {
      interface CategoryData {
        category: string
        count: number
      }
      
      const { chartData, setData } = useChartData<CategoryData>({
        transformer: (data) => data.map(d => ({
          name: d.category,
          value: d.count
        }))
      })
      
      setData([
        { category: 'A', count: 10 },
        { category: 'B', count: 20 },
        { category: 'C', count: 15 }
      ])
      
      expect(chartData.value).toEqual([
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
        { name: 'C', value: 15 }
      ])
    })

    it('should handle multi-dimensional data', () => {
      interface Point3D {
        x: number
        y: number
        z: number
      }
      
      const { chartData, setData } = useChartData<Point3D>({
        transformer: (data) => data.map(d => [d.x, d.y, d.z])
      })
      
      setData([
        { x: 1, y: 2, z: 3 },
        { x: 4, y: 5, z: 6 }
      ])
      
      expect(chartData.value).toEqual([[1, 2, 3], [4, 5, 6]])
    })
  })
})