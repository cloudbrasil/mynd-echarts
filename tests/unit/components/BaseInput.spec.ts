import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BaseInput from '../../../lib/components/BaseInput.vue'

describe('BaseInput', () => {
  describe('Basic Rendering', () => {
    it('should render input with label', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          label: 'Test Label'
        }
      })

      expect(wrapper.find('label').text()).toBe('Test Label')
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should render without label', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('label').exists()).toBe(false)
      expect(wrapper.find('input').exists()).toBe(true)
    })

    it('should apply custom id', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          id: 'custom-id',
          label: 'Test'
        }
      })

      const input = wrapper.find('input')
      const label = wrapper.find('label')
      
      expect(input.attributes('id')).toBe('custom-id')
      expect(label.attributes('for')).toBe('custom-id')
    })

    it('should generate unique id when not provided', () => {
      const wrapper1 = mount(BaseInput, {
        props: { modelValue: '', label: 'Test 1' }
      })
      const wrapper2 = mount(BaseInput, {
        props: { modelValue: '', label: 'Test 2' }
      })

      const id1 = wrapper1.find('input').attributes('id')
      const id2 = wrapper2.find('input').attributes('id')

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })
  })

  describe('Input Types', () => {
    it('should render text input by default', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' }
      })

      expect(wrapper.find('input').attributes('type')).toBe('text')
    })

    it('should render number input', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 0,
          type: 'number'
        }
      })

      expect(wrapper.find('input').attributes('type')).toBe('number')
    })

    it('should render textarea when type is textarea', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          type: 'textarea'
        }
      })

      expect(wrapper.find('textarea').exists()).toBe(true)
      expect(wrapper.find('input').exists()).toBe(false)
    })

    it('should support other input types', () => {
      const types = ['email', 'password', 'url', 'tel']
      
      types.forEach(type => {
        const wrapper = mount(BaseInput, {
          props: { modelValue: '', type }
        })
        
        expect(wrapper.find('input').attributes('type')).toBe(type)
      })
    })
  })

  describe('Props and Attributes', () => {
    it('should bind placeholder', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          placeholder: 'Enter text...'
        }
      })

      expect(wrapper.find('input').attributes('placeholder')).toBe('Enter text...')
    })

    it('should bind min and max for number input', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 5,
          type: 'number',
          min: 0,
          max: 10
        }
      })

      const input = wrapper.find('input')
      expect(input.attributes('min')).toBe('0')
      expect(input.attributes('max')).toBe('10')
    })

    it('should bind step for number input', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 0,
          type: 'number',
          step: 0.1
        }
      })

      expect(wrapper.find('input').attributes('step')).toBe('0.1')
    })

    it('should bind rows for textarea', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          type: 'textarea',
          rows: 5
        }
      })

      expect(wrapper.find('textarea').attributes('rows')).toBe('5')
    })

    it('should apply input-class to input element', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          inputClass: 'custom-input-class'
        }
      })

      expect(wrapper.find('input').classes()).toContain('custom-input-class')
    })
  })

  describe('v-model Binding', () => {
    it('should display initial value', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'Initial Value'
        }
      })

      expect(wrapper.find('input').element.value).toBe('Initial Value')
    })

    it('should emit update:modelValue on input', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      await input.setValue('New Value')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New Value'])
    })

    it('should emit input event', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      await input.setValue('Test')

      expect(wrapper.emitted('input')?.[0]).toBeDefined()
      expect(wrapper.emitted('input')?.[0][0]).toBeInstanceOf(Event)
    })

    it('should update value when prop changes', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'Old Value'
        }
      })

      await wrapper.setProps({ modelValue: 'New Value' })
      
      expect(wrapper.find('input').element.value).toBe('New Value')
    })

    it('should handle number values correctly', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 0,
          type: 'number'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('42')

      const emitted = wrapper.emitted('update:modelValue')?.[0]
      expect(emitted).toEqual([42]) // Component converts to number for type="number"
    })
  })

  describe('Help Text', () => {
    it('should display help text when provided', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          helpText: 'This is helpful information'
        }
      })

      const helpText = wrapper.find('.input-help')
      expect(helpText.exists()).toBe(true)
      expect(helpText.text()).toBe('This is helpful information')
    })

    it('should not display help text when not provided', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('.input-help').exists()).toBe(false)
    })
  })

  describe('Textarea Specific', () => {
    it('should render textarea with correct props', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'Multi\nLine\nText',
          type: 'textarea',
          rows: 10,
          placeholder: 'Enter description...'
        }
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBe('Multi\nLine\nText')
      expect(textarea.attributes('rows')).toBe('10')
      expect(textarea.attributes('placeholder')).toBe('Enter description...')
    })

    it('should emit events from textarea', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          type: 'textarea'
        }
      })

      const textarea = wrapper.find('textarea')
      await textarea.setValue('New textarea content')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['New textarea content'])
      expect(wrapper.emitted('input')?.[0]).toBeDefined()
      expect(wrapper.emitted('input')?.[0][0]).toBeInstanceOf(Event)
    })
  })

  describe('CSS Classes', () => {
    it('should have proper wrapper classes', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          label: 'Test'
        }
      })

      expect(wrapper.classes()).toContain('base-input')
    })

    it('should apply base-input class to input', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: ''
        }
      })

      expect(wrapper.find('input').classes()).toContain('input-field')
    })

    it('should apply both base-input and custom classes', () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          inputClass: 'my-custom-class'
        }
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('input-field')
      expect(input.classes()).toContain('my-custom-class')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string values', async () => {
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'Some text'
        }
      })

      const input = wrapper.find('input')
      await input.setValue('')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    })

    it('should handle very long values', async () => {
      const longText = 'A'.repeat(1000)
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      await input.setValue(longText)

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([longText])
    })

    it('should handle special characters', async () => {
      const specialText = '<script>alert("test")</script>'
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: ''
        }
      })

      const input = wrapper.find('input')
      await input.setValue(specialText)

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([specialText])
    })
  })
})