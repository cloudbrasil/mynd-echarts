import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, defineComponent, h, ref, reactive, computed, watch, onMounted } from 'vue'

// Mock echarts before imports
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    clear: vi.fn(),
    getOption: vi.fn(() => ({})),
    on: vi.fn(),
    off: vi.fn(),
    showLoading: vi.fn(),
    hideLoading: vi.fn(),
    isDisposed: vi.fn(() => false),
    getDom: vi.fn(() => document.createElement('div')),
    getWidth: vi.fn(() => 600),
    getHeight: vi.fn(() => 400),
    getDataURL: vi.fn(() => 'data:image/png;base64,test'),
    convertToPixel: vi.fn(() => [100, 200]),
    convertFromPixel: vi.fn(() => [10, 20]),
    containPixel: vi.fn(() => true),
    dispatchAction: vi.fn(),
    group: ''
  })),
  registerTheme: vi.fn(),
  use: vi.fn()
}))

// Import all composables
import { useECharts } from '../../lib/composables/useECharts'
import { useChartAnimation } from '../../lib/composables/useChartAnimation'
import { useChartData } from '../../lib/composables/useChartData'
import { useChartEvents } from '../../lib/composables/useChartEvents'
import { useChartOptions } from '../../lib/composables/useChartOptions'
import { useChartResize } from '../../lib/composables/useChartResize'
import { useChartTheme } from '../../lib/composables/useChartTheme'
import { useToast, toasts } from '../../lib/composables/useToast'
import { provideLocale, useLocale, useTranslation } from '../../lib/composables/useLocale'

// Import locale functions
import { getLocale } from '../../lib/locales'
import * as localeIndex from '../../lib/locales/index'
import enMessages from '../../lib/locales/en'
import zhCNMessages from '../../lib/locales/zh-CN'
import esMessages from '../../lib/locales/es'
import frMessages from '../../lib/locales/fr'
import ptBRMessages from '../../lib/locales/pt-BR'
import deMessages from '../../lib/locales/de'
import jaMessages from '../../lib/locales/ja'
import koMessages from '../../lib/locales/ko'
import ruMessages from '../../lib/locales/ru'
import itMessages from '../../lib/locales/it'

// Import all from composables index
import * as composablesIndex from '../../lib/composables/index'

describe('Coverage Boost Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    toasts.value = []
  })

  describe('Composables Index', () => {
    it('should export all composables', () => {
      expect(composablesIndex.useECharts).toBeDefined()
      expect(composablesIndex.useChartAnimation).toBeDefined()
      expect(composablesIndex.useChartData).toBeDefined()
      expect(composablesIndex.useChartEvents).toBeDefined()
      expect(composablesIndex.useChartOptions).toBeDefined()
      expect(composablesIndex.useChartResize).toBeDefined()
      expect(composablesIndex.useChartTheme).toBeDefined()
      expect(composablesIndex.useToast).toBeDefined()
      expect(composablesIndex.useLocale).toBeDefined()
      expect(composablesIndex.useTranslation).toBeDefined()
      expect(composablesIndex.provideLocale).toBeDefined()
    })
  })

  describe('Locale Messages', () => {
    it('should have all required locale messages', () => {
      // Test all locale files directly
      expect(enMessages).toBeDefined()
      expect(zhCNMessages).toBeDefined()
      expect(esMessages).toBeDefined()
      expect(frMessages).toBeDefined()
      expect(ptBRMessages).toBeDefined()
      expect(deMessages).toBeDefined()
      expect(jaMessages).toBeDefined()
      expect(koMessages).toBeDefined()
      expect(ruMessages).toBeDefined()
      expect(itMessages).toBeDefined()

      // Test locale structure
      const locales = [enMessages, zhCNMessages, esMessages, frMessages, ptBRMessages, deMessages, jaMessages, koMessages, ruMessages, itMessages]
      locales.forEach(locale => {
        expect(locale.configDialog).toBeDefined()
        expect(locale.configDialog.title).toBeDefined()
        expect(locale.chartTypes).toBeDefined()
        expect(locale.chartConfig).toBeDefined()
      })
    })

    it('should get locale through index', () => {
      expect(localeIndex.getLocale('en')).toBe(enMessages)
      expect(localeIndex.getLocale('zh-CN')).toBe(zhCNMessages)
      expect(localeIndex.getLocale('es')).toBe(esMessages)
      expect(localeIndex.getLocale('fr')).toBe(frMessages)
      expect(localeIndex.getLocale('pt-BR')).toBe(ptBRMessages)
      expect(localeIndex.getLocale('de')).toBe(deMessages)
      expect(localeIndex.getLocale('ja')).toBe(jaMessages)
      expect(localeIndex.getLocale('ko')).toBe(koMessages)
      expect(localeIndex.getLocale('ru')).toBe(ruMessages)
      expect(localeIndex.getLocale('it')).toBe(itMessages)
      
      // Test fallback
      expect(localeIndex.getLocale('invalid' as any)).toBe(enMessages)
    })
  })

  describe('useChartAnimation', () => {
    it('should manage animation options', () => {
      const chartRef = ref({
        setOption: vi.fn()
      })

      const TestComponent = defineComponent({
        setup() {
          const { animationOptions, setAnimationOptions, applyAnimation } = useChartAnimation(chartRef)
          return { animationOptions, setAnimationOptions, applyAnimation }
        },
        template: '<div></div>'
      })

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      // Test default options
      expect(vm.animationOptions.animation).toBe(true)
      expect(vm.animationOptions.animationDuration).toBe(1000)

      // Test setting options
      vm.setAnimationOptions({
        animation: false,
        animationDuration: 2000,
        animationEasing: 'linear'
      })
      expect(vm.animationOptions.animation).toBe(false)
      expect(vm.animationOptions.animationDuration).toBe(2000)

      // Test applying animation
      vm.applyAnimation({ series: [] })
      expect(chartRef.value.setOption).toHaveBeenCalledWith(
        expect.objectContaining({
          animation: false,
          animationDuration: 2000
        })
      )
    })

    it('should handle animation lifecycle methods', () => {
      const chartRef = ref({
        setOption: vi.fn()
      })

      const TestComponent = defineComponent({
        setup() {
          const animation = useChartAnimation(chartRef)
          return animation
        },
        template: '<div></div>'
      })

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      // Test animation methods
      vm.enableAnimation()
      expect(vm.animationOptions.animation).toBe(true)

      vm.disableAnimation()
      expect(vm.animationOptions.animation).toBe(false)

      vm.setAnimationDuration(3000)
      expect(vm.animationOptions.animationDuration).toBe(3000)

      vm.setAnimationEasing('cubicOut')
      expect(vm.animationOptions.animationEasing).toBe('cubicOut')

      vm.setAnimationDelay(500)
      expect(vm.animationOptions.animationDelay).toBe(500)
    })
  })

  describe('useChartData', () => {
    it('should transform and process data', () => {
      const TestComponent = defineComponent({
        setup() {
          const chartData = useChartData()
          return chartData
        },
        template: '<div></div>'
      })

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      // Test data transformation
      const data = [1, 2, 3, 4, 5]
      const transformed = vm.transformData(data, (v: number) => v * 2)
      expect(transformed).toEqual([2, 4, 6, 8, 10])

      // Test aggregation
      const aggregated = vm.aggregateData(data, 'sum')
      expect(aggregated).toBe(15)

      expect(vm.aggregateData(data, 'average')).toBe(3)
      expect(vm.aggregateData(data, 'min')).toBe(1)
      expect(vm.aggregateData(data, 'max')).toBe(5)
      expect(vm.aggregateData(data, 'count')).toBe(5)

      // Test filtering
      const filtered = vm.filterData(data, (v: number) => v > 3)
      expect(filtered).toEqual([4, 5])

      // Test sorting
      const unsorted = [3, 1, 4, 1, 5]
      expect(vm.sortData(unsorted, 'asc')).toEqual([1, 1, 3, 4, 5])
      expect(vm.sortData(unsorted, 'desc')).toEqual([5, 4, 3, 1, 1])

      // Test grouping
      const items = [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 },
        { category: 'A', value: 3 }
      ]
      const grouped = vm.groupData(items, 'category')
      expect(grouped['A']).toHaveLength(2)
      expect(grouped['B']).toHaveLength(1)
    })

    it('should create series data', () => {
      const TestComponent = defineComponent({
        setup() {
          const { createSeriesData } = useChartData()
          return { createSeriesData }
        },
        template: '<div></div>'
      })

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      const series = vm.createSeriesData('line', [1, 2, 3], { name: 'Test' })
      expect(series.type).toBe('line')
      expect(series.data).toEqual([1, 2, 3])
      expect(series.name).toBe('Test')
    })
  })

  describe('useChartEvents', () => {
    it('should manage chart events', () => {
      const mockChart = {
        on: vi.fn(),
        off: vi.fn()
      }
      const chartRef = ref(mockChart)

      const TestComponent = defineComponent({
        setup() {
          const events = useChartEvents(chartRef)
          return events
        },
        template: '<div></div>'
      })

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      // Test event registration
      const handler = vi.fn()
      vm.onChartEvent('click', handler)
      expect(mockChart.on).toHaveBeenCalledWith('click', handler)

      // Test event removal
      vm.offChartEvent('click', handler)
      expect(mockChart.off).toHaveBeenCalledWith('click', handler)

      // Test event handlers map
      const clickHandler = vi.fn()
      vm.registerEventHandler('click', clickHandler)
      expect(vm.eventHandlers.click).toBe(clickHandler)

      vm.unregisterEventHandler('click')
      expect(vm.eventHandlers.click).toBeUndefined()

      // Test clear all
      vm.registerEventHandler('click', vi.fn())
      vm.registerEventHandler('mouseover', vi.fn())
      vm.clearEventHandlers()
      expect(Object.keys(vm.eventHandlers)).toHaveLength(0)
    })
  })

  describe('useChartOptions', () => {
    it('should manage and merge chart options', () => {
      const TestComponent = defineComponent({
        setup() {
          const options = useChartOptions()
          return options
        },
        template: '<div></div>'
      })

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      // Test merging options
      const base = { title: { text: 'Base' }, series: [] }
      const override = { title: { subtext: 'Override' }, legend: { show: true } }
      const merged = vm.mergeOptions(base, override)
      
      expect(merged.title.text).toBe('Base')
      expect(merged.title.subtext).toBe('Override')
      expect(merged.legend.show).toBe(true)

      // Test setting options
      vm.setChartOptions({ xAxis: { type: 'category' } })
      expect(vm.chartOptions.xAxis.type).toBe('category')

      // Test updating options
      vm.updateChartOptions({ yAxis: { type: 'value' } })
      expect(vm.chartOptions.yAxis.type).toBe('value')
      expect(vm.chartOptions.xAxis.type).toBe('category') // Should preserve existing

      // Test reset
      vm.resetChartOptions()
      expect(vm.chartOptions).toEqual({})

      // Test validation
      expect(vm.validateOptions({ series: [] })).toBe(true)
      expect(vm.validateOptions(null)).toBe(false)
      expect(vm.validateOptions('invalid')).toBe(false)
    })
  })

  describe('useChartResize', () => {
    it('should handle chart resizing in component context', () => {
      const TestComponent = defineComponent({
        setup() {
          const elementRef = ref<HTMLElement>()
          const chartRef = ref({
            resize: vi.fn()
          })
          
          const resize = useChartResize(elementRef, chartRef)
          
          onMounted(() => {
            elementRef.value = document.createElement('div')
          })
          
          return { ...resize, elementRef, chartRef }
        },
        template: '<div ref="elementRef"></div>'
      })

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      // Test resize function
      vm.resizeChart()
      expect(vm.chartRef.resize).toHaveBeenCalled()

      // Test auto resize toggle
      expect(vm.isAutoResize).toBe(true)
      vm.setAutoResize(false)
      expect(vm.isAutoResize).toBe(false)
    })
  })

  describe('useChartTheme', () => {
    it('should manage chart themes', () => {
      const TestComponent = defineComponent({
        setup() {
          const theme = useChartTheme()
          return theme
        },
        template: '<div></div>'
      })

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      // Test default theme
      expect(vm.currentTheme).toBe('default')

      // Test theme switching
      vm.setTheme('dark')
      expect(vm.currentTheme).toBe('dark')

      // Test available themes
      expect(vm.availableThemes).toContain('default')
      expect(vm.availableThemes).toContain('dark')

      // Test theme validation
      expect(vm.isValidTheme('dark')).toBe(true)
      expect(vm.isValidTheme('invalid')).toBe(false)

      // Test getting theme config
      const config = vm.getThemeConfig('dark')
      expect(config).toBeDefined()
      expect(config.backgroundColor).toBeDefined()
    })
  })

  describe('useToast', () => {
    it('should manage toasts', () => {
      const { success, warning, danger, info, clear, removeToast } = useToast()

      // Test creating toasts
      const id1 = success('Success!')
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0].type).toBe('success')

      const id2 = warning('Warning!')
      const id3 = danger('Danger!')
      const id4 = info('Info!')
      expect(toasts.value).toHaveLength(4)

      // Test removing specific toast
      removeToast(id2)
      expect(toasts.value).toHaveLength(3)
      expect(toasts.value.find(t => t.id === id2)).toBeUndefined()

      // Test clearing all
      clear()
      expect(toasts.value).toHaveLength(0)

      // Test with custom duration
      success('Test', 0) // No auto-remove
      expect(toasts.value).toHaveLength(1)
    })
  })

  describe('useLocale and useTranslation', () => {
    it('should work in component context', () => {
      const TestComponent = defineComponent({
        setup() {
          const context = provideLocale('en')
          const { locale } = useLocale()
          const { t, messages } = useTranslation()
          
          return { locale, t, messages, setLocale: context.setLocale }
        },
        template: '<div>{{ t("configDialog.title") }}</div>'
      })

      const wrapper = mount(TestComponent)
      const vm = wrapper.vm as any

      expect(vm.locale).toBe('en')
      expect(wrapper.text()).toBe('Chart Configuration')
      expect(vm.messages.configDialog).toBeDefined()

      // Test locale switching
      vm.setLocale('es')
      expect(vm.locale).toBe('es')
    })
  })
})