<template>
  <div class="page">
    <ChartWrapper
      title="Line Chart"
      description="Display trends over time with smooth or stepped lines"
      :options="chartOptions"
      :theme="currentTheme"
      @refresh="generateNewData"
    >
      <template #controls>
        <div class="control-group">
          <label class="control-label">Number of Series</label>
          <input
            type="range"
            v-model.number="seriesCount"
            min="1"
            max="5"
            class="control-input"
          />
          <span>{{ seriesCount }}</span>
        </div>
        
        <div class="control-group">
          <label class="control-label">Data Points</label>
          <input
            type="range"
            v-model.number="dataPoints"
            min="5"
            max="50"
            class="control-input"
          />
          <span>{{ dataPoints }}</span>
        </div>
        
        <div class="control-group">
          <label class="control-label">
            <input type="checkbox" v-model="smooth" />
            Smooth Lines
          </label>
        </div>
        
        <div class="control-group">
          <label class="control-label">
            <input type="checkbox" v-model="showArea" />
            Show Area
          </label>
        </div>
        
        <div class="control-group">
          <label class="control-label">
            <input type="checkbox" v-model="showSymbol" />
            Show Symbols
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
import { generateLineData } from '../data/generators'
import { useChartTheme } from '@lib/composables'

const { currentTheme } = useChartTheme()

// Controls
const seriesCount = ref(2)
const dataPoints = ref(12)
const smooth = ref(true)
const showArea = ref(false)
const showSymbol = ref(true)

// Data
const chartData = ref(generateLineData(seriesCount.value, dataPoints.value))

// Computed options
const chartOptions = computed<EChartsOption>(() => {
  const series = chartData.value.series.map((s, index) => ({
    ...s,
    smooth: smooth.value,
    showSymbol: showSymbol.value,
    areaStyle: showArea.value ? {} : undefined,
    emphasis: {
      focus: 'series'
    }
  }))

  return {
    title: {
      text: 'Line Chart Example',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
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
      type: 'category',
      boundaryGap: false,
      data: chartData.value.xData
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series
  }
})

// Methods
const generateNewData = () => {
  chartData.value = generateLineData(seriesCount.value, dataPoints.value)
}

// Watchers
watch([seriesCount, dataPoints], () => {
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