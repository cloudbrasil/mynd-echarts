# mynd-echarts

A powerful Vue 3 wrapper component for Apache ECharts with full TypeScript support.

[![npm version](https://badge.fury.io/js/@docbrasil%2Fmynd-echarts.svg)](https://www.npmjs.com/package/@docbrasil/mynd-echarts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Features

- 🚀 **Vue 3 Composition API** - Built with the latest Vue 3 features
- 📊 **Full ECharts Support** - Access to all ECharts chart types and features
- 🎨 **Theme System** - Built-in light/dark themes with custom theme support
- 📱 **Responsive** - Automatic resize handling with performance optimization
- 🔧 **TypeScript** - Comprehensive type definitions and IntelliSense support
- ⚡ **Performance** - Optimized rendering with lazy loading and debouncing
- 🎯 **Developer Friendly** - Intuitive API with Vue-style props and events

## 📦 Installation

```bash
# npm
npm install @docbrasil/mynd-echarts echarts

# yarn
yarn add @docbrasil/mynd-echarts echarts
```

## 🚀 Quick Start

```vue
<template>
  <MyndEcharts :options="chartOptions" :theme="theme" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MyndEcharts } from '@docbrasil/mynd-echarts'
import type { EChartsOption } from '@docbrasil/mynd-echarts'

const theme = ref('light')

const chartOptions: EChartsOption = {
  title: {
    text: 'My First Chart'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: 'Sales',
    type: 'line',
    data: [150, 230, 224, 218, 135, 147, 260]
  }]
}
</script>
```

## 📚 Documentation

For detailed documentation, please visit:
- 📖 [Full Documentation](./DOCUMENTATION.md)
- 🌐 [Live Demo & Examples](https://echarts.myndware.io)

## 🔄 Migration from Vanilla ECharts

### Before (Vanilla ECharts)
```javascript
import * as echarts from 'echarts'

const chartDom = document.getElementById('main')
const myChart = echarts.init(chartDom, 'dark')

const option = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [150, 230, 224, 218, 135, 147, 260],
    type: 'line'
  }]
}

myChart.setOption(option)

// Handle resize
window.addEventListener('resize', () => {
  myChart.resize()
})

// Cleanup
window.removeEventListener('resize', handleResize)
myChart.dispose()
```

### After (mynd-echarts)
```vue
<template>
  <MyndEcharts :options="options" theme="dark" auto-resize />
</template>

<script setup>
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const options = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [150, 230, 224, 218, 135, 147, 260],
    type: 'line'
  }]
}
</script>
```

### Key Differences

1. **No Manual DOM Management** - Vue handles all DOM operations
2. **Automatic Cleanup** - Chart disposal is handled automatically
3. **Built-in Resize** - ResizeObserver is integrated with `auto-resize` prop
4. **Reactive Options** - Chart updates automatically when options change
5. **Event Handling** - Use Vue's `@event` syntax instead of `.on()`

## 💡 TypeScript Usage

### Basic Setup
```typescript
import { MyndEcharts } from '@docbrasil/mynd-echarts'
import type { EChartsOption, LineSeriesOption } from '@docbrasil/mynd-echarts'

// Fully typed options
const options: EChartsOption = {
  series: [{
    type: 'line',
    smooth: true,
    data: [1, 2, 3]
  } as LineSeriesOption]
}
```

### Using with Refs
```typescript
import { ref } from 'vue'
import type { MyndEchartsProps } from '@docbrasil/mynd-echarts'

const chartRef = ref<InstanceType<typeof MyndEcharts>>()

// Access chart instance methods
const exportChart = () => {
  const dataURL = chartRef.value?.getDataURL({
    type: 'png',
    pixelRatio: 2
  })
}
```

### Custom Types
```typescript
interface ChartData {
  name: string
  value: number
}

const createChartOptions = (data: ChartData[]): EChartsOption => ({
  series: [{
    type: 'pie',
    data: data.map(item => ({
      name: item.name,
      value: item.value
    }))
  }]
})
```

## 🎯 Best Practices

### 1. Use Computed for Dynamic Options
```typescript
const chartOptions = computed<EChartsOption>(() => ({
  series: [{
    type: 'line',
    data: processedData.value
  }]
}))
```

### 2. Optimize Large Datasets
```vue
<MyndEcharts
  :options="options"
  :init-options="{ renderer: 'canvas' }"
  :lazy-update="true"
/>
```

### 3. Handle Loading States
```vue
<MyndEcharts
  :options="options"
  :loading="isLoading"
  :loading-options="{
    text: 'Loading data...',
    color: '#4299e1',
    maskColor: 'rgba(255, 255, 255, 0.8)'
  }"
/>
```

### 4. Use Theme Switching
```typescript
const { isDarkMode } = useAppTheme()
const theme = computed(() => isDarkMode.value ? 'dark' : 'light')
```

## ⚡ Performance Tips

1. **Use Canvas for Large Data** - SVG rendering can be slow with many data points
2. **Enable Progressive Rendering** - For datasets > 10k points
3. **Debounce Updates** - Avoid frequent re-renders
4. **Dispose Unused Charts** - Prevent memory leaks
5. **Use Data Sampling** - Reduce points while maintaining visual accuracy

See [DOCUMENTATION.md](./DOCUMENTATION.md#performance-optimization) for detailed performance guide.

## 🛠️ Advanced Usage

### Using Composables
```typescript
import { useECharts, useChartTheme } from '@docbrasil/mynd-echarts'

const elementRef = ref<HTMLElement>()
const { setOption, resize, dispose } = useECharts(elementRef, {
  theme: 'dark',
  autoResize: true
})

const { currentTheme, setTheme } = useChartTheme()
```

### Chart Interactions
```vue
<template>
  <MyndEcharts
    :options="options"
    @click="handleClick"
    @legendselectchanged="handleLegendChange"
  />
</template>

<script setup>
const handleClick = (params) => {
  console.log('Chart clicked:', params)
}

const handleLegendChange = (params) => {
  console.log('Legend changed:', params)
}
</script>
```

## 🧪 Testing

### Test Coverage (as of August 6, 2025)

| Category | Coverage | Status |
|----------|----------|---------|
| **Statements** | 85.02% | ✅ |
| **Branches** | 87.38% | ✅ |
| **Functions** | 43.54% | ⚠️ |
| **Lines** | 85.02% | ✅ |

#### Detailed Coverage by Module

| Module | Coverage | Description |
|--------|----------|-------------|
| **Composables** | 95.64% | Core logic and hooks |
| **Utilities** | 100% | Helper functions |
| **Type Guards** | 82.29% | Type checking utilities |
| **Locales** | 100% | Internationalization |
| **Components** | 69.33% | Vue components |

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test tests/unit/composables/useECharts.spec.ts

# Watch mode
npm run test:watch
```

### Test Stack

- **Framework**: Vitest
- **Component Testing**: @vue/test-utils
- **Coverage**: c8
- **Assertions**: Built-in Vitest assertions

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Credits

Built with ❤️ by the Myndware team. Powered by [Apache ECharts](https://echarts.apache.org/).
