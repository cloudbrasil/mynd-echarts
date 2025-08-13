<template>
  <div class="mynd-echarts-toolbox" :class="[`mynd-echarts-toolbox-${displayStyle}`, { 'mynd-echarts-toolbox-open': isMenuOpen }]" :data-theme="isDarkMode ? 'dark' : 'light'" @mousedown.stop @touchstart.stop>
    <!-- Toolbar Style -->
    <div v-if="displayStyle === 'toolbar'" class="mynd-echarts-toolbox-toolbar">
      <button
        v-for="tool in availableTools"
        :key="tool.key"
        @click="handleToolAction(tool.key)"
        class="mynd-echarts-toolbox-btn"
        :title="tool.title"
        :disabled="tool.disabled"
      >
        <svg v-if="tool.key === 'saveAsImage'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
        <svg v-else-if="tool.key === 'restore'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        <svg v-else-if="tool.key === 'dataView'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10.02H3V19z"/>
        </svg>
        <svg v-else-if="tool.key === 'dataZoom'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
        </svg>
        <svg v-else-if="tool.key === 'magicType'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"/>
        </svg>
      </button>
      <!-- Zoom bar moved below chart -->
    </div>

    <!-- Menu Style -->
    <div v-else-if="displayStyle === 'menu'" class="mynd-echarts-toolbox-menu">
      <button @click.stop="toggleMenu" class="mynd-echarts-toolbox-menu-trigger" title="Chart Options">
        <svg class="mynd-echarts-toolbox-icon" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2"/>
          <circle cx="12" cy="12" r="2"/>
          <circle cx="12" cy="19" r="2"/>
        </svg>
      </button>
      <div v-if="isMenuOpen" class="mynd-echarts-toolbox-menu-dropdown" @click.stop>
        <button
          v-for="tool in availableTools"
          :key="tool.key"
          @click="handleToolAction(tool.key)"
          class="mynd-echarts-toolbox-menu-item"
          :disabled="tool.disabled"
        >
          <svg v-if="tool.key === 'saveAsImage'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
        <svg v-else-if="tool.key === 'restore'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        <svg v-else-if="tool.key === 'dataView'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10.02H3V19z"/>
        </svg>
        <svg v-else-if="tool.key === 'dataZoom'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
        </svg>
        <svg v-else-if="tool.key === 'magicType'" class="mynd-echarts-toolbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"/>
        </svg>
          <span class="mynd-echarts-toolbox-menu-label">{{ tool.title }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type PropType, inject } from 'vue'
import type { ECharts, EChartsOption } from 'echarts'
import { getLocale } from '../locales'
import type { SupportedLocale } from '../locales/types'

export interface ToolboxProps {
  chartInstance?: ECharts | null
  chartType: string | string[]
  displayStyle?: 'toolbar' | 'menu'
  toolboxConfig?: any
  options?: EChartsOption
  locale?: string
  isDarkMode?: boolean
}

const props = withDefaults(defineProps<ToolboxProps>(), {
  displayStyle: 'toolbar',
  locale: 'en',
  isDarkMode: false
})

// Use the prop directly instead of detecting from DOM
const isDarkMode = computed(() => props.isDarkMode)

const emit = defineEmits<{
  action: [key: string, data?: any]
}>()

const isMenuOpen = ref(false)
// zoom bar now handled by parent

// Get locale messages
const messages = computed(() => getLocale(props.locale as SupportedLocale))

// Helper function for getting localized strings
const t = (key: string) => {
  const toolboxMessages = messages.value?.toolbox
  if (toolboxMessages && key in toolboxMessages) {
    return toolboxMessages[key as keyof typeof toolboxMessages]
  }
  return key
}

// SVG icon definitions
const icons = {
  download: '<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>',
  refresh: '<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>',
  table: '<path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10.02H3V19z"/>',
  zoomIn: '<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>',
  magicWand: '<path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"/>'
}

// Define all possible tools
const allTools = computed(() => [
  {
    key: 'saveAsImage',
    icon: icons.download,
    title: t('saveAsImage'),
    supportedTypes: ['line', 'bar', 'pie', 'scatter', 'radar', 'heatmap', 'tree', 'graph', 'gauge', 'funnel', 'sankey', 'treemap', 'sunburst', 'parallel', 'themeRiver'],
    disabled: false,
    action: () => {
      if (props.chartInstance && !props.chartInstance.isDisposed()) {
        // Use configuration from toolbox if available
        const saveConfig = props.toolboxConfig?.feature?.saveAsImage || {}
        const url = props.chartInstance.getDataURL({
          type: saveConfig.type || 'png',
          pixelRatio: saveConfig.pixelRatio || 2,
          backgroundColor: saveConfig.backgroundColor || '#fff'
        })
        const a = document.createElement('a')
        a.href = url
        a.download = saveConfig.name ? `${saveConfig.name}.${saveConfig.type || 'png'}` : 'chart.png'
        a.click()
      }
    }
  },
  {
    key: 'restore',
    icon: icons.refresh,
    title: t('restore'),
    supportedTypes: ['line', 'bar', 'pie', 'scatter', 'radar', 'heatmap', 'tree', 'graph', 'gauge', 'funnel', 'sankey', 'treemap', 'sunburst', 'parallel', 'themeRiver'],
    disabled: false,
    action: () => {
      emit('action', 'restore')
    }
  },
  {
    key: 'dataView',
    icon: icons.table,
    title: t('dataView'),
    supportedTypes: ['line', 'bar', 'area', 'pie', 'scatter', 'radar', 'heatmap', 'gauge', 'funnel', 'sankey'],
    disabled: false,
    action: () => {
      emit('action', 'dataView')
    }
  },
  {
    key: 'dataZoom',
    icon: icons.zoomIn,
    title: t('dataZoom'),
    supportedTypes: ['line', 'bar', 'area', 'scatter', 'candlestick', 'boxplot'],
    disabled: false,
    action: () => emit('action', 'dataZoom')
  },
  {
    key: 'magicType',
    icon: icons.magicWand,
    title: t('magicType'),
    supportedTypes: ['line', 'bar', 'area'],
    disabled: false,
    action: () => {
      emit('action', 'magicType')
    }
  }
])

// Get chart types from props (can be string or array)
const chartTypes = computed(() => {
  if (Array.isArray(props.chartType)) {
    return props.chartType
  }
  return props.chartType ? [props.chartType] : []
})

// Filter tools based on chart type and toolbox config
const availableTools = computed(() => {
  // If toolbox config is provided, use it to determine which tools to show
  if (props.toolboxConfig && props.toolboxConfig.feature) {
    const configuredTools = []
    const features = props.toolboxConfig.feature
    
    // Map ECharts feature names to our tool keys
    const featureMap: Record<string, string> = {
      saveAsImage: 'saveAsImage',
      restore: 'restore',
      dataView: 'dataView',
      dataZoom: 'dataZoom',
      magicType: 'magicType'
    }
    
    // Check each feature in the config
    for (const [featureName, featureConfig] of Object.entries(features)) {
      const toolKey = featureMap[featureName]
      if (toolKey && featureConfig && (featureConfig as any).show !== false) {
        const tool = allTools.value.find(t => t.key === toolKey)
        if (tool) {
          // Also check if chart type supports this tool
          const isSupported = chartTypes.value.some(type => tool.supportedTypes.includes(type))
          if (isSupported) {
            configuredTools.push(tool)
          }
        }
      }
    }
    
    return configuredTools.length > 0 ? configuredTools : getDefaultTools()
  }
  
  // If no toolbox config, return default tools based on chart type
  return getDefaultTools()
})

// Get default tools based on chart type
const getDefaultTools = () => {
  const filtered = allTools.value.filter(tool => {
    // Check if at least one chart type is supported
    const isSupported = chartTypes.value.some(type => tool.supportedTypes.includes(type))
    return isSupported
  })
  return filtered
}

// Handle tool actions
const handleToolAction = (key: string) => {
  const tool = allTools.value.find(t => t.key === key)
  if (tool) {
    tool.action()
  }
  closeMenu()
}


// Menu controls
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  // Check if click is outside the menu
  if (!target.closest('.mynd-echarts-toolbox-menu')) {
    closeMenu()
  }
}

// Setup click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside, { capture: true })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, { capture: true } as any)
})
</script>

<style scoped>
/* CSS Variables for theming */
.mynd-echarts-toolbox {
  --toolbox-icon-color: #4b5563;
  --toolbox-icon-hover-color: #1f2937;
  --toolbox-bg-hover: rgba(0, 0, 0, 0.05);
  --toolbox-menu-bg: white;
  --toolbox-menu-border: rgba(0, 0, 0, 0.1);
  --toolbox-menu-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  --toolbox-menu-item-color: #374151;
  --toolbox-menu-item-hover: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  min-height: 32px;
}

/* Dark mode variables */
.mynd-echarts-toolbox[data-theme="dark"] {
  --toolbox-icon-color: #ffffff;
  --toolbox-icon-hover-color: #ffffff;
  --toolbox-bg-hover: rgba(255, 255, 255, 0.1);
  --toolbox-menu-bg: #1f2937;
  --toolbox-menu-border: #374151;
  --toolbox-menu-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  --toolbox-menu-item-color: #ffffff;
  --toolbox-menu-item-hover: rgba(255, 255, 255, 0.1);
}

/* Toolbar Style */
.mynd-echarts-toolbox-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mynd-echarts-toolbox-btn {
  padding: 6px;
  border: none;
  background: transparent;
  color: var(--toolbox-icon-color);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  line-height: 1;
  outline: none;
  position: relative;
}

.mynd-echarts-toolbox-btn:hover:not(:disabled) {
  background: var(--toolbox-bg-hover);
  color: var(--toolbox-icon-hover-color);
}

.mynd-echarts-toolbox-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mynd-echarts-toolbox-icon {
  width: 18px;
  height: 18px;
  display: block;
  flex-shrink: 0;
  pointer-events: none;
  fill: currentColor;
}

.mynd-echarts-toolbox-btn .mynd-echarts-toolbox-icon {
  color: currentColor;
  fill: currentColor;
}

/* Zoom control inline UI */
.mynd-echarts-toolbox-zoom-control {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}
.mynd-echarts-toolbox-zoom-control input[type="range"] {
  width: 120px;
}
.mynd-echarts-zoom-label {
  font-size: 12px;
  color: #666;
}

/* Menu Style */
.mynd-echarts-toolbox-menu {
  position: relative;
}

.mynd-echarts-toolbox-menu-trigger {
  padding: 6px;
  border: none;
  background: transparent;
  color: var(--toolbox-icon-color);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.mynd-echarts-toolbox-menu-trigger:hover {
  background: var(--toolbox-bg-hover);
  color: var(--toolbox-icon-hover-color);
}

.mynd-echarts-toolbox-menu-trigger .mynd-echarts-toolbox-icon {
  width: 20px;
  height: 20px;
}

.mynd-echarts-toolbox-menu-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: var(--toolbox-menu-bg);
  border: 1px solid var(--toolbox-menu-border);
  border-radius: 6px;
  box-shadow: var(--toolbox-menu-shadow);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mynd-echarts-toolbox-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: var(--toolbox-menu-item-color);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 14px;
}

.mynd-echarts-toolbox-menu-item:hover:not(:disabled) {
  background: var(--toolbox-menu-item-hover);
}

.mynd-echarts-toolbox-menu-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mynd-echarts-toolbox-menu-item .mynd-echarts-toolbox-icon {
  width: 18px;
  height: 18px;
  color: var(--toolbox-icon-color);
  flex-shrink: 0;
}

.mynd-echarts-toolbox-menu-label {
  flex: 1;
}

/* Removed dark mode specific rules - now handled by CSS variables */
</style>