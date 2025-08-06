import type { App } from 'vue'
import MyndEcharts from './components/MyndEcharts.vue'
import ToastContainer from './components/ToastContainer.vue'

export { MyndEcharts, ToastContainer }

// Re-export specific items to avoid conflicts
export * from './types'
export * from './composables'
export * from './locales'
export { debounce, throttle } from './utils'

// Plugin install function
export default {
  install(app: App) {
    app.component('MyndEcharts', MyndEcharts)
    app.component('ToastContainer', ToastContainer)
  }
}