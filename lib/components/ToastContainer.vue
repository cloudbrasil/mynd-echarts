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
            <svg class="toast-icon-svg" viewBox="0 0 24 24" fill="currentColor">
              <path v-if="toast.type === 'success'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              <path v-else-if="toast.type === 'warning'" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              <path v-else-if="toast.type === 'danger'" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              <path v-else d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div class="toast-message">
            {{ toast.message }}
          </div>
          <button class="toast-close" @click.stop="removeToast(toast.id)">
            <svg class="toast-close-icon" viewBox="0 0 24 24" fill="currentColor">
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

.toast-icon-svg {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
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

.toast-close-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: block;
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