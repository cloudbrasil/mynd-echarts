import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { provideLocale, useLocale, useTranslation } from '../../../lib/composables/useLocale'
import type { SupportedLocale } from '../../../lib/locales/types'

describe('useLocale', () => {
  // Provider component
  const ProviderComponent = defineComponent({
    props: {
      locale: {
        type: String as () => SupportedLocale,
        default: 'en'
      }
    },
    setup(props, { slots }) {
      const context = provideLocale(props.locale)
      return () => slots.default?.({ ...context })
    }
  })

  // Consumer component
  const ConsumerComponent = defineComponent({
    setup() {
      const { locale, messages, setLocale } = useLocale()
      const { t } = useTranslation()
      
      return {
        locale,
        messages,
        setLocale,
        t
      }
    },
    template: '<div>{{ t("configDialog.title") }}</div>'
  })

  describe('provideLocale', () => {
    it('should provide locale context with default locale', () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      expect(consumer.vm.locale).toBe('en')
      expect(consumer.vm.messages).toBeDefined()
      expect(consumer.text()).toBe('Chart Configuration')
    })

    it('should provide locale context with custom initial locale', () => {
      const wrapper = mount(ProviderComponent, {
        props: { locale: 'zh-CN' },
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      expect(consumer.vm.locale).toBe('zh-CN')
      expect(consumer.text()).toBe('图表配置')
    })

    it('should update locale', async () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      expect(consumer.vm.locale).toBe('en')
      
      consumer.vm.setLocale('es')
      await nextTick()
      
      expect(consumer.vm.locale).toBe('es')
      expect(consumer.text()).toBe('Configuración del Gráfico')
    })

    it('should handle invalid locale gracefully', () => {
      const wrapper = mount(ProviderComponent, {
        props: { locale: 'invalid' as SupportedLocale },
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      // Should default to English
      expect(consumer.vm.messages.configDialog).toBeDefined()
    })
  })

  describe('useTranslation', () => {
    it('should translate simple paths', () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      expect(consumer.vm.t('configDialog.title')).toBe('Chart Configuration')
      expect(consumer.vm.t('configDialog.sections.title')).toBe('Title & Subtitle')
    })

    it('should translate with different locales', async () => {
      const wrapper = mount(ProviderComponent, {
        props: { locale: 'zh-CN' },
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      expect(consumer.vm.t('configDialog.title')).toBe('图表配置')
      expect(consumer.vm.t('configDialog.sections.title')).toBe('标题和副标题')
    })

    it('should handle missing translation keys', () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      expect(consumer.vm.t('non.existent.key')).toBe('non.existent.key')
    })

    it('should handle partial paths', () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      expect(consumer.vm.t('configDialog')).toBe('configDialog')
    })

    it('should provide access to full messages object', () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      expect(consumer.vm.messages).toBeDefined()
      expect(consumer.vm.messages.configDialog).toBeDefined()
      expect(consumer.vm.messages.configDialog.title).toBe('Chart Configuration')
    })
  })

  describe('Locale Switching', () => {
    it('should support all documented locales', async () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      const locales: SupportedLocale[] = ['en', 'zh-CN', 'es', 'fr', 'pt-BR']
      
      for (const locale of locales) {
        consumer.vm.setLocale(locale)
        await nextTick()
        expect(consumer.vm.locale).toBe(locale)
        expect(consumer.vm.messages.configDialog).toBeDefined()
      }
    })

    it('should handle locale aliases', () => {
      const wrapper = mount(ProviderComponent, {
        props: { locale: 'pt' as SupportedLocale },
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      // 'pt' should be treated as 'pt-BR'
      expect(consumer.vm.messages.configDialog.title).toBe('Configuração do Gráfico')
    })
  })

  describe('Complex Translation Paths', () => {
    it('should handle deeply nested paths', () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      expect(consumer.vm.t('configDialog.fields.titleText')).toBe('Title Text')
      expect(consumer.vm.t('configDialog.fields.fontSize')).toBe('Font Size')
    })

    it('should handle array-like structures', () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      // Test field names
      expect(consumer.vm.t('configDialog.fields.position')).toBe('Position')
      expect(consumer.vm.t('configDialog.fields.showLegend')).toBe('Show Legend')
      expect(consumer.vm.t('configDialog.fields.orientation')).toBe('Orientation')
    })
  })

  describe('Reactivity', () => {
    it('should be reactive to locale changes', async () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      
      expect(consumer.vm.t('configDialog.title')).toBe('Chart Configuration')
      
      consumer.vm.setLocale('fr')
      await nextTick()
      
      expect(consumer.vm.t('configDialog.title')).toBe('Configuration du Graphique')
    })

    it('should update all translations when locale changes', async () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      
      const titleEn = consumer.vm.t('configDialog.title')
      const tabTitleEn = consumer.vm.t('configDialog.sections.title')
      
      consumer.vm.setLocale('es')
      await nextTick()
      
      const titleEs = consumer.vm.t('configDialog.title')
      const tabTitleEs = consumer.vm.t('configDialog.sections.title')
      
      expect(titleEn).not.toBe(titleEs)
      expect(tabTitleEn).not.toBe(tabTitleEs)
      expect(titleEs).toBe('Configuración del Gráfico')
      expect(tabTitleEs).toBe('Título y Subtítulo')
    })
  })

  describe('Edge Cases', () => {
    it('should handle special characters in translations', () => {
      const wrapper = mount(ProviderComponent, {
        props: { locale: 'fr' },
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      // French uses accented characters
      expect(consumer.vm.t('configDialog.sections.legend')).toBe('Légende')
      expect(consumer.vm.t('configDialog.fields.subtitle')).toBe('Sous-titre')
    })

    it('should handle Unicode characters', () => {
      const wrapper = mount(ProviderComponent, {
        props: { locale: 'zh-CN' },
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      // Chinese uses Unicode characters
      expect(consumer.vm.t('configDialog.sections.language')).toBe('语言 / Language / Idioma')
    })

    it('should handle RTL languages gracefully', () => {
      // Even though we don't have Arabic translations, the system should handle RTL locale codes
      const wrapper = mount(ProviderComponent, {
        props: { locale: 'ar' as SupportedLocale },
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      // Should default to English
      expect(consumer.vm.messages.configDialog).toBeDefined()
    })
  })

  describe('Performance', () => {
    it('should cache translation lookups', () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      
      // Call the same translation multiple times
      const result1 = consumer.vm.t('configDialog.title')
      const result2 = consumer.vm.t('configDialog.title')
      const result3 = consumer.vm.t('configDialog.title')
      
      // All should return the same result
      expect(result1).toBe(result2)
      expect(result2).toBe(result3)
      expect(result1).toBe('Chart Configuration')
    })

    it('should handle many different paths efficiently', () => {
      const wrapper = mount(ProviderComponent, {
        slots: {
          default: () => h(ConsumerComponent)
        }
      })
      
      const consumer = wrapper.findComponent(ConsumerComponent)
      const paths = [
        'configDialog.title',
        'configDialog.sections.title',
        'configDialog.sections.legend',
        'configDialog.fields.titleText',
        'configDialog.fields.subtitle',
        'configDialog.buttons.apply',
        'configDialog.buttons.reset'
      ]
      
      const results = paths.map(path => consumer.vm.t(path))
      
      // All should return valid translations
      results.forEach((result, index) => {
        expect(result).not.toBe(paths[index])
        expect(typeof result).toBe('string')
      })
    })
  })

  describe('useLocale without provider', () => {
    it('should provide default context when no provider exists', () => {
      const StandaloneComponent = defineComponent({
        setup() {
          const { locale, messages, setLocale } = useLocale()
          const { t } = useTranslation()
          return { locale, messages, setLocale, t }
        },
        template: '<div>{{ t("configDialog.title") }}</div>'
      })

      const wrapper = mount(StandaloneComponent)
      
      expect(wrapper.vm.locale).toBe('en')
      expect(wrapper.vm.messages.configDialog).toBeDefined()
      expect(wrapper.text()).toBe('Chart Configuration')
    })
  })
})