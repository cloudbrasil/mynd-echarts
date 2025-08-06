# mynd-echarts Documentation

## Table of Contents

- [Component API](#component-api)
  - [MyndEcharts Component](#myndecharts-component)
  - [Props](#props)
  - [Events](#events)
  - [Instance Methods](#instance-methods)
- [Composables](#composables)
  - [useECharts](#useecharts)
  - [useChartTheme](#usecharttheme)
  - [useChartAnimation](#usechartanimation)
  - [useChartData](#usechartdata)
  - [useChartOptions](#usechartoptions)
  - [useChartResize](#usechartresize)
- [TypeScript Support](#typescript-support)
- [Theme System](#theme-system)
- [Performance Optimization](#performance-optimization)

## Component API

### MyndEcharts Component

The main Vue component that wraps Apache ECharts functionality.

```vue
<template>
  <MyndEcharts
    :options="chartOptions"
    :theme="currentTheme"
    :loading="isLoading"
    @ready="handleChartReady"
    @click="handleChartClick"
  />
</template>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `EChartsOption` | **required** | ECharts configuration object |
| `theme` | `string \| object` | `'default'` | Chart theme - can be a theme name or custom theme object |
| `loading` | `boolean` | `false` | Show loading animation |
| `loadingOptions` | `object` | `{}` | Loading animation configuration |
| `style` | `CSSProperties` | `{}` | Custom inline styles |
| `className` | `string \| string[] \| Record<string, boolean>` | `''` | CSS class name(s) |
| `autoResize` | `boolean` | `true` | Enable automatic resize on container size change |
| `renderer` | `'canvas' \| 'svg'` | `'canvas'` | Rendering mode |
| `initOptions` | `object` | `{}` | Chart initialization options |
| `notMerge` | `boolean` | `false` | Whether to merge options |
| `lazyUpdate` | `boolean` | `false` | Enable lazy update for better performance |
| `silent` | `boolean` | `false` | Update options silently (no animation) |
| `group` | `string` | `undefined` | Group name for chart connection |

#### Loading Options

```typescript
interface LoadingOptions {
  text?: string;        // Loading text
  color?: string;       // Loading spinner color
  textColor?: string;   // Loading text color
  maskColor?: string;   // Mask background color
  zlevel?: number;      // Z-level for loading
  fontSize?: number;    // Font size for loading text
  showSpinner?: boolean; // Show loading spinner
  spinnerRadius?: number; // Spinner radius
  lineWidth?: number;    // Spinner line width
}
```

### Events

All native ECharts events are supported and re-emitted by the component:

| Event | Payload | Description |
|-------|---------|-------------|
| `ready` | `ECharts` | Emitted when chart instance is ready |
| `click` | `any` | Mouse click event |
| `dblclick` | `any` | Mouse double click event |
| `mousedown` | `any` | Mouse down event |
| `mousemove` | `any` | Mouse move event |
| `mouseup` | `any` | Mouse up event |
| `mouseover` | `any` | Mouse over event |
| `mouseout` | `any` | Mouse out event |
| `globalout` | `any` | Global out event |
| `contextmenu` | `any` | Context menu event |
| `highlight` | `any` | Series highlight event |
| `downplay` | `any` | Series downplay event |
| `selectchanged` | `any` | Selection change event |
| `legendselectchanged` | `any` | Legend selection change |
| `legendselected` | `any` | Legend selected |
| `legendunselected` | `any` | Legend unselected |
| `legendselectall` | `any` | Legend select all |
| `legendinverseselect` | `any` | Legend inverse select |
| `legendscroll` | `any` | Legend scroll event |
| `datazoom` | `any` | Data zoom event |
| `datarangeselected` | `any` | Data range selected |
| `graphroam` | `any` | Graph roam event |
| `georoam` | `any` | Geo roam event |
| `treeroam` | `any` | Tree roam event |
| `timelinechanged` | `any` | Timeline changed |
| `timelineplaychanged` | `any` | Timeline play changed |
| `restore` | `any` | Restore event |
| `dataviewchanged` | `any` | Data view changed |
| `magictypechanged` | `any` | Magic type changed |
| `pieselectchanged` | `any` | Pie selection changed |
| `pieselected` | `any` | Pie selected |
| `pieunselected` | `any` | Pie unselected |
| `mapselected` | `any` | Map selected |
| `mapunselected` | `any` | Map unselected |
| `axisareaselected` | `any` | Axis area selected |
| `brush` | `any` | Brush event |
| `brushEnd` | `any` | Brush end event |
| `brushselected` | `any` | Brush selected |
| `globalcursortaken` | `any` | Global cursor taken |
| `rendered` | `any` | Rendered event |
| `finished` | `any` | Finished rendering |

### Instance Methods

Access these methods via template ref:

```vue
<template>
  <MyndEcharts ref="chartRef" :options="options" />
</template>

<script setup>
const chartRef = ref()

// Access methods
chartRef.value.setOption(newOptions)
chartRef.value.resize()
</script>
```

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| `setOption` | `(options: EChartsOption, opts?: SetOptionOpts)` | `void` | Update chart options |
| `getOption` | `()` | `any` | Get current options |
| `resize` | `(opts?: ResizeOpts)` | `void` | Manually trigger resize |
| `dispose` | `()` | `void` | Dispose chart instance |
| `clear` | `()` | `void` | Clear chart content |
| `getWidth` | `()` | `number` | Get chart width |
| `getHeight` | `()` | `number` | Get chart height |
| `getDom` | `()` | `HTMLElement` | Get chart DOM element |
| `getDataURL` | `(opts?: DataURLOpts)` | `string` | Get chart as data URL |
| `getConnectedDataURL` | `(opts?: DataURLOpts)` | `string` | Get connected charts as data URL |
| `convertToPixel` | `(finder: any, value: any)` | `any` | Convert to pixel coordinates |
| `convertFromPixel` | `(finder: any, value: any)` | `any` | Convert from pixel coordinates |
| `containPixel` | `(finder: any, value: any)` | `boolean` | Check if contains pixel |
| `dispatchAction` | `(action: any)` | `void` | Dispatch action |
| `isDisposed` | `()` | `boolean` | Check if chart is disposed |

## Composables

### useECharts

Core composable for managing ECharts instances programmatically.

```typescript
import { useECharts } from '@abernardobr/mynd-echarts'

const { 
  chartInstance, 
  setOption, 
  resize, 
  dispose 
} = useECharts(elementRef, {
  theme: 'dark',
  autoResize: true,
  renderer: 'canvas'
})
```

#### Options

```typescript
interface UseEChartsOptions {
  theme?: string | object | Ref<string | object>
  renderer?: 'canvas' | 'svg'
  autoResize?: boolean
  resizeDebounce?: number
  initOptions?: {
    devicePixelRatio?: number
    renderer?: 'canvas' | 'svg'
    width?: number | string
    height?: number | string
    locale?: string
    useDirtyRect?: boolean
  }
  onReady?: (instance: ECharts) => void
  onDispose?: (instance: ECharts) => void
  events?: Record<string, (params: any) => void>
}
```

#### Return Value

```typescript
interface UseEChartsReturn {
  chartInstance: Ref<ECharts | undefined>
  setOption: (options: EChartsOption, opts?: SetOptionOpts) => void
  getOption: () => any
  resize: (opts?: ResizeOpts) => void
  clear: () => void
  dispose: () => void
  showLoading: (type?: string, opts?: any) => void
  hideLoading: () => void
  dispatchAction: (action: any) => void
  on: (eventName: string, handler: Function) => void
  off: (eventName: string, handler?: Function) => void
  getDataURL: (opts?: DataURLOpts) => string | undefined
  getConnectedDataURL: (opts?: DataURLOpts) => string | undefined
  connect: (group: string | ECharts[]) => void
  disconnect: (group: string) => void
  registerTheme: (name: string, theme: object) => void
  registerMap: (mapName: string, geoJson: any, specialAreas?: any) => void
}
```

### useChartTheme

Manage chart themes and theme switching.

```typescript
import { useChartTheme } from '@abernardobr/mynd-echarts'

const { 
  currentTheme, 
  setTheme, 
  registerTheme 
} = useChartTheme({
  defaultTheme: 'light',
  themes: [
    { name: 'custom', theme: customThemeObject }
  ]
})
```

#### Options

```typescript
interface UseChartThemeOptions {
  defaultTheme?: string
  themes?: Array<{
    name: string
    theme: object | string
  }>
}
```

#### Return Value

```typescript
interface UseChartThemeReturn {
  currentTheme: Ref<string>
  registeredThemes: Ref<Set<string>>
  registerTheme: (name: string, theme: object) => void
  setTheme: (themeName: string) => void
  getTheme: () => string
  getRegisteredThemes: () => string[]
  createDarkTheme: () => object
  createLightTheme: () => object
}
```

### useChartAnimation

Control chart animations and transitions.

```typescript
import { useChartAnimation } from '@abernardobr/mynd-echarts'

const { 
  animationConfig, 
  updateAnimation,
  createStaggeredAnimation 
} = useChartAnimation({
  duration: 1000,
  easing: 'cubicOut'
})
```

#### Options

```typescript
interface UseChartAnimationOptions {
  duration?: number
  easing?: string
  delay?: number | ((idx: number) => number)
  animationThreshold?: number
  animationDuration?: number | ((idx: number) => number)
  animationEasing?: string
  animationDelay?: number | ((idx: number) => number)
  animationDurationUpdate?: number | ((idx: number) => number)
  animationEasingUpdate?: string
  animationDelayUpdate?: number | ((idx: number) => number)
}
```

### useChartData

Utilities for data transformation and manipulation.

```typescript
import { useChartData } from '@abernardobr/mynd-echarts'

const { 
  transformData, 
  normalizeData,
  aggregateData 
} = useChartData()

// Transform flat data to hierarchical
const treeData = transformData(flatData, 'tree')

// Normalize data values
const normalized = normalizeData(data, { min: 0, max: 100 })
```

#### Methods

- `transformData(data: any[], format: string): any` - Transform data format
- `normalizeData(data: any[], options?: NormalizeOptions): any[]` - Normalize data values
- `aggregateData(data: any[], options?: AggregateOptions): any[]` - Aggregate data
- `filterData(data: any[], predicate: Function): any[]` - Filter data
- `sortData(data: any[], key: string, order?: 'asc' | 'desc'): any[]` - Sort data

### useChartOptions

Build and validate chart options with TypeScript support.

```typescript
import { useChartOptions } from '@abernardobr/mynd-echarts'

const { buildOptions, validateOptions } = useChartOptions()

const options = buildOptions({
  type: 'line',
  data: myData,
  title: 'Sales Chart'
})
```

### useChartResize

Advanced resize handling with debouncing and performance optimization.

```typescript
import { useChartResize } from '@abernardobr/mynd-echarts'

const { enableResize, disableResize } = useChartResize(chartInstance, {
  debounce: 200,
  onResize: (width, height) => {
    console.log('Chart resized:', width, height)
  }
})
```

## TypeScript Support

mynd-echarts provides comprehensive TypeScript support with full type definitions.

### Basic Types

```typescript
import type { 
  EChartsOption, 
  ECharts,
  SeriesOption,
  TitleComponentOption 
} from '@abernardobr/mynd-echarts'

// Typed chart options
const options: EChartsOption = {
  title: {
    text: 'My Chart'
  } as TitleComponentOption,
  series: [{
    type: 'line',
    data: [1, 2, 3]
  }] as SeriesOption[]
}
```

### Component Props Type

```typescript
import type { MyndEchartsProps } from '@abernardobr/mynd-echarts'

// In your component
defineProps<{
  chartProps: MyndEchartsProps
}>()
```

### Type Guards

```typescript
import { 
  isLineSeriesOption,
  isBarSeriesOption,
  isPieSeriesOption 
} from '@abernardobr/mynd-echarts'

if (isLineSeriesOption(series)) {
  // TypeScript knows this is a LineSeriesOption
  series.smooth = true
}
```

## Theme System

### Built-in Themes

mynd-echarts includes built-in light and dark themes:

```typescript
// Use built-in themes
<MyndEcharts :theme="isDark ? 'dark' : 'light'" />
```

### Custom Themes

Register custom themes:

```typescript
import { useChartTheme } from '@abernardobr/mynd-echarts'

const { registerTheme } = useChartTheme()

// Register a custom theme
registerTheme('myTheme', {
  color: ['#5470c6', '#91cc75', '#fac858'],
  backgroundColor: '#f5f5f5',
  textStyle: {
    color: '#333'
  },
  // ... more theme options
})

// Use the custom theme
<MyndEcharts theme="myTheme" />
```

### Dynamic Theme Switching

```typescript
const { currentTheme, setTheme } = useChartTheme()

// Switch theme dynamically
const toggleTheme = () => {
  setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
}
```

## Performance Optimization

### 1. Use Canvas Renderer for Large Datasets

```vue
<MyndEcharts 
  :options="options" 
  renderer="canvas"
  :init-options="{ devicePixelRatio: 1 }"
/>
```

### 2. Enable Lazy Update

```vue
<MyndEcharts 
  :options="options" 
  :lazy-update="true"
  :not-merge="false"
/>
```

### 3. Optimize Resize Performance

```typescript
const { chartInstance } = useECharts(elementRef, {
  autoResize: true,
  resizeDebounce: 300 // Increase debounce for better performance
})
```

### 4. Use Progressive Rendering

```typescript
const options: EChartsOption = {
  series: [{
    type: 'scatter',
    data: largeDataset,
    large: true,
    largeThreshold: 5000,
    progressive: 10000,
    progressiveThreshold: 30000
  }]
}
```

### 5. Dispose Unused Charts

```typescript
onUnmounted(() => {
  // Always dispose charts when component unmounts
  chartInstance.value?.dispose()
})
```

### 6. Use Data Sampling

```typescript
const options: EChartsOption = {
  series: [{
    type: 'line',
    data: veryLargeDataset,
    sampling: 'lttb', // or 'average', 'max', 'min', 'sum'
    samplingTarget: 1000 // Target number of points
  }]
}
```

### 7. Optimize Animation

```typescript
// Disable animation for better performance
const options: EChartsOption = {
  animation: false,
  // or selectively enable
  animationDuration: 300,
  animationThreshold: 5000 // Disable animation when data > 5000
}
```

### 8. Use Silent Updates

```vue
<!-- Update without triggering animations -->
<MyndEcharts 
  :options="options" 
  :silent="true"
/>
```