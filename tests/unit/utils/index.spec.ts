import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce, throttle } from '../../../lib/utils/index'

describe('Utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  describe('debounce', () => {
    it('should delay function execution', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 200)

      debouncedFn('test')
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledWith('test')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous calls', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 200)

      debouncedFn('first')
      vi.advanceTimersByTime(100)
      
      debouncedFn('second')
      vi.advanceTimersByTime(100)
      
      debouncedFn('third')
      vi.advanceTimersByTime(200)

      expect(fn).toHaveBeenCalledWith('third')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should preserve this context', () => {
      const context = { value: 42 }
      const fn = vi.fn(function(this: any) {
        return this.value
      })
      
      const debouncedFn = debounce(fn, 200)
      debouncedFn.call(context)
      
      vi.advanceTimersByTime(200)
      
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn.mock.instances[0]).toBe(context)
    })

    it('should handle multiple arguments', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 200)

      debouncedFn('arg1', 'arg2', 'arg3')
      vi.advanceTimersByTime(200)

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
    })

    it('should handle zero delay', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 0)

      debouncedFn('test')
      vi.advanceTimersByTime(0)

      expect(fn).toHaveBeenCalledWith('test')
    })

    it('should handle rapid successive calls', () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      for (let i = 0; i < 10; i++) {
        debouncedFn(i)
        vi.advanceTimersByTime(50)
      }

      // Should not have been called yet
      expect(fn).not.toHaveBeenCalled()

      // Advance past the debounce delay
      vi.advanceTimersByTime(100)

      // Should only be called once with the last value
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(9)
    })
  })

  describe('throttle', () => {
    it('should execute immediately on first call', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 200)

      throttledFn('first')
      expect(fn).toHaveBeenCalledWith('first')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should throttle subsequent calls', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 200)

      throttledFn('first')
      throttledFn('second')
      throttledFn('third')

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith('first')

      vi.advanceTimersByTime(200)
      
      throttledFn('fourth')
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenCalledWith('fourth')
    })

    it('should preserve this context', () => {
      const context = { value: 42 }
      const fn = vi.fn(function(this: any) {
        return this.value
      })
      
      const throttledFn = throttle(fn, 200)
      throttledFn.call(context)
      
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn.mock.instances[0]).toBe(context)
    })

    it('should handle multiple arguments', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 200)

      throttledFn('arg1', 'arg2', 'arg3')
      
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
    })

    it('should reset after throttle period', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      throttledFn('first')
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(50)
      throttledFn('second') // Should be throttled
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(50) // Total 100ms
      throttledFn('third') // Should execute
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenCalledWith('third')
    })

    it('should handle zero limit', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 0)

      throttledFn('first')
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(0)
      
      throttledFn('second')
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should handle rapid calls correctly', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      // Rapid calls
      for (let i = 0; i < 5; i++) {
        throttledFn(i)
      }

      // Only first should execute
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(0)

      // Advance time and call again
      vi.advanceTimersByTime(100)
      throttledFn(5)
      
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenCalledWith(5)
    })

    it('should be independent for different instances', () => {
      const fn1 = vi.fn()
      const fn2 = vi.fn()
      const throttled1 = throttle(fn1, 100)
      const throttled2 = throttle(fn2, 100)

      throttled1('fn1-1')
      throttled2('fn2-1')
      
      expect(fn1).toHaveBeenCalledWith('fn1-1')
      expect(fn2).toHaveBeenCalledWith('fn2-1')

      throttled1('fn1-2')
      throttled2('fn2-2')
      
      // Both should be throttled
      expect(fn1).toHaveBeenCalledTimes(1)
      expect(fn2).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(100)

      throttled1('fn1-3')
      throttled2('fn2-3')
      
      expect(fn1).toHaveBeenCalledTimes(2)
      expect(fn2).toHaveBeenCalledTimes(2)
    })
  })

  describe('debounce vs throttle', () => {
    it('should show different behavior patterns', () => {
      const debouncedFn = vi.fn()
      const throttledFn = vi.fn()
      
      const debounced = debounce(debouncedFn, 100)
      const throttled = throttle(throttledFn, 100)

      // Call both 5 times rapidly
      for (let i = 0; i < 5; i++) {
        debounced(i)
        throttled(i)
      }

      // Throttle executes immediately, debounce doesn't
      expect(throttledFn).toHaveBeenCalledTimes(1)
      expect(throttledFn).toHaveBeenCalledWith(0)
      expect(debouncedFn).not.toHaveBeenCalled()

      // After delay, debounce executes with last value
      vi.advanceTimersByTime(100)
      
      expect(debouncedFn).toHaveBeenCalledTimes(1)
      expect(debouncedFn).toHaveBeenCalledWith(4)
      
      // Throttle is ready for next execution
      throttled(5)
      expect(throttledFn).toHaveBeenCalledTimes(2)
      expect(throttledFn).toHaveBeenCalledWith(5)
    })
  })
})