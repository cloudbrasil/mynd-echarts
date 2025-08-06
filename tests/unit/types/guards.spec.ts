import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as guards from '../../../lib/types/guards'
import type { SeriesOption } from '../../../lib/types/echarts'

// Import test setup to ensure mocks are loaded
import '../../setup'

describe('Type Guards', () => {
  describe('isEChartsInstance', () => {
    it('should return true for valid ECharts instance', () => {
      const mockInstance = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
        getOption: vi.fn()
      }

      expect(guards.isEChartsInstance(mockInstance)).toBe(true)
    })

    it('should return false for invalid objects', () => {
      expect(guards.isEChartsInstance(null)).toBeFalsy()
      expect(guards.isEChartsInstance(undefined)).toBeFalsy()
      expect(guards.isEChartsInstance({})).toBeFalsy()
      expect(guards.isEChartsInstance({ setOption: 'not a function' })).toBeFalsy()
      expect(guards.isEChartsInstance({ 
        setOption: vi.fn(),
        resize: vi.fn() 
        // Missing dispose and getOption
      })).toBeFalsy()
    })

    it('should handle partial instances', () => {
      const partial = {
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn(),
        // Missing getOption
      }
      expect(guards.isEChartsInstance(partial)).toBe(false)
    })
  })

  describe('isEChartsOption', () => {
    it('should return true for valid ECharts options', () => {
      expect(guards.isEChartsOption({ series: [] })).toBe(true)
      expect(guards.isEChartsOption({ xAxis: {} })).toBe(true)
      expect(guards.isEChartsOption({ yAxis: {} })).toBe(true)
      expect(guards.isEChartsOption({ grid: {} })).toBe(true)
      expect(guards.isEChartsOption({ title: {} })).toBe(true)
      expect(guards.isEChartsOption({ legend: {} })).toBe(true)
      expect(guards.isEChartsOption({ tooltip: {} })).toBe(true)
    })

    it('should return true for combined options', () => {
      const complexOption = {
        title: { text: 'Chart' },
        series: [{ type: 'line', data: [1, 2, 3] }],
        xAxis: { type: 'category' },
        yAxis: { type: 'value' }
      }
      expect(guards.isEChartsOption(complexOption)).toBe(true)
    })

    it('should return false for invalid options', () => {
      expect(guards.isEChartsOption(null)).toBeFalsy()
      expect(guards.isEChartsOption(undefined)).toBeFalsy()
      expect(guards.isEChartsOption('string')).toBeFalsy()
      expect(guards.isEChartsOption(123)).toBeFalsy()
      expect(guards.isEChartsOption([])).toBeFalsy()
      expect(guards.isEChartsOption({})).toBeFalsy()
      expect(guards.isEChartsOption({ random: 'property' })).toBeFalsy()
    })
  })

  describe('Series Type Guards', () => {
    describe('isLineSeries', () => {
      it('should identify line series', () => {
        const lineSeries: SeriesOption = { type: 'line', data: [] }
        expect(guards.isLineSeries(lineSeries)).toBe(true)
      })

      it('should reject non-line series', () => {
        const barSeries: SeriesOption = { type: 'bar', data: [] }
        expect(guards.isLineSeries(barSeries)).toBe(false)
      })
    })

    describe('isBarSeries', () => {
      it('should identify bar series', () => {
        const barSeries: SeriesOption = { type: 'bar', data: [] }
        expect(guards.isBarSeries(barSeries)).toBe(true)
      })

      it('should reject non-bar series', () => {
        const pieSeries: SeriesOption = { type: 'pie', data: [] }
        expect(guards.isBarSeries(pieSeries)).toBe(false)
      })
    })

    describe('isPieSeries', () => {
      it('should identify pie series', () => {
        const pieSeries: SeriesOption = { type: 'pie', data: [] }
        expect(guards.isPieSeries(pieSeries)).toBe(true)
      })

      it('should reject non-pie series', () => {
        const lineSeries: SeriesOption = { type: 'line', data: [] }
        expect(guards.isPieSeries(lineSeries)).toBe(false)
      })
    })

    describe('isScatterSeries', () => {
      it('should identify scatter series', () => {
        const scatterSeries: SeriesOption = { type: 'scatter', data: [] }
        expect(guards.isScatterSeries(scatterSeries)).toBe(true)
      })

      it('should identify effectScatter series', () => {
        const effectScatterSeries: SeriesOption = { type: 'effectScatter', data: [] }
        expect(guards.isScatterSeries(effectScatterSeries)).toBe(true)
      })

      it('should reject non-scatter series', () => {
        const barSeries: SeriesOption = { type: 'bar', data: [] }
        expect(guards.isScatterSeries(barSeries)).toBe(false)
      })
    })

    describe('isRadarSeries', () => {
      it('should identify radar series', () => {
        const radarSeries: SeriesOption = { type: 'radar', data: [] }
        expect(guards.isRadarSeries(radarSeries)).toBe(true)
      })

      it('should reject non-radar series', () => {
        const gaugeSeries: SeriesOption = { type: 'gauge', data: [] }
        expect(guards.isRadarSeries(gaugeSeries)).toBe(false)
      })
    })

    describe('isGaugeSeries', () => {
      it('should identify gauge series', () => {
        const gaugeSeries: SeriesOption = { type: 'gauge', data: [] }
        expect(guards.isGaugeSeries(gaugeSeries)).toBe(true)
      })

      it('should reject non-gauge series', () => {
        const radarSeries: SeriesOption = { type: 'radar', data: [] }
        expect(guards.isGaugeSeries(radarSeries)).toBe(false)
      })
    })
  })

  describe('isValidRenderer', () => {
    it('should accept valid renderers', () => {
      expect(guards.isValidRenderer('canvas')).toBe(true)
      expect(guards.isValidRenderer('svg')).toBe(true)
    })

    it('should reject invalid renderers', () => {
      expect(guards.isValidRenderer('webgl')).toBe(false)
      expect(guards.isValidRenderer('invalid')).toBe(false)
      expect(guards.isValidRenderer(null)).toBe(false)
      expect(guards.isValidRenderer(undefined)).toBe(false)
      expect(guards.isValidRenderer(123)).toBe(false)
      expect(guards.isValidRenderer({})).toBe(false)
    })
  })

  describe('isValidTheme', () => {
    it('should accept string themes', () => {
      expect(guards.isValidTheme('dark')).toBe(true)
      expect(guards.isValidTheme('light')).toBe(true)
      expect(guards.isValidTheme('custom-theme')).toBe(true)
    })

    it('should accept object themes', () => {
      expect(guards.isValidTheme({})).toBe(true)
      expect(guards.isValidTheme({ color: ['#123'] })).toBe(true)
      expect(guards.isValidTheme({ 
        backgroundColor: '#fff',
        textStyle: { color: '#000' }
      })).toBe(true)
    })

    it('should reject invalid themes', () => {
      expect(guards.isValidTheme(null)).toBeFalsy()
      expect(guards.isValidTheme(undefined)).toBeFalsy()
      expect(guards.isValidTheme(123)).toBeFalsy()
      expect(guards.isValidTheme(true)).toBeFalsy()
      expect(guards.isValidTheme([])).toBeFalsy()
    })
  })

  describe('Browser Feature Detection', () => {
    describe('supportsResizeObserver', () => {
      it('should detect ResizeObserver support', () => {
        // Test environment has ResizeObserver mocked
        expect(guards.supportsResizeObserver()).toBe(true)
      })

      it('should handle missing ResizeObserver', () => {
        const original = global.ResizeObserver
        // @ts-ignore
        delete global.ResizeObserver
        
        expect(guards.supportsResizeObserver()).toBe(false)
        
        global.ResizeObserver = original
      })
    })

    describe('supportsIntersectionObserver', () => {
      it('should detect IntersectionObserver support', () => {
        // Test environment has IntersectionObserver mocked
        expect(guards.supportsIntersectionObserver()).toBe(true)
      })

      it('should handle missing IntersectionObserver', () => {
        const original = global.IntersectionObserver
        // @ts-ignore
        delete global.IntersectionObserver
        
        expect(guards.supportsIntersectionObserver()).toBe(false)
        
        global.IntersectionObserver = original
      })
    })
  })

  describe('isHTMLElement', () => {
    it('should identify HTML elements', () => {
      const div = document.createElement('div')
      const span = document.createElement('span')
      const canvas = document.createElement('canvas')

      expect(guards.isHTMLElement(div)).toBe(true)
      expect(guards.isHTMLElement(span)).toBe(true)
      expect(guards.isHTMLElement(canvas)).toBe(true)
    })

    it('should reject non-HTML elements', () => {
      expect(guards.isHTMLElement(null)).toBe(false)
      expect(guards.isHTMLElement(undefined)).toBe(false)
      expect(guards.isHTMLElement({})).toBe(false)
      expect(guards.isHTMLElement('div')).toBe(false)
      expect(guards.isHTMLElement(123)).toBe(false)
      expect(guards.isHTMLElement(document)).toBe(false)
      expect(guards.isHTMLElement(window)).toBe(false)
    })
  })

  describe('isColorString', () => {
    it('should accept hex colors', () => {
      expect(guards.isColorString('#fff')).toBe(true)
      expect(guards.isColorString('#FFF')).toBe(true)
      expect(guards.isColorString('#ffffff')).toBe(true)
      expect(guards.isColorString('#FFFFFF')).toBe(true)
      expect(guards.isColorString('#123456')).toBe(true)
      expect(guards.isColorString('#abcdef')).toBe(true)
      expect(guards.isColorString('#ABCDEF')).toBe(true)
    })

    it('should accept rgb/rgba colors', () => {
      expect(guards.isColorString('rgb(255, 255, 255)')).toBe(true)
      expect(guards.isColorString('rgba(255, 255, 255, 1)')).toBe(true)
      expect(guards.isColorString('rgba(0, 0, 0, 0.5)')).toBe(true)
      expect(guards.isColorString('rgb(0,0,0)')).toBe(true)
    })

    it('should accept hsl/hsla colors', () => {
      expect(guards.isColorString('hsl(120, 100%, 50%)')).toBe(true)
      expect(guards.isColorString('hsla(120, 100%, 50%, 0.5)')).toBe(true)
      expect(guards.isColorString('hsl(0,0%,0%)')).toBe(true)
    })

    it('should accept named colors', () => {
      expect(guards.isColorString('red')).toBe(true)
      expect(guards.isColorString('Red')).toBe(true)
      expect(guards.isColorString('RED')).toBe(true)
      expect(guards.isColorString('blue')).toBe(true)
      expect(guards.isColorString('green')).toBe(true)
      expect(guards.isColorString('black')).toBe(true)
      expect(guards.isColorString('white')).toBe(true)
      expect(guards.isColorString('orange')).toBe(true)
    })

    it('should reject invalid colors', () => {
      expect(guards.isColorString('#ff')).toBe(false) // Too short
      expect(guards.isColorString('#fffffff')).toBe(false) // Too long
      expect(guards.isColorString('#xyz')).toBe(false) // Invalid chars
      expect(guards.isColorString('notacolor')).toBe(false)
      expect(guards.isColorString(123)).toBe(false)
      expect(guards.isColorString(null)).toBe(false)
      expect(guards.isColorString(undefined)).toBe(false)
      expect(guards.isColorString({})).toBe(false)
    })
  })

  describe('isValidNumeric', () => {
    it('should accept valid numbers', () => {
      expect(guards.isValidNumeric(0)).toBe(true)
      expect(guards.isValidNumeric(123)).toBe(true)
      expect(guards.isValidNumeric(-123)).toBe(true)
      expect(guards.isValidNumeric(123.456)).toBe(true)
      expect(guards.isValidNumeric(-123.456)).toBe(true)
      expect(guards.isValidNumeric(1e6)).toBe(true)
      expect(guards.isValidNumeric(0.0001)).toBe(true)
    })

    it('should reject invalid numbers', () => {
      expect(guards.isValidNumeric(NaN)).toBe(false)
      expect(guards.isValidNumeric(Infinity)).toBe(false)
      expect(guards.isValidNumeric(-Infinity)).toBe(false)
      expect(guards.isValidNumeric('123')).toBe(false)
      expect(guards.isValidNumeric(null)).toBe(false)
      expect(guards.isValidNumeric(undefined)).toBe(false)
      expect(guards.isValidNumeric({})).toBe(false)
    })
  })

  describe('isNumericArray', () => {
    it('should accept arrays of numbers', () => {
      expect(guards.isNumericArray([])).toBe(true)
      expect(guards.isNumericArray([1, 2, 3])).toBe(true)
      expect(guards.isNumericArray([0])).toBe(true)
      expect(guards.isNumericArray([-1, -2, -3])).toBe(true)
      expect(guards.isNumericArray([1.1, 2.2, 3.3])).toBe(true)
      expect(guards.isNumericArray([1e6, 2e6, 3e6])).toBe(true)
    })

    it('should reject non-numeric arrays', () => {
      expect(guards.isNumericArray([1, 2, '3'])).toBe(false)
      expect(guards.isNumericArray([1, 2, NaN])).toBe(false)
      expect(guards.isNumericArray([1, 2, Infinity])).toBe(false)
      expect(guards.isNumericArray([1, 2, null])).toBe(false)
      expect(guards.isNumericArray(['1', '2', '3'])).toBe(false)
      expect(guards.isNumericArray(null)).toBe(false)
      expect(guards.isNumericArray(undefined)).toBe(false)
      expect(guards.isNumericArray({})).toBe(false)
      expect(guards.isNumericArray('not an array')).toBe(false)
    })
  })

  describe('deepFreeze', () => {
    it('should freeze simple objects', () => {
      const obj = { a: 1, b: 2 }
      const frozen = guards.deepFreeze(obj)

      expect(Object.isFrozen(frozen)).toBe(true)
      expect(() => {
        // @ts-ignore
        frozen.a = 2
      }).toThrow()
    })

    it('should freeze nested objects', () => {
      const obj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3
          }
        }
      }
      const frozen = guards.deepFreeze(obj)

      expect(Object.isFrozen(frozen)).toBe(true)
      expect(Object.isFrozen(frozen.b)).toBe(true)
      expect(Object.isFrozen(frozen.b.d)).toBe(true)
    })

    it('should freeze arrays', () => {
      const obj = {
        arr: [1, 2, { a: 3 }]
      }
      const frozen = guards.deepFreeze(obj)

      expect(Object.isFrozen(frozen)).toBe(true)
      expect(Object.isFrozen(frozen.arr)).toBe(true)
      expect(Object.isFrozen(frozen.arr[2])).toBe(true)
    })

    it('should handle already frozen objects', () => {
      const inner = Object.freeze({ a: 1 })
      const obj = { inner }
      const frozen = guards.deepFreeze(obj)

      expect(Object.isFrozen(frozen)).toBe(true)
      expect(frozen.inner).toBe(inner)
    })

    it('should return the same reference', () => {
      const obj = { a: 1 }
      const frozen = guards.deepFreeze(obj)
      
      expect(frozen).toBe(obj)
    })
  })
})