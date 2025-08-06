<template>
  <div class="option-editor-page">
    <div class="editor-header">
      <h2>ECharts Option Editor</h2>
      <p>Write or paste ECharts options with full IntelliSense support</p>
    </div>

    <div class="editor-layout">
      <!-- Editor Panel -->
      <div class="editor-panel">
        <div class="editor-toolbar">
          <div class="toolbar-group">
            <button @click="formatCode" class="control-button" title="Format Code (Ctrl+Shift+F)">
              <span>⚡</span> Format
            </button>
            <button @click="validateOption" class="control-button" title="Validate Option">
              <span>✓</span> Validate
            </button>
          </div>
          
          <div class="toolbar-group">
            <select v-model="selectedExample" @change="loadSelectedExample" class="control-select">
              <option value="">Load Example...</option>
              <optgroup v-for="category in categories" :key="category" :label="category">
                <option v-for="example in getExamplesByCategory(category)" :key="example.name" :value="example.name">
                  {{ example.name }}
                </option>
              </optgroup>
            </select>
          </div>
          
          <div class="toolbar-group">
            <button @click="importFile" class="control-button secondary" title="Import JSON">
              <span>📁</span> Import
            </button>
            <button @click="exportFile" class="control-button secondary" title="Export JSON">
              <span>💾</span> Export
            </button>
            <button @click="copyToClipboard" class="control-button secondary" title="Copy to Clipboard">
              <span>📋</span> Copy
            </button>
            <button @click="clearEditor" class="control-button secondary" title="Clear Editor">
              <span>🗑️</span> Clear
            </button>
          </div>
        </div>

        <div class="editor-wrapper">
          <MonacoEditor
            ref="editorRef"
            v-model="optionText"
            language="json"
            :theme="editorTheme"
            height="100%"
            @change="handleEditorChange"
            @validate="handleValidation"
          />
        </div>

        <div class="editor-status">
          <div class="status-left">
            <span v-if="!hasErrors" class="status-ok">✅ Valid JSON</span>
            <span v-else class="status-error">❌ {{ errorCount }} error(s)</span>
            <span class="status-info">{{ lineCount }} lines | {{ charCount }} chars</span>
          </div>
          <div class="status-right">
            <label>
              <input type="checkbox" v-model="autoPreview" />
              Auto Preview
            </label>
            <label>
              <input type="checkbox" v-model="darkMode" @change="toggleEditorTheme" />
              Dark Mode
            </label>
          </div>
        </div>
      </div>

      <!-- Preview Panel -->
      <div class="preview-panel">
        <div class="preview-header">
          <h3>Preview</h3>
          <div class="preview-controls">
            <button @click="refreshPreview" class="control-button small" :disabled="hasErrors">
              🔄 Refresh
            </button>
            <button @click="downloadChart" class="control-button small secondary" :disabled="!parsedOptions">
              📥 Download
            </button>
          </div>
        </div>

        <div class="chart-container">
          <MyndEcharts
            v-if="parsedOptions && !hasErrors"
            ref="chartRef"
            :options="parsedOptions"
            :theme="currentTheme"
            :key="updateKey"
            @ready="handleChartReady"
          />
          <div v-else class="empty-state">
            <div v-if="hasErrors" class="error-details">
              <h4>Validation Errors:</h4>
              <ul>
                <li v-for="(error, index) in validationErrors" :key="index">
                  Line {{ error.startLineNumber }}: {{ error.message }}
                </li>
              </ul>
            </div>
            <div v-else>
              <span class="empty-icon">📊</span>
              <p>Enter valid ECharts options to see preview</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { EChartsOption } from 'echarts'
import { MyndEcharts } from '@lib/index'
import { useChartTheme } from '@lib/composables'
import MonacoEditor from '../components/MonacoEditor.vue'
import { chartExamples, getExamplesByCategory, getCategories } from '../data/chartExamples'

const { currentTheme } = useChartTheme()

// Refs
const editorRef = ref<InstanceType<typeof MonacoEditor>>()
const chartRef = ref<InstanceType<typeof MyndEcharts>>()
const fileInput = ref<HTMLInputElement>()

// State
const optionText = ref('{\n  \n}')
const parsedOptions = ref<EChartsOption | null>(null)
const validationErrors = ref<any[]>([])
const selectedExample = ref('')
const updateKey = ref(0)
const autoPreview = ref(true)
const darkMode = ref(false)
const editorTheme = ref('vs')

// Computed
const hasErrors = computed(() => validationErrors.value.length > 0)
const errorCount = computed(() => validationErrors.value.length)
const lineCount = computed(() => optionText.value.split('\n').length)
const charCount = computed(() => optionText.value.length)
const categories = computed(() => getCategories())

// Methods
const handleEditorChange = (value: string) => {
  if (autoPreview.value && !hasErrors.value) {
    parseAndPreview()
  }
}

const handleValidation = (markers: any[]) => {
  validationErrors.value = markers.filter(m => m.severity === 8) // Error severity
}

const parseAndPreview = () => {
  try {
    const parsed = JSON.parse(optionText.value)
    parsedOptions.value = parsed
    updateKey.value++
  } catch (e) {
    parsedOptions.value = null
  }
}

const formatCode = () => {
  editorRef.value?.formatDocument()
}

const validateOption = () => {
  parseAndPreview()
  if (!hasErrors.value && parsedOptions.value) {
    // For example app, we'd need to import toast or use a different notification
    console.log('✅ Option is valid!')
  }
}

const loadSelectedExample = () => {
  if (!selectedExample.value) return
  
  const example = chartExamples.find(e => e.name === selectedExample.value)
  if (example) {
    optionText.value = JSON.stringify(example.option, null, 2)
    parseAndPreview()
  }
}

const importFile = () => {
  fileInput.value?.click()
}

const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const parsed = JSON.parse(content)
      optionText.value = JSON.stringify(parsed, null, 2)
      parseAndPreview()
    } catch (error) {
      console.error('Error reading file: Invalid JSON format')
    }
  }
  reader.readAsText(file)
}

const exportFile = () => {
  const blob = new Blob([optionText.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'echarts-option.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(optionText.value)
    console.log('✅ Copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy to clipboard')
  }
}

const clearEditor = () => {
  if (confirm('Are you sure you want to clear the editor?')) {
    optionText.value = '{\n  \n}'
    parsedOptions.value = null
    selectedExample.value = ''
  }
}

const refreshPreview = () => {
  parseAndPreview()
}

const downloadChart = () => {
  if (chartRef.value?.chartInstance) {
    const url = chartRef.value.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })
    
    const link = document.createElement('a')
    link.download = 'echarts-chart.png'
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

const toggleEditorTheme = () => {
  editorTheme.value = darkMode.value ? 'vs-dark' : 'vs'
}

const handleChartReady = () => {
  console.log('Chart is ready!')
}

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl/Cmd + Shift + F: Format
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
    e.preventDefault()
    formatCode()
  }
  // Ctrl/Cmd + S: Export
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    exportFile()
  }
}

// Listen for theme changes
const handleThemeChange = (event: CustomEvent) => {
  currentTheme.value = event.detail
  updateKey.value++
}

// Load default example
const loadDefaultExample = () => {
  const defaultExample = chartExamples[0]
  optionText.value = JSON.stringify(defaultExample.option, null, 2)
  parseAndPreview()
}

onMounted(() => {
  window.addEventListener('theme-change', handleThemeChange as EventListener)
  window.addEventListener('keydown', handleKeydown)
  loadDefaultExample()
})

onUnmounted(() => {
  window.removeEventListener('theme-change', handleThemeChange as EventListener)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.option-editor-page {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  background: #f5f6fa;
}

.editor-header {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.editor-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.editor-header p {
  margin: 0;
  color: #606266;
}

.editor-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-height: 0;
}

.editor-panel,
.preview-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ebeef5;
  flex-wrap: wrap;
  gap: 1rem;
}

.toolbar-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.editor-wrapper {
  flex: 1;
  min-height: 0;
}

.editor-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-top: 1px solid #ebeef5;
  font-size: 13px;
  background: #f5f7fa;
}

.status-left {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.status-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.status-right label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.status-ok {
  color: #67c23a;
}

.status-error {
  color: #f56c6c;
}

.status-info {
  color: #909399;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ebeef5;
}

.preview-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.preview-controls {
  display: flex;
  gap: 0.5rem;
}

.chart-container {
  flex: 1;
  padding: 1rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  color: #909399;
  padding: 2rem;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.error-details {
  text-align: left;
  background: #fef0f0;
  border: 1px solid #fde2e2;
  border-radius: 4px;
  padding: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.error-details h4 {
  margin: 0 0 0.5rem 0;
  color: #f56c6c;
}

.error-details ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #f56c6c;
  font-size: 14px;
}

.control-button.small {
  padding: 0.25rem 0.5rem;
  font-size: 13px;
}

.control-button span {
  margin-right: 0.25rem;
}

@media (max-width: 1200px) {
  .editor-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
}
</style>