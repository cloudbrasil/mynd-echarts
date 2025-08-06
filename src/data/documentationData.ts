export interface DocSection {
  id: string
  title: string
  icon: string
  content: string
  subsections?: {
    id: string
    title: string
    content: string
  }[]
}

export const documentationSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'rocket_launch',
    content: `
# Getting Started

## Installation

\`\`\`bash
# npm
npm install @abernardobr/mynd-echarts echarts

# yarn
yarn add @abernardobr/mynd-echarts echarts
\`\`\`

## Basic Usage

\`\`\`vue
<template>
  <MyndEcharts :options="chartOptions" />
</template>

<script setup>
import { MyndEcharts } from '@abernardobr/mynd-echarts'

const chartOptions = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [120, 200, 150, 80, 70],
    type: 'bar'
  }]
}
</script>
\`\`\`
    `
  },
  {
    id: 'component-api',
    title: 'Component API',
    icon: 'api',
    content: '',
    subsections: [
      {
        id: 'props',
        title: 'Props',
        content: ''
      },
      {
        id: 'events',
        title: 'Events',
        content: ''
      },
      {
        id: 'methods',
        title: 'Methods',
        content: ''
      }
    ]
  },
  {
    id: 'composables',
    title: 'Composables',
    icon: 'functions',
    content: `
# Composables

## useECharts

Core composable for managing ECharts instances.

\`\`\`typescript
import { useECharts } from '@abernardobr/mynd-echarts'

const { chartInstance, setOption, resize } = useECharts(elementRef, {
  theme: 'dark',
  autoResize: true
})
\`\`\`

## useChartTheme

Manage chart themes and theme switching.

\`\`\`typescript
import { useChartTheme } from '@abernardobr/mynd-echarts'

const { currentTheme, setTheme } = useChartTheme({
  defaultTheme: 'light'
})

// Switch theme
setTheme('dark')
\`\`\`

## useChartAnimation

Control chart animations.

\`\`\`typescript
import { useChartAnimation } from '@abernardobr/mynd-echarts'

const { animationConfig } = useChartAnimation({
  duration: 1000,
  easing: 'cubicOut'
})
\`\`\`
    `
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    icon: 'code',
    content: `
# TypeScript Support

## Type Imports

\`\`\`typescript
import type { 
  EChartsOption, 
  LineSeriesOption,
  BarSeriesOption 
} from '@abernardobr/mynd-echarts'
\`\`\`

## Typed Options

\`\`\`typescript
const options: EChartsOption = {
  title: {
    text: 'Sales Data'
  },
  series: [{
    type: 'line',
    smooth: true,
    data: [1, 2, 3]
  } as LineSeriesOption]
}
\`\`\`

## Component Props Type

\`\`\`typescript
import type { MyndEchartsProps } from '@abernardobr/mynd-echarts'

interface Props extends MyndEchartsProps {
  customProp?: string
}
\`\`\`

## Type Guards

\`\`\`typescript
import { isLineSeriesOption } from '@abernardobr/mynd-echarts'

if (isLineSeriesOption(series)) {
  series.smooth = true
}
\`\`\`
    `
  },
  {
    id: 'themes',
    title: 'Themes',
    icon: 'palette',
    content: `
# Theme System

## Built-in Themes

\`\`\`vue
<MyndEcharts :theme="isDark ? 'dark' : 'light'" />
\`\`\`

## Custom Themes

\`\`\`typescript
import { useChartTheme } from '@abernardobr/mynd-echarts'

const { registerTheme } = useChartTheme()

registerTheme('myTheme', {
  color: ['#5470c6', '#91cc75'],
  backgroundColor: '#f5f5f5',
  textStyle: {
    color: '#333'
  }
})
\`\`\`

## Theme Configuration

\`\`\`typescript
const darkTheme = {
  textStyle: { color: '#eee' },
  title: { textStyle: { color: '#eee' } },
  legend: { textStyle: { color: '#ccc' } },
  xAxis: { axisLabel: { color: '#ccc' } },
  yAxis: { axisLabel: { color: '#ccc' } }
}
\`\`\`
    `
  },
  {
    id: 'performance',
    title: 'Performance',
    icon: 'speed',
    content: `
# Performance Optimization

## Large Datasets

\`\`\`vue
<MyndEcharts 
  :options="options"
  renderer="canvas"
  :lazy-update="true"
/>
\`\`\`

## Progressive Rendering

\`\`\`typescript
const options = {
  series: [{
    type: 'scatter',
    data: largeDataset,
    large: true,
    largeThreshold: 5000,
    progressive: 10000
  }]
}
\`\`\`

## Data Sampling

\`\`\`typescript
const options = {
  series: [{
    type: 'line',
    data: veryLargeDataset,
    sampling: 'lttb',
    samplingTarget: 1000
  }]
}
\`\`\`

## Resize Debouncing

\`\`\`typescript
const { chartInstance } = useECharts(elementRef, {
  autoResize: true,
  resizeDebounce: 300
})
\`\`\`
    `
  },
  {
    id: 'migration',
    title: 'Migration Guide',
    icon: 'swap_horiz',
    content: `
# Migration from Vanilla ECharts

## Before (Vanilla)

\`\`\`javascript
import * as echarts from 'echarts'

const chart = echarts.init(document.getElementById('chart'))
chart.setOption(options)

window.addEventListener('resize', () => {
  chart.resize()
})

// Cleanup
chart.dispose()
\`\`\`

## After (mynd-echarts)

\`\`\`vue
<template>
  <MyndEcharts :options="options" auto-resize />
</template>

<script setup>
import { MyndEcharts } from '@abernardobr/mynd-echarts'
// No manual cleanup needed!
</script>
\`\`\`

## Key Differences

1. **No DOM Management** - Vue handles it
2. **Automatic Cleanup** - No manual dispose
3. **Built-in Resize** - No event listeners
4. **Reactive Updates** - Options are reactive
5. **Event Handling** - Use \`@event\` syntax
    `
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    icon: 'star',
    content: `
# Best Practices

## 1. Use Computed for Dynamic Options

\`\`\`typescript
const chartOptions = computed(() => ({
  series: [{
    type: 'line',
    data: processedData.value
  }]
}))
\`\`\`

## 2. Handle Loading States

\`\`\`vue
<MyndEcharts 
  :options="options"
  :loading="isLoading"
  :loading-options="{
    text: 'Loading...',
    color: '#4299e1'
  }"
/>
\`\`\`

## 3. Dispose Unused Charts

\`\`\`typescript
onUnmounted(() => {
  chartInstance.value?.dispose()
})
\`\`\`

## 4. Use Keys for Force Updates

\`\`\`vue
<MyndEcharts 
  :options="options"
  :key="chartKey"
/>
\`\`\`

## 5. Optimize Re-renders

\`\`\`typescript
// Avoid creating new objects
const stableOptions = shallowRef({
  // options
})
\`\`\`
    `
  }
]