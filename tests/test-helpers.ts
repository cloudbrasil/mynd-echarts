import { mount, type MountingOptions } from '@vue/test-utils'
import { defineComponent, h, provide, type Component } from 'vue'
import { vi } from 'vitest'
import { provideLocale } from '../lib/composables/useLocale'
import type { SupportedLocale } from '../lib/locales/types'

/**
 * Mount a component with locale provider
 */
export function mountWithLocale(
  component: Component,
  options: MountingOptions<any> = {},
  locale: SupportedLocale = 'en'
) {
  // Clean up any existing teleport targets
  const existingTarget = document.getElementById('teleport-target')
  if (existingTarget) {
    existingTarget.remove()
  }

  // Add a target element for Teleport
  const teleportTarget = document.createElement('div')
  teleportTarget.id = 'teleport-target'
  document.body.appendChild(teleportTarget)

  const Wrapper = defineComponent({
    setup() {
      provideLocale(locale)
      return () => h(component as any, options.props)
    }
  })

  const rootWrapper = mount(Wrapper, {
    ...options,
    props: undefined, // Props are passed directly to the component
    attachTo: document.body,
    global: {
      ...options.global,
      stubs: {
        ...options.global?.stubs,
        // Don't stub Teleport - let it work normally
        teleport: false
      }
    }
  })

  // Return the inner component wrapper so emitted() and vm map to the component
  const inner = rootWrapper.findComponent(component as any)

  // Clean up function delegated to root wrapper
  const rootUnmount = rootWrapper.unmount.bind(rootWrapper)
  ;(inner as any).unmount = () => {
    rootUnmount()
    const target = document.getElementById('teleport-target')
    if (target) {
      document.body.removeChild(target)
    }
  }

  return inner as any
}

/**
 * Mount a component with custom providers
 */
export function mountWithProviders(
  component: Component,
  providers: Record<string | symbol, any>,
  options: MountingOptions<any> = {}
) {
  const Wrapper = defineComponent({
    setup() {
      Object.entries(providers).forEach(([key, value]) => {
        provide(key, value)
      })
      return () => h(component as any, options.props)
    }
  })

  return mount(Wrapper, {
    ...options,
    props: undefined
  })
}

/**
 * Wait for async operations
 */
export async function flushPromises() {
  return new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * Mock ECharts instance
 */
export function createMockEChartsInstance() {
  return {
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    clear: vi.fn(),
    getOption: vi.fn(() => ({})),
    getWidth: vi.fn(() => 600),
    getHeight: vi.fn(() => 400),
    getDom: vi.fn(() => document.createElement('div')),
    getDataURL: vi.fn(() => 'data:image/png;base64,test'),
    convertToPixel: vi.fn(),
    convertFromPixel: vi.fn(),
    containPixel: vi.fn(() => true),
    dispatchAction: vi.fn(),
    isDisposed: vi.fn(() => false),
    on: vi.fn(),
    off: vi.fn(),
    showLoading: vi.fn(),
    hideLoading: vi.fn(),
    group: ''
  }
}