import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import { routes } from './routes'

// Import mynd-echarts
import MyndEcharts from '../lib'

// Create router
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Create and mount app
const app = createApp(App)

// Install mynd-echarts plugin
app.use(MyndEcharts)

// Use router
app.use(router)

// Mount app
app.mount('#app')