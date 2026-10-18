import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en } from './locales/en'
import { es } from './locales/es'

export const SUPPORTED_LANGUAGES = ['es', 'en'] as const
export const DEFAULT_LANGUAGE = 'es'

/** The device language when supported, otherwise Spanish. */
export function deviceLanguage(): string {
  const code = getLocales()[0]?.languageCode ?? DEFAULT_LANGUAGE

  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code)
    ? code
    : DEFAULT_LANGUAGE
}

void i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: deviceLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
})

export { i18n }
