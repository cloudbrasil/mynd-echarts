import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import ConfigDialog from '../../../lib/components/ConfigDialog.vue'
import { mountWithLocale } from '../../test-helpers'
import type { EChartsOption } from 'echarts'

describe('ConfigDialog', () => {
  const defaultOptions: EChartsOption = {
    title: { text: 'Test Chart', subtext: 'Test Subtitle' },
    legend: { show: true },
    tooltip: { show: true },
    series: []
  }

  // Helper to get elements from teleport target
  const getTeleportElement = (selector: string): Element | null => {
    const teleportTarget = document.getElementById('teleport-target')
    return teleportTarget ? teleportTarget.querySelector(selector) : null
  }

  const getTeleportElements = (selector: string): Element[] => {
    const teleportTarget = document.getElementById('teleport-target')
    return teleportTarget ? Array.from(teleportTarget.querySelectorAll(selector)) : []
  }

  describe('Component Mounting', () => {
    it('should mount successfully', () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: false,
          options: defaultOptions
        }
      })

      expect(wrapper.findComponent(ConfigDialog).exists()).toBe(true)
    })

    it('should not render when modelValue is false', () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: false,
          options: defaultOptions
        }
      })

      expect(wrapper.find('.config-dialog-overlay').exists()).toBe(false)
    })

    it('should render when modelValue is true', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()

      // Check in the teleport target
      const teleportTarget = document.getElementById('teleport-target')
      expect(teleportTarget).toBeTruthy()
      const overlay = teleportTarget?.querySelector('.config-dialog-overlay')
      expect(overlay).toBeTruthy()
    })

    it('should use Teleport to body', () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        },
        global: {
          stubs: {
            teleport: true
          }
        }
      })

      expect(wrapper.findComponent({ name: 'Teleport' }).exists()).toBe(true)
    })
  })

  describe('Dialog Header', () => {
    it('should display localized title', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      const teleportTarget = document.getElementById('teleport-target')
      const header = teleportTarget?.querySelector('.config-header h2')
      expect(header?.textContent).toBe('Chart Configuration')
    })

    it('should have close button', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      const teleportTarget = document.getElementById('teleport-target')
      const closeBtn = teleportTarget?.querySelector('.close-btn')
      expect(closeBtn).toBeTruthy()
      expect(closeBtn?.querySelector('.material-icons')?.textContent).toBe('close')
    })

    it('should close dialog when close button clicked', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      const teleportTarget = document.getElementById('teleport-target')
      const closeBtn = teleportTarget?.querySelector('.close-btn') as HTMLElement
      closeBtn?.click()
      await nextTick()
      
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })
  })

  describe('Accordion Sections', () => {
    it('should render all sections', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await nextTick()
      const sections = getTeleportElements('.accordion-section')
      expect(sections.length).toBeGreaterThan(5) // At least Title, Legend, Tooltip, Grid, Colors, Animation

      // Check section headers
      const headers = getTeleportElements('.accordion-header')
      const headerTexts = headers.map(h => h.textContent || '')
      
      expect(headerTexts.some(t => t.includes('Title')))
      expect(headerTexts.some(t => t.includes('Legend')))
      expect(headerTexts.some(t => t.includes('Tooltip')))
      expect(headerTexts.some(t => t.includes('Grid')))
      expect(headerTexts.some(t => t.includes('Colors')))
      expect(headerTexts.some(t => t.includes('Animation')))
    })

    it('should toggle section visibility', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      // Title section should be expanded by default
      const titleSection = wrapper.findAll('.accordion-section')[0]
      expect(titleSection.find('.accordion-content').exists()).toBe(true)

      // Find legend section (should be collapsed)
      const legendSection = wrapper.findAll('.accordion-section')[1]
      expect(legendSection.find('.accordion-content').exists()).toBe(false)

      // Click to expand
      await legendSection.find('.accordion-header').trigger('click')
      expect(legendSection.find('.accordion-content').exists()).toBe(true)

      // Click to collapse
      await legendSection.find('.accordion-header').trigger('click')
      expect(legendSection.find('.accordion-content').exists()).toBe(false)
    })

    it('should show expand/collapse icons', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      const titleHeader = wrapper.findAll('.accordion-header')[0]
      
      // Expanded state shows expand_less
      expect(titleHeader.find('.material-icons').text()).toBe('expand_less')

      // Click to collapse
      await titleHeader.trigger('click')
      expect(titleHeader.find('.material-icons').text()).toBe('expand_more')
    })
  })

  describe('Title Section', () => {
    it('should initialize with chart title values', () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: {
            title: { 
              text: 'My Chart Title',
              subtext: 'My Subtitle',
              left: 'center',
              textStyle: { color: '#ff0000', fontSize: 24 }
            }
          }
        }
      })

      const inputs = wrapper.findAll('input[type="text"]')
      expect(inputs[0].element.value).toBe('My Chart Title')
      expect(inputs[1].element.value).toBe('My Subtitle')
    })

    it('should update options when title text changes', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      const titleInput = wrapper.findAll('input[type="text"]')[0]
      await titleInput.setValue('New Title')

      const emitted = wrapper.emitted('update:options')
      expect(emitted).toBeTruthy()
      
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      expect(lastEmit.title?.text).toBe('New Title')
    })

    it('should handle position dropdown', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      // Find position select in title section
      const selects = wrapper.findAll('select')
      const positionSelect = selects[0] // First select should be position
      
      await positionSelect.setValue('right')

      const emitted = wrapper.emitted('update:options')
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      expect(lastEmit.title?.left).toBe('right')
    })

    it('should handle color picker', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      const colorInput = wrapper.find('input[type="color"]')
      await colorInput.setValue('#00ff00')

      const emitted = wrapper.emitted('update:options')
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      expect(lastEmit.title?.textStyle?.color).toBe('#00ff00')
    })
  })

  describe('Legend Section', () => {
    it('should handle show legend checkbox', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      // Expand legend section
      const legendHeader = wrapper.findAll('.accordion-header')[1]
      await legendHeader.trigger('click')

      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.setValue(false)

      const emitted = wrapper.emitted('update:options')
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      expect(lastEmit.legend?.show).toBe(false)
    })

    it('should handle orientation dropdown', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: { legend: { orient: 'horizontal' } }
        }
      })

      // Expand legend section
      const legendHeader = wrapper.findAll('.accordion-header')[1]
      await legendHeader.trigger('click')

      // Find orientation select
      const selects = wrapper.findAll('select')
      const orientSelect = selects.find(s => {
        const options = s.findAll('option')
        return options.some(o => o.text().includes('Horizontal'))
      })

      await orientSelect?.setValue('vertical')

      const emitted = wrapper.emitted('update:options')
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      expect(lastEmit.legend?.orient).toBe('vertical')
    })
  })

  describe('Tooltip Section', () => {
    it('should handle formatter textarea', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      // Expand tooltip section
      const tooltipHeader = wrapper.findAll('.accordion-header')[2]
      await tooltipHeader.trigger('click')

      const textarea = wrapper.find('textarea')
      await textarea.setValue('{b}: {c} ({d}%)')

      const emitted = wrapper.emitted('update:options')
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      expect(lastEmit.tooltip?.formatter).toBe('{b}: {c} ({d}%)')
    })

    it('should show formatter help text', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      // Expand tooltip section
      const tooltipHeader = wrapper.findAll('.accordion-header')[2]
      await tooltipHeader.trigger('click')

      const helpText = wrapper.find('.help-text')
      expect(helpText.text()).toContain('Use placeholders')
    })
  })

  describe('Colors Section', () => {
    it('should display color palette', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: {
            color: ['#ff0000', '#00ff00', '#0000ff']
          }
        }
      })

      // Find and expand colors section
      const headers = wrapper.findAll('.accordion-header')
      const colorsHeader = headers.find(h => h.text().includes('Colors'))
      await colorsHeader?.trigger('click')

      const colorInputs = wrapper.findAll('.color-palette input[type="color"]')
      expect(colorInputs).toHaveLength(3)
    })

    it('should add new color', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: {
            color: ['#ff0000']
          }
        }
      })

      // Find and expand colors section
      const headers = wrapper.findAll('.accordion-header')
      const colorsHeader = headers.find(h => h.text().includes('Colors'))
      await colorsHeader?.trigger('click')

      const addButton = wrapper.find('.add-color')
      await addButton.trigger('click')

      const emitted = wrapper.emitted('update:options')
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      expect(Array.isArray(lastEmit.color)).toBe(true)
      expect(lastEmit.color?.length).toBe(2)
    })

    it('should remove color', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: {
            color: ['#ff0000', '#00ff00', '#0000ff']
          }
        }
      })

      // Find and expand colors section
      const headers = wrapper.findAll('.accordion-header')
      const colorsHeader = headers.find(h => h.text().includes('Colors'))
      await colorsHeader?.trigger('click')

      const removeButton = wrapper.find('.remove-color')
      await removeButton.trigger('click')

      const emitted = wrapper.emitted('update:options')
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      expect(lastEmit.color?.length).toBe(2)
    })
  })

  describe('Language Section', () => {
    it('should display language selector', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      // Find and expand language section
      const headers = wrapper.findAll('.accordion-header')
      const langHeader = headers.find(h => h.text().includes('Language'))
      await langHeader?.trigger('click')

      const langSelect = wrapper.find('.accordion-content select')
      expect(langSelect.exists()).toBe(true)
      
      const options = langSelect.findAll('option')
      expect(options.length).toBeGreaterThan(5) // Should have multiple languages
    })

    it('should emit locale change', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      // Find and expand language section
      const headers = wrapper.findAll('.accordion-header')
      const langHeader = headers.find(h => h.text().includes('Language'))
      await langHeader?.trigger('click')

      const langSelect = wrapper.find('.accordion-content select')
      await langSelect.setValue('zh-CN')

      expect(wrapper.emitted('update:locale')?.[0]).toEqual(['zh-CN'])
    })
  })

  describe('Footer Actions', () => {
    it('should reset options', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: {
            title: { text: 'Custom Title' }
          }
        }
      })

      const resetButton = wrapper.find('.btn-secondary')
      await resetButton.trigger('click')

      const emitted = wrapper.emitted('update:options')
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      
      // Should reset to default values
      expect(lastEmit.title?.text).toBe('')
    })

    it('should apply and close', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      const applyButton = wrapper.find('.btn-primary')
      await applyButton.trigger('click')

      // Should emit close
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
      
      // Should also emit final options
      expect(wrapper.emitted('update:options')).toBeTruthy()
    })
  })

  describe('Overlay Behavior', () => {
    it('should close on overlay click', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await wrapper.find('.config-dialog-overlay').trigger('click')
      
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    })

    it('should not close on dialog content click', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: defaultOptions
        }
      })

      await wrapper.find('.config-dialog').trigger('click')
      
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('Complex Options Handling', () => {
    it('should handle deeply nested options', () => {
      const complexOptions: EChartsOption = {
        title: {
          text: 'Complex Chart',
          textStyle: {
            color: '#123456',
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          axisLine: { show: true },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: true },
          splitLine: { show: true }
        }
      }

      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: complexOptions
        }
      })

      // Should initialize with complex values
      const titleInput = wrapper.find('input[type="text"]')
      expect(titleInput.element.value).toBe('Complex Chart')
    })

    it('should preserve unmanaged options', async () => {
      const customOptions: EChartsOption = {
        title: { text: 'Test' },
        series: [{ type: 'line', data: [1, 2, 3] }],
        // Custom property that ConfigDialog doesn't manage
        dataZoom: [{ type: 'slider' }]
      }

      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: customOptions
        }
      })

      // Change title
      const titleInput = wrapper.find('input[type="text"]')
      await titleInput.setValue('New Title')

      const emitted = wrapper.emitted('update:options')
      const lastEmit = emitted?.[emitted.length - 1]?.[0] as EChartsOption
      
      // Should preserve series and dataZoom
      expect(lastEmit.series).toEqual(customOptions.series)
      expect(lastEmit.dataZoom).toEqual(customOptions.dataZoom)
    })
  })

  describe('Error Handling', () => {
    it('should handle missing options gracefully', () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: {} // Empty options
        }
      })

      expect(wrapper.exists()).toBe(true)
      // Should not throw and should have default values
      const titleInput = wrapper.find('input[type="text"]')
      expect(titleInput.element.value).toBe('')
    })

    it('should handle invalid color values', async () => {
      const wrapper = mountWithLocale(ConfigDialog, {
        props: {
          modelValue: true,
          options: {
            color: ['#123'] // Short hex color
          }
        }
      })

      // Find and expand colors section
      const headers = wrapper.findAll('.accordion-header')
      const colorsHeader = headers.find(h => h.text().includes('Colors'))
      await colorsHeader?.trigger('click')

      const colorInput = wrapper.find('.color-palette input[type="color"]')
      // Should expand short hex to full hex
      expect(colorInput.element.value).toBe('#112233')
    })
  })
})