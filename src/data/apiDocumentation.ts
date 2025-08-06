export const apiDocumentation = {
  props: `
# Props

## Required Props

### options
- **Type**: \`EChartsOption\`
- **Required**: Yes
- **Description**: The main configuration object for ECharts. This prop contains all the settings for your chart including data, series, axes, tooltips, etc.

\`\`\`vue
<template>
  <MyndEcharts :options="chartOptions" />
</template>

<script setup>
const chartOptions = {
  title: { text: 'Sales Data' },
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150] }]
}
</script>
\`\`\`

## Style Props

### style
- **Type**: \`CSSProperties\`
- **Default**: \`{}\`
- **Description**: Custom inline styles to apply to the chart container.

\`\`\`vue
<MyndEcharts 
  :options="options" 
  :style="{ width: '100%', height: '400px' }" 
/>
\`\`\`

### className
- **Type**: \`string | string[] | Record<string, boolean>\`
- **Default**: \`''\`
- **Description**: CSS class name(s) to apply to the chart container. Supports multiple formats.

\`\`\`vue
<!-- String -->
<MyndEcharts :options="options" class-name="chart-container" />

<!-- Array -->
<MyndEcharts :options="options" :class-name="['chart', 'sales-chart']" />

<!-- Object -->
<MyndEcharts :options="options" :class-name="{ active: isActive, 'full-width': true }" />
\`\`\`

## Theme Props

### theme
- **Type**: \`string | object\`
- **Default**: \`'default'\`
- **Description**: Chart theme. Can be a built-in theme name ('light', 'dark') or a custom theme object.

\`\`\`vue
<!-- Built-in theme -->
<MyndEcharts :options="options" theme="dark" />

<!-- Custom theme object -->
<MyndEcharts :options="options" :theme="customTheme" />

<script setup>
const customTheme = {
  color: ['#5470c6', '#91cc75', '#fac858'],
  backgroundColor: '#f5f5f5'
}
</script>
\`\`\`

## Loading Props

### loading
- **Type**: \`boolean\`
- **Default**: \`false\`
- **Description**: Shows a loading animation overlay on the chart.

\`\`\`vue
<MyndEcharts 
  :options="options" 
  :loading="isLoading" 
/>
\`\`\`

### loadingOptions
- **Type**: \`object\`
- **Default**: \`{}\`
- **Description**: Configuration for the loading animation.

\`\`\`typescript
interface LoadingOptions {
  text?: string        // Loading text
  color?: string       // Spinner color
  textColor?: string   // Text color
  maskColor?: string   // Overlay background color
  zlevel?: number      // Z-index level
  fontSize?: number    // Text font size
  showSpinner?: boolean // Show spinner animation
  spinnerRadius?: number // Spinner size
  lineWidth?: number    // Spinner line width
}
\`\`\`

\`\`\`vue
<MyndEcharts 
  :options="options" 
  :loading="isLoading"
  :loading-options="{
    text: 'Loading chart data...',
    color: '#4299e1',
    textColor: '#333',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    showSpinner: true
  }"
/>
\`\`\`

## Rendering Props

### renderer
- **Type**: \`'canvas' | 'svg'\`
- **Default**: \`'canvas'\`
- **Description**: Rendering mode. Canvas is better for performance with large datasets, SVG is better for print quality.

\`\`\`vue
<!-- Use SVG for better print quality -->
<MyndEcharts :options="options" renderer="svg" />

<!-- Use canvas for large datasets -->
<MyndEcharts :options="options" renderer="canvas" />
\`\`\`

### initOptions
- **Type**: \`object\`
- **Default**: \`{}\`
- **Description**: Additional initialization options for the chart instance.

\`\`\`typescript
interface InitOptions {
  devicePixelRatio?: number    // Device pixel ratio for high DPI screens
  renderer?: 'canvas' | 'svg'  // Renderer type
  width?: number | string      // Chart width
  height?: number | string     // Chart height
  locale?: string              // Locale for internationalization
  useDirtyRect?: boolean       // Enable dirty rectangle optimization
}
\`\`\`

\`\`\`vue
<MyndEcharts 
  :options="options"
  :init-options="{
    devicePixelRatio: window.devicePixelRatio || 1,
    locale: 'en',
    useDirtyRect: true
  }"
/>
\`\`\`

## Update Props

### notMerge
- **Type**: \`boolean\`
- **Default**: \`false\`
- **Description**: Whether to merge new options with existing ones. When true, completely replaces the options.

\`\`\`vue
<!-- Merge with existing options (default) -->
<MyndEcharts :options="options" />

<!-- Replace options completely -->
<MyndEcharts :options="options" :not-merge="true" />
\`\`\`

### lazyUpdate
- **Type**: \`boolean\`
- **Default**: \`false\`
- **Description**: Enable lazy update for better performance when updating frequently.

\`\`\`vue
<MyndEcharts 
  :options="options" 
  :lazy-update="true" 
/>
\`\`\`

### silent
- **Type**: \`boolean\`
- **Default**: \`false\`
- **Description**: Update options without animation.

\`\`\`vue
<MyndEcharts 
  :options="options" 
  :silent="true" 
/>
\`\`\`

## Other Props

### autoResize
- **Type**: \`boolean\`
- **Default**: \`true\`
- **Description**: Automatically resize the chart when the container size changes using ResizeObserver.

\`\`\`vue
<!-- Enable auto resize (default) -->
<MyndEcharts :options="options" />

<!-- Disable auto resize -->
<MyndEcharts :options="options" :auto-resize="false" />
\`\`\`

### group
- **Type**: \`string\`
- **Default**: \`undefined\`
- **Description**: Group name for connecting multiple charts. Charts in the same group will be synchronized.

\`\`\`vue
<!-- Connect multiple charts -->
<MyndEcharts :options="options1" group="sales-charts" />
<MyndEcharts :options="options2" group="sales-charts" />
\`\`\`
`,
  events: `
# Events

## Chart Lifecycle Events

### @ready
- **Payload**: \`ECharts\` instance
- **Description**: Emitted when the chart instance is initialized and ready to use.

\`\`\`vue
<template>
  <MyndEcharts :options="options" @ready="handleReady" />
</template>

<script setup>
const handleReady = (instance) => {
  console.log('Chart is ready!', instance)
  // You can now use the instance directly
  instance.on('finished', () => {
    console.log('Initial render finished')
  })
}
</script>
\`\`\`

### @rendered
- **Payload**: Event params
- **Description**: Emitted after the chart is rendered.

### @finished
- **Payload**: Event params
- **Description**: Emitted when rendering animation is finished.

## Mouse Events

### @click
- **Payload**: \`{ componentType, seriesType, seriesIndex, dataIndex, data, value, name }\`
- **Description**: Mouse click event on chart elements.

\`\`\`vue
<template>
  <MyndEcharts :options="options" @click="handleClick" />
</template>

<script setup>
const handleClick = (params) => {
  console.log('Clicked on:', params.name)
  console.log('Value:', params.value)
  console.log('Series:', params.seriesName)
}
</script>
\`\`\`

### @dblclick
- **Payload**: Same as click event
- **Description**: Mouse double click event.

### @mousedown
- **Payload**: Mouse event params
- **Description**: Mouse button pressed.

### @mousemove
- **Payload**: Mouse event params
- **Description**: Mouse moved over chart.

### @mouseup
- **Payload**: Mouse event params
- **Description**: Mouse button released.

### @mouseover
- **Payload**: Mouse event params
- **Description**: Mouse entered a chart element.

### @mouseout
- **Payload**: Mouse event params
- **Description**: Mouse left a chart element.

### @globalout
- **Payload**: Event params
- **Description**: Mouse left the chart area entirely.

### @contextmenu
- **Payload**: Mouse event params
- **Description**: Right-click context menu event.

\`\`\`vue
<template>
  <MyndEcharts :options="options" @contextmenu="handleContextMenu" />
</template>

<script setup>
const handleContextMenu = (params) => {
  // Prevent default context menu
  params.event?.preventDefault()
  // Show custom menu
  showCustomMenu(params)
}
</script>
\`\`\`

## Data Selection Events

### @highlight
- **Payload**: \`{ type, seriesIndex, dataIndex }\`
- **Description**: Data highlighted (hover).

### @downplay
- **Payload**: \`{ type, seriesIndex, dataIndex }\`
- **Description**: Data downplayed (unhover).

### @selectchanged
- **Payload**: \`{ type, selected }\`
- **Description**: Data selection changed.

\`\`\`vue
<MyndEcharts 
  :options="options" 
  @selectchanged="handleSelectionChange" 
/>

<script setup>
const handleSelectionChange = (params) => {
  console.log('Selected data:', params.selected)
}
</script>
\`\`\`

## Legend Events

### @legendselectchanged
- **Payload**: \`{ type, name, selected }\`
- **Description**: Legend selection state changed.

\`\`\`vue
<MyndEcharts 
  :options="options" 
  @legendselectchanged="handleLegendChange" 
/>

<script setup>
const handleLegendChange = (params) => {
  console.log('Legend item:', params.name)
  console.log('Is selected:', params.selected[params.name])
  console.log('All selections:', params.selected)
}
</script>
\`\`\`

### @legendselected
- **Payload**: \`{ type, name, selected }\`
- **Description**: Legend item selected.

### @legendunselected
- **Payload**: \`{ type, name, selected }\`
- **Description**: Legend item unselected.

### @legendselectall
- **Payload**: \`{ type, selected }\`
- **Description**: All legend items selected.

### @legendinverseselect
- **Payload**: \`{ type, selected }\`
- **Description**: Legend selection inverted.

### @legendscroll
- **Payload**: \`{ type, scrollDataIndex, legendId }\`
- **Description**: Legend scrolled.

## Data Zoom Events

### @datazoom
- **Payload**: \`{ type, start, end, startValue, endValue }\`
- **Description**: Data zoom changed.

\`\`\`vue
<MyndEcharts 
  :options="options" 
  @datazoom="handleDataZoom" 
/>

<script setup>
const handleDataZoom = (params) => {
  console.log('Zoom range:', params.start, '-', params.end)
  if (params.startValue) {
    console.log('Value range:', params.startValue, '-', params.endValue)
  }
}
</script>
\`\`\`

### @datarangeselected
- **Payload**: \`{ type, selected, selectedValue }\`
- **Description**: Visual map range selected.

## Special Chart Events

### @graphroam
- **Payload**: \`{ type, zoom, center }\`
- **Description**: Graph chart roamed (panned/zoomed).

### @georoam
- **Payload**: \`{ type, zoom, center }\`
- **Description**: Geo/map chart roamed.

### @treeroam
- **Payload**: \`{ type, zoom, center }\`
- **Description**: Tree chart roamed.

### @timelinechanged
- **Payload**: \`{ type, currentIndex }\`
- **Description**: Timeline current time changed.

### @timelineplaychanged
- **Payload**: \`{ type, playState }\`
- **Description**: Timeline play state changed.

## Toolbox Events

### @restore
- **Payload**: \`{ type }\`
- **Description**: Restore button clicked in toolbox.

### @dataviewchanged
- **Payload**: \`{ type }\`
- **Description**: Data view changed in toolbox.

### @magictypechanged
- **Payload**: \`{ type, currentType }\`
- **Description**: Chart type changed via magic type in toolbox.

## Pie Chart Events

### @pieselectchanged
- **Payload**: \`{ type, seriesId, selected }\`
- **Description**: Pie slice selection changed.

### @pieselected
- **Payload**: \`{ type, seriesId, dataIndex, name }\`
- **Description**: Pie slice selected.

### @pieunselected
- **Payload**: \`{ type, seriesId, dataIndex, name }\`
- **Description**: Pie slice unselected.

## Map Events

### @mapselected
- **Payload**: \`{ type, seriesId, name, selected }\`
- **Description**: Map area selected.

### @mapunselected
- **Payload**: \`{ type, seriesId, name, selected }\`
- **Description**: Map area unselected.

## Brush Events

### @brush
- **Payload**: \`{ type, areas, brushId }\`
- **Description**: Brush action happening.

### @brushEnd
- **Payload**: \`{ type, areas, brushId }\`
- **Description**: Brush action ended.

### @brushselected
- **Payload**: \`{ type, batch }\`
- **Description**: Data selected by brush.

\`\`\`vue
<MyndEcharts 
  :options="options" 
  @brushselected="handleBrushSelect" 
/>

<script setup>
const handleBrushSelect = (params) => {
  params.batch.forEach(item => {
    console.log('Series:', item.seriesIndex)
    console.log('Selected data:', item.dataIndex)
  })
}
</script>
\`\`\`

## Other Events

### @axisareaselected
- **Payload**: \`{ type, intervalIds, axisId, axisIndex }\`
- **Description**: Parallel axis area selected.

### @globalcursortaken
- **Payload**: \`{ type, key }\`
- **Description**: Global cursor taken.
`,
  methods: `
# Instance Methods

Access these methods through a template ref:

\`\`\`vue
<template>
  <MyndEcharts ref="chartRef" :options="options" />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const chartRef = ref()

onMounted(() => {
  // Access methods after chart is mounted
  const instance = chartRef.value
})
</script>
\`\`\`

## Chart Control Methods

### setOption(options, opts?)
- **Parameters**: 
  - \`options: EChartsOption\` - Chart configuration
  - \`opts?: SetOptionOpts\` - Update options
- **Returns**: \`void\`
- **Description**: Update chart options. This is the main method for updating your chart.

\`\`\`typescript
interface SetOptionOpts {
  notMerge?: boolean    // Don't merge with previous options
  lazyUpdate?: boolean  // Delay update for performance
  silent?: boolean      // No animation
  replaceMerge?: string[] // Replace specified components
  transition?: {        // Animation config
    from?: object
    to?: object
    duration?: number
  }
}
\`\`\`

\`\`\`javascript
// Basic update
chartRef.value.setOption({
  series: [{
    data: [150, 230, 224, 218, 135]
  }]
})

// Replace all options
chartRef.value.setOption(newOptions, {
  notMerge: true
})

// Silent update (no animation)
chartRef.value.setOption(options, {
  silent: true
})
\`\`\`

### getOption()
- **Returns**: \`any\` - Current chart options
- **Description**: Get the current chart configuration.

\`\`\`javascript
const currentOptions = chartRef.value.getOption()
console.log('Current title:', currentOptions.title[0].text)
\`\`\`

### resize(opts?)
- **Parameters**: \`opts?: { width?: number, height?: number, silent?: boolean }\`
- **Returns**: \`void\`
- **Description**: Manually trigger chart resize.

\`\`\`javascript
// Auto-detect size
chartRef.value.resize()

// Specific size
chartRef.value.resize({
  width: 800,
  height: 600
})

// Silent resize (no animation)
chartRef.value.resize({
  silent: true
})
\`\`\`

### clear()
- **Returns**: \`void\`
- **Description**: Clear all components and data. The chart becomes blank.

\`\`\`javascript
// Clear the chart
chartRef.value.clear()

// Then set new options
chartRef.value.setOption(newOptions)
\`\`\`

### dispose()
- **Returns**: \`void\`
- **Description**: Dispose the chart instance. Releases all resources.

\`\`\`javascript
// Clean up when done
chartRef.value.dispose()
\`\`\`

## Chart Information Methods

### getWidth()
- **Returns**: \`number\` - Chart width in pixels
- **Description**: Get current chart width.

\`\`\`javascript
const width = chartRef.value.getWidth()
console.log('Chart width:', width)
\`\`\`

### getHeight()
- **Returns**: \`number\` - Chart height in pixels
- **Description**: Get current chart height.

\`\`\`javascript
const height = chartRef.value.getHeight()
console.log('Chart height:', height)
\`\`\`

### getDom()
- **Returns**: \`HTMLElement\` - Chart container element
- **Description**: Get the DOM container of the chart.

\`\`\`javascript
const dom = chartRef.value.getDom()
console.log('Container:', dom)
\`\`\`

### isDisposed()
- **Returns**: \`boolean\`
- **Description**: Check if the chart instance has been disposed.

\`\`\`javascript
if (!chartRef.value.isDisposed()) {
  chartRef.value.setOption(options)
}
\`\`\`

## Export Methods

### getDataURL(opts?)
- **Parameters**: \`opts?: DataURLOpts\`
- **Returns**: \`string\` - Base64 data URL
- **Description**: Export chart as image data URL.

\`\`\`typescript
interface DataURLOpts {
  type?: 'png' | 'jpeg' | 'svg'  // Image format
  pixelRatio?: number             // Resolution multiplier
  backgroundColor?: string        // Background color
  excludeComponents?: string[]    // Components to exclude
}
\`\`\`

\`\`\`javascript
// Basic export
const dataURL = chartRef.value.getDataURL()

// High resolution PNG
const hdURL = chartRef.value.getDataURL({
  type: 'png',
  pixelRatio: 2,
  backgroundColor: '#fff'
})

// Download as image
const link = document.createElement('a')
link.download = 'chart.png'
link.href = hdURL
link.click()
\`\`\`

### getConnectedDataURL(opts?)
- **Parameters**: \`opts?: DataURLOpts\`
- **Returns**: \`string\` - Base64 data URL
- **Description**: Export all connected charts as a single image.

\`\`\`javascript
// Connect charts first
echarts.connect(['chart1', 'chart2'])

// Export all connected charts
const dataURL = chartRef.value.getConnectedDataURL({
  type: 'png',
  pixelRatio: 2
})
\`\`\`

## Coordinate Methods

### convertToPixel(finder, value)
- **Parameters**: 
  - \`finder: string | object\` - Component finder
  - \`value: any\` - Logical value
- **Returns**: \`number | number[]\` - Pixel coordinates
- **Description**: Convert data value to pixel coordinates.

\`\`\`javascript
// Convert data point to pixel position
const pixel = chartRef.value.convertToPixel('grid', [3, 120])
console.log('Pixel position:', pixel) // [x, y]

// Using finder object
const pixel2 = chartRef.value.convertToPixel(
  { seriesIndex: 0 }, 
  [dataIndex, value]
)
\`\`\`

### convertFromPixel(finder, value)
- **Parameters**: 
  - \`finder: string | object\` - Component finder
  - \`value: number[]\` - Pixel coordinates
- **Returns**: \`any\` - Data value
- **Description**: Convert pixel coordinates to data value.

\`\`\`javascript
// Get data value from mouse position
const handleMouseMove = (e) => {
  const rect = chartRef.value.getDom().getBoundingClientRect()
  const point = [e.clientX - rect.left, e.clientY - rect.top]
  const dataValue = chartRef.value.convertFromPixel('grid', point)
  console.log('Data at cursor:', dataValue)
}
\`\`\`

### containPixel(finder, value)
- **Parameters**: 
  - \`finder: string | object\` - Component finder
  - \`value: number[]\` - Pixel coordinates
- **Returns**: \`boolean\`
- **Description**: Check if pixel is inside a component area.

\`\`\`javascript
// Check if mouse is over the grid
const isInGrid = chartRef.value.containPixel('grid', [x, y])

// Check if point is in a specific series
const isInSeries = chartRef.value.containPixel(
  { seriesIndex: 0, dataIndex: 5 }, 
  [x, y]
)
\`\`\`

## Action Methods

### dispatchAction(action)
- **Parameters**: \`action: any\` - Action object
- **Returns**: \`void\`
- **Description**: Trigger chart actions programmatically.

\`\`\`javascript
// Highlight a data point
chartRef.value.dispatchAction({
  type: 'highlight',
  seriesIndex: 0,
  dataIndex: 3
})

// Show tooltip
chartRef.value.dispatchAction({
  type: 'showTip',
  seriesIndex: 0,
  dataIndex: 5
})

// Select legend
chartRef.value.dispatchAction({
  type: 'legendSelect',
  name: 'Series 1'
})

// Data zoom
chartRef.value.dispatchAction({
  type: 'dataZoom',
  start: 20,
  end: 80
})
\`\`\`

## Common Action Types

\`\`\`javascript
// Tooltip actions
{ type: 'showTip', seriesIndex, dataIndex }
{ type: 'hideTip' }

// Highlight actions  
{ type: 'highlight', seriesIndex, dataIndex }
{ type: 'downplay', seriesIndex, dataIndex }

// Legend actions
{ type: 'legendSelect', name }
{ type: 'legendUnSelect', name }
{ type: 'legendToggleSelect', name }
{ type: 'legendAllSelect' }
{ type: 'legendInverseSelect' }

// Data zoom actions
{ type: 'dataZoom', start, end, startValue, endValue }
{ type: 'dataZoomSelect', start, end }

// Visual map actions
{ type: 'selectDataRange', selected, range }

// Timeline actions
{ type: 'timelineChange', currentIndex }
{ type: 'timelinePlayChange', playState }

// Toolbox actions
{ type: 'restore' }

// Brush actions
{ type: 'brush', areas }
{ type: 'brushSelect', brushIndex, range }
{ type: 'brushEnd' }
\`\`\`

## Full Example

\`\`\`vue
<template>
  <div>
    <MyndEcharts ref="chartRef" :options="options" @ready="onReady" />
    <div class="controls">
      <button @click="updateData">Update Data</button>
      <button @click="exportChart">Export</button>
      <button @click="showTooltip">Show Tooltip</button>
      <button @click="clearChart">Clear</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { MyndEcharts } from '@docbrasil/mynd-echarts'

const chartRef = ref()

const options = {
  title: { text: 'Sales Chart' },
  tooltip: { trigger: 'axis' },
  xAxis: { 
    type: 'category', 
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] 
  },
  yAxis: { type: 'value' },
  series: [{
    name: 'Sales',
    type: 'bar',
    data: [120, 200, 150, 80, 70]
  }]
}

const onReady = (instance) => {
  console.log('Chart ready!', instance)
}

const updateData = () => {
  chartRef.value.setOption({
    series: [{
      data: [150, 180, 200, 120, 90]
    }]
  })
}

const exportChart = () => {
  const url = chartRef.value.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  })
  
  const link = document.createElement('a')
  link.download = 'chart.png'
  link.href = url
  link.click()
}

const showTooltip = () => {
  chartRef.value.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: 2
  })
}

const clearChart = () => {
  chartRef.value.clear()
}
</script>
\`\`\`
`
}
