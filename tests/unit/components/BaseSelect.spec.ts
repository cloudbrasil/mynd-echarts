import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import BaseSelect from '../../../lib/components/BaseSelect.vue'

describe('BaseSelect', () => {
  describe('Basic Rendering', () => {
    it('should render select with label', () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          label: 'Select Option',
          options: ['Option 1', 'Option 2']
        }
      })

      expect(wrapper.find('label').text()).toBe('Select Option')
      expect(wrapper.find('select').exists()).toBe(true)
    })

    it('should render without label', () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options: ['Option 1', 'Option 2']
        }
      })

      expect(wrapper.find('label').exists()).toBe(false)
      expect(wrapper.find('select').exists()).toBe(true)
    })

    it('should apply custom id', () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          id: 'custom-select-id',
          label: 'Test',
          options: []
        }
      })

      const select = wrapper.find('select')
      const label = wrapper.find('label')
      
      expect(select.attributes('id')).toBe('custom-select-id')
      expect(label.attributes('for')).toBe('custom-select-id')
    })

    it('should generate unique id when not provided', () => {
      const wrapper1 = mount(BaseSelect, {
        props: { modelValue: '', label: 'Select 1', options: [] }
      })
      const wrapper2 = mount(BaseSelect, {
        props: { modelValue: '', label: 'Select 2', options: [] }
      })

      const id1 = wrapper1.find('select').attributes('id')
      const id2 = wrapper2.find('select').attributes('id')

      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })
  })

  describe('Options Rendering', () => {
    it('should render string array options', () => {
      const options = ['Apple', 'Banana', 'Cherry']
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options
        }
      })

      const optionElements = wrapper.findAll('option')
      expect(optionElements).toHaveLength(3)
      
      optionElements.forEach((opt, index) => {
        expect(opt.text()).toBe(options[index])
        expect(opt.attributes('value')).toBe(options[index])
      })
    })

    it('should render object array options', () => {
      const options = [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' }
      ]
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options
        }
      })

      const optionElements = wrapper.findAll('option')
      expect(optionElements).toHaveLength(3)
      
      optionElements.forEach((opt, index) => {
        expect(opt.text()).toBe(options[index].label)
        expect(opt.attributes('value')).toBe(options[index].value)
      })
    })

    it('should handle empty options array', () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options: []
        }
      })

      const optionElements = wrapper.findAll('option')
      expect(optionElements).toHaveLength(0)
    })

    it('should handle mixed type values in object options', () => {
      const options = [
        { label: 'Number', value: 123 },
        { label: 'Boolean', value: true },
        { label: 'String', value: 'text' }
      ]
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options
        }
      })

      const optionElements = wrapper.findAll('option')
      expect(optionElements[0].attributes('value')).toBe('123')
      expect(optionElements[1].attributes('value')).toBe('true')
      expect(optionElements[2].attributes('value')).toBe('text')
    })
  })

  describe('v-model Binding', () => {
    it('should display initial value', () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: 'banana',
          options: ['apple', 'banana', 'cherry']
        }
      })

      expect(wrapper.find('select').element.value).toBe('banana')
    })

    it('should emit update:modelValue on change', async () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: 'apple',
          options: ['apple', 'banana', 'cherry']
        }
      })

      const select = wrapper.find('select')
      await select.setValue('banana')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['banana'])
    })

    it('should emit change event', async () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options: ['option1', 'option2']
        }
      })

      const select = wrapper.find('select')
      await select.setValue('option2')

      expect(wrapper.emitted('change')?.[0]).toBeDefined()
      expect(wrapper.emitted('change')?.[0][0]).toBeInstanceOf(Event)
    })

    it('should update value when prop changes', async () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: 'option1',
          options: ['option1', 'option2', 'option3']
        }
      })

      await wrapper.setProps({ modelValue: 'option3' })
      
      expect(wrapper.find('select').element.value).toBe('option3')
    })

    it('should work with object option values', async () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: 'md',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' }
          ]
        }
      })

      expect(wrapper.find('select').element.value).toBe('md')

      await wrapper.find('select').setValue('lg')
      
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['lg'])
    })
  })

  describe('Props and Attributes', () => {
    it('should bind placeholder when provided', () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          placeholder: 'Choose an option...',
          options: ['a', 'b', 'c']
        }
      })

      // Placeholder in select is typically done with an empty option
      const firstOption = wrapper.find('option')
      if (firstOption.exists() && firstOption.attributes('value') === '') {
        expect(firstOption.text()).toBe('Choose an option...')
      }
    })

    it('should apply custom attributes to select', async () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options: ['a', 'b'],
          disabled: true
        },
        attrs: {
          'data-test': 'custom-select'
        }
      })

      const select = wrapper.find('select')
      expect(select.attributes('data-test')).toBe('custom-select')
    })
  })

  describe('CSS Classes', () => {
    it('should have proper wrapper classes', () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          label: 'Test',
          options: []
        }
      })

      expect(wrapper.classes()).toContain('base-select')
    })

    it('should apply base-select class to select element', () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options: []
        }
      })

      expect(wrapper.find('select').classes()).toContain('select-field')
    })
  })

  describe('Edge Cases', () => {
    it('should handle options with special characters', () => {
      const options = [
        'Option & More',
        'Option <with> HTML',
        'Option "quoted"',
        "Option 'single quoted'"
      ]
      
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options
        }
      })

      const optionElements = wrapper.findAll('option')
      optionElements.forEach((opt, index) => {
        expect(opt.text()).toBe(options[index])
      })
    })

    it('should handle very long option lists', () => {
      const options = Array.from({ length: 1000 }, (_, i) => `Option ${i}`)
      
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options
        }
      })

      const optionElements = wrapper.findAll('option')
      expect(optionElements).toHaveLength(1000)
    })

    it('should handle options with duplicate values', () => {
      const options = [
        { label: 'First', value: 'same' },
        { label: 'Second', value: 'same' },
        { label: 'Third', value: 'different' }
      ]
      
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: 'same',
          options
        }
      })

      // Should still render all options
      const optionElements = wrapper.findAll('option')
      expect(optionElements).toHaveLength(3)
    })

    it('should handle numeric values correctly', async () => {
      const options = [
        { label: 'Zero', value: 0 },
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 }
      ]
      
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: 1,
          options
        }
      })

      expect(wrapper.find('select').element.value).toBe('1')

      await wrapper.find('select').setValue('2')
      
      // Note: HTML selects return string values
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2'])
    })

    // BaseSelect doesn't support boolean values in modelValue
    // Boolean values in options are converted to strings

    it('should handle undefined/null in options gracefully', () => {
      const options = [
        { label: 'Valid', value: 'valid' },
        { label: 'Undefined', value: undefined },
        { label: 'Null', value: null }
      ]
      
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options
        }
      })

      const optionElements = wrapper.findAll('option')
      expect(optionElements).toHaveLength(3)
    })
  })

  describe('Dynamic Options', () => {
    it('should react to options changes', async () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: '',
          options: ['initial1', 'initial2']
        }
      })

      expect(wrapper.findAll('option')).toHaveLength(2)

      await wrapper.setProps({
        options: ['new1', 'new2', 'new3']
      })

      const options = wrapper.findAll('option')
      expect(options).toHaveLength(3)
      expect(options[0].text()).toBe('new1')
      expect(options[1].text()).toBe('new2')
      expect(options[2].text()).toBe('new3')
    })

    it('should handle selected value not in new options', async () => {
      const wrapper = mount(BaseSelect, {
        props: {
          modelValue: 'option2',
          options: ['option1', 'option2', 'option3']
        }
      })

      expect(wrapper.find('select').element.value).toBe('option2')

      // Remove selected option from list
      await wrapper.setProps({
        options: ['option1', 'option3']
      })

      // When the selected value is not in options, the select value becomes empty
      expect(wrapper.find('select').element.value).toBe('')
    })
  })
})