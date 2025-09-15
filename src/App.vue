<template>
  <div id="app" :class="{ dark: isDarkMode }">
    <ToastContainer />
    <!-- Header Component -->
    <AppHeader 
      :active-view="activeView" 
      :is-dark-mode="isDarkMode"
      @navigate="activeView = $event"
      @toggle-theme="toggleTheme"
    />

    <!-- Main Content -->
    <main class="app-main">
      <!-- Showcase View -->
      <div v-if="activeView === 'showcase'" class="showcase-view">
        <!-- MyndAgents CTA Section -->
        <div class="myndagents-cta">
          <!-- Backdrop and glow removed - causing overlay issues -->
          <!-- <div class="cta-backdrop"></div> -->
          <!-- <div class="cta-glow"></div> -->
          <div class="cta-content">
            <div class="cta-left">
              <div class="cta-badge">
                <span class="badge-text">ENTERPRISE AI</span>
              </div>
              <h3 class="cta-title">
                <span class="title-line">Custom AI Agents</span>
                <span class="title-highlight">for Enterprise</span>
              </h3>
              <p class="cta-subtitle">
                From Hype to Infrastructure
              </p>
              <div class="cta-features">
                <div class="feature-item">
                  <span class="feature-dot"></span>
                  <span>Production Ready</span>
                </div>
                <div class="feature-item">
                  <span class="feature-dot"></span>
                  <span>Scalable Solutions</span>
                </div>
                <div class="feature-item">
                  <span class="feature-dot"></span>
                  <span>24/7 Support</span>
                </div>
              </div>
              <button @click="goToMyndAgents" class="cta-button">
                <span class="button-bg"></span>
                <span class="button-content">
                  Discover MyndAgents
                </span>
              </button>
            </div>
            <div class="cta-right" @click="goToMyndAgents">
              <div class="logo-container">
                <div class="logo-glow"></div>
                <div class="logo-ring ring-1"></div>
                <div class="logo-ring ring-2"></div>
                <div class="logo-ring ring-3"></div>
                <img 
                  :src="myndAgentsLogo" 
                  alt="MyndAgents" 
                  class="myndagents-logo"
                />
                <div class="floating-particles">
                  <span class="particle particle-1"></span>
                  <span class="particle particle-2"></span>
                  <span class="particle particle-3"></span>
                  <span class="particle particle-4"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="showcase-header">
          <h2>Chart Gallery</h2>
          <p>Explore various chart types with live examples</p>
        </div>
        
        <div class="chart-categories">
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="{ active: selectedCategory === category.id }"
            class="category-btn"
          >
            <span class="material-icons">{{ category.icon }}</span>
            {{ category.name }}
          </button>
        </div>

        <div class="showcase-grid">
          <div 
            v-for="chart in enhancedShowcaseCharts" 
            :key="chart.id"
            class="showcase-card"
          >
            <div class="chart-preview">
              <MyndEcharts
                :options="chart.options"
                :theme="currentTheme"
                :is-dark-mode="isDarkMode"
                :prefer-theme-defaults="true"
                style="height: 100%; width: 100%; min-height: 400px"
                :key="`${chart.id}-${themeKey}`"
                :show-toolbox="true"
                :toolbox-style="'toolbar'"
              />
            </div>
            <div class="chart-info">
              <h3>{{ chart.name }}</h3>
              <p>{{ chart.description }}</p>
              <div class="chart-info-footer">
                <span :class="['chart-type', `chart-type-${chart.category}`]">{{ chart.type }}</span>
                <button @click="selectChart(chart)" class="try-playground-btn">
                  <span class="material-icons">science</span>
                  Try in Playground
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Playground View -->
      <div v-if="activeView === 'playground'" class="playground-view">
        <div class="playground-header">
          <h2>Interactive Playground</h2>
          <p>Build and customize your charts with live preview</p>
        </div>
        
        <!-- Tab Navigation -->
        <div class="playground-tabs">
          <button
            @click="switchToPreviewTab"
            :class="{ active: playgroundTab === 'preview' }"
            class="tab-button"
          >
            <span class="material-icons">visibility</span>
            Preview
          </button>
          <button
            @click="playgroundTab = 'code'"
            :class="{ active: playgroundTab === 'code' }"
            class="tab-button"
          >
            <span class="material-icons">code</span>
            Code
          </button>
        </div>
        
        <div class="playground-content">
          <!-- Preview Tab -->
          <div v-show="playgroundTab === 'preview'" class="preview-tab" ref="previewPanelRef">
            <div class="preview-toolbar">
              <div class="preview-actions">
                <button @click="toggleTheme" class="theme-toggle">
                  <span class="material-icons">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</span>
                  {{ isDarkMode ? 'Light' : 'Dark' }}
                </button>
                <button @click="refreshPreview" :disabled="!validOptions">
                  <span class="material-icons">refresh</span>
                  Refresh
                </button>
                <button v-if="!isFullscreen" @click="openConfigDialog" :disabled="!validOptions">
                  <span class="material-icons">settings</span>
                  Config
                </button>
                <button @click="toggleFullscreen" class="fullscreen-toggle">
                  <span class="material-icons">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
                  {{ isFullscreen ? 'Exit' : 'Fullscreen' }}
                </button>
              </div>
            </div>
            
            <div class="chart-preview-container">
              <MyndEcharts
                v-if="validOptions && previewOptions"
                v-show="playgroundTab === 'preview'"
                ref="previewChartRef"
                :options="enhanceOptionsWithTheme(previewOptions)"
                :theme="currentTheme"
                :is-dark-mode="isDarkMode"
                :prefer-theme-defaults="true"
                v-model:locale="chartLocale"
                :show-toolbox="true"
                :toolbox-style="'menu'"
                :key="previewKey"
                :auto-resize="true"
                @ready="handleChartReady"
                @update:options="handleOptionsUpdate"
              />
              <div v-else class="empty-preview">
                <span class="material-icons empty-icon">insert_chart</span>
                <p>Enter valid ECharts options to see preview</p>
                <button @click="playgroundTab = 'code'" class="action-btn primary">
                  <span class="material-icons">code</span>
                  Go to Code Editor
                </button>
              </div>
            </div>
          </div>
          
          <!-- Code Tab -->
          <div v-show="playgroundTab === 'code'" class="code-tab">
            <div class="editor-toolbar">
              <select v-model="selectedTemplate" @change="loadTemplate" class="template-select">
                <option value="">Choose a template...</option>
                <optgroup v-for="category in chartCategories" :key="category" :label="category">
                  <option v-for="template in getTemplatesByCategory(category)" :key="template.id" :value="template.id">
                    {{ template.name }}
                  </option>
                </optgroup>
              </select>
              <div class="editor-actions">
                <button @click="formatCode" title="Format Code (Ctrl+Shift+F)">
                  <span class="material-icons">code</span>
                  Format
                </button>
                <button @click="copyCode" title="Copy to Clipboard">
                  <span class="material-icons">content_copy</span>
                  Copy
                </button>
                <button @click="downloadOptions" title="Download JSON">
                  <span class="material-icons">download</span>
                  Download
                </button>
                <button @click="clearEditor" title="Clear Editor">
                  <span class="material-icons">clear</span>
                  Clear
                </button>
              </div>
            </div>
            
            <div class="code-editor">
              <textarea
                v-model="editorContent"
                @input="updatePreview"
                placeholder="Paste your ECharts options here..."
                spellcheck="false"
              ></textarea>
              <div v-if="editorError" class="editor-error">
                ❌ {{ editorError }}
              </div>
              <div v-else-if="validOptions" class="editor-success">
                <div class="success-content">
                  <span class="success-icon">✅</span>
                  <span class="success-text">Valid JSON</span>
                  <span v-if="hasFunctions" class="function-indicator" title="Contains functions">
                    <span class="material-icons">functions</span>
                    <span class="function-count">{{ functionPaths.length }}</span>
                  </span>
                  <button @click="switchToPreviewTab" class="inline-link">View Preview</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Examples View -->
      <div v-if="activeView === 'examples'" class="examples-view">
        <div class="examples-header">
          <h2>Live Examples</h2>
          <p>Ready-to-use chart configurations with source code</p>
        </div>

        <div class="examples-grid">
          <div v-for="example in enhancedAdvancedExamples" :key="example.id" class="example-card">
            <div class="example-preview">
              <MyndEcharts
                :options="example.options"
                :theme="currentTheme"
                :is-dark-mode="isDarkMode"
                :prefer-theme-defaults="true"
                style="height: 600px; width: 100%; max-width: 1400px"
                :key="`${example.id}-${themeKey}`"
                :show-toolbox="true"
                :toolbox-style="'toolbar'"
              />
            </div>
            <div class="example-info">
              <h3>{{ example.name }}</h3>
              <p>{{ example.description }}</p>
              <div class="example-tags">
                <span v-for="tag in example.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="example-actions">
                <button @click="useInPlayground(example)" class="action-btn primary">
                  <span class="material-icons">science</span>
                  Try in Playground
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Documentation View -->
      <div v-if="activeView === 'documentation'" class="documentation-view">
        <div class="documentation-layout">
          <!-- Sidebar Navigation -->
          <aside class="documentation-sidebar" :class="{ 'mobile-visible': !isMobileDrawerOpen }">
            <h3>Documentation</h3>
            <nav class="documentation-nav">
              <template v-for="section in documentationSections" :key="section.id">
                <button 
                  @click="selectDocSection(section.id); openMobileDrawer()"
                  :class="{ active: selectedDocSection === section.id }"
                  class="doc-nav-item"
                >
                  <span class="material-icons">{{ section.icon }}</span>
                  {{ section.title }}
                </button>
                
                <!-- Subsections for API -->
                <div v-if="section.subsections && selectedDocSection === section.id" class="doc-subnav">
                  <button
                    v-for="subsection in section.subsections"
                    :key="subsection.id"
                    @click="selectedSubsection = subsection.id; openMobileDrawer()"
                    :class="{ active: selectedSubsection === subsection.id }"
                    class="doc-subnav-item"
                  >
                    {{ subsection.title }}
                  </button>
                </div>
              </template>
            </nav>
          </aside>

          <!-- Mobile Drawer for Content -->
          <div class="mobile-drawer-overlay" :class="{ open: isMobileDrawerOpen }" @click="closeMobileDrawer"></div>
          
          <!-- Content Area -->
          <main class="documentation-content" :class="{ 'drawer-open': isMobileDrawerOpen }">
            <div class="mobile-drawer-header">
              <button @click="closeMobileDrawer" class="drawer-close-btn">
                <span class="material-icons">arrow_back</span>
                Back
              </button>
              <h2>{{ currentDocSection?.title }}</h2>
            </div>
            <div class="doc-content-wrapper">
              <div class="markdown-content" ref="markdownContentRef"></div>
            </div>
          </main>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { MyndEcharts, useChartTheme, ToastContainer, useToast } from '@lib/index'
import type { EChartsOption } from 'echarts'
import AppHeader from './components/AppHeader.vue'
import { showcaseCharts, chartCategories, advancedExamples } from './data/demoData'
import { documentationSections } from './data/documentationData'
import { apiDocumentation } from './data/apiDocumentation'
import { useAppTheme } from './composables/useAppTheme'
import { parseMarkdown, mountCodeBlocks, unmountCodeBlocks } from './utils/markdown'
import { useJSONWithFunctions } from './composables/useJSONWithFunctions'

// State
const activeView = ref<'showcase' | 'playground' | 'examples' | 'documentation'>('showcase')
const selectedCategory = ref('all')
const selectedChart = ref<any>(null)
const selectedTemplate = ref('')
const isFullscreen = ref(false)
const previewPanelRef = ref<HTMLElement>()
const previewChartRef = ref<any>()
const playgroundTab = ref<'preview' | 'code'>('preview')
const editorContent = ref(JSON.stringify({
  title: {
    text: 'Sample Chart',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    feature: {
      saveAsImage: { show: true },
      restore: { show: true },
      dataView: { show: true },
      dataZoom: { show: true },
      magicType: { show: true, type: ['line', 'bar'] }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
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
  series: [{
    name: 'Sales',
    data: [120, 200, 150, 80, 70, 110, 130],
    type: 'bar'
    // Color handled by theme
  }]
}, null, 2))
const editorError = ref('')
const previewOptions = ref<EChartsOption | null>(null)
const validOptions = ref(false)
const previewKey = ref(0)
const selectedDocSection = ref('getting-started')
const selectedSubsection = ref<string | null>(null)
const isMobileDrawerOpen = ref(false)
const markdownContentRef = ref<HTMLElement>()
const isMounted = ref(false)

// JSON parser composable
const {
  hasFunctions,
  functionPaths,
  parseJSON,
  stringifyJSON,
  formatJSON
} = useJSONWithFunctions()

// Theme management
const { isDarkMode, toggleTheme: toggleAppTheme } = useAppTheme()
const { currentTheme, setTheme } = useChartTheme({
  defaultTheme: isDarkMode.value ? 'dark' : 'light'
})
const themeKey = ref(0)

// Toast notifications
const toast = useToast()

// Chart locale
const chartLocale = ref('en')

// Sync app theme with chart theme
watch(isDarkMode, (newValue) => {
  const newTheme = newValue ? 'dark' : 'light'
  setTheme(newTheme)
  themeKey.value++
  previewKey.value++
})

// Trigger chart resize when switching to preview tab
watch(playgroundTab, async (newTab, oldTab) => {
  if (newTab === 'preview' && oldTab !== 'preview' && isMounted.value) {
    await nextTick()
    // Use requestAnimationFrame for better timing in production
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          if (isMounted.value && previewChartRef.value && previewChartRef.value.resize) {
            previewChartRef.value.resize()
          }
        } catch (error) {
          console.warn('Chart resize error in watcher:', error)
        }
      }, 250)
    })
  }
})

// Computed logo based on theme
const logoImage = computed(() => isDarkMode.value ? '/logo_white.png' : '/logo.png')

const myndAgentsLogo = computed(() => isDarkMode.value ? '/logo_myndagents_vertical_black.png' : '/logo_myndagents_vertical.png')

// Categories
const categories = [
  { id: 'all', name: 'All Charts', icon: 'category' },
  { id: 'line', name: 'Line', icon: 'show_chart' },
  { id: 'bar', name: 'Bar', icon: 'bar_chart' },
  { id: 'pie', name: 'Pie', icon: 'pie_chart' },
  { id: 'scatter', name: 'Scatter', icon: 'scatter_plot' },
  { id: 'radar', name: 'Radar', icon: 'radar' },
  { id: 'heatmap', name: 'Heatmap', icon: 'grid_on' },
  { id: 'tree', name: 'Tree', icon: 'account_tree' },
  { id: 'graph', name: 'Graph', icon: 'hub' },
  { id: 'other', name: 'Other', icon: 'auto_awesome' }
]

// Computed
const filteredCharts = computed(() => {
  if (selectedCategory.value === 'all') {
    return showcaseCharts
  }
  return showcaseCharts.filter(chart => chart.category === selectedCategory.value)
})

const renderedDocContent = computed(() => {
  const section = documentationSections.find(s => s.id === selectedDocSection.value)
  if (!section) return ''
  
  // Handle API documentation specially
  if (section.id === 'component-api' && selectedSubsection.value) {
    const apiContent = apiDocumentation[selectedSubsection.value as keyof typeof apiDocumentation]
    return parseMarkdown(apiContent || '')
  }
  
  return parseMarkdown(section.content)
})


// Watch for content changes and update DOM
watch([renderedDocContent, markdownContentRef], ([content, ref]) => {
  if (ref && content) {
    // Unmount any existing code blocks
    unmountCodeBlocks(ref)
    
    // Set new content
    ref.innerHTML = content
    
    // Mount code block components
    nextTick(() => {
      mountCodeBlocks(ref)
    })
  }
}, { immediate: true, flush: 'post' })

const currentDocSection = computed(() => {
  return documentationSections.find(s => s.id === selectedDocSection.value)
})

// Methods
const selectChart = async (chart: any) => {
  selectedChart.value = chart
  // Apply theme enhancements when loading in playground
  const enhancedOptions = enhanceOptionsWithTheme(chart.options)
  editorContent.value = JSON.stringify(enhancedOptions, null, 2)
  activeView.value = 'playground'
  playgroundTab.value = 'preview' // Ensure preview tab is active
  updatePreview()

  // Ensure the chart renders properly when loaded
  await nextTick()
  requestAnimationFrame(() => {
    setTimeout(() => {
      try {
        if (previewChartRef.value && previewChartRef.value.resize) {
          previewChartRef.value.resize()
        }
      } catch (error) {
        console.warn('Select chart resize error:', error)
      }
    }, 300)
  })
}

const loadTemplate = () => {
  const template = showcaseCharts.find(c => c.id === selectedTemplate.value)
  if (template) {
    // Apply theme enhancements when loading template
    const enhancedOptions = enhanceOptionsWithTheme(template.options)
    editorContent.value = JSON.stringify(enhancedOptions, null, 2)
    updatePreview()
  }
}

const updatePreview = () => {
  try {
    if (!editorContent.value.trim()) {
      validOptions.value = false
      editorError.value = ''
      previewOptions.value = null
      return
    }

    const parseResult = parseJSON(editorContent.value)
    if (parseResult) {
      previewOptions.value = parseResult.data
      validOptions.value = true
      editorError.value = ''
      previewKey.value++
    } else {
      validOptions.value = false
      previewOptions.value = null
    }
  } catch (e: any) {
    validOptions.value = false
    editorError.value = e.message
    previewOptions.value = null
  }
}

const formatCode = () => {
  const formatted = formatJSON(editorContent.value, 2)
  if (formatted) {
    editorContent.value = formatted
    updatePreview()
  }
  // Keep content as is if invalid JSON
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(editorContent.value)
    toast.success('Copied to clipboard!')
  } catch (err) {
    toast.danger('Failed to copy to clipboard')
  }
}

const downloadOptions = () => {
  const blob = new Blob([editorContent.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'echarts-options.json'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const clearEditor = () => {
  if (confirm('Clear the editor?')) {
    editorContent.value = ''
    previewOptions.value = null
    validOptions.value = false
    selectedTemplate.value = ''
  }
}

const toggleTheme = () => {
  toggleAppTheme()
}

const refreshPreview = () => {
  updatePreview()
}

const switchToPreviewTab = async () => {
  playgroundTab.value = 'preview'
  // Wait for the tab to switch and DOM to update
  await nextTick()
  // Trigger chart resize to fix rendering issues
  // Use requestAnimationFrame for better timing in production
  requestAnimationFrame(() => {
    setTimeout(() => {
      try {
        if (previewChartRef.value && previewChartRef.value.resize) {
          previewChartRef.value.resize()
        }
      } catch (error) {
        console.warn('Chart resize error:', error)
      }
    }, 200)
  })
}

const handleChartReady = (instance: any) => {
  // Force a resize to ensure chart renders properly
  // Single resize call after chart is ready
  setTimeout(() => {
    try {
      if (instance && instance.resize) {
        instance.resize()
      }
    } catch (error) {
      console.warn('Chart ready resize error:', error)
    }
  }, 100)
}

const openConfigDialog = () => {
  if (previewChartRef.value) {
    previewChartRef.value.openConfig()
  }
}

const handleOptionsUpdate = (newOptions: EChartsOption) => {
  if (newOptions) {
    // Update the editor content with the new options
    editorContent.value = stringifyJSON(newOptions, 2)
    previewOptions.value = newOptions
    validOptions.value = true
    editorError.value = ''
  }
}

const useInPlayground = async (example: any) => {
  // Apply theme enhancements when loading in playground
  const enhancedOptions = enhanceOptionsWithTheme(example.options)
  editorContent.value = JSON.stringify(enhancedOptions, null, 2)
  activeView.value = 'playground'
  playgroundTab.value = 'preview' // Ensure preview tab is active
  updatePreview()

  // Ensure the chart renders properly when loaded
  await nextTick()
  requestAnimationFrame(() => {
    setTimeout(() => {
      try {
        if (previewChartRef.value && previewChartRef.value.resize) {
          previewChartRef.value.resize()
        }
      } catch (error) {
        console.warn('Use in playground resize error:', error)
      }
    }, 300)
  })
}

const formatJson = (obj: any) => {
  return JSON.stringify(obj, null, 2)
}

const getTemplatesByCategory = (category: string) => {
  return showcaseCharts.filter(c => c.category === category)
}


const goToMyndAgents = () => {
  window.open('https://myndagents.com', '_blank')
}

const selectDocSection = (sectionId: string) => {
  selectedDocSection.value = sectionId
  const section = documentationSections.find(s => s.id === sectionId)
  if (section?.subsections) {
    selectedSubsection.value = section.subsections[0].id
  } else {
    selectedSubsection.value = null
  }
}

const openMobileDrawer = () => {
  if (window.innerWidth <= 1024) {
    isMobileDrawerOpen.value = true
    document.body.style.overflow = 'hidden'
  }
}

const closeMobileDrawer = () => {
  isMobileDrawerOpen.value = false
  document.body.style.overflow = ''
}

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    if (previewPanelRef.value) {
      try {
        await previewPanelRef.value.requestFullscreen()
        isFullscreen.value = true
      } catch (err) {
        console.error('Error attempting to enter fullscreen:', err)
      }
    }
  } else {
    try {
      await document.exitFullscreen()
      isFullscreen.value = false
    } catch (err) {
      console.error('Error attempting to exit fullscreen:', err)
    }
  }
}

// Listen for fullscreen changes
const handleFullscreenChange = async () => {
  const wasFullscreen = isFullscreen.value
  isFullscreen.value = !!document.fullscreenElement
  
  // Refresh the chart when exiting fullscreen to ensure proper rendering
  if (wasFullscreen && !isFullscreen.value) {
    await nextTick()
    if (previewChartRef.value) {
      previewChartRef.value.refresh()
    }
  }
}

// Function to enhance chart options with theme-aware colors
const enhanceOptionsWithTheme = (options: EChartsOption): EChartsOption => {
  const enhanced = { ...options }
  
  // Define colors based on current theme
  const titleColor = isDarkMode.value ? '#e2e8f0' : '#333'
  const subtitleColor = isDarkMode.value ? '#a0aec0' : '#666'
  const axisLabelColor = isDarkMode.value ? '#9ca3af' : '#666'
  const splitLineColor = isDarkMode.value ? '#374151' : '#e5e7eb'
  
  // Enhance title if it exists
  if (enhanced.title) {
    enhanced.title = {
      ...enhanced.title,
      textStyle: {
        ...((enhanced.title as any).textStyle || {}),
        color: titleColor
      },
      subtextStyle: {
        ...((enhanced.title as any).subtextStyle || {}),
        color: subtitleColor
      }
    }
  }
  
  // Enhance toolbox if it exists
  if (enhanced.toolbox) {
    const toolboxIconColor = isDarkMode.value ? '#9ca3af' : '#666'
    const toolboxEmphasisColor = isDarkMode.value ? '#e2e8f0' : '#333'
    
    enhanced.toolbox = {
      ...enhanced.toolbox,
      iconStyle: {
        normal: {
          borderColor: toolboxIconColor,
          color: 'transparent'
        },
        ...((enhanced.toolbox as any).iconStyle || {})
      },
      emphasis: {
        iconStyle: {
          borderColor: toolboxEmphasisColor,
          color: 'transparent',
          borderWidth: 2
        },
        ...((enhanced.toolbox as any).emphasis || {})
      }
    }
    
    // Also enhance individual feature icons if they exist
    if (enhanced.toolbox.feature) {
      Object.keys(enhanced.toolbox.feature).forEach(featureName => {
        const feature = (enhanced.toolbox.feature as any)[featureName]
        if (feature && typeof feature === 'object') {
          (enhanced.toolbox.feature as any)[featureName] = {
            ...feature,
            iconStyle: {
              normal: {
                borderColor: toolboxIconColor,
                color: 'transparent'
              },
              emphasis: {
                borderColor: toolboxEmphasisColor,
                color: 'transparent'
              },
              ...(feature.iconStyle || {})
            }
          }
        }
      })
    }
  }
  
  // Enhance axis if they exist
  if (enhanced.xAxis) {
    const xAxis = Array.isArray(enhanced.xAxis) ? enhanced.xAxis : [enhanced.xAxis]
    enhanced.xAxis = xAxis.map(axis => ({
      ...axis,
      axisLabel: {
        ...(axis.axisLabel || {}),
        color: axisLabelColor
      },
      axisLine: {
        ...(axis.axisLine || {}),
        lineStyle: {
          ...((axis.axisLine as any)?.lineStyle || {}),
          color: isDarkMode.value ? '#4b5563' : '#d1d5db'
        }
      },
      splitLine: {
        ...(axis.splitLine || {}),
        lineStyle: {
          ...((axis.splitLine as any)?.lineStyle || {}),
          color: splitLineColor
        }
      }
    }))
    if (!Array.isArray(options.xAxis)) {
      enhanced.xAxis = enhanced.xAxis[0]
    }
  }
  
  if (enhanced.yAxis) {
    const yAxis = Array.isArray(enhanced.yAxis) ? enhanced.yAxis : [enhanced.yAxis]
    enhanced.yAxis = yAxis.map(axis => ({
      ...axis,
      axisLabel: {
        ...(axis.axisLabel || {}),
        color: axisLabelColor
      },
      axisLine: {
        ...(axis.axisLine || {}),
        lineStyle: {
          ...((axis.axisLine as any)?.lineStyle || {}),
          color: isDarkMode.value ? '#4b5563' : '#d1d5db'
        }
      },
      splitLine: {
        ...(axis.splitLine || {}),
        lineStyle: {
          ...((axis.splitLine as any)?.lineStyle || {}),
          color: splitLineColor
        }
      }
    }))
    if (!Array.isArray(options.yAxis)) {
      enhanced.yAxis = enhanced.yAxis[0]
    }
  }
  
  // Enhance legend if it exists
  if (enhanced.legend) {
    enhanced.legend = {
      ...enhanced.legend,
      textStyle: {
        ...((enhanced.legend as any).textStyle || {}),
        color: axisLabelColor
      }
    }
  }
  
  // Enhance tooltip if it exists
  if (enhanced.tooltip) {
    enhanced.tooltip = {
      ...enhanced.tooltip,
      backgroundColor: isDarkMode.value ? '#1f2937' : '#fff',
      borderColor: isDarkMode.value ? '#374151' : '#e5e7eb',
      textStyle: {
        ...((enhanced.tooltip as any).textStyle || {}),
        color: isDarkMode.value ? '#e2e8f0' : '#333'
      }
    }
  }
  
  return enhanced
}

// Computed properties for enhanced chart options
const enhancedShowcaseCharts = computed(() => {
  return filteredCharts.value.map(chart => ({
    ...chart,
    options: enhanceOptionsWithTheme(chart.options)
  }))
})

const enhancedAdvancedExamples = computed(() => {
  return advancedExamples.map(example => ({
    ...example,
    options: enhanceOptionsWithTheme(example.options)
  }))
})

// Initialize
watch(() => currentTheme.value, () => {
  themeKey.value++
})


// Initialize preview on mount
onMounted(() => {
  isMounted.value = true
  updatePreview()
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

// Cleanup
onUnmounted(() => {
  isMounted.value = false
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  // Reset body overflow if drawer was open
  document.body.style.overflow = ''
  // Unmount code blocks if documentation view
  if (markdownContentRef.value) {
    unmountCodeBlocks(markdownContentRef.value)
  }
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* CSS Variables for theming */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #f5f6fa;
  --text-primary: #2c3e50;
  --text-secondary: #718096;
  --text-tertiary: #a0aec0;
  --border-color: #e9ecef;
  --border-light: #e2e8f0;
  --shadow: 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 4px 12px rgba(0,0,0,0.15);
}

.dark {
  --bg-primary: #1a202c;
  --bg-secondary: #2d3748;
  --bg-tertiary: #374151;
  --text-primary: #f7fafc;
  --text-secondary: #e2e8f0;
  --text-tertiary: #cbd5e0;
  --border-color: #4a5568;
  --border-light: #2d3748;
  --shadow: 0 2px 4px rgba(0,0,0,0.2);
  --shadow-lg: 0 4px 12px rgba(0,0,0,0.3);
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-primary);
  min-height: 100vh;
  background: var(--bg-secondary);
  transition: background-color 0.3s ease, color 0.3s ease;
  position: relative;
}

/* Force all direct children except header to lower z-index */
#app > *:not(.app-header) {
  position: relative;
  z-index: 1;
}

/* Ensure all views have proper spacing from fixed header */
.showcase-view,
.playground-view,
.examples-view,
.documentation-view {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* Main Content */
.app-main {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 100px; /* Add space for fixed header */
  position: relative;
  z-index: 1;
}

/* MyndAgents CTA Section - Modern Card Design */
.myndagents-cta {
  position: relative;
  margin-bottom: 3rem;
  border-radius: 24px;
  overflow: hidden;
  z-index: 1;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.05) 0%, 
    rgba(168, 85, 247, 0.05) 50%, 
    rgba(236, 72, 153, 0.05) 100%);
  /* backdrop-filter removed - causing overlay issues in dark mode */
  animation: cardEntrance 0.8s cubic-bezier(0.23, 1, 0.320, 1);
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.cta-backdrop {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.1) 0%, 
    rgba(168, 85, 247, 0.08) 50%, 
    rgba(236, 72, 153, 0.1) 100%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
  z-index: 0;
}

.myndagents-cta:hover .cta-backdrop {
  opacity: 1;
  pointer-events: auto;
}

/* Ensure backdrop is hidden in dark mode when not hovered */
.dark .cta-backdrop {
  opacity: 0 !important;
  pointer-events: none !important;
}

.dark .myndagents-cta:hover .cta-backdrop {
  opacity: 1 !important;
  pointer-events: auto !important;
}

.cta-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle at 30% 50%, 
    rgba(99, 102, 241, 0.3) 0%, 
    transparent 50%);
  animation: glowRotate 15s linear infinite;
  pointer-events: none;
}

@keyframes glowRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cta-content {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  padding: 3rem;
  align-items: center;
}

/* Left Section */
.cta-left {
  animation: slideInLeft 0.8s cubic-bezier(0.23, 1, 0.320, 1) 0.2s both;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1.2rem;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15));
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 6px;
  margin-bottom: 1.5rem;
  animation: fadeInDown 0.8s cubic-bezier(0.23, 1, 0.320, 1) 0.1s both;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.badge-text {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1rem 0;
}

.title-line {
  display: block;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
  background-size: 200% 100%;
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

.title-highlight {
  display: block;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  opacity: 0.9;
  font-weight: 300;
  letter-spacing: 0.02em;
}

.cta-features {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.320, 1) both;
}

.feature-item:nth-child(1) { animation-delay: 0.3s; }
.feature-item:nth-child(2) { animation-delay: 0.4s; }
.feature-item:nth-child(3) { animation-delay: 0.5s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-dot {
  display: block;
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.4rem;
  animation: dotPulse 3s infinite;
}

@keyframes dotPulse {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Modern Button */
.cta-button {
  position: relative;
  display: inline-flex;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 600;
  overflow: hidden;
  border-radius: 12px;
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.320, 1);
}

.button-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
  border-radius: 12px;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.button-content {
  position: relative;
  display: block;
  padding: 1rem 2.5rem;
  color: white;
  z-index: 1;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.cta-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.cta-button:active {
  transform: translateY(0) scale(0.98);
}

/* Right Section - Logo */
.cta-right {
  animation: slideInRight 0.8s cubic-bezier(0.23, 1, 0.320, 1) 0.4s both;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.logo-container {
  position: relative;
  width: 180px;
  height: 180px;
  cursor: pointer;
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1);
}

.logo-container:hover {
  transform: scale(1.1) rotate(5deg);
}

.logo-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, 
    rgba(168, 85, 247, 0.4) 0%, 
    transparent 70%);
  filter: blur(20px);
  animation: pulseGlow 3s infinite;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.logo-ring {
  position: absolute;
  inset: 0;
  border: 2px solid;
  border-radius: 50%;
  opacity: 0.3;
}

.ring-1 {
  border-color: #6366f1;
  animation: ringRotate 10s linear infinite;
}

.ring-2 {
  inset: 10px;
  border-color: #a855f7;
  animation: ringRotate 15s linear infinite reverse;
}

.ring-3 {
  inset: 20px;
  border-color: #ec4899;
  animation: ringRotate 20s linear infinite;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.myndagents-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: 120px;
  max-width: 100px;
  object-fit: contain;
  z-index: 2;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(-50%, -50%); }
  50% { transform: translate(-50%, -55%); }
}

.floating-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 50%;
  animation: particleFloat 8s infinite;
}

.particle-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.particle-2 {
  top: 80%;
  left: 20%;
  animation-delay: 2s;
}

.particle-3 {
  top: 30%;
  right: 10%;
  animation-delay: 4s;
}

.particle-4 {
  bottom: 20%;
  right: 20%;
  animation-delay: 6s;
}

@keyframes particleFloat {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  10% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  90% {
    transform: translate(100px, -100px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(150px, -150px) scale(0);
    opacity: 0;
  }
}

/* Dark mode adjustments */
.dark-mode .myndagents-cta {
  background: linear-gradient(135deg, 
    rgba(99, 102, 241, 0.08) 0%, 
    rgba(168, 85, 247, 0.08) 50%, 
    rgba(236, 72, 153, 0.08) 100%);
  border: 1px solid rgba(168, 85, 247, 0.2);
}

.dark-mode .cta-badge {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3));
  border-color: rgba(168, 85, 247, 0.5);
}

.dark-mode .logo-glow {
  background: radial-gradient(circle, 
    rgba(168, 85, 247, 0.6) 0%, 
    transparent 70%);
}

/* Showcase View */
.showcase-header {
  text-align: center;
  margin-bottom: 3rem;
}

.showcase-header h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.showcase-header p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.chart-categories {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.category-btn .material-icons {
  font-size: 1rem;
}

.category-btn:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

.category-btn.active {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.showcase-card {
  background: var(--bg-primary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.2s;
}

.chart-preview {
  padding: 1rem;
  background: var(--bg-secondary);
  min-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-info {
  padding: 1.25rem;
}

.chart-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.chart-info p {
  margin: 0 0 0.75rem 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.chart-info-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.try-playground-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.try-playground-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.try-playground-btn .material-icons {
  font-size: 1rem;
}

.chart-type {
  display: inline-block;
  padding: 0.375rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.chart-type::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.chart-type:hover::before {
  left: 100%;
}

/* Chart type badge colors */
.chart-type-line {
  background: #6366f1;
  color: white;
}

.chart-type-bar {
  background: #ec4899;
  color: white;
}

.chart-type-pie {
  background: #06b6d4;
  color: white;
}

.chart-type-scatter {
  background: #10b981;
  color: white;
}

.chart-type-radar {
  background: #f59e0b;
  color: white;
}

.chart-type-heatmap {
  background: #ef4444;
  color: white;
}

.chart-type-tree {
  background: #8b5cf6;
  color: white;
}

.chart-type-graph {
  background: #f97316;
  color: white;
}

.chart-type-other {
  background: #6b7280;
  color: white;
}

/* Dark mode adjustments */
.dark-mode .chart-type {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Playground View */
.playground-header {
  text-align: center;
  margin-bottom: 2rem;
}

.playground-header h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.playground-header p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

/* Tab Navigation Styles */
.playground-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.tab-button.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
  background: transparent;
}

.tab-button .material-icons {
  font-size: 20px;
}

/* Playground Content */
.playground-content {
  height: calc(100vh - 320px); /* Adjusted for fixed header and tabs */
  min-height: 600px;
}

.preview-tab,
.code-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.inline-link {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: inherit;
}

.inline-link:hover {
  color: #4f46e5;
}

.editor-success {
  padding: 0.75rem 1rem;
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border-left: 3px solid #16a34a;
  margin-top: 0.5rem;
  border-radius: 4px;
}

.success-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-icon {
  display: inline-flex;
}

.success-text {
  margin-right: 0.25rem;
}

.function-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
}

.function-indicator .material-icons {
  font-size: 1rem;
}

.function-count {
  font-weight: 600;
}

.playground-layout {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 1.5rem;
  height: calc(100vh - 250px); /* Adjusted for fixed header */
  min-height: 800px;
}

.editor-panel,
.preview-panel {
  background: var(--bg-primary);
  border-radius: 8px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-toolbar {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-toolbar {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.template-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--bg-primary);
  cursor: pointer;
}

.editor-actions,
.preview-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.editor-actions button,
.preview-actions button {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.editor-actions button .material-icons,
.preview-actions button .material-icons {
  font-size: 1rem;
}

.editor-actions button:hover,
.preview-actions button:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

.theme-toggle {
  background: #4299e1 !important;
  color: white !important;
  border-color: #4299e1 !important;
}

.theme-toggle:hover {
  background: #3182ce !important;
}

.code-editor {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.code-editor textarea {
  flex: 1;
  padding: 1rem;
  border: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  color: var(--text-primary);
  background: var(--bg-secondary);
}

.editor-error {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem 1rem;
  background: #fed7d7;
  color: #c53030;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.preview-toolbar h3 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.chart-preview-container {
  flex: 1;
  padding: 1rem;
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

/* Ensure MyndEcharts takes full space */
.chart-preview-container > div:first-child {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.empty-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--text-tertiary);
}

/* Fullscreen styles - Fixed to properly detect theme */
/* Base fullscreen styles - no forced colors */
.preview-tab:fullscreen,
.preview-tab:-webkit-full-screen,
.preview-tab:-moz-full-screen,
.preview-tab:-ms-fullscreen {
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* Toolbar in fullscreen */
.preview-tab:fullscreen .preview-toolbar,
.preview-tab:-webkit-full-screen .preview-toolbar,
.preview-tab:-moz-full-screen .preview-toolbar,
.preview-tab:-ms-fullscreen .preview-toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  flex-shrink: 0;
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
}

/* Actions in fullscreen */
.preview-tab:fullscreen .preview-actions,
.preview-tab:-webkit-full-screen .preview-actions,
.preview-tab:-moz-full-screen .preview-actions,
.preview-tab:-ms-fullscreen .preview-actions {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Chart container in fullscreen */
.preview-tab:fullscreen .chart-preview-container,
.preview-tab:-webkit-full-screen .chart-preview-container,
.preview-tab:-moz-full-screen .chart-preview-container,
.preview-tab:-ms-fullscreen .chart-preview-container {
  flex: 1;
  height: calc(100vh - 60px);
  padding: 1rem;
}

/* Light mode fullscreen - when html does NOT have dark class */
html:not(.dark) .preview-tab:fullscreen,
html:not(.dark) .preview-tab:-webkit-full-screen,
html:not(.dark) .preview-tab:-moz-full-screen,
html:not(.dark) .preview-tab:-ms-fullscreen {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

html:not(.dark) .preview-tab:fullscreen .preview-toolbar,
html:not(.dark) .preview-tab:-webkit-full-screen .preview-toolbar,
html:not(.dark) .preview-tab:-moz-full-screen .preview-toolbar,
html:not(.dark) .preview-tab:-ms-fullscreen .preview-toolbar {
  background-color: #ffffff !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  color: #2c3e50 !important;
}

html:not(.dark) .preview-tab:fullscreen .chart-preview-container,
html:not(.dark) .preview-tab:-webkit-full-screen .chart-preview-container,
html:not(.dark) .preview-tab:-moz-full-screen .chart-preview-container,
html:not(.dark) .preview-tab:-ms-fullscreen .chart-preview-container {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

/* Dark mode fullscreen - when html HAS dark class */
html.dark .preview-tab:fullscreen,
html.dark .preview-tab:-webkit-full-screen,
html.dark .preview-tab:-moz-full-screen,
html.dark .preview-tab:-ms-fullscreen {
  background-color: #1a202c !important;
  color: #e2e8f0 !important;
}

html.dark .preview-tab:fullscreen .preview-toolbar,
html.dark .preview-tab:-webkit-full-screen .preview-toolbar,
html.dark .preview-tab:-moz-full-screen .preview-toolbar,
html.dark .preview-tab:-ms-fullscreen .preview-toolbar {
  background-color: #2d3748 !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  color: #e2e8f0 !important;
}

html.dark .preview-tab:fullscreen .chart-preview-container,
html.dark .preview-tab:-webkit-full-screen .chart-preview-container,
html.dark .preview-tab:-moz-full-screen .chart-preview-container,
html.dark .preview-tab:-ms-fullscreen .chart-preview-container {
  background-color: #1a202c !important;
  color: #e2e8f0 !important;
}

/* Backdrop styles removed - no longer needed after removing modals */

.fullscreen-toggle {
  background: #805ad5 !important;
  color: white !important;
  border-color: #805ad5 !important;
}

.fullscreen-toggle:hover {
  background: #6b46c1 !important;
}

/* Examples View */
.examples-header {
  text-align: center;
  margin-bottom: 3rem;
}

.examples-header h2 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.examples-header p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 100%;
  padding: 0 2rem;
}

.example-card {
  background: var(--bg-primary);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
  width: 100%;
}

.example-preview {
  padding: 2rem;
  background: var(--bg-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 650px;
}

.example-info {
  padding: 1.5rem;
}

.example-info h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.example-info p {
  margin: 0 0 1rem 0;
  color: #718096;
  line-height: 1.6;
}

.example-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e6fffa;
  color: #047857;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
}

.example-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.action-btn .material-icons {
  font-size: 1rem;
}

.action-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.action-btn.primary {
  background: #4299e1;
  color: white;
  border-color: #4299e1;
}

.action-btn.primary:hover {
  background: #3182ce;
}

/* Responsive */
@media (max-width: 1024px) {
  .playground-content {
    height: calc(100vh - 300px);
    min-height: 500px;
  }
  
  .preview-tab,
  .code-tab {
    min-height: 400px;
  }
  
  /* Keep 2 columns on tablets but make them smaller */
  .showcase-grid,
  .examples-grid {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .showcase-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-info-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .try-playground-btn {
    width: 100%;
    justify-content: center;
  }
  
  .examples-grid {
    padding: 0 1rem;
    gap: 1.5rem;
  }
  
  .example-preview {
    padding: 1rem;
    min-height: 450px;
  }
  
  .app-main {
    padding: 1rem;
    margin-top: 70px; /* Add space for fixed header on mobile */
  }
  
  /* MyndAgents CTA Mobile */
  .cta-content {
    grid-template-columns: 1fr;
    padding: 2rem;
    gap: 2rem;
  }
  
  .cta-title {
    font-size: 1.75rem;
  }
  
  .cta-subtitle {
    font-size: 1rem;
  }
  
  .cta-features {
    flex-direction: column;
    gap: 1rem;
  }
  
  .cta-button {
    width: 100%;
  }
  
  .button-content {
    justify-content: center;
  }
  
  .logo-container {
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }
  
  .myndagents-logo {
    height: 100px;
    width: auto;
  }
  
  .playground-content {
    height: calc(100vh - 280px);
    min-height: 400px;
  }
  
  .playground-tabs {
    margin-bottom: 1rem;
  }
  
  .tab-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .tab-button .material-icons {
    font-size: 18px;
  }
  
  .playground-header {
    margin-bottom: 1.5rem;
  }
  
  .playground-header h2 {
    font-size: 1.5rem;
  }
  
  .playground-header p {
    font-size: 1rem;
  }
}

/* Material Icons global styles */
.material-icons {
  vertical-align: middle;
  line-height: 1;
}

/* Documentation Styles */
.documentation-view {
  height: calc(100vh - 160px); /* Adjusted for fixed header */
  overflow: hidden;
}

.documentation-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100%;
  gap: 0;
}

.documentation-sidebar {
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  padding: 2rem;
  overflow-y: auto;
}

.documentation-sidebar h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.documentation-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.doc-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.doc-nav-item .material-icons {
  font-size: 1.25rem;
  opacity: 0.7;
}

.doc-nav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.doc-nav-item.active {
  background: #4299e1;
  color: white;
}

.doc-nav-item.active .material-icons {
  opacity: 1;
}

/* Subsection navigation */
.doc-subnav {
  margin-left: 2rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.doc-subnav-item {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 400;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 2px solid transparent;
}

.doc-subnav-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.doc-subnav-item.active {
  background: var(--bg-tertiary);
  color: #4299e1;
  border-left-color: #4299e1;
  font-weight: 500;
}

.documentation-content {
  background: var(--bg-secondary);
  overflow-y: auto;
  padding: 3rem;
}

.doc-content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

/* Markdown Content Styles */
.markdown-content {
  color: var(--text-primary);
  line-height: 1.7;
}

.markdown-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.75rem;
}

.markdown-content h2 {
  font-size: 1.875rem;
  font-weight: 600;
  margin: 2.5rem 0 1rem 0;
  color: var(--text-primary);
}

.markdown-content h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin: 2rem 0 0.75rem 0;
  color: var(--text-primary);
}

.markdown-content p {
  margin: 0 0 1.25rem 0;
  color: var(--text-secondary);
}

.markdown-content code {
  background: var(--bg-tertiary);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  color: #4299e1;
}

.markdown-content pre {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  overflow-x: auto;
}

.markdown-content pre code {
  background: transparent;
  padding: 0;
  color: var(--text-primary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.markdown-content ul,
.markdown-content ol {
  margin: 0 0 1.25rem 0;
  padding-left: 2rem;
  color: var(--text-secondary);
}

.markdown-content li {
  margin: 0.5rem 0;
}

.markdown-content strong {
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.markdown-content th,
.markdown-content td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.markdown-content th {
  background: var(--bg-tertiary);
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-content tr:last-child td {
  border-bottom: none;
}

/* Responsive Documentation */
@media (max-width: 1024px) {
  .documentation-layout {
    grid-template-columns: 1fr;
    position: relative;
  }
  
  .documentation-sidebar {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
    border-right: none;
  }
  
  .documentation-sidebar.mobile-visible {
    display: block;
  }
  
  /* Mobile drawer overlay */
  .mobile-drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  
  .mobile-drawer-overlay.open {
    opacity: 1;
    pointer-events: auto;
  }
  
  /* Content as drawer */
  .documentation-content {
    position: fixed;
    top: 0;
    right: -100%;
    width: 90%;
    max-width: 600px;
    height: 100vh;
    background: var(--bg-secondary);
    z-index: 1000;
    transition: right 0.3s ease;
    overflow-y: auto;
    padding: 0;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  }
  
  .documentation-content.drawer-open {
    right: 0;
  }
  
  /* Mobile drawer header */
  .mobile-drawer-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .mobile-drawer-header h2 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--text-primary);
    flex: 1;
  }
  
  .drawer-close-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid var(--border-light);
    border-radius: 6px;
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .drawer-close-btn:hover {
    background: var(--bg-tertiary);
    border-color: var(--border-color);
  }
  
  .drawer-close-btn .material-icons {
    font-size: 1.125rem;
  }
  
  .doc-content-wrapper {
    padding: 2rem 1.5rem;
  }
}

/* Hide drawer header on desktop */
@media (min-width: 1025px) {
  .mobile-drawer-header {
    display: none;
  }
  
  .mobile-drawer-overlay {
    display: none;
  }
}

@media (max-width: 768px) {
  .documentation-content {
    width: 95%;
    max-width: none;
  }
  
  .doc-content-wrapper {
    padding: 1.5rem 1rem;
  }
  
  .markdown-content h1 {
    font-size: 2rem;
  }
  
  .markdown-content h2 {
    font-size: 1.5rem;
  }
  
  .markdown-content h3 {
    font-size: 1.25rem;
  }
  
  .documentation-sidebar h3 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }
  
  .doc-nav-item {
    font-size: 0.875rem;
    padding: 0.625rem 0.875rem;
  }
  
  .doc-nav-item .material-icons {
    font-size: 1.125rem;
  }
}
</style>