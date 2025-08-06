<template>
  <div class="page">
    <ChartWrapper
      title="Bar Chart"
      description="Compare values across categories with vertical or horizontal bars"
      :options="chartOptions"
      :theme="currentTheme"
      @refresh="generateNewData"
    >
      <template #controls>
        <div class="control-group">
          <label class="control-label">Number of Groups</label>
          <input
            type="range"
            v-model.number="groupCount"
            min="3"
            max="10"
            class="control-input"
          />
          <span>{{ groupCount }}</span>
        </div>
        
        <div class="control-group">
          <label class="control-label">Number of Series</label>
          <input
            type="range"
            v-model.number="seriesCount"
            min="1"
            max="4"
            class="control-input"
          />
          <span>{{ seriesCount }}</span>
        </div>
        
        <div class="control-group">
          <label class="control-label">Bar Layout</label>
          <select v-model="barLayout" class="control-select">
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
        
        <div class="control-group">
          <label class="control-label">
            <input type="checkbox" v-model="stack" />
            Stack Bars
          </label>
        </div>
        
        <div class="control-group">
          <label class="control-label">
            <input type="checkbox" v-model="showLabel" />
            Show Labels
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
import { generateBarData } from '../data/generators'
import { useChartTheme } from '@lib/composables'

const { currentTheme } = useChartTheme()

// Controls
const groupCount = ref(5)
const seriesCount = ref(2)
const barLayout = ref<'vertical' | 'horizontal'>('vertical')
const stack = ref(false)
const showLabel = ref(false)

// Data
const chartData = ref(generateBarData(groupCount.value, seriesCount.value))

// Computed options
const chartOptions = computed<EChartsOption>(() => {
  const isHorizontal = barLayout.value === 'horizontal'
  const series = chartData.value.series.map((s, index) => ({
    ...s,
    stack: stack.value ? 'total' : undefined,
    label: {
      show: showLabel.value,
      position: stack.value ? 'inside' : 'top'
    },
    emphasis: {
      focus: 'series'
    }
  }))

  return {
    title: {
      text: 'Bar Chart Example',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      bottom: 0,
      data: series.map(s => s.name)
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: isHorizontal ? 'value' : 'category',
      data: isHorizontal ? undefined : chartData.value.xData
    },
    yAxis: {
      type: isHorizontal ? 'category' : 'value',
      data: isHorizontal ? chartData.value.xData : undefined
    },
    series
  }
})

// Methods
const generateNewData = () => {
  chartData.value = generateBarData(groupCount.value, seriesCount.value)
}

// Watchers
watch([groupCount, seriesCount], () => {
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