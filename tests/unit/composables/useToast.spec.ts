import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useToast, toasts } from '../../../lib/composables/useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Clear any existing toasts
    toasts.value = []
  })

  afterEach(() => {
    vi.useRealTimers()
    toasts.value = []
  })

  describe('Toast Creation', () => {
    it('should create a success toast', () => {
      const { success } = useToast()
      
      success('Operation successful!')
      
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]).toMatchObject({
        message: 'Operation successful!',
        type: 'success',
        duration: 3000
      })
      expect(toasts.value[0].id).toBeDefined()
    })

    it('should create a warning toast', () => {
      const { warning } = useToast()
      
      warning('Warning message')
      
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]).toMatchObject({
        message: 'Warning message',
        type: 'warning',
        duration: 3000
      })
    })

    it('should create a danger toast', () => {
      const { danger } = useToast()
      
      danger('Error occurred!')
      
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]).toMatchObject({
        message: 'Error occurred!',
        type: 'danger',
        duration: 3000
      })
    })

    it('should create an info toast', () => {
      const { info } = useToast()
      
      info('Information message')
      
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0]).toMatchObject({
        message: 'Information message',
        type: 'info',
        duration: 3000
      })
    })

    it('should create multiple toasts', () => {
      const { success, warning, danger } = useToast()
      
      success('Toast 1')
      warning('Toast 2')
      danger('Toast 3')
      
      expect(toasts.value).toHaveLength(3)
      expect(toasts.value[0].message).toBe('Toast 1')
      expect(toasts.value[1].message).toBe('Toast 2')
      expect(toasts.value[2].message).toBe('Toast 3')
    })

    it('should generate unique IDs for toasts', () => {
      const { info } = useToast()
      
      info('Toast 1')
      info('Toast 2')
      info('Toast 3')
      
      const ids = toasts.value.map(t => t.id)
      const uniqueIds = new Set(ids)
      
      expect(uniqueIds.size).toBe(3)
    })
  })

  describe('Toast Removal', () => {
    it('should auto-remove toast after duration', () => {
      const { success } = useToast()
      
      success('Auto remove test')
      
      expect(toasts.value).toHaveLength(1)
      
      // Advance time past the duration
      vi.advanceTimersByTime(3000)
      
      expect(toasts.value).toHaveLength(0)
    })

    it('should remove toast manually', () => {
      const { info, removeToast } = useToast()
      
      const toastId = info('Manual remove test')
      
      expect(toasts.value).toHaveLength(1)
      
      removeToast(toastId)
      
      expect(toasts.value).toHaveLength(0)
    })

    it('should only remove specified toast', () => {
      const { info, removeToast } = useToast()
      
      const id1 = info('Toast 1')
      const id2 = info('Toast 2')
      const id3 = info('Toast 3')
      
      expect(toasts.value).toHaveLength(3)
      
      removeToast(id2)
      
      expect(toasts.value).toHaveLength(2)
      expect(toasts.value.find(t => t.id === id1)).toBeDefined()
      expect(toasts.value.find(t => t.id === id2)).toBeUndefined()
      expect(toasts.value.find(t => t.id === id3)).toBeDefined()
    })

    it('should handle removing non-existent toast', () => {
      const { info, removeToast } = useToast()
      
      info('Test toast')
      
      expect(toasts.value).toHaveLength(1)
      
      // Try to remove non-existent toast
      removeToast('non-existent-id')
      
      // Original toast should still be there
      expect(toasts.value).toHaveLength(1)
    })

    it('should clear all toasts', () => {
      const { success, warning, danger, clear } = useToast()
      
      success('Toast 1')
      warning('Toast 2')
      danger('Toast 3')
      
      expect(toasts.value).toHaveLength(3)
      
      clear()
      
      expect(toasts.value).toHaveLength(0)
    })
  })

  describe('Custom Duration', () => {
    it('should create toast with custom duration', () => {
      const { success } = useToast()
      
      success('Custom duration', 5000)
      
      expect(toasts.value[0].duration).toBe(5000)
      
      // Should not be removed before custom duration
      vi.advanceTimersByTime(3000)
      expect(toasts.value).toHaveLength(1)
      
      // Should be removed after custom duration
      vi.advanceTimersByTime(2000)
      expect(toasts.value).toHaveLength(0)
    })

    it('should create permanent toast with duration 0', () => {
      const { info } = useToast()
      
      info('Permanent toast', 0)
      
      expect(toasts.value[0].duration).toBe(0)
      
      // Should not be auto-removed
      vi.advanceTimersByTime(10000)
      expect(toasts.value).toHaveLength(1)
    })

    it('should create permanent toast with negative duration', () => {
      const { warning } = useToast()
      
      warning('Another permanent toast', -1)
      
      // Should not be auto-removed
      vi.advanceTimersByTime(10000)
      expect(toasts.value).toHaveLength(1)
    })
  })

  describe('Toast State', () => {
    it('should expose reactive toasts array', async () => {
      const { success } = useToast()
      
      expect(toasts.value).toHaveLength(0)
      
      success('Test')
      await nextTick()
      
      expect(toasts.value).toHaveLength(1)
      
      vi.advanceTimersByTime(3000)
      await nextTick()
      
      expect(toasts.value).toHaveLength(0)
    })

    it('should maintain toast order (newest last)', () => {
      const { info } = useToast()
      
      info('First')
      vi.advanceTimersByTime(100)
      info('Second')
      vi.advanceTimersByTime(100)
      info('Third')
      
      expect(toasts.value[0].message).toBe('First')
      expect(toasts.value[1].message).toBe('Second')
      expect(toasts.value[2].message).toBe('Third')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      const { info } = useToast()
      
      info('')
      
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0].message).toBe('')
    })

    it('should handle very long messages', () => {
      const { warning } = useToast()
      const longMessage = 'A'.repeat(1000)
      
      warning(longMessage)
      
      expect(toasts.value).toHaveLength(1)
      expect(toasts.value[0].message).toBe(longMessage)
    })

    it('should handle rapid toast creation', () => {
      const { success } = useToast()
      
      // Create many toasts rapidly
      for (let i = 0; i < 100; i++) {
        success(`Toast ${i}`)
      }
      
      expect(toasts.value).toHaveLength(100)
      
      // All should have unique IDs
      const ids = new Set(toasts.value.map(t => t.id))
      expect(ids.size).toBe(100)
    })

    it('should handle concurrent removals', () => {
      const { info, removeToast } = useToast()
      
      const ids = []
      for (let i = 0; i < 10; i++) {
        ids.push(info(`Toast ${i}`))
      }
      
      // Remove all at once
      ids.forEach(id => removeToast(id))
      
      expect(toasts.value).toHaveLength(0)
    })
  })

  describe('Multiple Instances', () => {
    it('should share state between multiple useToast calls', () => {
      const toast1 = useToast()
      const toast2 = useToast()
      
      toast1.success('From first instance')
      
      expect(toasts.value).toHaveLength(1)
      
      toast2.warning('From second instance')
      
      expect(toasts.value).toHaveLength(2)
      
      toast1.clear()
      
      expect(toasts.value).toHaveLength(0)
    })
  })

  describe('Return Value', () => {
    it('should return toast ID from creation methods', () => {
      const { success, warning, danger, info } = useToast()
      
      const successId = success('Test')
      const warningId = warning('Test')
      const dangerId = danger('Test')
      const infoId = info('Test')
      
      expect(typeof successId).toBe('string')
      expect(typeof warningId).toBe('string')
      expect(typeof dangerId).toBe('string')
      expect(typeof infoId).toBe('string')
      
      // IDs should match created toasts
      expect(toasts.value.find(t => t.id === successId)).toBeDefined()
      expect(toasts.value.find(t => t.id === warningId)).toBeDefined()
      expect(toasts.value.find(t => t.id === dangerId)).toBeDefined()
      expect(toasts.value.find(t => t.id === infoId)).toBeDefined()
    })
  })
})