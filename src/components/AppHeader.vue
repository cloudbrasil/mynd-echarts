<template>
  <header class="app-header" :class="{ 'dark-mode': isDarkMode }">
    <div class="header-content">
      <div class="logo-section" @click="$emit('navigate', 'showcase')" role="button" tabindex="0" @keydown.enter="$emit('navigate', 'showcase')">
        <img :src="logoImage" alt="mynd-echarts" class="logo-image" />
      </div>
      <nav class="header-nav">
        <button @click="$emit('navigate', 'showcase')" :class="{ active: activeView === 'showcase' }">
          <span class="material-icons">palette</span>
          Showcase
        </button>
        <button @click="$emit('navigate', 'playground')" :class="{ active: activeView === 'playground' }">
          <span class="material-icons">science</span>
          Playground
        </button>
        <button @click="$emit('navigate', 'examples')" :class="{ active: activeView === 'examples' }">
          <span class="material-icons">library_books</span>
          Examples
        </button>
        <button @click="$emit('navigate', 'documentation')" :class="{ active: activeView === 'documentation' }">
          <span class="material-icons">description</span>
          Docs
        </button>
        <button @click="$emit('toggle-theme')" class="theme-toggle-btn" :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <span class="material-icons">{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        <button @click="openGitHub" class="github-btn">
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          GitHub
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import logoLight from '../images/logo.png'
import logoDark from '../images/logo_white.png'

interface Props {
  activeView: string
  isDarkMode: boolean
}

const props = defineProps<Props>()

defineEmits<{
  navigate: [view: string]
  'toggle-theme': []
}>()

const logoImage = computed(() => props.isDarkMode ? logoDark : logoLight)

const openGitHub = () => {
  window.open('https://github.com/cloudbrasil/mynd-echarts', '_blank')
}
</script>

<style scoped>
/* Header Styles */
.app-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 2147483647; /* Maximum z-index value */
  transition: all 0.3s ease;
}

/* Dark mode header */
.app-header.dark-mode {
  background: black;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  outline: none;
  border-radius: 8px;
}

.logo-section:hover {
  transform: scale(1.05);
}

.logo-section:active {
  transform: scale(0.98);
}

.logo-section:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.logo-image {
  height: 50px;
  width: auto;
  object-fit: contain;
}

.header-nav {
  display: flex;
  gap: 0.5rem;
}

.header-nav button {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: #718096;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dark-mode .header-nav button {
  color: #e2e8f0;
}

.header-nav button .material-icons {
  font-size: 1.125rem;
}

.header-nav button:hover {
  background: #f5f6fa;
  color: #2c3e50;
}

.dark-mode .header-nav button:hover {
  background: #374151;
  color: #f7fafc;
}

.header-nav button.active {
  background: #f5f6fa;
  color: #2c3e50;
}

.dark-mode .header-nav button.active {
  background: #374151;
  color: #f7fafc;
}

/* Theme Toggle Button */
.theme-toggle-btn {
  position: relative;
  width: 40px;
  height: 40px;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
  overflow: hidden;
}

.dark-mode .theme-toggle-btn {
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.3);
}

.theme-toggle-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #6366f1, #fbbf24);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.theme-toggle-btn:hover::before {
  opacity: 0.15;
}

.theme-toggle-btn:hover {
  transform: rotate(180deg) scale(1.1);
  border-color: #6366f1;
}

.theme-toggle-btn .material-icons {
  position: relative;
  z-index: 1;
  font-size: 20px;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.dark-mode .theme-toggle-btn .material-icons {
  color: #fbbf24;
}

.theme-toggle-btn:hover .material-icons {
  color: #6366f1;
}

.dark-mode .theme-toggle-btn:hover .material-icons {
  color: #fbbf24;
}

/* GitHub Button */
.github-btn {
  background: #24292e !important;
  color: white !important;
  padding: 0.5rem 1rem !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.github-btn:hover {
  background: #1a1e22 !important;
  transform: translateY(-1px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }
  
  .header-nav {
    gap: 0.25rem;
  }
  
  .header-nav button {
    padding: 0.5rem 0.75rem;
  }
  
  .header-nav button .material-icons {
    font-size: 1rem;
  }
  
  .header-nav button span:not(.material-icons) {
    display: none;
  }
  
  .github-btn span {
    display: none;
  }
  
  .logo-image {
    height: 40px;
  }
}
</style>