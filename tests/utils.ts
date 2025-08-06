import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'

/**
 * Helper to find an input by its label text
 */
export function findByLabelText(wrapper: VueWrapper, labelText: string) {
  const labels = wrapper.findAll('label')
  const label = labels.find(l => l.text().includes(labelText))
  
  if (!label) {
    throw new Error(`Label with text "${labelText}" not found`)
  }

  const forId = label.attributes('for')
  if (forId) {
    return wrapper.find(`#${forId}`)
  }

  // If no for attribute, look for input as sibling or child
  const parent = label.element.parentElement
  if (parent) {
    const input = parent.querySelector('input, select, textarea')
    if (input) {
      return wrapper.find(input as HTMLElement)
    }
  }

  throw new Error(`Input for label "${labelText}" not found`)
}

/**
 * Helper to wait for debounced actions
 */
export async function waitForDebounce(ms: number = 200) {
  await new Promise(resolve => setTimeout(resolve, ms))
  await nextTick()
}

/**
 * Helper to trigger input event with value
 */
export async function setInputValue(wrapper: VueWrapper, selector: string, value: any) {
  const input = wrapper.find(selector)
  await input.setValue(value)
  await input.trigger('input')
  await nextTick()
}

/**
 * Helper to get emitted event data
 */
export function getLastEmittedValue<T = any>(wrapper: VueWrapper, eventName: string): T | undefined {
  const emitted = wrapper.emitted(eventName)
  if (!emitted || emitted.length === 0) {
    return undefined
  }
  const lastEmit = emitted[emitted.length - 1]
  return lastEmit?.[0] as T
}

/**
 * Mock window.matchMedia for tests
 */
export function mockMatchMedia(matches: boolean = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {}
    })
  })
}