<template>
  <div class="test-app">
    <header class="test-header">
      <h1>MyndEcharts Toolbox Test Suite</h1>
      <div class="controls">
        <button @click="runAllTests" class="btn btn-primary">Run All Tests</button>
        <button @click="fixAllToolboxes" class="btn btn-secondary">Fix All Toolboxes</button>
        <button @click="toggleDebug" class="btn btn-secondary">
          Debug: {{ debugMode ? 'ON' : 'OFF' }}
        </button>
        <select v-model="toolboxMode" @change="updateAllCharts" class="select">
          <option value="auto">Auto Mode</option>
          <option value="fixed">Fixed Mode</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>
    </header>

    <div class="test-results" v-if="testResults">
      <h2>Test Results</h2>
      <div class="results-grid">
        <div class="result-card pass">
          <div class="result-number">{{ testResults.pass }}</div>
          <div class="result-label">Passed</div>
        </div>
        <div class="result-card warning">
          <div class="result-number">{{ testResults.warning }}</div>
          <div class="result-label">Warnings</div>
        </div>
        <div class="result-card fail">
          <div class="result-number">{{ testResults.fail }}</div>
          <div class="result-label">Failed</div>
        </div>
      </div>
    </div>

    <div class="test-grid">
      <!-- Test 1: Overflow Hidden -->
      <div class="test-case">
        <h3>
          <span :class="['status', testStatus.overflow]"></span>
          Overflow: Hidden
        </h3>
        <div class="test-description">
          Parent container has overflow:hidden which may clip the toolbox
        </div>
        <div class="chart-container overflow-hidden">
          <MyndEcharts
            ref="chartOverflow"
            :options="getChartOptions('Overflow Test')"
            :debug-toolbox="debugMode"
            :toolbox-mode="toolboxMode"
            :fix-toolbox-overlap="true"
            @toolbox-rendered="onToolboxRendered('overflow', $event)"
            @toolbox-overlap-detected="onOverlapDetected('overflow', $event)"
            @toolbox-fixed="onToolboxFixed('overflow', $event)"
          />
        </div>
        <div v-if="debugInfo.overflow" class="debug-panel">
          {{ debugInfo.overflow }}
        </div>
      </div>

      <!-- Test 2: Absolute Position -->
      <div class="test-case">
        <h3>
          <span :class="['status', testStatus.absolute]"></span>
          Position: Absolute
        </h3>
        <div class="test-description">
          Absolutely positioned container can affect toolbox positioning
        </div>
        <div class="chart-container-wrapper">
          <div class="chart-container absolute">
            <MyndEcharts
              ref="chartAbsolute"
              :options="getChartOptions('Absolute Test')"
              :debug-toolbox="debugMode"
              :toolbox-mode="toolboxMode"
              :fix-toolbox-overlap="true"
              @toolbox-rendered="onToolboxRendered('absolute', $event)"
              @toolbox-overlap-detected="onOverlapDetected('absolute', $event)"
              @toolbox-fixed="onToolboxFixed('absolute', $event)"
            />
          </div>
        </div>
        <div v-if="debugInfo.absolute" class="debug-panel">
          {{ debugInfo.absolute }}
        </div>
      </div>

      <!-- Test 3: Transform -->
      <div class="test-case">
        <h3>
          <span :class="['status', testStatus.transform]"></span>
          CSS Transform
        </h3>
        <div class="test-description">
          Transform creates new stacking context affecting toolbox
        </div>
        <div class="chart-container transform">
          <MyndEcharts
            ref="chartTransform"
            :options="getChartOptions('Transform Test')"
            :debug-toolbox="debugMode"
            :toolbox-mode="toolboxMode"
            :fix-toolbox-overlap="true"
            :toolbox-position="{ right: 20, top: 20 }"
            @toolbox-rendered="onToolboxRendered('transform', $event)"
            @toolbox-overlap-detected="onOverlapDetected('transform', $event)"
            @toolbox-fixed="onToolboxFixed('transform', $event)"
          />
        </div>
        <div v-if="debugInfo.transform" class="debug-panel">
          {{ debugInfo.transform }}
        </div>
      </div>

      <!-- Test 4: Flexbox -->
      <div class="test-case">
        <h3>
          <span :class="['status', testStatus.flexbox]"></span>
          Flexbox Container
        </h3>
        <div class="test-description">
          Flex container may affect chart sizing and toolbox position
        </div>
        <div class="chart-container flexbox">
          <MyndEcharts
            ref="chartFlexbox"
            :options="getChartOptions('Flexbox Test')"
            :debug-toolbox="debugMode"
            :toolbox-mode="toolboxMode"
            :fix-toolbox-overlap="true"
            @toolbox-rendered="onToolboxRendered('flexbox', $event)"
            @toolbox-overlap-detected="onOverlapDetected('flexbox', $event)"
            @toolbox-fixed="onToolboxFixed('flexbox', $event)"
          />
        </div>
        <div v-if="debugInfo.flexbox" class="debug-panel">
          {{ debugInfo.flexbox }}
        </div>
      </div>

      <!-- Test 5: CSS Grid -->
      <div class="test-case">
        <h3>
          <span :class="['status', testStatus.grid]"></span>
          CSS Grid Container
        </h3>
        <div class="test-description">
          Grid layout affects element sizing and positioning
        </div>
        <div class="chart-container grid">
          <MyndEcharts
            ref="chartGrid"
            :options="getChartOptions('Grid Test')"
            :debug-toolbox="debugMode"
            :toolbox-mode="toolboxMode"
            :fix-toolbox-overlap="true"
            @toolbox-rendered="onToolboxRendered('grid', $event)"
            @toolbox-overlap-detected="onOverlapDetected('grid', $event)"
            @toolbox-fixed="onToolboxFixed('grid', $event)"
          />
        </div>
        <div v-if="debugInfo.grid" class="debug-panel">
          {{ debugInfo.grid }}
        </div>
      </div>

      <!-- Test 6: Small Container -->
      <div class="test-case">
        <h3>
          <span :class="['status', testStatus.small]"></span>
          Small Container
        </h3>
        <div class="test-description">
          Limited space may cause toolbox icons to overlap
        </div>
        <div class="chart-container small">
          <MyndEcharts
            ref="chartSmall"
            :options="getChartOptions('Small Test')"
            :debug-toolbox="debugMode"
            :toolbox-mode="toolboxMode"
            :fix-toolbox-overlap="true"
            :toolbox-position="{ right: 5, top: 5 }"
            @toolbox-rendered="onToolboxRendered('small', $event)"
            @toolbox-overlap-detected="onOverlapDetected('small', $event)"
            @toolbox-fixed="onToolboxFixed('small', $event)"
          />
        </div>
        <div v-if="debugInfo.small" class="debug-panel">
          {{ debugInfo.small }}
        </div>
      </div>

      <!-- Test 7: Nested Complex -->
      <div class="test-case">
        <h3>
          <span :class="['status', testStatus.nested]"></span>
          Nested Containers
        </h3>
        <div class="test-description">
          Multiple nested containers with various CSS properties
        </div>
        <div class="chart-container nested-outer">
          <div class="nested-middle">
            <div class="nested-inner">
              <MyndEcharts
                ref="chartNested"
                :options="getChartOptions('Nested Test')"
                :debug-toolbox="debugMode"
                :toolbox-mode="toolboxMode"
                :fix-toolbox-overlap="true"
                @toolbox-rendered="onToolboxRendered('nested', $event)"
                @toolbox-overlap-detected="onOverlapDetected('nested', $event)"
                @toolbox-fixed="onToolboxFixed('nested', $event)"
              />
            </div>
          </div>
        </div>
        <div v-if="debugInfo.nested" class="debug-panel">
          {{ debugInfo.nested }}
        </div>
      </div>

      <!-- Test 8: Dynamic Resize -->
      <div class="test-case">
        <h3>
          <span :class="['status', testStatus.resize]"></span>
          Dynamic Resize
        </h3>
        <div class="test-description">
          Container that changes size dynamically
        </div>
        <div :class="['chart-container', 'resize', resizeClass]">
          <MyndEcharts
            ref="chartResize"
            :options="getChartOptions('Resize Test')"
            :debug-toolbox="debugMode"
            :toolbox-mode="toolboxMode"
            :fix-toolbox-overlap="true"
            :auto-resize="true"
            @toolbox-rendered="onToolboxRendered('resize', $event)"
            @toolbox-overlap-detected="onOverlapDetected('resize', $event)"
            @toolbox-fixed="onToolboxFixed('resize', $event)"
          />
        </div>
        <button @click="toggleResize" class="btn btn-small">
          Toggle Size
        </button>
        <div v-if="debugInfo.resize" class="debug-panel">
          {{ debugInfo.resize }}
        </div>
      </div>
    </div>

    <!-- Summary Panel -->
    <div class="summary-panel">
      <h2>Known Issues & Limitations</h2>
      <ul>
        <li v-for="issue in knownIssues" :key="issue">{{ issue }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { MyndEcharts } from '../lib/index'

// Test state
const debugMode = ref(false)
const toolboxMode = ref('auto')
const resizeClass = ref('normal')

// Chart refs
const chartOverflow = ref()
const chartAbsolute = ref()
const chartTransform = ref()
const chartFlexbox = ref()
const chartGrid = ref()
const chartSmall = ref()
const chartNested = ref()
const chartResize = ref()

// Test status
const testStatus = reactive({
  overflow: '',
  absolute: '',
  transform: '',
  flexbox: '',
  grid: '',
  small: '',
  nested: '',
  resize: ''
})

// Debug info
const debugInfo = reactive({
  overflow: '',
  absolute: '',
  transform: '',
  flexbox: '',
  grid: '',
  small: '',
  nested: '',
  resize: ''
})

// Test results
const testResults = ref(null)

// Known issues
const knownIssues = [
  'Toolbox may be clipped in containers with overflow:hidden if positioned outside bounds',
  'Transform scale < 1 may cause click targets to be misaligned',
  'Very small containers (< 250px width) may not have enough space for all toolbox features',
  'Nested transforms can compound positioning issues',
  'Some third-party CSS frameworks may override toolbox styles',
  'SVG renderer may handle toolbox differently than canvas renderer',
  'Toolbox tooltip positioning may be affected by container scroll position'
]

// Get chart options
const getChartOptions = (title) => ({
  title: {
    text: title,
    left: 'center',
    textStyle: {
      fontSize: 14
    }
  },
  toolbox: {
    show: true,
    feature: {
      saveAsImage: { show: true },
      restore: { show: true },
      dataView: { show: true },
      dataZoom: { show: true },
      magicType: {
        show: true,
        type: ['line', 'bar', 'stack']
      }
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '15%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Data 1',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 130],
      itemStyle: {
        color: '#5470c6'
      }
    },
    {
      name: 'Data 2',
      type: 'line',
      data: [140, 180, 120, 100, 90, 130, 110],
      itemStyle: {
        color: '#91cc75'
      }
    }
  ]
})

// Event handlers
const onToolboxRendered = (scenario, event) => {
  console.log(`Toolbox rendered for ${scenario}:`, event)
  testStatus[scenario] = 'pass'
  debugInfo[scenario] = `Toolbox rendered with ${Object.keys(event.config.feature || {}).length} features`
}

const onOverlapDetected = (scenario, event) => {
  console.warn(`Overlap detected for ${scenario}:`, event)
  testStatus[scenario] = 'fail'
  debugInfo[scenario] = `Overlap detected! ${event.elements} elements, check measurements`
}

const onToolboxFixed = (scenario, event) => {
  console.log(`Toolbox fixed for ${scenario}:`, event)
  if (event.success && testStatus[scenario] !== 'fail') {
    testStatus[scenario] = 'pass'
  }
  debugInfo[scenario] += ` | Fix ${event.success ? 'succeeded' : 'failed'} via ${event.method}`
}

// Test methods
const runAllTests = async () => {
  const scenarios = ['overflow', 'absolute', 'transform', 'flexbox', 'grid', 'small', 'nested', 'resize']
  const results = { pass: 0, warning: 0, fail: 0 }
  
  for (const scenario of scenarios) {
    // Reset status
    testStatus[scenario] = 'warning'
    debugInfo[scenario] = 'Testing...'
    
    // Get chart ref
    const chartRef = eval(`chart${scenario.charAt(0).toUpperCase() + scenario.slice(1)}`)
    if (chartRef.value) {
      // Try to refresh toolbox
      const success = await chartRef.value.refreshToolbox()
      
      await nextTick()
      
      // Check final status
      if (testStatus[scenario] === 'pass') {
        results.pass++
      } else if (testStatus[scenario] === 'fail') {
        results.fail++
      } else {
        results.warning++
        testStatus[scenario] = 'warning'
      }
    }
  }
  
  testResults.value = results
}

const fixAllToolboxes = () => {
  const refs = [
    chartOverflow, chartAbsolute, chartTransform, chartFlexbox,
    chartGrid, chartSmall, chartNested, chartResize
  ]
  
  refs.forEach(ref => {
    if (ref.value) {
      ref.value.refreshToolbox()
    }
  })
}

const toggleDebug = () => {
  debugMode.value = !debugMode.value
}

const updateAllCharts = () => {
  // Charts will update automatically due to prop binding
}

const toggleResize = () => {
  resizeClass.value = resizeClass.value === 'normal' ? 'expanded' : 'normal'
}

// Run initial tests on mount
onMounted(() => {
  setTimeout(runAllTests, 1000)
})
</script>

<style scoped>
.test-app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.test-header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.test-header h1 {
  margin: 0 0 20px 0;
  color: #333;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background: #5470c6;
  color: white;
}

.btn-primary:hover {
  background: #4159a9;
}

.btn-secondary {
  background: white;
  border: 1px solid #ddd;
  color: #333;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

.select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.test-results {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 15px;
}

.result-card {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
}

.result-card.pass {
  background: #d4edda;
  color: #155724;
}

.result-card.warning {
  background: #fff3cd;
  color: #856404;
}

.result-card.fail {
  background: #f8d7da;
  color: #721c24;
}

.result-number {
  font-size: 36px;
  font-weight: bold;
}

.result-label {
  font-size: 14px;
  margin-top: 5px;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.test-case {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.test-case h3 {
  margin: 0 0 10px 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.status {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ddd;
}

.status.pass { background: #28a745; }
.status.warning { background: #ffc107; }
.status.fail { background: #dc3545; }

.test-description {
  font-size: 13px;
  color: #666;
  margin-bottom: 15px;
  padding: 8px;
  background: #f9f9f9;
  border-left: 3px solid #5470c6;
}

.chart-container,
.chart-container-wrapper {
  height: 300px;
  border: 2px dashed #ddd;
  background: #fafafa;
  position: relative;
}

/* Test scenario styles */
.overflow-hidden {
  overflow: hidden;
}

.chart-container-wrapper {
  position: relative;
}

.absolute {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.transform {
  transform: scale(0.98) rotate(0.5deg);
}

.flexbox {
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid {
  display: grid;
  place-items: stretch;
}

.small {
  width: 280px;
  height: 200px;
}

.nested-outer {
  overflow: auto;
  position: relative;
}

.nested-middle {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  transform: translateZ(0);
}

.nested-inner {
  height: 100%;
  position: relative;
}

.resize.normal {
  height: 250px;
}

.resize.expanded {
  height: 400px;
  transition: height 0.3s ease;
}

.debug-panel {
  margin-top: 10px;
  padding: 10px;
  background: #f0f8ff;
  border: 1px solid #b0d4ff;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  color: #0066cc;
}

.summary-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.summary-panel h2 {
  margin: 0 0 15px 0;
  color: #333;
}

.summary-panel ul {
  margin: 0;
  padding-left: 20px;
}

.summary-panel li {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}
</style>