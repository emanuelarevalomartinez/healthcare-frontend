import 'server-only' 
import { cookies } from 'next/headers'
import { defaultLocale } from './config'

const languages = {
  en: () => import('./../../../messages/en.json').then((module) => module.default),
  es: () => import('./../../../messages/es.json').then((module) => module.default),
}

export type Language = keyof typeof languages

export const getLanguages = () => Object.keys(languages) as Array<Language>

export const getLanguage = async (): Promise<Language> => {
  const cookieStore = await cookies()
  const localeLanguageCookies = cookieStore.get('language')?.value ?? defaultLocale

  if (!getLanguages().includes(localeLanguageCookies as Language)) {
    return defaultLocale
  }

  return localeLanguageCookies as Language
}

export const getCurrentLanguage = async () => {
  const locale = await getLanguage()
  return languages[locale]()
}