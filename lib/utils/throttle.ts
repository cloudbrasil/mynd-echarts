/**
 * Throttle function execution
 * Based on vue-echarts approach
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): T {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastTime = 0
  
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - lastTime)
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      lastTime = now
      fn.apply(this, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now()
        timeout = null
        fn.apply(this, args)
      }, remaining)
    }
  } as T
}