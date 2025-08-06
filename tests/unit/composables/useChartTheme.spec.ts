import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useChartTheme } from '../../../lib/composables/useChartTheme'

// Ensure echarts is mocked before importing
vi.mock('echarts')

describe('useChartTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Theme Registration', () => {
    it('should register a custom theme object', async () => {
      const { registerTheme } = await import('echarts')
      const customTheme = {
        color: ['#ff0000', '#00ff00', '#0000ff'],
        backgroundColor: '#f0f0f0',
        textStyle: {
          color: '#333333'
        }
      }

      const { registerTheme: register } = useChartTheme()
      register('myCustomTheme', customTheme)

      expect(registerTheme).toHaveBeenCalledWith('myCustomTheme', customTheme)
    })

    it('should add registered themes to set', () => {
      const { registerTheme, registeredThemes } = useChartTheme()
      
      registerTheme('custom1', {})
      
      expect(registeredThemes.value.has('custom1')).toBe(true)
    })

    it('should register default themes', () => {
      const { registeredThemes } = useChartTheme()
      
      expect(registeredThemes.value.has('default')).toBe(true)
      expect(registeredThemes.value.has('light')).toBe(true)
      expect(registeredThemes.value.has('dark')).toBe(true)
    })
  })

  describe('Current Theme', () => {
    it('should provide current theme ref', () => {
      const { currentTheme } = useChartTheme({ defaultTheme: 'dark' })

      expect(currentTheme.value).toBe('dark')
    })

    it('should default to "default" theme', () => {
      const { currentTheme } = useChartTheme()

      expect(currentTheme.value).toBe('default')
    })
  })

  describe('Theme Switching', () => {
    it('should switch to registered theme', async () => {
      const { currentTheme, setTheme } = useChartTheme()

      expect(currentTheme.value).toBe('default')

      setTheme('dark')
      await nextTick()

      expect(currentTheme.value).toBe('dark')
    })

    it('should warn and not switch to unregistered theme', async () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { currentTheme, setTheme } = useChartTheme()

      setTheme('unknown-theme')
      await nextTick()

      expect(consoleWarn).toHaveBeenCalledWith('Theme "unknown-theme" is not registered')
      expect(currentTheme.value).toBe('default')

      consoleWarn.mockRestore()
    })
  })

  describe('Get Methods', () => {
    it('should get current theme', () => {
      const { getTheme } = useChartTheme({ defaultTheme: 'light' })

      expect(getTheme()).toBe('light')
    })

    it('should get registered themes list', () => {
      const { getRegisteredThemes, registerTheme } = useChartTheme()

      registerTheme('custom', {})

      const themes = getRegisteredThemes()
      expect(themes).toContain('default')
      expect(themes).toContain('light')
      expect(themes).toContain('dark')
      expect(themes).toContain('custom')
    })
  })

  describe('Theme Creation', () => {
    it('should create dark theme', () => {
      const { createDarkTheme } = useChartTheme()
      const darkTheme = createDarkTheme()

      expect(darkTheme.textStyle.color).toBe('#eee')
      expect(darkTheme.title.textStyle.color).toBe('#eee')
      expect(darkTheme.title.subtextStyle.color).toBe('#aaa')
      expect(darkTheme.tooltip.backgroundColor).toContain('rgba(50, 50, 50')
      expect(darkTheme.legend.textStyle.color).toBe('#ccc')
      expect(darkTheme.xAxis.axisLabel.color).toBe('#ccc')
      expect(darkTheme.yAxis.axisLabel.color).toBe('#ccc')
    })

    it('should create light theme', () => {
      const { createLightTheme } = useChartTheme()
      const lightTheme = createLightTheme()

      expect(lightTheme.textStyle.color).toBe('#333')
      expect(lightTheme.title.textStyle.color).toBe('#333')
      expect(lightTheme.title.subtextStyle.color).toBe('#666')
      expect(lightTheme.tooltip.backgroundColor).toContain('rgba(255, 255, 255')
      expect(lightTheme.legend.textStyle.color).toBe('#333')
      expect(lightTheme.xAxis.axisLabel.color).toBe('#666')
      expect(lightTheme.yAxis.axisLabel.color).toBe('#666')
    })
  })

  describe('Integration', () => {
    it('should work with custom themes array in options', async () => {
      const { registerTheme } = await import('echarts')
      const customThemes = [
        { name: 'ocean', theme: { color: ['#00f', '#0ff'] } },
        { name: 'forest', theme: { color: ['#0f0', '#ff0'] } }
      ]

      const { registeredThemes } = useChartTheme({ themes: customThemes })

      expect(registeredThemes.value.has('ocean')).toBe(true)
      expect(registeredThemes.value.has('forest')).toBe(true)
      expect(registerTheme).toHaveBeenCalledWith('ocean', customThemes[0].theme)
      expect(registerTheme).toHaveBeenCalledWith('forest', customThemes[1].theme)
    })

    it('should maintain reactivity', async () => {
      const { currentTheme, setTheme } = useChartTheme()

      expect(currentTheme.value).toBe('default')

      setTheme('light')
      await nextTick()
      expect(currentTheme.value).toBe('light')

      setTheme('dark')
      await nextTick()
      expect(currentTheme.value).toBe('dark')
    })
  })

  describe('Return Value', () => {
    it('should return expected properties', () => {
      const result = useChartTheme()

      expect(result).toHaveProperty('currentTheme')
      expect(result).toHaveProperty('registeredThemes')
      expect(result).toHaveProperty('registerTheme')
      expect(result).toHaveProperty('setTheme')
      expect(result).toHaveProperty('getTheme')
      expect(result).toHaveProperty('getRegisteredThemes')
      expect(result).toHaveProperty('createDarkTheme')
      expect(result).toHaveProperty('createLightTheme')
    })
  })
})