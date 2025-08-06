import { describe, it, expect } from 'vitest'
import * as composables from '../../../lib/composables'

describe('Composables Index Exports', () => {
  it('should export useECharts', () => {
    expect(composables.useECharts).toBeDefined()
    expect(typeof composables.useECharts).toBe('function')
  })

  it('should export useChartTheme', () => {
    expect(composables.useChartTheme).toBeDefined()
    expect(typeof composables.useChartTheme).toBe('function')
  })

  it('should export useChartResize', () => {
    expect(composables.useChartResize).toBeDefined()
    expect(typeof composables.useChartResize).toBe('function')
  })

  it('should export useChartEvents', () => {
    expect(composables.useChartEvents).toBeDefined()
    expect(typeof composables.useChartEvents).toBe('function')
  })

  it('should export useChartAnimation', () => {
    expect(composables.useChartAnimation).toBeDefined()
    expect(typeof composables.useChartAnimation).toBe('function')
  })

  it('should export useChartOptions', () => {
    expect(composables.useChartOptions).toBeDefined()
    expect(typeof composables.useChartOptions).toBe('function')
  })

  it('should export useChartData', () => {
    expect(composables.useChartData).toBeDefined()
    expect(typeof composables.useChartData).toBe('function')
  })

  it('should export useToast', () => {
    expect(composables.useToast).toBeDefined()
    expect(typeof composables.useToast).toBe('function')
  })

  it('should export useLocale', () => {
    expect(composables.useLocale).toBeDefined()
    expect(typeof composables.useLocale).toBe('function')
    expect(composables.provideLocale).toBeDefined()
    expect(typeof composables.provideLocale).toBe('function')
    expect(composables.useTranslation).toBeDefined()
    expect(typeof composables.useTranslation).toBe('function')
  })

  it('should export toasts ref from useToast', () => {
    expect(composables.toasts).toBeDefined()
    expect(Array.isArray(composables.toasts.value)).toBe(true)
  })
})