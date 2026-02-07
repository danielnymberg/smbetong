// =============================================================================
// APP TRANSLATIONS - Svenska & Tyska
// =============================================================================

export type Language = 'sv-SE' | 'de-DE'

export const translations = {
  'sv-SE': {
    // App
    appName: 'Betong QC',
    appSubtitle: 'Kvalitetskontroll enligt SS-EN 206-1',

    // Navigation
    nav: {
      checklista: 'Checklista',
      journal: 'Daglig journal',
      avvikelser: 'Avvikelser',
      recept: 'Recept',
      historik: 'Historik',
      installningar: 'Inställningar',
    },

    // Kategorier
    kategorier: {
      delmaterial: 'Delmaterial',
      utrustning: 'Utrustning',
      tillverkning: 'Tillverkning',
    },

    // Status
    status: {
      pending: 'Ej kontrollerad',
      ok: 'OK',
      avvikelse: 'Avvikelse',
      ej_tillamplig: 'Ej tillämplig',
      pagaende: 'Pågående',
      godkand: 'Godkänd',
      oppen: 'Öppen',
      avslutad: 'Avslutad',
    },

    // Actions
    actions: {
      nytt: 'Nytt',
      nySats: 'Ny sats',
      spara: 'Spara',
      avbryt: 'Avbryt',
      redigera: 'Redigera',
      tabort: 'Ta bort',
      bockaAv: 'Bocka av',
      markera: 'Markera',
      exportera: 'Exportera',
      skrivUt: 'Skriv ut',
      visaDetaljer: 'Visa detaljer',
      laggTillFoto: 'Lägg till foto',
    },

    // Checklista
    checklista: {
      titel: 'Produktionskontroll',
      valdSats: 'Vald sats',
      ingenSats: 'Ingen sats vald',
      skapaNy: 'Skapa ny sats för att börja',
      satsnummer: 'Satsnummer',
      recept: 'Recept',
      progress: 'framsteg',
      avKlara: 'av kontroller klara',
      allKlart: 'Alla kontroller utförda!',
      anmarkning: 'Anmärkning',
      anmarkningPlaceholder: 'Beskriv avvikelsen...',
    },

    // Journal
    journal: {
      titel: 'Daglig journal',
      nyPost: 'Ny journalpost',
      typ: {
        notering: 'Notering',
        avvikelse: 'Avvikelse',
        atgard: 'Åtgärd',
      },
      rubrik: 'Rubrik',
      beskrivning: 'Beskrivning',
    },

    // Avvikelser
    avvikelser: {
      titel: 'Avvikelser',
      nyAvvikelse: 'Ny avvikelse',
      orsak: 'Orsak',
      atgard: 'Åtgärd',
      ansvarig: 'Ansvarig',
    },

    // Recept
    recept: {
      titel: 'Receptprotokoll',
      nyttRecept: 'Nytt recept',
      namn: 'Receptnamn',
      cement: 'Cement',
      cementTyp: 'Cementtyp',
      ballast: 'Ballast',
      fin: 'Fin',
      grov: 'Grov',
      vatten: 'Vatten',
      vct: 'Vct',
      pigment: 'Pigment',
      fibrer: 'Fibrer',
      tillsatsmedel: 'Tillsatsmedel',
    },

    // Inställningar
    installningar: {
      titel: 'Inställningar',
      sprak: 'Språk',
      foretag: 'Företagsinformation',
      foretagNamn: 'Företagsnamn',
      orgnummer: 'Org.nummer',
      adress: 'Adress',
      tillverkningsstalle: 'Tillverkningsställe',
      ansvarig: 'Ansvarig person',
      telefon: 'Telefon',
      epost: 'E-post',
    },

    // Meddelanden
    messages: {
      sparad: 'Sparad!',
      borttagen: 'Borttagen',
      fel: 'Något gick fel',
      bekrafta: 'Bekräfta',
      arDuSaker: 'Är du säker?',
    },

    // Datum/tid
    datum: {
      idag: 'Idag',
      igar: 'Igår',
      dennaVecka: 'Denna vecka',
    },
  },

  'de-DE': {
    // App
    appName: 'Beton QC',
    appSubtitle: 'Qualitätskontrolle nach SS-EN 206-1',

    // Navigation
    nav: {
      checklista: 'Checkliste',
      journal: 'Tagesjournal',
      avvikelser: 'Abweichungen',
      recept: 'Rezepte',
      historik: 'Verlauf',
      installningar: 'Einstellungen',
    },

    // Kategorier
    kategorier: {
      delmaterial: 'Teilmaterialien',
      utrustning: 'Ausrüstung',
      tillverkning: 'Herstellung',
    },

    // Status
    status: {
      pending: 'Nicht geprüft',
      ok: 'OK',
      avvikelse: 'Abweichung',
      ej_tillamplig: 'Nicht zutreffend',
      pagaende: 'In Bearbeitung',
      godkand: 'Genehmigt',
      oppen: 'Offen',
      avslutad: 'Abgeschlossen',
    },

    // Actions
    actions: {
      nytt: 'Neu',
      nySats: 'Neue Charge',
      spara: 'Speichern',
      avbryt: 'Abbrechen',
      redigera: 'Bearbeiten',
      tabort: 'Löschen',
      bockaAv: 'Abhaken',
      markera: 'Markieren',
      exportera: 'Exportieren',
      skrivUt: 'Drucken',
      visaDetaljer: 'Details anzeigen',
      laggTillFoto: 'Foto hinzufügen',
    },

    // Checklista
    checklista: {
      titel: 'Produktionskontrolle',
      valdSats: 'Ausgewählte Charge',
      ingenSats: 'Keine Charge ausgewählt',
      skapaNy: 'Neue Charge erstellen um zu beginnen',
      satsnummer: 'Chargennummer',
      recept: 'Rezept',
      progress: 'Fortschritt',
      avKlara: 'Kontrollen abgeschlossen',
      allKlart: 'Alle Kontrollen durchgeführt!',
      anmarkning: 'Anmerkung',
      anmarkningPlaceholder: 'Abweichung beschreiben...',
    },

    // Journal
    journal: {
      titel: 'Tagesjournal',
      nyPost: 'Neuer Eintrag',
      typ: {
        notering: 'Notiz',
        avvikelse: 'Abweichung',
        atgard: 'Maßnahme',
      },
      rubrik: 'Titel',
      beskrivning: 'Beschreibung',
    },

    // Avvikelser
    avvikelser: {
      titel: 'Abweichungen',
      nyAvvikelse: 'Neue Abweichung',
      orsak: 'Ursache',
      atgard: 'Maßnahme',
      ansvarig: 'Verantwortlich',
    },

    // Recept
    recept: {
      titel: 'Rezeptprotokolle',
      nyttRecept: 'Neues Rezept',
      namn: 'Rezeptname',
      cement: 'Zite',
      cementTyp: 'Zementtyp',
      ballast: 'Zuschlag',
      fin: 'Fein',
      grov: 'Grob',
      vatten: 'Wasser',
      vct: 'W/Z',
      pigment: 'Pigment',
      fibrer: 'Fasern',
      tillsatsmedel: 'Zusatzmittel',
    },

    // Inställningar
    installningar: {
      titel: 'Einstellungen',
      sprak: 'Sprache',
      foretag: 'Unternehmensinformation',
      foretagNamn: 'Unternehmensname',
      orgnummer: 'Org.-Nr.',
      adress: 'Adresse',
      tillverkningsstalle: 'Produktionsstätte',
      ansvarig: 'Verantwortliche Person',
      telefon: 'Telefon',
      epost: 'E-Mail',
    },

    // Meddelanden
    messages: {
      sparad: 'Gespeichert!',
      borttagen: 'Gelöscht',
      fel: 'Etwas ist schief gelaufen',
      bekrafta: 'Bestätigen',
      arDuSaker: 'Sind Sie sicher?',
    },

    // Datum/tid
    datum: {
      idag: 'Heute',
      igar: 'Gestern',
      dennaVecka: 'Diese Woche',
    },
  },
} as const

export type TranslationKey = keyof typeof translations['sv-SE']

export function getTranslation(lang: Language) {
  return translations[lang]
}
