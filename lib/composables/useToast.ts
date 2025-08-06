import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'warning' | 'danger' | 'info'
  duration?: number
}

export const toasts = ref<Toast[]>([])
let toastId = 0

export function useToast() {
  const addToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = `toast-${++toastId}`
    const toast: Toast = {
      id,
      message,
      type,
      duration
    }
    
    toasts.value.push(toast)
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message: string, duration?: number) => {
    return addToast(message, 'success', duration)
  }
  
  const warning = (message: string, duration?: number) => {
    return addToast(message, 'warning', duration)
  }
  
  const danger = (message: string, duration?: number) => {
    return addToast(message, 'danger', duration)
  }
  
  const info = (message: string, duration?: number) => {
    return addToast(message, 'info', duration)
  }
  
  const clear = () => {
    toasts.value = []
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    warning,
    danger,
    info,
    clear
  }
}