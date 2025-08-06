<template>
  <div class="page">
    <ChartWrapper
      title="Pie Chart"
      description="Show proportions and percentages of a whole"
      :options="chartOptions"
      :theme="currentTheme"
      @refresh="generateNewData"
    >
      <template #controls>
        <div class="control-group">
          <label class="control-label">Number of Slices</label>
          <input
            type="range"
            v-model.number="sliceCount"
            min="3"
            max="8"
            class="control-input"
          />
          <span>{{ sliceCount }}</span>
        </div>
        
        <div class="control-group">
          <label class="control-label">Chart Style</label>
          <select v-model="pieStyle" class="control-select">
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="rose">Rose</option>
          </select>
        </div>
        
        <div class="control-group">
          <label class="control-label">
            <input type="checkbox" v-model="showLabel" />
            Show Labels
          </label>
        </div>
        
        <div class="control-group">
          <label class="control-label">
            <input type="checkbox" v-model="showLabelLine" />
            Show Label Lines
          </label>
        </div>
        
        <div class="control-group">
          <label class="control-label">
            <input type="checkbox" v-model="showLegend" />
            Show Legend
          </label>
        </div>
      </template>
    </ChartWrapper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import ChartWrapper from '../components/ChartWrapper.vue'
import { generatePieData } from '../data/generators'
import { useChartTheme } from '@lib/composables'

const { currentTheme } = useChartTheme()

// Controls
const sliceCount = ref(5)
const pieStyle = ref<'pie' | 'doughnut' | 'rose'>('pie')
const showLabel = ref(true)
const showLabelLine = ref(true)
const showLegend = ref(true)

// Data
const chartData = ref(generatePieData(sliceCount.value))

// Computed options
const chartOptions = computed<EChartsOption>(() => {
  const series = chartData.value.map(s => ({
    ...s,
    radius: pieStyle.value === 'doughnut' ? ['40%', '70%'] : '70%',
    roseType: pieStyle.value === 'rose' ? 'radius' : undefined,
    label: {
      show: showLabel.value,
      formatter: '{b}: {c} ({d}%)'
    },
    labelLine: {
      show: showLabelLine.value
    },
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }))

  return {
    title: {
      text: 'Pie Chart Example',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: showLegend.value,
      orient: 'vertical',
      left: 'left'
    },
    series
  }
})

// Methods
const generateNewData = () => {
  chartData.value = generatePieData(sliceCount.value)
}

// Watchers
watch(sliceCount, () => {
  generateNewData()
})

// Listen for theme changes
const handleThemeChange = (event: CustomEvent) => {
  currentTheme.value = event.detail
}

onMounted(() => {
  window.addEventListener('theme-change', handleThemeChange as EventListener)
})
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>