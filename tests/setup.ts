import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock ECharts
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
    clear: vi.fn(),
    getOption: vi.fn(() => ({})),
    getWidth: vi.fn(() => 600),
    getHeight: vi.fn(() => 400),
    getDom: vi.fn(() => document.createElement('div')),
    getDataURL: vi.fn(() => 'data:image/png;base64,test'),
    getConnectedDataURL: vi.fn(() => 'data:image/png;base64,test'),
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
  })),
  use: vi.fn(),
  registerTheme: vi.fn(),
  registerLocale: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  dispose: vi.fn(),
  getInstanceByDom: vi.fn(),
  graphic: {
    LinearGradient: vi.fn()
  }
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})