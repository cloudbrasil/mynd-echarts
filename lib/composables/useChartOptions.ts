/**
 * @fileoverview Composable for chart options management and validation
 * @module mynd-echarts/composables/useChartOptions
 */

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import type { EChartsOption } from 'echarts'
import { isEChartsOption, deepClone, mergeOptions } from '../types'

/**
 * Options for useChartOptions composable
 */
export interface UseChartOptionsConfig {
  /** Default chart options */
  defaultOptions?: any
  /** Validate options before applying */
  validateOptions?: boolean
  /** Deep watch for option changes */
  deepWatch?: boolean
  /** Custom validation function */
  validator?: (options: any) => boolean | string
  /** Transform options before applying */
  transformer?: (options: any) => any
}

/**
 * Return type for useChartOptions composable
 */
export interface UseChartOptionsReturn {
  /** Current chart options */
  options: Ref<any>
  /** Computed options after transformation */
  computedOptions: ComputedRef<any>
  /** Validation errors */
  errors: Ref<string[]>
  /** Whether options are valid */
  isValid: ComputedRef<boolean>
  /** Set new options */
  setOptions: (newOptions: any, merge?: boolean) => void
  /** Update specific option property */
  updateOption: (path: string, value: any) => void
  /** Reset to default options */
  resetOptions: () => void
  /** Merge multiple options */
  mergeOptions: (...options: any[]) => void
  /** Validate current options */
  validate: () => boolean
  /** Get option by path */
  getOption: (path: string) => any
  /** Clone current options */
  cloneOptions: () => any
}

/**
 * Composable for managing and validating chart options
 * 
 * @param initialOptions - Initial chart options
 * @param config - Configuration options
 * @returns Chart options management functions
 * 
 * @example
 * ```typescript
 * const { options, setOptions, isValid } = useChartOptions({
 *   xAxis: { type: 'category' },
 *   yAxis: { type: 'value' }
 * })
 * ```
 */
export function useChartOptions(
  initialOptions: any = {},
  config: UseChartOptionsConfig = {}
): UseChartOptionsReturn {
  const {
    defaultOptions = {},
    validateOptions = true,
    deepWatch = true,
    validator,
    transformer
  } = config

  // State
  const options = ref<any>(deepClone({ ...defaultOptions, ...initialOptions }))
  const errors = ref<string[]>([])

  // Computed
  const computedOptions = computed(() => {
    const opts = deepClone(options.value)
    return transformer ? transformer(opts) : opts
  })

  const isValid = computed(() => errors.value.length === 0)

  // Methods
  const validate = (): boolean => {
    errors.value = []

    if (!validateOptions) {
      return true
    }

    // Basic validation
    if (!isEChartsOption(options.value)) {
      errors.value.push('Invalid ECharts option structure')
      return false
    }

    // Custom validation
    if (validator) {
      const result = validator(options.value)
      if (result !== true) {
        errors.value.push(typeof result === 'string' ? result : 'Custom validation failed')
        return false
      }
    }

    // Specific validations
    if (options.value.series) {
      const series = Array.isArray(options.value.series) 
        ? options.value.series 
        : [options.value.series]
      
      series.forEach((s, index) => {
        if (!s.type) {
          errors.value.push(`Series[${index}] is missing required property 'type'`)
        }
      })
    }

    return errors.value.length === 0
  }

  const setOptions = (newOptions: EChartsOption, merge = false): void => {
    if (merge) {
      options.value = mergeOptions(options.value, newOptions)
    } else {
      options.value = deepClone(newOptions)
    }
    validate()
  }

  const updateOption = (path: string, value: any): void => {
    const keys = path.split('.')
    let current: any = options.value
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      if (!current[key]) {
        current[key] = {}
      }
      current = current[key]
    }
    
    current[keys[keys.length - 1]] = value
    validate()
  }

  const resetOptions = (): void => {
    options.value = deepClone(defaultOptions)
    validate()
  }

  const mergeOptionsMethod = (...optionsToMerge: Partial<EChartsOption>[]): void => {
    options.value = mergeOptions(options.value, ...optionsToMerge)
    validate()
  }

  const getOption = (path: string): any => {
    const keys = path.split('.')
    let current: any = options.value
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return undefined
      }
    }
    
    return current
  }

  const cloneOptions = (): EChartsOption => {
    return deepClone(options.value)
  }

  // Watch for changes
  if (deepWatch) {
    watch(
      options,
      () => {
        validate()
      },
      { deep: true }
    )
  }

  // Initial validation
  validate()

  return {
    options,
    computedOptions,
    errors,
    isValid,
    setOptions,
    updateOption,
    resetOptions,
    mergeOptions: mergeOptionsMethod,
    validate,
    getOption,
    cloneOptions
  }
}