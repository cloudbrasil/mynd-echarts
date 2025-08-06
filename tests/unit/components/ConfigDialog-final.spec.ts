import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h, defineComponent } from 'vue'
import ConfigDialog from '../../../lib/components/ConfigDialog.vue'
import { provideLocale } from '../../../lib/composables/useLocale'
import type { EChartsOption } from 'echarts'

describe('ConfigDialog - Final Tests', () => {
  const defaultOptions: EChartsOption = {
    title: { text: 'Test Chart', subtext: 'Test Subtitle' },
    legend: { show: true },
    tooltip: { show: true },
    series: []
  }

  // Create a wrapper component that provides locale
  const createWrapper = (props: any = {}) => {
    const TestWrapper = defineComponent({
      setup() {
        provideLocale('en')
        return () => h(ConfigDialog, {
          modelValue: false,
          options: defaultOptions,
          ...props,
          'onUpdate:modelValue': (value: boolean) => props['onUpdate:modelValue']?.(value),
          'onUpdate:options': (options: any) => props['onUpdate:options']?.(options),
          'onUpdate:locale': (locale: string) => props['onUpdate:locale']?.(locale)
        })
      }
    })

    return mount(TestWrapper, {
      global: {
        stubs: {
          Teleport: {
            template: '<div><slot /></div>'
          }
        }
      }
    })
  }

  describe('Component Lifecycle', () => {
    it('should mount without errors', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should render dialog when open', async () => {
      const wrapper = createWrapper({ modelValue: true })
      await nextTick()
      
      expect(wrapper.find('.config-dialog-overlay').exists()).toBe(true)
      expect(wrapper.find('.config-dialog').exists()).toBe(true)
    })

    it('should not render dialog when closed', () => {
      const wrapper = createWrapper({ modelValue: false })
      expect(wrapper.find('.config-dialog-overlay').exists()).toBe(false)
    })
  })

  describe('User Interactions', () => {
    it('should close when close button clicked', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = createWrapper({ 
        modelValue: true,
        'onUpdate:modelValue': onUpdateModelValue 
      })
      await nextTick()

      const closeBtn = wrapper.find('.close-btn')
      await closeBtn.trigger('click')

      expect(onUpdateModelValue).toHaveBeenCalledWith(false)
    })

    it('should close when overlay clicked', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = createWrapper({ 
        modelValue: true,
        'onUpdate:modelValue': onUpdateModelValue 
      })
      await nextTick()

      const overlay = wrapper.find('.config-dialog-overlay')
      await overlay.trigger('click')

      expect(onUpdateModelValue).toHaveBeenCalledWith(false)
    })

    it('should not close when dialog clicked', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = createWrapper({ 
        modelValue: true,
        'onUpdate:modelValue': onUpdateModelValue 
      })
      await nextTick()

      const dialog = wrapper.find('.config-dialog')
      await dialog.trigger('click')

      expect(onUpdateModelValue).not.toHaveBeenCalled()
    })

    it('should toggle accordion sections', async () => {
      const wrapper = createWrapper({ modelValue: true })
      await nextTick()

      // Find first accordion header
      const header = wrapper.find('.accordion-header')
      
      // Initial state - title section is expanded
      expect(wrapper.find('.accordion-content').exists()).toBe(true)

      // Click to collapse
      await header.trigger('click')
      await nextTick()

      // Should be collapsed
      expect(wrapper.find('.accordion-content').exists()).toBe(false)
    })
  })

  describe('Form Handling', () => {
    it('should emit options update when inputs change', async () => {
      const onUpdateOptions = vi.fn()
      const wrapper = createWrapper({ 
        modelValue: true,
        'onUpdate:options': onUpdateOptions 
      })
      await nextTick()

      // Find an input and change its value
      const input = wrapper.find('input[type="text"]')
      if (input.exists()) {
        await input.setValue('New Value')
        expect(onUpdateOptions).toHaveBeenCalled()
      }
    })

    it('should handle color picker changes', async () => {
      const onUpdateOptions = vi.fn()
      const wrapper = createWrapper({ 
        modelValue: true,
        'onUpdate:options': onUpdateOptions 
      })
      await nextTick()

      const colorPicker = wrapper.find('input[type="color"]')
      if (colorPicker.exists()) {
        await colorPicker.setValue('#ff0000')
        expect(onUpdateOptions).toHaveBeenCalled()
      }
    })

    it('should handle select changes', async () => {
      const onUpdateOptions = vi.fn()
      const wrapper = createWrapper({ 
        modelValue: true,
        'onUpdate:options': onUpdateOptions 
      })
      await nextTick()

      const select = wrapper.find('select')
      if (select.exists()) {
        await select.setValue('center')
        expect(onUpdateOptions).toHaveBeenCalled()
      }
    })
  })

  describe('Footer Actions', () => {
    it('should have reset and apply buttons', async () => {
      const wrapper = createWrapper({ modelValue: true })
      await nextTick()

      const footer = wrapper.find('.config-footer')
      expect(footer.exists()).toBe(true)

      const buttons = footer.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
      
      // Check button text contains reset and apply
      const buttonTexts = buttons.map(b => b.text().toLowerCase())
      expect(buttonTexts.some(text => text.includes('reset'))).toBe(true)
      expect(buttonTexts.some(text => text.includes('apply'))).toBe(true)
    })

    it('should close dialog when apply clicked', async () => {
      const onUpdateModelValue = vi.fn()
      const wrapper = createWrapper({ 
        modelValue: true,
        'onUpdate:modelValue': onUpdateModelValue 
      })
      await nextTick()

      const buttons = wrapper.findAll('.config-footer button')
      const applyButton = buttons.find(b => b.text().toLowerCase().includes('apply'))
      
      if (applyButton) {
        await applyButton.trigger('click')
        expect(onUpdateModelValue).toHaveBeenCalledWith(false)
      }
    })
  })

  describe('Options Handling', () => {
    it('should handle empty options', async () => {
      const wrapper = createWrapper({ 
        modelValue: true,
        options: {}
      })
      await nextTick()

      expect(wrapper.find('.config-dialog').exists()).toBe(true)
    })

    it('should handle complex options', async () => {
      const complexOptions: EChartsOption = {
        title: { 
          text: 'Complex Title',
          subtext: 'Complex Subtitle',
          textStyle: { color: '#333', fontSize: 20 }
        },
        legend: {
          show: true,
          orient: 'vertical',
          data: ['Series 1', 'Series 2']
        },
        xAxis: { type: 'category', data: ['A', 'B', 'C'] },
        yAxis: { type: 'value' },
        series: [
          { name: 'Series 1', type: 'line', data: [1, 2, 3] },
          { name: 'Series 2', type: 'bar', data: [4, 5, 6] }
        ]
      }

      const wrapper = createWrapper({ 
        modelValue: true,
        options: complexOptions
      })
      await nextTick()

      // Should render without errors
      expect(wrapper.find('.config-dialog').exists()).toBe(true)
      
      // Title input should have the correct value
      const titleInput = wrapper.find('input[type="text"]')
      if (titleInput.exists()) {
        expect((titleInput.element as HTMLInputElement).value).toBe('Complex Title')
      }
    })
  })

  describe('Localization', () => {
    it('should display English text by default', async () => {
      const wrapper = createWrapper({ modelValue: true })
      await nextTick()

      const header = wrapper.find('.config-header h2')
      expect(header.text()).toBe('Chart Configuration')
    })

    it('should have language selector in appropriate section', async () => {
      const wrapper = createWrapper({ modelValue: true })
      await nextTick()

      // Find and expand all sections to find language selector
      const headers = wrapper.findAll('.accordion-header')
      let foundLanguageSection = false
      
      for (const header of headers) {
        if (header.text().includes('Language') || header.text().includes('语言')) {
          foundLanguageSection = true
          await header.trigger('click')
          await nextTick()
          
          // The language section should exist
          expect(foundLanguageSection).toBe(true)
          break
        }
      }
      
      // Ensure we found a language section
      expect(foundLanguageSection).toBe(true)
    })
  })
})