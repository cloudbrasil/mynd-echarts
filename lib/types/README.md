# mynd-echarts Type System

This directory contains comprehensive TypeScript definitions for the mynd-echarts Vue 3 component wrapper.

## Structure

### `echarts.ts`
Re-exports all ECharts types for convenient access:
- Core types: `ECharts`, `EChartsOption`, `SetOptionOpts`
- Series types: `LineSeriesOption`, `BarSeriesOption`, etc.
- Component types: `TitleComponentOption`, `LegendComponentOption`, etc.
- Event types: Various event parameter types

### `component.ts`
Component-specific interfaces with full JSDoc documentation:
- `MyndEchartsProps` - Component props interface
- `MyndEchartsEmits` - Component events interface
- `MyndEchartsInstance` - Component instance methods
- `MyndEchartsLoadingOptions` - Loading animation options
- Various configuration interfaces

### `guards.ts`
Type guards and validation functions:
- `isEChartsInstance()` - Check if value is an ECharts instance
- `isEChartsOption()` - Validate ECharts options
- Series type guards: `isLineSeries()`, `isBarSeries()`, etc.
- Utility validators: `isValidRenderer()`, `isColorString()`, etc.

### `generics.ts`
Generic types for type-safe chart creation:
- `TypedChartOption<T>` - Create typed options for specific chart types
- `MultiSeriesChartOption<T>` - Type-safe multi-series charts
- `SeriesTypeMap` - Map of series types to their options
- Utility types: `DeepPartial`, `RequiredProps`, etc.
- Pre-configured chart types: `LineChartConfig`, `BarChartConfig`, etc.

### `utilities.ts`
Helper functions and utility types:
- `mergeOptions()` - Safely merge multiple chart options
- `createResponsiveOption()` - Create responsive charts
- `formatChartData()` - Format data with type safety
- Axis creators: `createTimeAxis()`, `createCategoryAxis()`, etc.
- `generateColorPalette()` - Generate color schemes
- `createTooltipFormatter()` - Create formatted tooltips

## Usage Examples

### Type-Safe Chart Creation

```typescript
import { TypedChartOption, createSeries } from 'mynd-echarts'

// Type-safe line chart
const lineChart: TypedChartOption<'line'> = {
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  yAxis: { type: 'value' },
  series: createSeries('line', {
    data: [120, 200, 150],
    smooth: true
  })
}

// Multi-series with different types
const multiChart: MultiSeriesChartOption<['line', 'bar']> = {
  series: [
    createSeries('line', { data: [1, 2, 3] }),
    createSeries('bar', { data: [4, 5, 6] })
  ]
}
```

### Using Type Guards

```typescript
import { isEChartsInstance, isLineSeries } from 'mynd-echarts'

// Validate chart instance
if (isEChartsInstance(chartRef.value)) {
  chartRef.value.setOption(options)
}

// Check series type
const series = chart.getOption().series[0]
if (isLineSeries(series)) {
  console.log('Line series smooth:', series.smooth)
}
```

### Responsive Charts

```typescript
import { createResponsiveOption } from 'mynd-echarts'

const responsiveChart = createResponsiveOption(
  baseOption,
  [
    {
      minWidth: 768,
      option: { grid: { left: '10%', right: '10%' } }
    },
    {
      maxWidth: 767,
      option: { grid: { left: '5%', right: '5%' } }
    }
  ]
)
```

### Utility Functions

```typescript
import { 
  mergeOptions, 
  formatNumber, 
  createTooltipFormatter,
  generateColorPalette 
} from 'mynd-echarts'

// Merge options safely
const merged = mergeOptions(defaultOptions, userOptions)

// Format numbers
formatNumber(1500) // "1.5K"
formatNumber(2500000) // "2.5M"

// Create tooltip formatter
const formatter = createTooltipFormatter({
  prefix: '$',
  suffix: ' USD',
  decimals: 2
})

// Generate colors
const colors = generateColorPalette(['#5470c6', '#91cc75'], 10)
```