# mynd-echarts API

A modern Vue 3 wrapper for Apache ECharts with first-class TypeScript support, adaptive sizing, theme awareness (light/dark), and a built-in header toolbox and config/data dialogs.

## Installation

```bash
npm install @docbrasil/mynd-echarts echarts
```

Import styles once in your app entry:

```ts
import '@docbrasil/mynd-echarts/dist/style.css'
```

## Exports

```ts
import {
  // Components
  MyndEcharts,
  ToastContainer,
  ChartToolbox,
  DataViewDialog,

  // Composables
  useECharts,
  useChartTheme,
  useChartResize,
  useChartEvents,
  useChartAnimation,
  useChartOptions,
  useChartData,
  useToast,
  useLocale,

  // Types, Locales, Utils
  // (all re-exported from lib/types, lib/locales, lib/utils)
  throttle,
  debounce
} from '@docbrasil/mynd-echarts'
```

## Quick start

```vue
<template>
  <MyndEcharts :options="options" :auto-resize="true" />
</template>

<script setup lang="ts">
import { MyndEcharts } from '@docbrasil/mynd-echarts'
import type { EChartsOption } from 'echarts'

const options: EChartsOption = {
  title: { text: 'Sales' },
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150, 80, 70] }]
}
</script>
```

## MyndEcharts component API

### Props

- options: EChartsOption (required)
  - Main ECharts configuration object.
- theme: string | object (default: 'default')
  - Theme name or object. 'dark' enables dark mode, 'light' disables.
- isDarkMode: boolean
  - Explicit UI dark mode override for header/dialogs. Overrides theme hints and DOM detection.
- preferThemeDefaults: boolean (default: false)
  - If true, strips common hard-coded colors from options so active theme can fully style the chart.
- style: CSSProperties
  - Inline styles for chart container.
- className: string | string[] | Record<string, boolean>
  - Class names for chart container.
- autoResize: boolean (default: true)
  - Auto-resize using ResizeObserver.
- renderer: 'canvas' | 'svg' (default: 'canvas')
- initOptions: EChartsInitOpts
  - Extra echarts.init options (devicePixelRatio, width, height, locale, useDirtyRect).
- notMerge: boolean (default: false)
- lazyUpdate: boolean (default: false)
- silent: boolean (default: false)
- group: string
  - ECharts group for synchronized charts.
- locale: string (default: 'en') and v-model:locale
  - Controls ECharts locale used in native UI; two-way bound via update:locale.
- chartHeight: number (default: 400)
  - Explicit pixel height for the chart area.
- aspectRatio: number | string
  - Adaptive height using a ratio (e.g. 16:9, 1.6). Ignored if chartHeight is set.
- renderHeader: boolean (default: true)
  - Render custom header (title + toolbox) instead of native ECharts title/toolbox.
- showToolbox: boolean (default: true)
  - Show header toolbox actions (Save as Image, Restore, Data View, Data Zoom toggle).
- toolboxStyle: 'toolbar' | 'menu' (default: 'toolbar')
  - Toolbox look-and-feel.
- showZoomBar: boolean (default: false)
  - Show bottom zoom bar that window-slices category axis and series.

Deprecated props (no longer used; kept for backwards compatibility):
- toolboxMode: 'auto' | 'fixed' | 'disabled'
- toolboxPosition: { right?: number, left?: number, top?: number, bottom?: number }
- fixToolboxOverlap: boolean
- debugToolbox: boolean

### Events

- ready: (instance: ECharts) => void
- rendered: (params: any) => void
- finished: (params: any) => void
- click: (params: any) => void
- dblclick: (params: any) => void
- datazoom: (params: any) => void
- update:options: (options: EChartsOption) => void
- update:locale: (locale: string) => void
- toolbox-action: (payload: { action: string; payload?: any }) => void
  - Emitted when a header toolbox item is activated. Actions include: 'saveAsImage', 'restore', 'dataView', 'dataZoom'.

Note: Not all raw ECharts events are forwarded by the component. For advanced event handling, use getChartInstance() to attach listeners directly, or use the useECharts composable.

### Instance methods (via template ref)

```vue
<MyndEcharts ref="chartRef" :options="options" />
```

- setOption(options: EChartsOption, opts?: SetOptionOpts): void
- resize(opts?: Parameters<ECharts['resize']>[0]): void
- dispose(): void
- getChartInstance(): ECharts | undefined
- getWidth(): number | undefined
- getHeight(): number | undefined
- getDom(): HTMLElement | undefined
- getDataURL(opts?): string | undefined
- getConnectedDataURL(opts?): string | undefined
- convertToPixel(finder, value): any
- convertFromPixel(finder, value): any
- containPixel(finder, value): boolean | undefined
- dispatchAction(action): void
- isDisposed(): boolean | undefined
- openConfig(): void

Notes:
- getOption(): The wrapper intentionally does not expose processed options via getOption. Keep your source options in app state and update via setOption or v-model:options flows where applicable.
- clear(): No-op. Prefer setOption with notMerge: true to fully replace options.

### Header toolbox and zoom bar

When renderHeader is true (default), native ECharts title/toolbox are stripped from the options and replaced by a custom header with:
- Title/subtitle extracted from options.title (including link/sublink targets)
- A configurable toolbox with actions
- Optional bottom ZoomBar that window-slices category axis and series based on start/end percentages

Example:

```vue
<template>
  <MyndEcharts
    :options="options"
    :show-toolbox="true"
    toolbox-style="toolbar"
    :show-zoom-bar="true"
    v-model:locale="locale"
  />
</template>
```

## Composables (summary)

- useECharts(elRef, options?): Low-level control over echarts.init lifecycle, events, and helpers (connect, registerMap, registerTheme, etc.).
- useChartTheme(): Manage themes and switching.
- useChartOptions(), useChartData(), useChartAnimation(), useChartEvents(), useChartResize(): Focused helpers for common scenarios.
- useToast(), useLocale(): UI helpers used by the demo/config/dialogs.

See source in `lib/composables/` for full details; all composables are re-exported from the package entry.

## TypeScript

Types are re-exported. Common imports:

```ts
import type {
  ECharts,
  EChartsOption,
  SetOptionOpts
} from '@docbrasil/mynd-echarts'

import type { MyndEchartsProps, MyndEchartsInstance } from '@docbrasil/mynd-echarts'
```
