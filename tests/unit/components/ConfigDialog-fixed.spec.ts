import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConfigDialog from '../../../lib/components/ConfigDialog.vue'
import { mountWithLocale } from '../../test-helpers'
import type { EChartsOption } from 'echarts'

describe('ConfigDialog - Fixed Teleport Tests', () => {
  let teleportTarget: HTMLElement

  beforeEach(() => {
    // Create and attach teleport target before each test
    teleportTarget = document.createElement('div')
    teleportTarget.id = 'config-dialog-teleport'
    document.body.appendChild(teleportTarget)
  })

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = ''
  })

  const defaultOptions: EChartsOption = {
    title: { text: 'Test Chart', subtext: 'Test Subtitle' },
    legend: { show: true },
    tooltip: { show: true },
    series: []
  }

  // Helper function to query elements in the teleported content
  const queryTeleported = (selector: string): Element | null => {
    return document.body.querySelector(selector)
  }

  const queryAllTeleported = (selector: string): NodeListOf<Element> => {
    return document.body.querySelectorAll(selector)
  }

  // Helper to trigger events on teleported elements
  const triggerTeleported = async (selector: string, event: string) => {
    const element = queryTeleported(selector) as HTMLElement
    if (element) {
      if (event === 'click') {
        element.click()
      } else {
        element.dispatchEvent(new Event(event, { bubbles: true }))
      }
      await nextTick()
    }
  }

  describe('Component Mounting', () => {
    it('should not render dialog when modelValue is false', async () => {
      mountWithLocale(ConfigDialog, {
        props: {
          modelValue: false,
          options: defaultOptions
        }
      })

      await nextTick()
      expect(queryTeleported('.config-dialog-overlay')).toBeNull()
    })

    it('should render dialog when modelValue is true', async () => {
      mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      const overlay = queryTeleported('.config-dialog-overlay')
      expect(overlay).not.toBeNull()
      
      const dialog = queryTeleported('.config-dialog')
      expect(dialog).not.toBeNull()
    })
  })

  describe('Dialog Header', () => {
    it('should display localized title', async () => {
      mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      const header = queryTeleported('.config-header h2')
      expect(header?.textContent).toBe('Chart Configuration')
    })

    it('should have close button', async () => {
      mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      const closeBtn = queryTeleported('.close-btn')
      expect(closeBtn).not.toBeNull()
      expect(closeBtn?.querySelector('.material-icons')?.textContent).toBe('close')
    })

    it('should emit close when close button clicked', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      await triggerTeleported('.close-btn', 'click')
      
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })
  })

  describe('Accordion Sections', () => {
    it('should render all accordion sections', async () => {
      mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      const sections = queryAllTeleported('.accordion-section')
      expect(sections.length).toBeGreaterThan(5)
      
      const headers = queryAllTeleported('.accordion-header')
      const headerTexts = Array.from(headers).map(h => h.textContent || '')
      
      // Check for key sections
      expect(headerTexts.some(text => text.includes('Title'))).toBe(true)
      expect(headerTexts.some(text => text.includes('Legend'))).toBe(true)
      expect(headerTexts.some(text => text.includes('Tooltip'))).toBe(true)
      expect(headerTexts.some(text => text.includes('Grid'))).toBe(true)
      expect(headerTexts.some(text => text.includes('Colors'))).toBe(true)
    })

    it('should toggle section visibility when header clicked', async () => {
      mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      // Get the first section (Title section)
      const firstSection = queryTeleported('.accordion-section')
      const header = firstSection?.querySelector('.accordion-header') as HTMLElement
      const content = firstSection?.querySelector('.accordion-content')
      
      // Title section should be expanded by default
      expect(content).not.toBeNull()
      
      // Click to collapse
      header?.click()
      await nextTick()
      
      // Content should be hidden
      const contentAfter = firstSection?.querySelector('.accordion-content')
      expect(contentAfter).toBeNull()
    })
  })

  describe('Form Inputs', () => {
    it('should update title when input changes', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      // Find the title input
      const titleInput = queryTeleported('.accordion-content input[type="text"]') as HTMLInputElement
      expect(titleInput).not.toBeNull()
      expect(titleInput.value).toBe('Test Chart')
      
      // Change the value
      titleInput.value = 'New Title'
      titleInput.dispatchEvent(new Event('input', { bubbles: true }))
      await nextTick()
      
      // Check that update event was emitted
      const emitted = wrapper.emitted('update:options')
      expect(emitted).toBeTruthy()
      expect(emitted?.[emitted.length - 1][0].title.text).toBe('New Title')
    })

    it('should handle color picker changes', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      // Find color picker
      const colorPicker = queryTeleported('.color-picker') as HTMLInputElement
      expect(colorPicker).not.toBeNull()
      
      // Change color
      colorPicker.value = '#ff0000'
      colorPicker.dispatchEvent(new Event('input', { bubbles: true }))
      await nextTick()
      
      // Check that update was emitted
      expect(wrapper.emitted('update:options')).toBeTruthy()
    })
  })

  describe('Language Selector', () => {
    it('should display language selector', async () => {
      mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      // Expand language section
      const languageHeader = Array.from(queryAllTeleported('.accordion-header'))
        .find(h => h.textContent?.includes('Language'))
      
      expect(languageHeader).not.toBeUndefined()
    })

    it('should emit locale change', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      // Find and expand language section
      const headers = Array.from(queryAllTeleported('.accordion-header'))
      const languageHeader = headers.find(h => h.textContent?.includes('Language')) as HTMLElement
      languageHeader?.click()
      await nextTick()
      
      // Find language select
      const selects = queryAllTeleported('.accordion-content select')
      const languageSelect = selects[selects.length - 1] as HTMLSelectElement
      
      // Change language
      languageSelect.value = 'es'
      languageSelect.dispatchEvent(new Event('change', { bubbles: true }))
      await nextTick()
      
      expect(wrapper.emitted('update:locale')?.[0]).toEqual(['es'])
    })
  })

  describe('Footer Actions', () => {
    it('should reset options when reset clicked', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      // Find reset button
      const buttons = queryAllTeleported('.config-footer button')
      const resetButton = Array.from(buttons).find(b => b.textContent?.includes('Reset')) as HTMLElement
      
      resetButton?.click()
      await nextTick()
      
      // Should emit original options
      const emitted = wrapper.emitted('update:options')
      expect(emitted).toBeTruthy()
    })

    it('should close dialog when apply clicked', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      // Find apply button
      const buttons = queryAllTeleported('.config-footer button')
      const applyButton = Array.from(buttons).find(b => b.textContent?.includes('Apply')) as HTMLElement
      
      applyButton?.click()
      await nextTick()
      
      // Should emit close
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })
  })

  describe('Overlay Behavior', () => {
    it('should close when overlay clicked', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      const overlay = queryTeleported('.config-dialog-overlay') as HTMLElement
      overlay?.click()
      await nextTick()
      
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('should not close when dialog content clicked', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      
      const dialog = queryTeleported('.config-dialog') as HTMLElement
      dialog?.click()
      await nextTick()
      
      // Should not emit close
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Complex Options', () => {
    it('should handle missing options gracefully', async () => {
      mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: {} // Empty options
        }
      })

      await nextTick()
      
      // Should render without errors
      expect(queryTeleported('.config-dialog')).not.toBeNull()
    })

    it('should preserve unmodified options', async () => {
      const complexOptions: EChartsOption = {
        title: { text: 'Test' },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [1, 2, 3] }]
      }

      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: complexOptions
        }
      })

      await nextTick()
      
      // Change title
      const titleInput = queryTeleported('.accordion-content input[type="text"]') as HTMLInputElement
      titleInput.value = 'New Title'
      titleInput.dispatchEvent(new Event('input', { bubbles: true }))
      await nextTick()
      
      // Check that other options are preserved
      const emitted = wrapper.emitted('update:options')?.[0][0]
      expect(emitted.xAxis).toEqual(complexOptions.xAxis)
      expect(emitted.yAxis).toEqual(complexOptions.yAxis)
      expect(emitted.series).toEqual(complexOptions.series)
    })
  })
})