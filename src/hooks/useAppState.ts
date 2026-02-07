import { useState, useCallback, useEffect } from 'react'
import type { Sats, Kontrollpunkt, KontrollStatus, JournalPost, Avvikelse, Recept, Foretag } from '../types'
import { KONTROLLPUNKTER_MALL } from '../types'

const STORAGE_KEY = 'smbetong-data'

// Generera unikt ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Generera satsnummer
function generateSatsnummer(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
  return `${year}${month}${day}-${seq}`
}

// Skapa ny sats med alla kontrollpunkter
function createNySats(receptNamn?: string): Sats {
  const now = new Date().toISOString()
  const kontrollpunkter: Kontrollpunkt[] = KONTROLLPUNKTER_MALL.map(mall => ({
    ...mall,
    id: generateId(),
    status: 'pending' as KontrollStatus,
  }))

  return {
    id: generateId(),
    satsnummer: generateSatsnummer(),
    recept: receptNamn,
    datum: now.split('T')[0],
    kontrollpunkter,
    status: 'pagaende',
    skapad: now,
    uppdaterad: now,
  }
}

interface AppData {
  foretag: Foretag | null
  satser: Sats[]
  recept: Recept[]
  journal: JournalPost[]
  avvikelser: Avvikelse[]
}

const defaultData: AppData = {
  foretag: null,
  satser: [],
  recept: [],
  journal: [],
  avvikelser: [],
}

export function useAppState() {
  const [data, setData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...defaultData, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.error('Failed to load saved data:', e)
    }
    return defaultData
  })

  const [aktivSatsId, setAktivSatsId] = useState<string | null>(null)

  // Spara till localStorage vid ändringar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('Failed to save data:', e)
    }
  }, [data])

  // Aktiv sats
  const aktivSats = data.satser.find(s => s.id === aktivSatsId) || null

  // === SATS-FUNKTIONER ===

  const skapaSats = useCallback((receptNamn?: string) => {
    const nySats = createNySats(receptNamn)
    setData(prev => ({
      ...prev,
      satser: [nySats, ...prev.satser],
    }))
    setAktivSatsId(nySats.id)
    return nySats
  }, [])

  const uppdateraKontrollpunkt = useCallback((
    satsId: string,
    kontrollpunktId: string,
    status: KontrollStatus,
    anmarkning?: string
  ) => {
    const now = new Date().toISOString()
    setData(prev => ({
      ...prev,
      satser: prev.satser.map(sats => {
        if (sats.id !== satsId) return sats

        const uppdateradeKontrollpunkter = sats.kontrollpunkter.map(kp => {
          if (kp.id !== kontrollpunktId) return kp
          return {
            ...kp,
            status,
            datum: now.split('T')[0],
            anmarkning: anmarkning || kp.anmarkning,
          }
        })

        // Beräkna satsens status
        const harAvvikelse = uppdateradeKontrollpunkter.some(kp => kp.status === 'avvikelse')
        const allaKlara = uppdateradeKontrollpunkter.every(
          kp => kp.status === 'ok' || kp.status === 'ej_tillamplig'
        )

        return {
          ...sats,
          kontrollpunkter: uppdateradeKontrollpunkter,
          status: harAvvikelse ? 'avvikelse' : allaKlara ? 'godkand' : 'pagaende',
          uppdaterad: now,
        }
      }),
    }))
  }, [])

  // === JOURNAL-FUNKTIONER ===

  const laggTillJournalpost = useCallback((
    typ: JournalPost['typ'],
    rubrik: string,
    beskrivning: string,
    satsnummer?: string
  ) => {
    const now = new Date()
    const nyPost: JournalPost = {
      id: generateId(),
      datum: now.toISOString().split('T')[0],
      tid: now.toTimeString().slice(0, 5),
      typ,
      rubrik,
      beskrivning,
      satsnummer,
      skapad: now.toISOString(),
    }

    setData(prev => ({
      ...prev,
      journal: [nyPost, ...prev.journal],
    }))

    return nyPost
  }, [])

  // === AVVIKELSE-FUNKTIONER ===

  const laggTillAvvikelse = useCallback((
    beskrivning: string,
    satsnummer?: string,
    kontrollpunktId?: string
  ) => {
    const now = new Date().toISOString()
    const nyAvvikelse: Avvikelse = {
      id: generateId(),
      datum: now.split('T')[0],
      satsnummer,
      kontrollpunkt_id: kontrollpunktId,
      beskrivning,
      status: 'oppen',
      skapad: now,
      uppdaterad: now,
    }

    setData(prev => ({
      ...prev,
      avvikelser: [nyAvvikelse, ...prev.avvikelser],
    }))

    return nyAvvikelse
  }, [])

  const uppdateraAvvikelse = useCallback((
    id: string,
    updates: Partial<Pick<Avvikelse, 'orsak' | 'atgard' | 'status' | 'ansvarig'>>
  ) => {
    const now = new Date().toISOString()
    setData(prev => ({
      ...prev,
      avvikelser: prev.avvikelser.map(av => {
        if (av.id !== id) return av
        return { ...av, ...updates, uppdaterad: now }
      }),
    }))
  }, [])

  // === RECEPT-FUNKTIONER ===

  const sparaRecept = useCallback((recept: Omit<Recept, 'id' | 'skapad' | 'uppdaterad'>) => {
    const now = new Date().toISOString()
    const nyttRecept: Recept = {
      ...recept,
      id: generateId(),
      skapad: now,
      uppdaterad: now,
    }

    setData(prev => ({
      ...prev,
      recept: [nyttRecept, ...prev.recept],
    }))

    return nyttRecept
  }, [])

  // === FÖRETAG ===

  const sparaForetag = useCallback((foretag: Foretag) => {
    setData(prev => ({ ...prev, foretag }))
  }, [])

  return {
    // Data
    foretag: data.foretag,
    satser: data.satser,
    aktivSats,
    recept: data.recept,
    journal: data.journal,
    avvikelser: data.avvikelser,

    // Sats
    setAktivSatsId,
    skapaSats,
    uppdateraKontrollpunkt,

    // Journal
    laggTillJournalpost,

    // Avvikelser
    laggTillAvvikelse,
    uppdateraAvvikelse,

    // Recept
    sparaRecept,

    // Företag
    sparaForetag,
  }
}
