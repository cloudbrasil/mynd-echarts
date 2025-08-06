# mynd-echarts Composables

Vue 3 composables for common ECharts patterns and functionality.

## Available Composables

### `useECharts`
Core composable for ECharts instance management.

```typescript
import { useECharts } from 'mynd-echarts'

const { chartInstance, setOption, resize, dispose } = useECharts(elementRef, {
  theme: 'dark',
  renderer: 'canvas',
  autoResize: true,
  onReady: (instance) => console.log('Chart ready!')
})
```

**Features:**
- Automatic initialization and cleanup
- ResizeObserver support with fallback
- Event handler management
- Theme switching support
- Loading states
- Chart connection/disconnection

### `useChartTheme`
Manage chart themes dynamically.

```typescript
import { useChartTheme } from 'mynd-echarts'

const { currentTheme, setTheme, registerTheme } = useChartTheme({
  defaultTheme: 'light'
})

// Register custom theme
registerTheme('custom', {
  color: ['#5470c6', '#91cc75', '#fac858'],
  backgroundColor: '#f5f5f5'
})

// Switch theme
setTheme('dark')
```

**Built-in themes:**
- `light` - Light theme with white background
- `dark` - Dark theme with dark background

### `useChartResize`
Advanced resize handling for responsive charts.

```typescript
import { useChartResize } from 'mynd-echarts'

const { isResizing, forceResize } = useChartResize(
  elementRef,
  () => chart.resize(),
  {
    mode: 'debounce',
    delay: 200,
    observeParent: true
  }
)
```

**Options:**
- `mode` - 'debounce' or 'throttle'
- `delay` - Delay in milliseconds
- `observeParent` - Also observe parent element
- `onResize` - Custom resize callback

### `useChartEvents`
Comprehensive event handling system.

```typescript
import { useChartEvents } from 'mynd-echarts'

const { on, off, once } = useChartEvents(chartInstance, {
  click: (params) => console.log('Clicked:', params),
  mouseover: (params) => console.log('Hover:', params)
})

// Add event dynamically
on('legendselectchanged', (params) => {
  console.log('Legend changed:', params)
})

// One-time event
once('finished', () => console.log('Rendering finished'))
```

**Supported events:**
- Mouse events: click, dblclick, mousedown, mousemove, etc.
- Legend events: legendselectchanged, legendselected, etc.
- Data events: datazoom, datarangeselected, etc.
- And 30+ more events

### `useChartAnimation`
Control chart animations and transitions.

```typescript
import { useChartAnimation } from 'mynd-echarts'

const { isAnimating, animateToOption, fadeIn } = useChartAnimation(
  chartInstance,
  {
    defaultAnimation: {
      duration: 1000,
      easing: 'cubicOut'
    }
  }
)

// Animate to new options
animateToOption(newOptions)

// Fade in effect
fadeIn(500)

// Transition between states
transitionTo(fromOptions, toOptions, 2000)
```

### `useChartOptions`
Manage and validate chart options.

```typescript
import { useChartOptions } from 'mynd-echarts'

const { options, isValid, errors, setOptions } = useChartOptions(
  {
    xAxis: { type: 'category' },
    yAxis: { type: 'value' }
  },
  {
    validateOptions: true,
    transformer: (opts) => ({
      ...opts,
      animation: true
    })
  }
)

// Update specific option
updateOption('title.text', 'New Title')

// Merge options
mergeOptions({ series: [...] })
```

**Features:**
- Option validation
- Deep watching
- Path-based updates
- Option transformation
- Error tracking

### `useChartData`
Data management with statistics and transformations.

```typescript
import { useChartData } from 'mynd-echarts'

const { chartData, stats, setData, appendData } = useChartData({
  transformer: (data) => data.map(d => ({
    value: d.sales,
    name: d.date
  })),
  maxDataPoints: 100
})

// Load data asynchronously
await loadData(async () => {
  const response = await fetch('/api/data')
  return response.json()
})

// Access statistics
console.log('Average:', stats.value.average)
console.log('Max:', stats.value.max)
```

**Features:**
- Data transformation
- Automatic statistics calculation
- Real-time data updates
- Data validation
- Caching support
- Async data loading

## Combining Composables

Example of using multiple composables together:

```vue
<template>
  <div ref="chartRef" :style="{ height: '400px' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  useECharts, 
  useChartTheme, 
  useChartData,
  useChartOptions 
} from 'mynd-echarts'

const chartRef = ref<HTMLElement>()

// Theme management
const { currentTheme, setTheme } = useChartTheme()

// Data management
const { chartData, loadData, stats } = useChartData({
  transformer: (data) => data.map(d => d.value)
})

// Options management
const { options, mergeOptions } = useChartOptions({
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  series: [{
    type: 'line',
    data: []
  }]
})

// Chart instance
const { chartInstance, setOption } = useECharts(chartRef, {
  theme: currentTheme.value,
  autoResize: true
})

// Load and display data
onMounted(async () => {
  await loadData(() => fetch('/api/data').then(r => r.json()))
  
  mergeOptions({
    series: [{
      data: chartData.value
    }]
  })
  
  setOption(options.value)
})
</script>
```

## Best Practices

1. **Always dispose charts** - Call `dispose()` in `onUnmounted`
2. **Use appropriate resize mode** - Debounce for frequent updates, throttle for smooth animations
3. **Validate options** - Use `useChartOptions` for complex configurations
4. **Transform data once** - Use `transformer` in `useChartData` for efficiency
5. **Register themes globally** - Share themes across multiple charts
6. **Handle errors** - Check `isValid` and `errors` from composables

## TypeScript Support

All composables are fully typed with comprehensive TypeScript definitions:

```typescript
import type { 
  UseEChartsReturn,
  UseChartThemeReturn,
  UseChartDataReturn,
  ChartEventMap,
  ChartAnimationConfig
} from 'mynd-echarts'
```