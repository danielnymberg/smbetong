import { useState, useEffect } from 'react'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { useTranslation } from '../hooks/useTranslation'
import { useAppState } from '../hooks/useAppState'
import type { Foretag } from '../types'

export function Installningar() {
  const { t, lang, setLang } = useTranslation()
  const { foretag, sparaForetag } = useAppState()

  const [form, setForm] = useState<Foretag>({
    namn: '',
    orgnummer: '',
    adress: '',
    tillverkningsstalle: '',
    ansvarig: '',
    telefon: '',
    epost: '',
  })

  const [sparadMessage, setSparadMessage] = useState(false)

  useEffect(() => {
    if (foretag) {
      setForm(foretag)
    }
  }, [foretag])

  const handleSpara = () => {
    sparaForetag(form)
    setSparadMessage(true)
    setTimeout(() => setSparadMessage(false), 3000)
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: 600 }}>
        {t.installningar.titel}
      </h2>

      {/* Språk */}
      <div className="e-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
          {t.installningar.sprak}
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className={`e-btn ${lang === 'sv-SE' ? 'e-primary' : ''}`}
            onClick={() => setLang('sv-SE')}
            style={{ flex: 1 }}
          >
            Svenska
          </button>
          <button
            className={`e-btn ${lang === 'de-DE' ? 'e-primary' : ''}`}
            onClick={() => setLang('de-DE')}
            style={{ flex: 1 }}
          >
            Deutsch
          </button>
        </div>
      </div>

      {/* Företagsinformation */}
      <div className="e-card" style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 600 }}>
          {t.installningar.foretag}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextBoxComponent
            placeholder={t.installningar.foretagNamn}
            value={form.namn}
            input={(e) => setForm(prev => ({ ...prev, namn: e.value || '' }))}
            cssClass="e-outline"
            floatLabelType="Auto"
          />

          <TextBoxComponent
            placeholder={t.installningar.orgnummer}
            value={form.orgnummer}
            input={(e) => setForm(prev => ({ ...prev, orgnummer: e.value || '' }))}
            cssClass="e-outline"
            floatLabelType="Auto"
          />

          <TextBoxComponent
            placeholder={t.installningar.tillverkningsstalle}
            value={form.tillverkningsstalle}
            input={(e) => setForm(prev => ({ ...prev, tillverkningsstalle: e.value || '' }))}
            cssClass="e-outline"
            floatLabelType="Auto"
          />

          <TextBoxComponent
            placeholder={t.installningar.adress}
            value={form.adress}
            input={(e) => setForm(prev => ({ ...prev, adress: e.value || '' }))}
            cssClass="e-outline"
            floatLabelType="Auto"
          />

          <div style={{
            height: '1px',
            backgroundColor: '#e0e0e0',
            margin: '8px 0',
          }} />

          <TextBoxComponent
            placeholder={t.installningar.ansvarig}
            value={form.ansvarig}
            input={(e) => setForm(prev => ({ ...prev, ansvarig: e.value || '' }))}
            cssClass="e-outline"
            floatLabelType="Auto"
          />

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <TextBoxComponent
                placeholder={t.installningar.telefon}
                value={form.telefon}
                input={(e) => setForm(prev => ({ ...prev, telefon: e.value || '' }))}
                cssClass="e-outline"
                floatLabelType="Auto"
              />
            </div>
            <div style={{ flex: 1 }}>
              <TextBoxComponent
                placeholder={t.installningar.epost}
                value={form.epost}
                input={(e) => setForm(prev => ({ ...prev, epost: e.value || '' }))}
                cssClass="e-outline"
                floatLabelType="Auto"
                type="email"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button className="e-btn e-primary" onClick={handleSpara}>
              {t.actions.spara}
            </button>
          </div>

          {sparadMessage && (
            <div style={{
              padding: '12px',
              backgroundColor: '#dff6dd',
              borderRadius: '4px',
              color: '#107c10',
              textAlign: 'center',
            }}>
              {t.messages.sparad}
            </div>
          )}
        </div>
      </div>

      {/* Standard-hänvisningar */}
      <div className="e-card" style={{ padding: '20px', marginTop: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>
          Standardhänvisningar
        </h3>
        <div style={{ fontSize: '13px', color: '#666' }}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>SS-EN 206-1:2000</strong> - Betong – Del 1: Fordringar, egenskaper, tillverkning och överensstämmelse
          </p>
          <p style={{ margin: '0 0 8px' }}>
            <strong>SS-EN 206-1/A1:2004</strong> - Tillägg A1
          </p>
          <p style={{ margin: '0 0 8px' }}>
            <strong>SS-EN 206-1/A2:2005</strong> - Tillägg A2
          </p>
          <p style={{ margin: 0 }}>
            <strong>SS 13 70 03</strong> - Betong – Användning av EN 206-1 i Sverige
          </p>
        </div>
      </div>
    </div>
  )
}
