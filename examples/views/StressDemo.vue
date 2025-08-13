<template>
  <div class="page">
    <h1>Stress Demo</h1>
    <p>Rapidly toggles theme, updates options, and triggers resize to validate stability.</p>

    <div class="controls">
      <button @click="toggleTheme">Toggle Theme ({{ isDark ? 'Dark' : 'Light' }})</button>
      <button @click="switchChart">Switch Chart ({{ currentIndex + 1 }}/{{ optionSets.length }})</button>
      <button @click="toggleDataZoom">Toggle DataZoom ({{ dataZoomVisible ? 'ON' : 'OFF' }})</button>
      <button @click="stressStart" :disabled="stressing">Start Stress</button>
      <button @click="stressStop" :disabled="!stressing">Stop Stress</button>
    </div>

    <div class="host" ref="hostRef">
      <MyndEcharts
        ref="chartRef"
        :options="computedOption"
        :theme="isDark ? 'dark' : 'default'"
        :auto-resize="true"
        :render-header="true"
        :show-toolbox="true"
        style="width: 100%; height: 480px"
        @toolbox-action="onToolboxAction"
      />
    </div>

    <details class="debug"><summary>State</summary>
      <pre>{{ JSON.stringify({ isDark, currentIndex, dataZoomVisible, stressing }, null, 2) }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { EChartsOption } from 'echarts'
import { MyndEcharts } from '@lib/index'

const isDark = ref(false)
const dataZoomVisible = ref(false)
const currentIndex = ref(0)
const chartRef = ref<InstanceType<typeof MyndEcharts> | null>(null)
const hostRef = ref<HTMLElement | null>(null)

const optionSets: EChartsOption[] = [
  {
    title: { text: 'Stress Line', left: 'center' },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, data: ['A', 'B'] },
    xAxis: { type: 'category', boundaryGap: false, data: Array.from({ length: 24 }, (_, i) => `${i}:00`) },
    yAxis: { type: 'value' },
    series: [
      { name: 'A', type: 'line', smooth: true, data: Array.from({ length: 24 }, () => Math.round(50 + Math.random() * 50)) },
      { name: 'B', type: 'line', smooth: true, data: Array.from({ length: 24 }, () => Math.round(40 + Math.random() * 60)) }
    ]
  },
  {
    title: { text: 'Stress Bar', left: 'center' },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0, data: ['A', 'B', 'C'] },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [
      { name: 'A', type: 'bar', data: [120, 200, 150, 80, 70, 110, 130] },
      { name: 'B', type: 'bar', data: [60, 100, 90, 50, 40, 80, 60] },
      { name: 'C', type: 'bar', data: [20, 40, 30, 10, 20, 30, 50] }
    ]
  }
]

const computedOption = computed<EChartsOption>(() => {
  const base = JSON.parse(JSON.stringify(optionSets[currentIndex.value] || optionSets[0]))
  // apply dataZoom visibility
  if (dataZoomVisible.value) {
    const dz = Array.isArray(base.dataZoom) ? base.dataZoom.slice() : (base.dataZoom ? [base.dataZoom] : [])
    const hasSlider = dz.some((z: any) => (z.type === 'slider' || !z.type))
    if (!hasSlider) dz.push({ type: 'slider', show: true, start: 0, end: 100, xAxisIndex: [0], filterMode: 'filter', realtime: true })
    base.dataZoom = dz
  }
  return base
})

function toggleTheme() { isDark.value = !isDark.value }
function switchChart() { currentIndex.value = (currentIndex.value + 1) % optionSets.length }
function toggleDataZoom() { dataZoomVisible.value = !dataZoomVisible.value }

function onToolboxAction(e: any) {
  if (e?.action === 'dataZoom') toggleDataZoom()
  if (e?.action === 'restore') dataZoomVisible.value = false
}

let timer: number | null = null
const stressing = ref(false)
function stressStart() {
  if (stressing.value) return
  stressing.value = true
  const step = () => {
    if (!stressing.value) return
    // random action
    const r = Math.random()
    if (r < 0.33) toggleTheme()
    else if (r < 0.66) switchChart()
    else toggleDataZoom()
    // schedule next
    timer = window.setTimeout(step, 150)
  }
  timer = window.setTimeout(step, 150)
}
function stressStop() {
  stressing.value = false
  if (timer) { clearTimeout(timer); timer = null }
}

onMounted(() => {
  // ensure initial theme classes
  document.documentElement.classList.toggle('dark', isDark.value)
  document.body.classList.toggle('dark', isDark.value)
})

onBeforeUnmount(() => { stressStop() })
</script>

<style scoped>
.page { max-width: 1200px; margin: 0 auto; padding: 16px; }
.controls { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0; }
.host { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: #fff; }
.debug { margin-top: 12px; }
</style>
