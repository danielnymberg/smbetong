import { useState, useEffect, useCallback } from 'react'
import { setCulture } from '@syncfusion/ej2-base'
import { type Language, getTranslation } from '../i18n/translations'

const STORAGE_KEY = 'smbetong-lang'

export function useTranslation() {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return (saved as Language) || 'sv-SE'
  })

  const t = getTranslation(lang)

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem(STORAGE_KEY, newLang)
    setCulture(newLang)
  }, [])

  useEffect(() => {
    setCulture(lang)
  }, [lang])

  return { t, lang, setLang }
}
