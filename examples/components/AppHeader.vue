<template>
  <header class="app-header">
    <div class="header-content">
      <h1 class="app-title">
        <span class="logo">📊</span>
        mynd-echarts Testing Interface
      </h1>
      <div class="header-controls">
        <select v-model="currentTheme" @change="changeTheme" class="theme-selector">
          <option value="light">Light Theme</option>
          <option value="dark">Dark Theme</option>
          <option value="vintage">Vintage Theme</option>
          <option value="westeros">Westeros Theme</option>
          <option value="essos">Essos Theme</option>
          <option value="wonderland">Wonderland Theme</option>
          <option value="walden">Walden Theme</option>
          <option value="chalk">Chalk Theme</option>
          <option value="infographic">Infographic Theme</option>
          <option value="macarons">Macarons Theme</option>
          <option value="roma">Roma Theme</option>
          <option value="shine">Shine Theme</option>
          <option value="purple-passion">Purple Passion Theme</option>
          <option value="halloween">Halloween Theme</option>
        </select>
        <a 
          href="https://github.com/cloudbrasil/mynd-echarts" 
          target="_blank"
          class="github-link"
          title="View on GitHub"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useChartTheme } from '@lib/composables'

const { currentTheme, setTheme } = useChartTheme()

const changeTheme = () => {
  setTheme(currentTheme.value)
  // Emit theme change event for all charts
  window.dispatchEvent(new CustomEvent('theme-change', { detail: currentTheme.value }))
}

// Initialize with light theme
currentTheme.value = 'light'
</script>

<style scoped>
.app-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 100%;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.logo {
  font-size: 2rem;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-selector {
  padding: 0.5rem 1rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.theme-selector:hover {
  border-color: #5470c6;
}

.theme-selector:focus {
  outline: none;
  border-color: #5470c6;
}

.github-link {
  display: flex;
  align-items: center;
  color: #2c3e50;
  transition: color 0.3s;
}

.github-link:hover {
  color: #5470c6;
}

@media (max-width: 768px) {
  .header-content {
    padding: 1rem;
  }
  
  .app-title {
    font-size: 1.2rem;
  }
  
  .logo {
    font-size: 1.5rem;
  }
  
  .theme-selector {
    font-size: 12px;
    padding: 0.4rem 0.8rem;
  }
}
</style>