import type { App } from 'vue'
import MyndEcharts from './components/MyndEcharts.vue'
import ToastContainer from './components/ToastContainer.vue'
import ChartToolbox from './components/ChartToolbox.vue'
import DataViewDialog from './components/DataViewDialog.vue'
import './styles/echarts-toolbox.css'

export { MyndEcharts, ToastContainer, ChartToolbox, DataViewDialog }

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