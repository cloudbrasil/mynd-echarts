import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { useChartOptions } from '../../../lib/composables/useChartOptions'
import type { EChartsOption } from 'echarts'

describe('useChartOptions', () => {
  describe('Basic Functionality', () => {
    it('should initialize with empty options', () => {
      const { options, computedOptions, errors, isValid } = useChartOptions({}, {
        validateOptions: false
      })
      
      expect(options.value).toEqual({})
      expect(computedOptions.value).toEqual({})
      expect(errors.value).toEqual([])
      expect(isValid.value).toBe(true)
    })

    it('should initialize with initial options', () => {
      const initialOptions: EChartsOption = {
        title: { text: 'Test Chart' },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' }
      }
      
      const { options } = useChartOptions(initialOptions)
      
      expect(options.value).toEqual(initialOptions)
    })

    it('should merge default and initial options', () => {
      const defaultOpts = {
        tooltip: { show: true },
        legend: { show: true }
      }
      
      const initialOpts = {
        title: { text: 'Test' },
        tooltip: { trigger: 'axis' }
      }
      
      const { options } = useChartOptions(initialOpts, {
        defaultOptions: defaultOpts
      })
      
      // The mergeOptions function does shallow merge on nested objects
      expect(options.value).toEqual({
        title: { text: 'Test' },
        tooltip: { trigger: 'axis' }, // Initial options override default
        legend: { show: true }
      })
    })
  })

  describe('Options Management', () => {
    it('should set new options', () => {
      const { options, setOptions } = useChartOptions()
      
      const newOptions: EChartsOption = {
        title: { text: 'New Chart' },
        series: [{ type: 'line', data: [1, 2, 3] }]
      }
      
      setOptions(newOptions)
      
      expect(options.value).toEqual(newOptions)
    })

    it('should merge options when merge flag is true', () => {
      const { options, setOptions } = useChartOptions({
        title: { text: 'Original' },
        xAxis: { type: 'category' }
      })
      
      setOptions({
        title: { subtext: 'Subtitle' },
        yAxis: { type: 'value' }
      }, true)
      
      expect(options.value).toEqual({
        title: { text: 'Original', subtext: 'Subtitle' },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' }
      })
    })

    it('should update option by path', () => {
      const { options, updateOption } = useChartOptions({
        title: { text: 'Test' },
        legend: { show: true }
      })
      
      updateOption('title.text', 'Updated')
      expect(options.value.title).toEqual({ text: 'Updated' })
      
      updateOption('legend.orient', 'vertical')
      expect(options.value.legend).toEqual({ show: true, orient: 'vertical' })
    })

    it('should create nested objects when updating non-existent paths', () => {
      const { options, updateOption } = useChartOptions()
      
      updateOption('grid.left', '10%')
      expect(options.value.grid).toEqual({ left: '10%' })
      
      updateOption('toolbox.feature.saveAsImage.show', true)
      expect(options.value.toolbox).toEqual({
        feature: {
          saveAsImage: {
            show: true
          }
        }
      })
    })

    it('should reset to default options', () => {
      const defaultOptions = {
        title: { text: 'Default' },
        legend: { show: false }
      }
      
      const { options, setOptions, resetOptions } = useChartOptions({}, {
        defaultOptions
      })
      
      setOptions({ title: { text: 'Changed' } })
      expect(options.value.title?.text).toBe('Changed')
      
      resetOptions()
      expect(options.value).toEqual(defaultOptions)
    })

    it('should merge multiple options', () => {
      const { options, mergeOptions } = useChartOptions({
        title: { text: 'Original' }
      })
      
      mergeOptions(
        { legend: { show: true } },
        { tooltip: { show: true } },
        { title: { subtext: 'Sub' } }
      )
      
      expect(options.value).toEqual({
        title: { text: 'Original', subtext: 'Sub' },
        legend: { show: true },
        tooltip: { show: true }
      })
    })
  })

  describe('Option Retrieval', () => {
    it('should get option by path', () => {
      const { getOption } = useChartOptions({
        title: { text: 'Test', textStyle: { color: 'red' } },
        series: [{ type: 'line', data: [1, 2, 3] }]
      })
      
      expect(getOption('title.text')).toBe('Test')
      expect(getOption('title.textStyle.color')).toBe('red')
      expect(getOption('series.0.type')).toBe('line')
      expect(getOption('series.0.data.1')).toBe(2)
    })

    it('should return undefined for non-existent paths', () => {
      const { getOption } = useChartOptions({ title: { text: 'Test' } })
      
      expect(getOption('nonexistent')).toBeUndefined()
      expect(getOption('title.nonexistent')).toBeUndefined()
      expect(getOption('title.text.nonexistent')).toBeUndefined()
    })

    it('should clone current options', () => {
      const { options, cloneOptions } = useChartOptions({
        title: { text: 'Test' },
        series: [{ type: 'line', data: [1, 2, 3] }]
      })
      
      const cloned = cloneOptions()
      
      expect(cloned).toEqual(options.value)
      expect(cloned).not.toBe(options.value)
      
      // Modify cloned options
      cloned.title!.text = 'Modified'
      expect(options.value.title?.text).toBe('Test')
    })
  })

  describe('Validation', () => {
    it('should validate options structure', () => {
      const { errors, isValid, setOptions } = useChartOptions()
      
      // Valid options
      setOptions({ series: [{ type: 'line', data: [] }] })
      expect(isValid.value).toBe(true)
      expect(errors.value).toEqual([])
    })

    it('should detect missing series type', () => {
      const { errors, isValid, setOptions } = useChartOptions()
      
      setOptions({ series: [{ data: [1, 2, 3] } as any] })
      
      expect(isValid.value).toBe(false)
      expect(errors.value).toContain("Series[0] is missing required property 'type'")
    })

    it('should handle non-array series', () => {
      const { errors, setOptions } = useChartOptions()
      
      setOptions({ series: { type: 'line', data: [] } as any })
      expect(errors.value).toEqual([])
      
      setOptions({ series: { data: [] } as any })
      expect(errors.value).toContain("Series[0] is missing required property 'type'")
    })

    it('should use custom validator', () => {
      const { errors, isValid, setOptions } = useChartOptions({ series: [] }, {
        validator: (options) => {
          if (!options.title) {
            return 'Title is required'
          }
          return true
        }
      })
      
      expect(isValid.value).toBe(false)
      expect(errors.value).toContain('Title is required')
      
      setOptions({ title: { text: 'Test' }, series: [] })
      expect(isValid.value).toBe(true)
      expect(errors.value).toEqual([])
    })

    it('should handle boolean validator result', () => {
      const { errors, setOptions } = useChartOptions({ series: [] }, {
        validator: () => false
      })
      
      expect(errors.value).toContain('Custom validation failed')
      
      setOptions({ title: { text: 'Test' }, series: [] })
      expect(errors.value).toContain('Custom validation failed')
    })

    it('should skip validation when disabled', () => {
      const { errors, isValid, setOptions } = useChartOptions({}, {
        validateOptions: false
      })
      
      setOptions({ series: [{ data: [] } as any] })
      
      expect(isValid.value).toBe(true)
      expect(errors.value).toEqual([])
    })

    it('should manually validate', () => {
      const { errors, validate, setOptions } = useChartOptions({}, {
        deepWatch: false
      })
      
      setOptions({ series: [{ data: [] } as any] })
      errors.value = [] // Clear errors manually
      
      const result = validate()
      
      expect(result).toBe(false)
      expect(errors.value).toContain("Series[0] is missing required property 'type'")
    })
  })

  describe('Transformation', () => {
    it('should transform options', () => {
      const { computedOptions, setOptions } = useChartOptions({}, {
        transformer: (options) => ({
          ...options,
          backgroundColor: '#f0f0f0',
          animation: true
        })
      })
      
      setOptions({ title: { text: 'Test' } })
      
      expect(computedOptions.value).toEqual({
        title: { text: 'Test' },
        backgroundColor: '#f0f0f0',
        animation: true
      })
    })

    it('should not affect original options', () => {
      const { options, computedOptions } = useChartOptions({
        title: { text: 'Original' }
      }, {
        transformer: (opts) => ({
          ...opts,
          title: { ...opts.title, text: 'Transformed' }
        })
      })
      
      expect(options.value.title?.text).toBe('Original')
      expect(computedOptions.value.title?.text).toBe('Transformed')
    })
  })

  describe('Reactivity', () => {
    it('should watch for deep changes', async () => {
      const { options, errors, isValid } = useChartOptions({
        series: [{ type: 'line', data: [] }]
      })
      
      expect(isValid.value).toBe(true)
      
      // Modify nested property to make it invalid
      ;(options.value.series as any)[0].type = undefined
      await nextTick()
      
      expect(isValid.value).toBe(false)
      expect(errors.value).toContain("Series[0] is missing required property 'type'")
    })

    it('should not watch when deepWatch is false', async () => {
      const { options, errors } = useChartOptions({
        series: [{ type: 'line', data: [] }]
      }, {
        deepWatch: false
      })
      
      // Clear initial validation errors
      errors.value = []
      
      // Modify to make invalid
      ;(options.value.series as any)[0].type = undefined
      await nextTick()
      
      // Should not detect the change
      expect(errors.value).toEqual([])
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle complex option structures', () => {
      const { options, updateOption, getOption } = useChartOptions({
        visualMap: {
          type: 'continuous',
          min: 0,
          max: 100,
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d']
          }
        }
      })
      
      updateOption('visualMap.inRange.color.1', '#ff0000')
      
      expect(getOption('visualMap.inRange.color')).toEqual(['#50a3ba', '#ff0000', '#d94e5d'])
    })

    it('should validate complex series configurations', () => {
      const { errors, setOptions } = useChartOptions()
      
      setOptions({
        series: [
          { type: 'line', data: [] },
          { data: [] } as any,
          { type: 'bar', data: [] },
          { type: 'pie', data: [], radius: '50%' }
        ]
      })
      
      expect(errors.value).toHaveLength(1)
      expect(errors.value[0]).toContain('Series[1]')
    })

    it('should handle option inheritance in merge', () => {
      const { options, mergeOptions } = useChartOptions({
        textStyle: {
          fontFamily: 'Arial',
          fontSize: 12
        },
        title: {
          textStyle: {
            fontSize: 16
          }
        }
      })
      
      mergeOptions({
        title: {
          text: 'New Title',
          textStyle: {
            color: 'red'
          }
        }
      })
      
      // The mergeOptions function does shallow merge on nested objects
      expect(options.value.title).toEqual({
        text: 'New Title',
        textStyle: {
          color: 'red' // Overwrites the entire textStyle object
        }
      })
    })

    it('should maintain option references after operations', () => {
      const { options, setOptions, updateOption } = useChartOptions()
      
      const seriesData = [1, 2, 3, 4, 5]
      setOptions({
        series: [{ type: 'line', data: seriesData }]
      })
      
      updateOption('series.0.name', 'Test Series')
      
      // Data should be preserved
      expect((options.value.series as any)[0].data).toEqual(seriesData)
    })
  })
})