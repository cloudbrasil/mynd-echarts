<template>
  <div class="chart-toolbox" :class="[`toolbox-${displayStyle}`, { 'toolbox-open': isMenuOpen }]">
    <!-- Toolbar Style -->
    <div v-if="displayStyle === 'toolbar'" class="toolbox-toolbar">
      <button
        v-for="tool in availableTools"
        :key="tool.key"
        @click="handleToolAction(tool.key)"
        class="toolbox-btn"
        :title="tool.title"
        :disabled="tool.disabled"
      >
        <span class="material-icons">{{ tool.icon }}</span>
      </button>
    </div>

    <!-- Menu Style -->
    <div v-else-if="displayStyle === 'menu'" class="toolbox-menu">
      <button @click.stop="toggleMenu" class="toolbox-menu-trigger" title="Chart Options">
        <span class="material-icons">more_vert</span>
      </button>
      <div v-if="isMenuOpen" class="toolbox-menu-dropdown" @click.stop>
        <button
          v-for="tool in availableTools"
          :key="tool.key"
          @click="handleToolAction(tool.key)"
          class="toolbox-menu-item"
          :disabled="tool.disabled"
        >
          <span class="material-icons">{{ tool.icon }}</span>
          <span class="toolbox-menu-label">{{ tool.title }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type PropType } from 'vue'
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
}

const props = withDefaults(defineProps<ToolboxProps>(), {
  displayStyle: 'toolbar',
  locale: 'en'
})

const emit = defineEmits<{
  action: [key: string, data?: any]
}>()

const isMenuOpen = ref(false)

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

// Define all possible tools
const allTools = computed(() => [
  {
    key: 'saveAsImage',
    icon: 'download',
    title: t('saveAsImage'),
    supportedTypes: ['line', 'bar', 'pie', 'scatter', 'radar', 'heatmap', 'tree', 'graph', 'gauge', 'funnel', 'sankey', 'treemap', 'sunburst', 'parallel', 'themeRiver'],
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
    icon: 'refresh',
    title: t('restore'),
    supportedTypes: ['line', 'bar', 'pie', 'scatter', 'radar', 'heatmap', 'tree', 'graph', 'gauge', 'funnel', 'sankey', 'treemap', 'sunburst', 'parallel', 'themeRiver'],
    action: () => {
      emit('action', 'restore')
    }
  },
  {
    key: 'dataView',
    icon: 'table_chart',
    title: t('dataView'),
    supportedTypes: ['line', 'bar', 'area', 'pie', 'scatter', 'radar', 'heatmap', 'gauge', 'funnel', 'sankey'],
    action: () => {
      emit('action', 'dataView')
    }
  },
  {
    key: 'dataZoom',
    icon: 'zoom_in',
    title: t('dataZoom'),
    supportedTypes: ['line', 'bar', 'area', 'scatter'],
    action: () => {
      emit('action', 'dataZoom')
    }
  },
  {
    key: 'magicType',
    icon: 'auto_fix_high',
    title: t('magicType'),
    supportedTypes: ['line', 'bar', 'area'],
    action: () => {
      emit('action', 'magicType')
    }
  },
  {
    key: 'brush',
    icon: 'brush',
    title: t('brush'),
    supportedTypes: ['line', 'bar', 'scatter', 'parallel'],
    action: () => {
      emit('action', 'brush')
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
      magicType: 'magicType',
      brush: 'brush'
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
  if (!target.closest('.toolbox-menu')) {
    closeMenu()
  }
}

// Setup click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.chart-toolbox {
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

/* Toolbar Style */
.toolbox-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbox-btn {
  padding: 6px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.toolbox-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.toolbox-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbox-btn .material-icons {
  font-size: 18px;
}

/* Menu Style */
.toolbox-menu {
  position: relative;
}

.toolbox-menu-trigger {
  padding: 6px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.toolbox-menu-trigger:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.toolbox-menu-trigger .material-icons {
  font-size: 20px;
}

.toolbox-menu-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

.toolbox-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 14px;
}

.toolbox-menu-item:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}

.toolbox-menu-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbox-menu-item .material-icons {
  font-size: 18px;
  color: #666;
}

.toolbox-menu-label {
  flex: 1;
}

/* Dark mode support */
:root.dark .toolbox-btn {
  color: #a0aec0;
}

:root.dark .toolbox-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

:root.dark .toolbox-menu-trigger {
  color: #a0aec0;
}

:root.dark .toolbox-menu-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

:root.dark .toolbox-menu-dropdown {
  background: #1a202c;
  border-color: rgba(255, 255, 255, 0.1);
}

:root.dark .toolbox-menu-item {
  color: #e2e8f0;
}

:root.dark .toolbox-menu-item:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .toolbox-menu-item .material-icons {
  color: #a0aec0;
}
</style>