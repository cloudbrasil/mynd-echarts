import { ref } from 'vue'
import * as echarts from 'echarts'

export interface ChartTheme {
  name: string
  theme: object | string
}

export interface UseChartThemeOptions {
  defaultTheme?: string
  themes?: ChartTheme[]
}

export function useChartTheme(options: UseChartThemeOptions = {}) {
  const { defaultTheme = 'default', themes = [] } = options
  
  const currentTheme = ref(defaultTheme)
  const registeredThemes = ref<Set<string>>(new Set(['default', 'light', 'dark']))

  // Register custom themes
  themes.forEach(({ name, theme }) => {
    if (typeof theme === 'object') {
      echarts.registerTheme(name, theme)
      registeredThemes.value.add(name)
    }
  })

  const registerTheme = (name: string, theme: object) => {
    echarts.registerTheme(name, theme)
    registeredThemes.value.add(name)
  }

  // Backwards/alternative naming expected by some consumers/tests
  const registerCustomTheme = (name: string, theme: object) => registerTheme(name, theme)

  const setTheme = (themeName: string) => {
    if (registeredThemes.value.has(themeName)) {
      currentTheme.value = themeName
    } else {
      console.warn(`Theme "${themeName}" is not registered`)
    }
  }

  const getTheme = () => currentTheme.value

  const getRegisteredThemes = () => Array.from(registeredThemes.value)

  const createDarkTheme = () => ({
    backgroundColor: '#121213',  // Custom dark background for mynd-aichat
    textStyle: {
      color: '#eee'
    },
    title: {
      textStyle: {
        color: '#eee'
      },
      subtextStyle: {
        color: '#aaa'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(50, 50, 50, 0.95)',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      }
    },
    legend: {
      textStyle: {
        color: '#ccc'
      }
    },
    dataZoom: {
      textStyle: {
        color: '#ccc'
      }
    },
    grid: {
      borderColor: '#444'
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#666'
        }
      },
      axisLabel: {
        color: '#ccc'
      },
      splitLine: {
        lineStyle: {
          color: '#333'
        }
      }
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#666'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#666'
        }
      },
      axisLabel: {
        color: '#ccc'
      },
      splitLine: {
        lineStyle: {
          color: '#333'
        }
      }
    }
  })

  const createLightTheme = () => ({
    textStyle: {
      color: '#333'
    },
    title: {
      textStyle: {
        color: '#333'
      },
      subtextStyle: {
        color: '#666'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ccc',
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      textStyle: {
        color: '#333'
      }
    },
    dataZoom: {
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      borderColor: '#ccc'
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisTick: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    }
  })

  // Register default themes
  registerTheme('dark', createDarkTheme())
  registerTheme('light', createLightTheme())

  return {
    currentTheme,
    registeredThemes,
    registerTheme,
    registerCustomTheme,
    setTheme,
    getTheme,
    getRegisteredThemes,
    createDarkTheme,
    createLightTheme
  }
}