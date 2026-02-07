// =============================================================================
// SMBETONG KVALITETSKONTROLL - DATAMODELL
// Förenklad från SS-EN 206-1 Excel-struktur
// =============================================================================

// Status för kontrollpunkter
export type KontrollStatus = 'pending' | 'ok' | 'avvikelse' | 'ej_tillamplig'

// Kategori av kontroll
export type KontrollKategori =
  | 'delmaterial'    // Cement, ballast, pigment, fibrer
  | 'utrustning'     // Vågar, blandare, formar
  | 'tillverkning'   // Dosering, gjutning, härdning

// En enskild kontrollpunkt
export interface Kontrollpunkt {
  id: string
  kategori: KontrollKategori
  nummer: string           // T.ex. "1", "1b", "2"
  material: string         // T.ex. "Cement", "Ballast"
  kontroll: string         // Vad som ska kontrolleras
  syfte: string           // Varför
  frekvens: string        // "Varje leverans", "Dagligen", etc
  status: KontrollStatus
  datum?: string          // ISO-datum när utförd
  anmarkning?: string     // Fritext vid avvikelse
  foto?: string[]         // URLs till foton
}

// En produktionssats/charge
export interface Sats {
  id: string
  satsnummer: string      // T.ex. "2024-001"
  recept?: string         // Receptnamn
  datum: string           // ISO-datum
  kontrollpunkter: Kontrollpunkt[]
  status: 'pagaende' | 'godkand' | 'avvikelse'
  skapad: string          // ISO timestamp
  uppdaterad: string      // ISO timestamp
}

// Receptprotokoll
export interface Recept {
  id: string
  namn: string
  beskrivning?: string
  // Proportioner (kg per m³)
  cement_kg: number
  cement_typ: string      // "Vit CEM I 52,5 R" etc
  ballast_fin_kg: number
  ballast_grov_kg: number
  vatten_kg: number
  vct: number             // Vattencementtal
  pigment_procent?: number
  pigment_typ?: string
  tillsatsmedel?: string
  fibrer?: string
  skapad: string
  uppdaterad: string
}

// Daglig journal-post
export interface JournalPost {
  id: string
  datum: string
  tid: string
  typ: 'notering' | 'avvikelse' | 'atgard'
  rubrik: string
  beskrivning: string
  satsnummer?: string     // Koppling till sats
  ansvarig?: string
  skapad: string
}

// Avvikelse
export interface Avvikelse {
  id: string
  datum: string
  satsnummer?: string
  kontrollpunkt_id?: string
  beskrivning: string
  orsak?: string
  atgard?: string
  status: 'oppen' | 'pagaende' | 'avslutad'
  ansvarig?: string
  foton?: string[]
  skapad: string
  uppdaterad: string
}

// Företagsinformation (försättsblad)
export interface Foretag {
  namn: string
  orgnummer: string
  adress: string
  tillverkningsstalle: string
  ansvarig: string
  telefon: string
  epost: string
}

// Applikationens state
export interface AppState {
  foretag: Foretag | null
  aktivSats: Sats | null
  satser: Sats[]
  recept: Recept[]
  journal: JournalPost[]
  avvikelser: Avvikelse[]
  sprak: 'sv-SE' | 'de-DE'
}

// =============================================================================
// KONTROLLPUNKTER MALL (baserat på SS-EN 206-1)
// =============================================================================

export const KONTROLLPUNKTER_MALL: Omit<Kontrollpunkt, 'id' | 'status' | 'datum' | 'anmarkning' | 'foto'>[] = [
  // DELMATERIAL - Cement
  { kategori: 'delmaterial', nummer: '1', material: 'Cement', kontroll: 'Kontroll av följesedel före urlastning', syfte: 'Säkerställa rätt leverans och källa', frekvens: 'Varje leverans' },
  { kategori: 'delmaterial', nummer: '1b', material: 'Cement', kontroll: 'Kontroll av cementtyp, färg och klass', syfte: 'Rätt typ för dekorativ betong', frekvens: 'Varje leverans' },

  // DELMATERIAL - Ballast
  { kategori: 'delmaterial', nummer: '2', material: 'Ballast', kontroll: 'Kontroll av följesedel före urlastning', syfte: 'Säkerställa rätt leverans och källa', frekvens: 'Varje leverans' },
  { kategori: 'delmaterial', nummer: '3', material: 'Ballast', kontroll: 'Okulär granskning före urlastning', syfte: 'Kornstorleksfördelning, kornform, föroreningar', frekvens: 'Varje leverans' },
  { kategori: 'delmaterial', nummer: '6b', material: 'Marmormjöl/kalksten', kontroll: 'Kontroll kornstorlek och renhet', syfte: 'Säkerställ ytfinish för stuckatur/dekor', frekvens: 'Varje leverans' },

  // DELMATERIAL - Tillsatsmedel & Pigment
  { kategori: 'delmaterial', nummer: '7', material: 'Tillsatsmedel', kontroll: 'Kontroll av följesedel och märkning', syfte: 'Säkerställa rätt leverans', frekvens: 'Varje leverans' },
  { kategori: 'delmaterial', nummer: '8b', material: 'Plastiserare', kontroll: 'Kontroll dosering & kompatibilitet', syfte: 'Optimal bearbetbarhet', frekvens: 'Varje ny batch' },
  { kategori: 'delmaterial', nummer: '11', material: 'Pigment', kontroll: 'Kontroll av typ, färgnr och batch', syfte: 'Säkerställ färgkonsistens mellan satser', frekvens: 'Varje leverans' },
  { kategori: 'delmaterial', nummer: '13', material: 'Fibrer', kontroll: 'Kontroll av typ, längd och dosering', syfte: 'Sprickdämpning dekorativa element', frekvens: 'Varje leverans' },
  { kategori: 'delmaterial', nummer: '14', material: 'Formolja', kontroll: 'Kontroll av typ och kompatibilitet', syfte: 'Förhindra missfärgning ytskikt', frekvens: 'Varje ny batch' },
  { kategori: 'delmaterial', nummer: '15', material: 'Vatten', kontroll: 'Kontroll av vattenkvalitet', syfte: 'Dricksvattenkvalitet eller provad', frekvens: 'Vid ny källa' },

  // UTRUSTNING - Förvaring
  { kategori: 'utrustning', nummer: '1', material: 'Upplag/silos', kontroll: 'Okulär granskning', syfte: 'Fastställa överensstämmelse med krav', frekvens: 'Varje vecka' },
  { kategori: 'utrustning', nummer: '1b', material: 'Cementförvaring', kontroll: 'Kontroll fukt, temperatur, separering', syfte: 'Förhindra klumpbildning', frekvens: 'Dagligen' },
  { kategori: 'utrustning', nummer: '1c', material: 'Pigmentförvaring', kontroll: 'Kontroll torrt, separerat, märkt', syfte: 'Undvika korsförorening', frekvens: 'Dagligen' },

  // UTRUSTNING - Vägning & Dosering
  { kategori: 'utrustning', nummer: '2', material: 'Vågutrustning', kontroll: 'Okulär granskning av funktion', syfte: 'Ren och fungerar rätt', frekvens: 'Dagligen' },
  { kategori: 'utrustning', nummer: '5b', material: 'Pigmentvåg', kontroll: 'Kontroll av noggrannhet', syfte: 'Exakt pigmentdosering för färgjämnhet', frekvens: 'Dagligen' },

  // UTRUSTNING - Blandning & Gjutning
  { kategori: 'utrustning', nummer: '7', material: 'Blandare', kontroll: 'Okulär granskning', syfte: 'Kontrollera slitage', frekvens: 'Periodiskt' },
  { kategori: 'utrustning', nummer: '7b', material: 'Blandare', kontroll: 'Kontroll rengjord mellan satser', syfte: 'Undvika färgkontaminering', frekvens: 'Vid färgbyte' },
  { kategori: 'utrustning', nummer: '8', material: 'Formar', kontroll: 'Kontroll skick, renhet, formolja', syfte: 'Ytfinish och dimensionsnoggrannhet', frekvens: 'Före varje gjutning' },
  { kategori: 'utrustning', nummer: '9', material: 'Vibrator', kontroll: 'Okulär granskning, funktionstest', syfte: 'Rätt kompaktering utan separation', frekvens: 'Dagligen' },
  { kategori: 'utrustning', nummer: '10', material: 'Härdkammare', kontroll: 'Kontroll temperatur och fukt', syfte: 'Korrekt härdning, minimera sprickor', frekvens: 'Dagligen' },

  // TILLVERKNING - Dosering
  { kategori: 'tillverkning', nummer: '4', material: 'Vattenhalt', kontroll: 'Kontroll av tillsatt mängd vatten', syfte: 'Uppgifter för vct-bestämning', frekvens: 'Varje sats' },
  { kategori: 'tillverkning', nummer: '5', material: 'Cementhalt', kontroll: 'Kontroll av tillsatt mängd cement', syfte: 'Kontroll cementhalt & underlag för vct', frekvens: 'Varje sats' },
  { kategori: 'tillverkning', nummer: '7b', material: 'Pigmentdosering', kontroll: 'Kontroll av exakt pigmentmängd per sats', syfte: 'Färgjämnhet mellan satser', frekvens: 'Varje sats' },

  // TILLVERKNING - Betongmassa
  { kategori: 'tillverkning', nummer: '8', material: 'Konsistens', kontroll: 'Okulär kontroll', syfte: 'Jämförelse med normalt utseende', frekvens: 'Varje sats' },
  { kategori: 'tillverkning', nummer: '12b', material: 'Bearbetbarhet', kontroll: 'Bedöm flytsättning/formfyllnad', syfte: 'Optimalt för dekorativt gjutgods', frekvens: 'Varje sats' },

  // TILLVERKNING - Gjutning
  { kategori: 'tillverkning', nummer: '13', material: 'Form', kontroll: 'Kontroll formolja, renhet, fogning', syfte: 'Ytfinish utan blåsor/defekter', frekvens: 'Före varje gjutning' },
  { kategori: 'tillverkning', nummer: '14', material: 'Gjutning', kontroll: 'Kontroll fyllnadsgrad, vibreringstid', syfte: 'Komplett formfyllnad utan separation', frekvens: 'Varje gjutning' },
  { kategori: 'tillverkning', nummer: '15', material: 'Ytbehandling', kontroll: 'Kontroll avdragning, textur, skrapning', syfte: 'Rätt ytfinish enligt specifikation', frekvens: 'Varje gjutning' },

  // TILLVERKNING - Härdning
  { kategori: 'tillverkning', nummer: '16', material: 'Härdning', kontroll: 'Kontroll temperatur, luftfuktighet, övertäckning', syfte: 'Minimera krympsprickor', frekvens: 'Dagligen' },
  { kategori: 'tillverkning', nummer: '17', material: 'Härdningstid', kontroll: 'Dokumentera tid i form/härdkammare', syfte: 'Säkerställ min. härdningstid uppnådd', frekvens: 'Varje sats' },
]
