<template>
  <div style="padding: 20px;">
    <h2>Test Chart</h2>
    <div style="width: 600px; height: 400px; border: 1px solid #ccc;">
      <MyndEcharts
        :options="chartOptions"
        :theme="theme"
        style="width: 100%; height: 100%;"
      />
    </div>
    <button @click="toggleTheme" style="margin-top: 10px;">
      Toggle Theme (Current: {{ theme }})
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MyndEcharts } from '@lib/index'
import type { EChartsOption } from 'echarts'

const theme = ref('light')

const chartOptions: EChartsOption = {
  title: {
    text: 'Test Chart'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar'
  }]
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>