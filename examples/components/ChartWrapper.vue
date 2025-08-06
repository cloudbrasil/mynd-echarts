<template>
  <div class="chart-wrapper">
    <div class="chart-header">
      <h2 class="chart-title">{{ title }}</h2>
      <p v-if="description" class="chart-description">{{ description }}</p>
    </div>
    
    <div class="controls-panel" v-if="$slots.controls">
      <slot name="controls"></slot>
    </div>
    
    <div class="chart-container" :style="{ height: chartHeight }">
      <MyndEcharts
        ref="chartRef"
        :options="chartOptions"
        :theme="theme"
        :loading="loading"
        :auto-resize="true"
        @ready="handleReady"
        @click="$emit('click', $event)"
        @finished="$emit('finished', $event)"
      />
    </div>
    
    <div class="chart-actions" v-if="showActions">
      <button @click="refreshData" class="control-button">
        🔄 Refresh Data
      </button>
      <button @click="downloadChart" class="control-button secondary">
        📥 Download
      </button>
      <button @click="showCode = !showCode" class="control-button secondary">
        { } View Code
      </button>
    </div>
    
    <div v-if="showCode" class="code-panel">
      <pre><code>{{ formattedOptions }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { EChartsOption, ECharts } from 'echarts'
import { MyndEcharts } from '@lib/index'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  options: EChartsOption
  theme?: string
  loading?: boolean
  chartHeight?: string
  showActions?: boolean
}>(), {
  chartHeight: '400px',
  showActions: true,
  loading: false
})

const emit = defineEmits<{
  refresh: []
  ready: [instance: ECharts]
  click: [params: any]
  finished: [params: any]
}>()

const chartRef = ref<InstanceType<typeof MyndEcharts>>()
const showCode = ref(false)

const chartOptions = computed(() => props.options)

const formattedOptions = computed(() => {
  return JSON.stringify(props.options, null, 2)
})

const handleReady = (instance: ECharts) => {
  emit('ready', instance)
}

const refreshData = () => {
  emit('refresh')
}

const downloadChart = () => {
  if (chartRef.value?.chartInstance) {
    const url = chartRef.value.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })
    
    const link = document.createElement('a')
    link.download = `${props.title.toLowerCase().replace(/\s+/g, '-')}-chart.png`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Listen for theme changes
const handleThemeChange = (event: CustomEvent) => {
  // Theme will be handled by parent component
}

onMounted(() => {
  window.addEventListener('theme-change', handleThemeChange as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('theme-change', handleThemeChange as EventListener)
})
</script>

<style scoped>
.chart-wrapper {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.chart-description {
  color: #606266;
  margin: 0;
}

.chart-container {
  margin-bottom: 1rem;
  min-height: 300px;
}

.chart-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #ebeef5;
}

.code-panel {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 4px;
  overflow-x: auto;
}

.code-panel pre {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.code-panel code {
  font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
  color: #303133;
}

@media (max-width: 768px) {
  .chart-wrapper {
    padding: 1rem;
  }
  
  .chart-title {
    font-size: 1.2rem;
  }
  
  .chart-actions {
    flex-wrap: wrap;
  }
}
</style>