<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast-${toast.type}`"
          @click="removeToast(toast.id)"
        >
          <div class="toast-icon">
            <span class="material-icons">
              {{ getIcon(toast.type) }}
            </span>
          </div>
          <div class="toast-message">
            {{ toast.message }}
          </div>
          <button class="toast-close" @click.stop="removeToast(toast.id)">
            <span class="material-icons">close</span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return 'check_circle'
    case 'warning':
      return 'warning'
    case 'danger':
      return 'error'
    case 'info':
    default:
      return 'info'
  }
}
</script>

<style scoped>
.toast-container {
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

.toast {
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

.toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-icon .material-icons {
  font-size: 1.5rem;
}

.toast-message {
  flex: 1;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #1e293b;
}

.toast-close {
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

.toast-close:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1e293b;
}

.toast-close .material-icons {
  font-size: 1.25rem;
}

/* Toast type variants */
.toast-success {
  background: #10b981;
  color: white;
}

.toast-success .toast-message {
  color: white;
}

.toast-success .toast-close {
  color: rgba(255, 255, 255, 0.8);
}

.toast-success .toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.toast-warning {
  background: #f59e0b;
  color: white;
}

.toast-warning .toast-message {
  color: white;
}

.toast-warning .toast-close {
  color: rgba(255, 255, 255, 0.8);
}

.toast-warning .toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.toast-danger {
  background: #ef4444;
  color: white;
}

.toast-danger .toast-message {
  color: white;
}

.toast-danger .toast-close {
  color: rgba(255, 255, 255, 0.8);
}

.toast-danger .toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.toast-info {
  background: #3b82f6;
  color: white;
}

.toast-info .toast-message {
  color: white;
}

.toast-info .toast-close {
  color: rgba(255, 255, 255, 0.8);
}

.toast-info .toast-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Animations */
.toast-enter-active {
  animation: slideDown 0.3s ease;
}

.toast-leave-active {
  animation: slideUp 0.3s ease;
}

.toast-move {
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
:global(.dark) .toast {
  background: #1e293b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

:global(.dark) .toast-message {
  color: #f1f5f9;
}

:global(.dark) .toast-close {
  color: #94a3b8;
}

:global(.dark) .toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
}

/* Dark mode type variants keep their colors */
:global(.dark) .toast-success,
:global(.dark) .toast-warning,
:global(.dark) .toast-danger,
:global(.dark) .toast-info {
  /* Keep the same as light mode */
}
</style>