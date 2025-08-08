<template>
  <Teleport to="body">
    <div class="mynd-echarts-toast-container">
      <TransitionGroup name="mynd-echarts-toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="mynd-echarts-toast"
          :class="`mynd-echarts-toast-${toast.type}`"
          @click="removeToast(toast.id)"
        >
          <div class="mynd-echarts-toast-icon">
            <svg class="mynd-echarts-toast-icon-svg" viewBox="0 0 24 24" fill="currentColor">
              <path v-if="toast.type === 'success'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              <path v-else-if="toast.type === 'warning'" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              <path v-else-if="toast.type === 'danger'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              <path v-else d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div class="mynd-echarts-toast-message">
            {{ toast.message }}
          </div>
          <button class="mynd-echarts-toast-close" @click.stop="removeToast(toast.id)">
            <svg class="mynd-echarts-toast-close-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()

// Icon logic is now handled directly in the template with v-if/v-else-if
</script>

<style scoped>
.mynd-echarts-toast-container {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.mynd-echarts-toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: all;
  cursor: pointer;
  min-width: 300px;
  max-width: 500px;
  transition: all 0.3s ease;
}

.mynd-echarts-toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.mynd-echarts-toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mynd-echarts-toast-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
}

.mynd-echarts-toast-message {
  flex: 1;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #1e293b;
}

.mynd-echarts-toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin: -0.25rem -0.5rem -0.25rem 0;
  border-radius: 0.25rem;
  color: #64748b;
  transition: all 0.2s ease;
}

.mynd-echarts-toast-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1e293b;
}

.mynd-echarts-toast-close-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: block;
}

/* Toast type variants */
.mynd-echarts-toast-success {
  background: #10b981;
  color: white;
}

.mynd-echarts-toast-success .mynd-echarts-toast-message {
  color: white;
}

.mynd-echarts-toast-success .mynd-echarts-toast-close {
  color: rgba(255, 255, 255, 0.8);
}

.mynd-echarts-toast-success .mynd-echarts-toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.mynd-echarts-toast-warning {
  background: #f59e0b;
  color: white;
}

.mynd-echarts-toast-warning .mynd-echarts-toast-message {
  color: white;
}

.mynd-echarts-toast-warning .mynd-echarts-toast-close {
  color: rgba(255, 255, 255, 0.8);
}

.mynd-echarts-toast-warning .mynd-echarts-toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.mynd-echarts-toast-danger {
  background: #ef4444;
  color: white;
}

.mynd-echarts-toast-danger .mynd-echarts-toast-message {
  color: white;
}

.mynd-echarts-toast-danger .mynd-echarts-toast-close {
  color: rgba(255, 255, 255, 0.8);
}

.mynd-echarts-toast-danger .mynd-echarts-toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.mynd-echarts-toast-info {
  background: #3b82f6;
  color: white;
}

.mynd-echarts-toast-info .mynd-echarts-toast-message {
  color: white;
}

.mynd-echarts-toast-info .mynd-echarts-toast-close {
  color: rgba(255, 255, 255, 0.8);
}

.mynd-echarts-toast-info .mynd-echarts-toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Animations */
.mynd-echarts-toast-enter-active {
  animation: slideDown 0.3s ease;
}

.mynd-echarts-toast-leave-active {
  animation: slideUp 0.3s ease;
}

.mynd-echarts-toast-move {
  transition: transform 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

/* Dark mode support */
:global(.dark) .mynd-echarts-toast {
  background: #1e293b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

:global(.dark) .mynd-echarts-toast-message {
  color: #f1f5f9;
}

:global(.dark) .mynd-echarts-toast-close {
  color: #94a3b8;
}

:global(.dark) .mynd-echarts-toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
}

/* Dark mode type variants keep their colors */
:global(.dark) .mynd-echarts-toast-success,
:global(.dark) .mynd-echarts-toast-warning,
:global(.dark) .mynd-echarts-toast-danger,
:global(.dark) .mynd-echarts-toast-info {
  /* Keep the same as light mode */
}
</style>