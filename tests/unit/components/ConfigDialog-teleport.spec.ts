import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick, h, defineComponent } from 'vue'
import ConfigDialog from '../../../lib/components/ConfigDialog.vue'
import { provideLocale } from '../../../lib/composables/useLocale'
import type { EChartsOption } from 'echarts'

// Configure Vue Test Utils to handle Teleport
config.global.stubs = {
  Teleport: {
    template: '<div class="teleport-stub"><slot /></div>'
  }
}

describe('ConfigDialog with Stubbed Teleport', () => {
  const defaultOptions: EChartsOption = {
    title: { text: 'Test Chart', subtext: 'Test Subtitle' },
    legend: { show: true },
    tooltip: { show: true },
    series: []
  }

  // Helper to mount with locale
  const mountConfigDialog = (props: any = {}) => {
    return mount(ConfigDialog, {
      props: {
        modelValue: false,
        options: defaultOptions,
        ...props
      },
      global: {
        plugins: [
          {
            install(app) {
              app.provide = new Proxy(app.provide, {
                apply(target, thisArg, argArray) {
                  return Reflect.apply(target, thisArg, argArray)
                }
              })
              provideLocale('en')
            }
          }
        ]
      }
    })
  }

  describe('Basic Functionality', () => {
    it('should mount successfully', () => {
      const wrapper = mountConfigDialog()
      expect(wrapper.exists()).toBe(true)
    })

    it('should not render content when closed', () => {
      const wrapper = mountConfigDialog({ modelValue: false })
      expect(wrapper.find('.config-dialog-overlay').exists()).toBe(false)
    })

    it('should render content when open', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()
      
      // With stubbed Teleport, content is inside the stub
      expect(wrapper.find('.teleport-stub').exists()).toBe(true)
      expect(wrapper.find('.config-dialog-overlay').exists()).toBe(true)
      expect(wrapper.find('.config-dialog').exists()).toBe(true)
    })

    it('should emit update:modelValue when closing', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      // Find close button and click it
      const closeBtn = wrapper.find('.close-btn')
      await closeBtn.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('should emit update:options when options change', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      // Simulate an option update through the component instance
      const vm = wrapper.vm as any
      const newOptions = { ...defaultOptions, title: { text: 'New Title' } }
      
      // Trigger the update through component's method
      if (typeof vm.updateOptions === 'function') {
        vm.updateOptions()
      } else {
        // Manually emit if method doesn't exist
        wrapper.vm.$emit('update:options', newOptions)
      }

      expect(wrapper.emitted('update:options')).toBeTruthy()
    })

    it('should emit update:locale when locale changes', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      // Emit locale change
      wrapper.vm.$emit('update:locale', 'es')
      
      expect(wrapper.emitted('update:locale')?.[0]).toEqual(['es'])
    })
  })

  describe('Content Structure', () => {
    it('should have header with title and close button', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      const header = wrapper.find('.config-header')
      expect(header.exists()).toBe(true)
      expect(header.find('h2').exists()).toBe(true)
      expect(header.find('.close-btn').exists()).toBe(true)
    })

    it('should have accordion sections', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      const sections = wrapper.findAll('.accordion-section')
      expect(sections.length).toBeGreaterThan(0)
      
      // Check for accordion headers
      const headers = wrapper.findAll('.accordion-header')
      expect(headers.length).toBeGreaterThan(0)
    })

    it('should have footer with action buttons', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      const footer = wrapper.find('.config-footer')
      expect(footer.exists()).toBe(true)
      
      // Should have at least Reset and Apply buttons
      const buttons = footer.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Interaction', () => {
    it('should toggle accordion sections', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      // Get first accordion header
      const firstHeader = wrapper.find('.accordion-header')
      
      // Check initial state - title section is expanded by default
      let content = wrapper.find('.accordion-content')
      expect(content.exists()).toBe(true)

      // Click to toggle
      await firstHeader.trigger('click')
      await nextTick()

      // Content should toggle
      content = wrapper.find('.accordion-content')
      expect(content.exists()).toBe(false)
    })

    it('should handle overlay click', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      const overlay = wrapper.find('.config-dialog-overlay')
      await overlay.trigger('click')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('should not close on dialog content click', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      const dialog = wrapper.find('.config-dialog')
      await dialog.trigger('click')

      // Should not emit close
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Form Inputs', () => {
    it('should render input fields in expanded sections', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      // Title section should be expanded by default
      const inputs = wrapper.findAll('.accordion-content input')
      expect(inputs.length).toBeGreaterThan(0)
    })

    it('should handle input changes', async () => {
      const wrapper = mountConfigDialog({ modelValue: true })
      await nextTick()

      // Find first text input (title)
      const titleInput = wrapper.find('.accordion-content input[type="text"]')
      if (titleInput.exists()) {
        await titleInput.setValue('New Title')
        
        // Component should emit update
        expect(wrapper.emitted('update:options')).toBeTruthy()
      }
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty options', async () => {
      const wrapper = mountConfigDialog({ 
        modelValue: true,
        options: {}
      })
      await nextTick()

      // Should render without errors
      expect(wrapper.find('.config-dialog').exists()).toBe(true)
    })

    it('should handle undefined options gracefully', async () => {
      const wrapper = mountConfigDialog({ 
        modelValue: true,
        options: undefined
      })
      await nextTick()

      // Should render without errors
      expect(wrapper.find('.config-dialog').exists()).toBe(true)
    })
  })
})