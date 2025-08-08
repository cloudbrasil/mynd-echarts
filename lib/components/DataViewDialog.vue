<template>
  <Teleport to="body">
    <div v-if="modelValue" class="dataview-overlay" @click="close">
      <div class="dataview-dialog" @click.stop>
        <div class="dataview-header">
          <h2>{{ t('title') }}</h2>
          <button @click="close" class="dataview-close">
            <span class="material-icons">close</span>
          </button>
        </div>
        
        <div class="dataview-content">
          <div v-if="tableData.length > 0" class="dataview-table-wrapper">
            <table class="dataview-table">
              <thead>
                <tr>
                  <th v-for="header in headers" :key="header">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in tableData" :key="index">
                  <td v-for="header in headers" :key="header">
                    {{ formatValue(row[header]) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="dataview-empty">
            <span class="material-icons">info</span>
            <p>{{ t('noData') }}</p>
          </div>
        </div>
        
        <div class="dataview-footer">
          <button @click="downloadCSV" class="dataview-btn primary" :disabled="tableData.length === 0">
            <span class="material-icons">download</span>
            {{ t('downloadCSV') }}
          </button>
          <button @click="copyToClipboard" class="dataview-btn" :disabled="tableData.length === 0">
            <span class="material-icons">content_copy</span>
            {{ t('copyToClipboard') }}
          </button>
          <button @click="close" class="dataview-btn">
            {{ t('close') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import { getLocale } from '../locales'
import type { SupportedLocale } from '../locales/types'

interface Props {
  modelValue: boolean
  options?: EChartsOption
  chartInstance?: any
  locale?: SupportedLocale
}

const props = withDefaults(defineProps<Props>(), {
  locale: 'en'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Get locale messages
const messages = computed(() => getLocale(props.locale))

// Helper function for getting localized strings
const t = (key: string) => {
  const dataViewMessages = messages.value?.dataView
  if (dataViewMessages && key in dataViewMessages) {
    return dataViewMessages[key as keyof typeof dataViewMessages]
  }
  return key
}

// Extract data from chart
const extractChartData = () => {
  if (!props.options) return { headers: [], data: [] }
  
  const series = props.options.series
  const xAxis = props.options.xAxis as any
  const yAxis = props.options.yAxis as any
  
  if (!series) return { headers: [], data: [] }
  
  const seriesArray = Array.isArray(series) ? series : [series]
  const headers: string[] = []
  const data: any[] = []
  
  // Handle different chart types
  const firstSeries = seriesArray[0] as any
  const chartType = firstSeries?.type || 'line'
  
  if (chartType === 'pie' || chartType === 'funnel') {
    // Pie/Funnel charts
    const nameHeader = t('name')
    const valueHeader = t('value')
    headers.push(nameHeader, valueHeader)
    if (firstSeries.data) {
      firstSeries.data.forEach((item: any) => {
        if (typeof item === 'object' && item !== null) {
          data.push({
            [nameHeader]: item.name || '',
            [valueHeader]: item.value || 0
          })
        }
      })
    }
  } else if (chartType === 'scatter') {
    // Scatter charts
    const seriesHeader = t('series')
    headers.push(seriesHeader)
    
    // Add x and y axis names
    const xName = xAxis?.name || 'X'
    const yName = yAxis?.name || 'Y'
    headers.push(xName, yName)
    
    seriesArray.forEach((s: any) => {
      if (s.data && Array.isArray(s.data)) {
        s.data.forEach((point: any) => {
          if (Array.isArray(point) && point.length >= 2) {
            data.push({
              [seriesHeader]: s.name || t('series'),
              [xName]: point[0],
              [yName]: point[1]
            })
          }
        })
      }
    })
  } else if (chartType === 'heatmap') {
    // Heatmap charts
    const valueHeader = t('value')
    headers.push('X', 'Y', valueHeader)
    if (firstSeries.data) {
      firstSeries.data.forEach((item: any) => {
        if (Array.isArray(item) && item.length >= 3) {
          data.push({
            'X': item[0],
            'Y': item[1],
            [valueHeader]: item[2]
          })
        }
      })
    }
  } else {
    // Line, Bar, Area charts with categories
    if (xAxis && xAxis.data) {
      // Category axis
      const categoryHeader = xAxis.name || t('category')
      headers.push(categoryHeader)
      
      // Add series names as headers
      seriesArray.forEach((s: any) => {
        if (s.name) {
          headers.push(s.name)
        }
      })
      
      // Build data rows
      xAxis.data.forEach((category: string, index: number) => {
        const row: any = {
          [categoryHeader]: category
        }
        
        seriesArray.forEach((s: any) => {
          if (s.name && s.data && s.data[index] !== undefined) {
            row[s.name] = s.data[index]
          }
        })
        
        data.push(row)
      })
    } else {
      // No category axis, use series data directly
      const indexHeader = t('index')
      headers.push(indexHeader)
      
      seriesArray.forEach((s: any) => {
        if (s.name) {
          headers.push(s.name)
        }
      })
      
      // Find max data length
      let maxLength = 0
      seriesArray.forEach((s: any) => {
        if (s.data && s.data.length > maxLength) {
          maxLength = s.data.length
        }
      })
      
      // Build data rows
      for (let i = 0; i < maxLength; i++) {
        const row: any = {
          [indexHeader]: i + 1
        }
        
        seriesArray.forEach((s: any) => {
          if (s.name && s.data && s.data[i] !== undefined) {
            const value = s.data[i]
            row[s.name] = typeof value === 'object' ? value.value : value
          }
        })
        
        data.push(row)
      }
    }
  }
  
  return { headers, data }
}

const chartData = computed(() => extractChartData())
const headers = computed(() => chartData.value.headers)
const tableData = computed(() => chartData.value.data)

// Format value for display
const formatValue = (value: any) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return String(value)
}

// Generate CSV content
const generateCSV = () => {
  if (tableData.value.length === 0) return ''
  
  const csvHeaders = headers.value.join(',')
  const csvRows = tableData.value.map(row => {
    return headers.value.map(header => {
      const value = row[header]
      // Escape values that contain commas or quotes
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }).join(',')
  })
  
  return [csvHeaders, ...csvRows].join('\n')
}

// Download CSV
const downloadCSV = () => {
  const csv = generateCSV()
  if (!csv) return
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'chart-data.csv'
  link.click()
  URL.revokeObjectURL(url)
}

// Copy to clipboard
const copyToClipboard = async () => {
  const csv = generateCSV()
  if (!csv) return
  
  try {
    await navigator.clipboard.writeText(csv)
    // You could emit an event here to show a toast notification
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

// Close dialog
const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.dataview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dataview-dialog {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.dataview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dataview-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.dataview-close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #718096;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dataview-close:hover {
  background: #f7fafc;
  color: #2d3748;
}

.dataview-content {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
}

.dataview-table-wrapper {
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.dataview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.dataview-table th {
  background: #f7fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #2d3748;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.dataview-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f7fafc;
  color: #4a5568;
}

.dataview-table tbody tr:hover {
  background: #f7fafc;
}

.dataview-table tbody tr:last-child td {
  border-bottom: none;
}

.dataview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #a0aec0;
}

.dataview-empty .material-icons {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.dataview-empty p {
  margin: 0;
  font-size: 1rem;
}

.dataview-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.dataview-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dataview-btn:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.dataview-btn.primary {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
}

.dataview-btn.primary:hover:not(:disabled) {
  background: #3182ce;
  border-color: #3182ce;
}

.dataview-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dataview-btn .material-icons {
  font-size: 1.125rem;
}

/* Dark mode support */
.dark & .dataview-dialog {
  background: #1a202c;
}

.dark & .dataview-header {
  border-bottom-color: #2d3748;
}

.dark & .dataview-header h2 {
  color: #f7fafc;
}

.dark & .dataview-close {
  color: #a0aec0;
}

.dark & .dataview-close:hover {
  background: #2d3748;
  color: #f7fafc;
}

.dark & .dataview-table-wrapper {
  border-color: #2d3748;
}

.dark & .dataview-table th {
  background: #2d3748;
  color: #f7fafc;
  border-bottom-color: #4a5568;
}

.dark & .dataview-table td {
  color: #e2e8f0;
  border-bottom-color: #2d3748;
}

.dark & .dataview-table tbody tr:hover {
  background: #2d3748;
}

.dark & .dataview-footer {
  border-top-color: #2d3748;
}

.dark & .dataview-btn {
  background: #2d3748;
  color: #e2e8f0;
  border-color: #4a5568;
}

.dark & .dataview-btn:hover:not(:disabled) {
  background: #4a5568;
  border-color: #718096;
}

/* Mobile styles */
@media (max-width: 768px) {
  .dataview-dialog {
    width: 95%;
    max-height: 90vh;
  }
  
  .dataview-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .dataview-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>