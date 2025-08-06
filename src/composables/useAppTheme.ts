import { ref, watch } from 'vue'

const isDarkMode = ref(false)

// Initialize theme from localStorage on module load
const savedTheme = localStorage.getItem('app-theme')
if (savedTheme === 'dark') {
  isDarkMode.value = true
  document.documentElement.classList.add('dark')
}

export function useAppTheme() {

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }

  // Watch for theme changes
  watch(isDarkMode, (newValue) => {
    if (newValue) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('app-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('app-theme', 'light')
    }
  })

  return {
    isDarkMode,
    toggleTheme
  }
}