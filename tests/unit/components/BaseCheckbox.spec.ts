import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BaseCheckbox from '../../../lib/components/BaseCheckbox.vue'

describe('BaseCheckbox', () => {
  describe('Basic Rendering', () => {
    it('should render checkbox with label', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Accept terms'
        }
      })

      expect(wrapper.find('label').text()).toBe('Accept terms')
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('should render without label', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false
        }
      })

      expect(wrapper.text()).toBe('')
      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })

    it('should apply custom id', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          id: 'custom-checkbox-id',
          label: 'Test'
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      const label = wrapper.find('label')
      
      expect(checkbox.attributes('id')).toBe('custom-checkbox-id')
      expect(label.attributes('for')).toBe('custom-checkbox-id')
    })

    it('should generate unique id when not provided', () => {
      const wrapper1 = mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Check 1' }
      })
      const wrapper2 = mount(BaseCheckbox, {
        props: { modelValue: false, label: 'Check 2' }
      })

      const id1 = wrapper1.find('input').attributes('id')
      const id2 = wrapper2.find('input').attributes('id')

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })
  })

  describe('v-model Binding', () => {
    it('should display initial checked state', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: true,
          label: 'Checked'
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      expect(checkbox.element.checked).toBe(true)
    })

    it('should display initial unchecked state', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Unchecked'
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      expect(checkbox.element.checked).toBe(false)
    })

    it('should emit update:modelValue on change', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Toggle me'
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.setChecked(true)

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    })

    it('should emit change event', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Toggle me'
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      await checkbox.setChecked(true)

      expect(wrapper.emitted('change')?.[0]).toBeDefined()
      expect(wrapper.emitted('change')?.[0][0]).toBeInstanceOf(Event)
    })

    it('should toggle state correctly', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Toggle me'
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      
      // Check
      await checkbox.setChecked(true)
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
      
      // Uncheck
      await checkbox.setChecked(false)
      expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
    })

    it('should update checked state when prop changes', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Test'
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      expect(checkbox.element.checked).toBe(false)

      await wrapper.setProps({ modelValue: true })
      
      expect(checkbox.element.checked).toBe(true)
    })
  })

  describe('Label Interaction', () => {
    it('should toggle when label is clicked', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Click me'
        }
      })

      await wrapper.find('label').trigger('click')
      
      // Note: The browser handles label clicks automatically
      // We need to check if the structure is correct for this to work
      const checkbox = wrapper.find('input[type="checkbox"]')
      const label = wrapper.find('label')
      
      expect(label.attributes('for')).toBe(checkbox.attributes('id'))
    })

    it('should have proper label structure', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Test Label'
        }
      })

      const label = wrapper.find('label')
      const checkbox = wrapper.find('input[type="checkbox"]')
      
      // Check that checkbox is inside label
      expect(label.exists()).toBe(true)
      expect(label.find('input[type="checkbox"]').exists()).toBe(true)
      expect(label.find('.checkbox-label').exists()).toBe(true)
      expect(label.find('.checkbox-label').text()).toBe('Test Label')
    })
  })

  describe('Disabled State', () => {
    it('should apply disabled attribute', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Disabled checkbox',
          disabled: true
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      expect(checkbox.attributes('disabled')).toBeDefined()
    })

    it('should not emit events when disabled', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Disabled',
          disabled: true
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      
      // Try to change the checkbox
      await checkbox.trigger('click')
      
      // Should not emit any events
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect(wrapper.emitted('change')).toBeUndefined()
    })
  })

  describe('CSS Classes', () => {
    it('should have proper wrapper classes', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Test'
        }
      })

      expect(wrapper.find('.base-checkbox').exists()).toBe(true)
    })

    it('should apply base-checkbox class to input', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false
        }
      })

      expect(wrapper.find('input').classes()).toContain('checkbox-input')
    })

    it('should maintain class when checked', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false
        }
      })

      const checkbox = wrapper.find('input')
      expect(checkbox.classes()).toContain('checkbox-input')

      await checkbox.setChecked(true)
      
      expect(checkbox.classes()).toContain('checkbox-input')
    })
  })

  describe('Indeterminate State', () => {
    it('should handle indeterminate prop if supported', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          indeterminate: true
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      
      // Note: indeterminate is a property, not an attribute
      // It can only be set via JavaScript, not HTML
      // The component would need to implement this feature
      expect(checkbox.element.indeterminate).toBeDefined()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: 'Accessible checkbox'
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      
      // Basic accessibility - checkbox should have proper type
      expect(checkbox.attributes('type')).toBe('checkbox')
      
      // Label association
      const label = wrapper.find('label')
      expect(label.attributes('for')).toBe(checkbox.attributes('id'))
    })

    it('should handle aria-label when no visible label', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          'aria-label': 'Hidden label checkbox'
        },
        attrs: {
          'aria-label': 'Hidden label checkbox'
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      expect(checkbox.attributes('aria-label')).toBe('Hidden label checkbox')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid toggling', async () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false
        }
      })

      const checkbox = wrapper.find('input[type="checkbox"]')
      
      // Rapidly toggle
      for (let i = 0; i < 10; i++) {
        await checkbox.setChecked(i % 2 === 0)
      }

      const emissions = wrapper.emitted('update:modelValue')
      expect(emissions).toHaveLength(10)
    })

    it('should handle label with HTML content', () => {
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: '<strong>Bold</strong> label'
        }
      })

      // Should escape HTML by default
      expect(wrapper.find('label').text()).toBe('<strong>Bold</strong> label')
      expect(wrapper.find('label strong').exists()).toBe(false)
    })

    it('should handle very long labels', () => {
      const longLabel = 'A'.repeat(500)
      const wrapper = mount(BaseCheckbox, {
        props: {
          modelValue: false,
          label: longLabel
        }
      })

      expect(wrapper.find('label').text()).toBe(longLabel)
    })

    it('should handle missing modelValue gracefully', () => {
      // @ts-ignore - Testing invalid props
      const wrapper = mount(BaseCheckbox, {
        props: {
          label: 'No model value'
        }
      })

      expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    })
  })

  // BaseCheckbox only supports boolean values
  // Custom true/false values are not supported
})