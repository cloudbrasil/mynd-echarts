import { ref, type Ref } from 'vue'
import type { ECharts, EChartsOption } from 'echarts'

export interface AnimationConfig {
  enabled?: boolean
  duration?: number
  easing?: 'linear' | 'quadraticIn' | 'quadraticOut' | 'quadraticInOut' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'quarticIn' | 'quarticOut' | 'quarticInOut' | 'quinticIn' | 'quinticOut' | 'quinticInOut' | 'sinusoidalIn' | 'sinusoidalOut' | 'sinusoidalInOut' | 'exponentialIn' | 'exponentialOut' | 'exponentialInOut' | 'circularIn' | 'circularOut' | 'circularInOut' | 'elasticIn' | 'elasticOut' | 'elasticInOut' | 'backIn' | 'backOut' | 'backInOut' | 'bounceIn' | 'bounceOut' | 'bounceInOut'
  delay?: number | ((idx: number) => number)
  update?: boolean
  updateDuration?: number
  updateEasing?: 'linear' | 'quadraticIn' | 'quadraticOut' | 'quadraticInOut' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'quarticIn' | 'quarticOut' | 'quarticInOut' | 'quinticIn' | 'quinticOut' | 'quinticInOut' | 'sinusoidalIn' | 'sinusoidalOut' | 'sinusoidalInOut' | 'exponentialIn' | 'exponentialOut' | 'exponentialInOut' | 'circularIn' | 'circularOut' | 'circularInOut' | 'elasticIn' | 'elasticOut' | 'elasticInOut' | 'backIn' | 'backOut' | 'backInOut' | 'bounceIn' | 'bounceOut' | 'bounceInOut'
  updateDelay?: number | ((idx: number) => number)
}

export interface UseChartAnimationOptions {
  defaultAnimation?: AnimationConfig
  transitionDuration?: number
}

export function useChartAnimation(
  chartInstance: Ref<ECharts | undefined>,
  options: UseChartAnimationOptions = {}
) {
  const {
    defaultAnimation = {
      enabled: true,
      duration: 1000,
      easing: 'cubicOut',
      delay: 0,
      update: true,
      updateDuration: 300,
      updateEasing: 'cubicOut',
      updateDelay: 0
    },
    transitionDuration = 300
  } = options

  const isAnimating = ref(false)
  const animationConfig = ref<AnimationConfig>(defaultAnimation)

  const setAnimationConfig = (config: AnimationConfig) => {
    animationConfig.value = { ...animationConfig.value, ...config }
  }

  const enableAnimation = () => {
    setAnimationConfig({ enabled: true })
  }

  const disableAnimation = () => {
    setAnimationConfig({ enabled: false })
  }

  const animateToOption = (
    option: EChartsOption,
    opts?: {
      notMerge?: boolean
      lazyUpdate?: boolean
      silent?: boolean
    }
  ) => {
    if (!chartInstance.value) return

    isAnimating.value = true

    const animationOption: EChartsOption = {
      ...option,
      animation: animationConfig.value.enabled,
      animationDuration: animationConfig.value.duration,
      animationEasing: animationConfig.value.easing,
      animationDelay: animationConfig.value.delay,
      animationDurationUpdate: animationConfig.value.updateDuration,
      animationEasingUpdate: animationConfig.value.updateEasing,
      animationDelayUpdate: animationConfig.value.updateDelay
    }

    chartInstance.value.setOption(animationOption, opts)

    // Set animation flag to false after animation completes
    setTimeout(() => {
      isAnimating.value = false
    }, animationConfig.value.duration || 1000)
  }

  const transitionTo = (
    fromOption: EChartsOption,
    toOption: EChartsOption,
    duration?: number
  ) => {
    if (!chartInstance.value) return

    const steps = 60 // 60fps
    let currentStep = 0

    isAnimating.value = true

    const interpolate = (from: any, to: any, progress: number): any => {
      if (typeof from === 'number' && typeof to === 'number') {
        return from + (to - from) * progress
      }
      if (Array.isArray(from) && Array.isArray(to)) {
        return from.map((val, idx) => interpolate(val, to[idx], progress))
      }
      return progress > 0.5 ? to : from
    }

    const animate = () => {
      if (currentStep >= steps || !chartInstance.value) {
        isAnimating.value = false
        chartInstance.value?.setOption(toOption, true)
        return
      }

      const progress = currentStep / steps
      const easeProgress = easeInOutCubic(progress)

      // Simple interpolation for series data
      const interpolatedOption: EChartsOption = {
        ...toOption,
        series: Array.isArray(toOption.series) ? toOption.series.map((toSeries: any, idx: number) => {
          const fromSeries = (fromOption.series as any[])?.[idx]
          if (!fromSeries) return toSeries

          return {
            ...toSeries,
            data: toSeries.data?.map((toData: any, dataIdx: number) => {
              const fromData = fromSeries.data?.[dataIdx]
              if (typeof fromData === 'number' && typeof toData === 'number') {
                return interpolate(fromData, toData, easeProgress)
              }
              return toData
            })
          }
        }) : toOption.series
      }

      chartInstance.value.setOption(interpolatedOption, true)
      currentStep++
      
      requestAnimationFrame(animate)
    }

    animate()
  }

  const fadeIn = (duration?: number) => {
    if (!chartInstance.value) return

    const actualDuration = duration || animationConfig.value.duration || 1000
    const chartDom = chartInstance.value.getDom()
    
    chartDom.style.opacity = '0'
    chartDom.style.transition = `opacity ${actualDuration}ms ease-in-out`
    
    requestAnimationFrame(() => {
      chartDom.style.opacity = '1'
    })

    setTimeout(() => {
      chartDom.style.transition = ''
    }, actualDuration)
  }

  const fadeOut = (duration?: number): Promise<void> => {
    return new Promise((resolve) => {
      if (!chartInstance.value) {
        resolve()
        return
      }

      const actualDuration = duration || animationConfig.value.duration || 1000
      const chartDom = chartInstance.value.getDom()
      
      chartDom.style.transition = `opacity ${actualDuration}ms ease-in-out`
      chartDom.style.opacity = '0'

      setTimeout(() => {
        chartDom.style.transition = ''
        resolve()
      }, actualDuration)
    })
  }

  // Easing functions
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  return {
    isAnimating,
    animationConfig,
    setAnimationConfig,
    enableAnimation,
    disableAnimation,
    animateToOption,
    transitionTo,
    fadeIn,
    fadeOut
  }
}