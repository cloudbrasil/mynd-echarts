import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import { debounce, throttle } from '../utils'

export interface UseChartResizeOptions {
  mode?: 'debounce' | 'throttle'
  delay?: number
  observeParent?: boolean
  onResize?: (entry: ResizeObserverEntry) => void
}

export function useChartResize(
  elementRef: Ref<HTMLElement | undefined>,
  callback: () => void,
  options: UseChartResizeOptions = {}
) {
  const {
    mode = 'debounce',
    delay = 200,
    observeParent = false,
    onResize
  } = options

  const isResizing = ref(false)
  let resizeObserver: ResizeObserver | null = null
  let resizeHandler: (() => void) | null = null

  const handleResize = mode === 'throttle' 
    ? throttle(() => {
        isResizing.value = true
        callback()
        setTimeout(() => {
          isResizing.value = false
        }, 50)
      }, delay)
    : debounce(() => {
        isResizing.value = true
        callback()
        setTimeout(() => {
          isResizing.value = false
        }, 50)
      }, delay)

  const observeElement = (element: HTMLElement) => {
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (onResize) {
            onResize(entry)
          }
          handleResize()
        }
      })
      
      resizeObserver.observe(element)
      
      if (observeParent && element.parentElement) {
        resizeObserver.observe(element.parentElement)
      }
    } else {
      // Fallback to window resize
      resizeHandler = handleResize
      window.addEventListener('resize', resizeHandler)
    }
  }

  const startObserving = () => {
    const element = elementRef.value
    if (element) {
      observeElement(element)
    }
  }

  const stopObserving = () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
      resizeHandler = null
    }
  }

  const forceResize = () => {
    callback()
  }

  onMounted(() => {
    startObserving()
  })

  onUnmounted(() => {
    stopObserving()
  })

  return {
    isResizing,
    startObserving,
    stopObserving,
    forceResize
  }
}