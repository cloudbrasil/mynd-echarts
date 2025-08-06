import { ref, computed, provide, inject, type InjectionKey, type Ref, type ComputedRef } from 'vue'
import { getLocale } from '../locales'
import type { LocaleMessages, SupportedLocale } from '../locales/types'

export interface LocaleContext {
  locale: Ref<SupportedLocale>
  messages: ComputedRef<LocaleMessages>
  setLocale: (locale: SupportedLocale) => void
}

const LocaleKey: InjectionKey<LocaleContext> = Symbol('mynd-echarts-locale')

export function provideLocale(initialLocale: SupportedLocale = 'en') {
  const locale = ref<SupportedLocale>(initialLocale)
  const messages = computed(() => getLocale(locale.value))
  
  const setLocale = (newLocale: SupportedLocale) => {
    locale.value = newLocale
  }
  
  const context: LocaleContext = {
    locale,
    messages,
    setLocale
  }
  
  provide(LocaleKey, context)
  
  return context
}

export function useLocale() {
  const context = inject(LocaleKey)
  
  if (!context) {
    // Provide a default context if none is provided
    const locale = ref<SupportedLocale>('en')
    const messages = computed(() => getLocale(locale.value))
    
    return {
      locale,
      messages,
      setLocale: (newLocale: SupportedLocale) => {
        locale.value = newLocale
      }
    }
  }
  
  return context
}

// Helper function to get nested property from messages
export function useTranslation() {
  const { messages } = useLocale()
  
  const t = (path: string): string => {
    const keys = path.split('.')
    let value: any = messages.value
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return path // Return the path if translation not found
      }
    }
    
    return typeof value === 'string' ? value : path
  }
  
  return { t, messages }
}