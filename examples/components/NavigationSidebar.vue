<template>
  <nav class="sidebar" :class="{ collapsed: modelValue }">
    <button @click="toggleSidebar" class="collapse-btn">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path v-if="!modelValue" d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path v-else d="M5 3v14M10 3v14M15 3v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    
    <div class="nav-sections">
      <div v-for="section in chartSections" :key="section.title" class="nav-section">
        <h3 class="section-title">{{ section.title }}</h3>
        <ul class="nav-list">
          <li v-for="chart in section.charts" :key="chart.path">
            <router-link 
              :to="chart.path" 
              class="nav-link"
              :title="chart.name"
            >
              <span class="nav-icon">{{ chart.icon }}</span>
              <span class="nav-text">{{ chart.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toggleSidebar = () => {
  emit('update:modelValue', !props.modelValue)
}

const chartSections = [
  {
    title: 'Basic Charts',
    charts: [
      { name: 'Line Chart', path: '/line', icon: '📈' },
      { name: 'Bar Chart', path: '/bar', icon: '📊' },
      { name: 'Pie Chart', path: '/pie', icon: '🥧' }
    ]
  },
  {
    title: 'Tools',
    charts: [
      { name: 'Option Editor', path: '/editor', icon: '✏️' },
      { name: 'AI Chat-like', path: '/ai-chat-like', icon: '🤖' },
      { name: 'Stress Demo', path: '/stress', icon: '🧪' }
    ]
  }
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 65px;
  bottom: 0;
  width: 260px;
  background: white;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  transition: width 0.3s ease;
  z-index: 50;
}

.sidebar.collapsed {
  width: 60px;
}

.collapse-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  background: transparent;
  border: none;
  color: #606266;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s;
}

.collapse-btn:hover {
  background: #f0f2f5;
  color: #5470c6;
}

.nav-sections {
  padding: 1rem;
  padding-top: 3rem;
}

.sidebar.collapsed .nav-sections {
  padding: 0.5rem;
  padding-top: 3rem;
}

.nav-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #909399;
  margin: 0 0 0.5rem 0;
  padding: 0 0.5rem;
  letter-spacing: 0.5px;
  transition: opacity 0.3s;
}

.sidebar.collapsed .section-title {
  opacity: 0;
  height: 0;
  margin: 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: #606266;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
  margin-bottom: 0.25rem;
}

.nav-link:hover {
  background: #f0f2f5;
  color: #5470c6;
}

.nav-link.router-link-active {
  background: #e6f0ff;
  color: #5470c6;
  font-weight: 500;
}

.nav-icon {
  font-size: 20px;
  width: 30px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.nav-text {
  margin-left: 0.5rem;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

/* Scrollbar styles */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  
  .collapse-btn {
    display: none;
  }
}
</style>