import { en } from './en'
import { zhCN } from './zh-CN'
import { es } from './es'
import { fr } from './fr'
import { ptBR } from './pt-BR'
import { de } from './de'
import { ja } from './ja'
import { ko } from './ko'
import { ru } from './ru'
import { it } from './it'
import type { LocaleMessages, SupportedLocale } from './types'

export * from './types'

export const locales: Record<SupportedLocale, LocaleMessages> = {
  'en': en,
  'zh-CN': zhCN,
  'es': es,
  'fr': fr,
  'pt-BR': ptBR,
  'pt': ptBR, // Portuguese uses Brazilian Portuguese
  'de': de,
  'ja': ja,
  'ko': ko,
  'ru': ru,
  'it': it,
  'nl': en,
  'pl': en,
  'tr': en,
  'ar': en,
  'he': en,
  'th': en,
  'vi': en,
  'id': en,
  'hi': en,
  'cs': en,
  'sk': en,
  'uk': en,
  'sv': en,
  'no': en,
  'da': en,
  'fi': en,
  'el': en,
  'hu': en,
  'ro': en
}

export function getLocale(locale: SupportedLocale): LocaleMessages {
  return locales[locale] || locales.en
}