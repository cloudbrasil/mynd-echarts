<template>
  <div id="app">
    <AppHeader />
    <div class="app-container">
      <NavigationSidebar v-model:collapsed="sidebarCollapsed" />
      <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import NavigationSidebar from './components/NavigationSidebar.vue'

const sidebarCollapsed = ref(false)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
  background-color: #f5f6fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 2rem;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
  background-color: #f5f6fa;
}

.main-content.sidebar-collapsed {
  margin-left: 60px;
}

/* Transition effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Global styles */
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.controls-panel {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.control-group {
  margin-bottom: 1.5rem;
}

.control-group:last-child {
  margin-bottom: 0;
}

.control-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-size: 14px;
}

.control-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.control-input:focus {
  outline: none;
  border-color: #5470c6;
}

.control-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.control-button {
  padding: 0.5rem 1rem;
  border: 1px solid #5470c6;
  background: #5470c6;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.control-button:hover {
  background: #4361c2;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(84, 112, 198, 0.3);
}

.control-button:active {
  transform: translateY(0);
}

.control-button.secondary {
  background: white;
  color: #5470c6;
}

.control-button.secondary:hover {
  background: #f0f2ff;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 60px;
    padding: 1rem;
  }
}
</style>