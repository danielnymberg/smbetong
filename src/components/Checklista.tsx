import { useState, useMemo } from 'react'
import { DialogComponent } from '@syncfusion/ej2-react-popups'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { useTranslation } from '../hooks/useTranslation'
import { useAppState } from '../hooks/useAppState'
import type { Kontrollpunkt, KontrollStatus, KontrollKategori } from '../types'

export function Checklista() {
  const { t } = useTranslation()
  const {
    aktivSats,
    satser,
    recept,
    skapaSats,
    setAktivSatsId,
    uppdateraKontrollpunkt,
    laggTillAvvikelse,
  } = useAppState()

  const [valdKategori, setValdKategori] = useState<KontrollKategori | 'alla'>('alla')
  const [avvikelseDialog, setAvvikelseDialog] = useState<{
    open: boolean
    kontrollpunkt: Kontrollpunkt | null
  }>({ open: false, kontrollpunkt: null })
  const [avvikelseText, setAvvikelseText] = useState('')
  const [nySatsDialog, setNySatsDialog] = useState(false)
  const [valdtRecept, setValdtRecept] = useState<string>('')

  // Filtrera kontrollpunkter baserat på vald kategori
  const filtreradeKontrollpunkter = useMemo(() => {
    if (!aktivSats) return []
    if (valdKategori === 'alla') return aktivSats.kontrollpunkter
    return aktivSats.kontrollpunkter.filter(kp => kp.kategori === valdKategori)
  }, [aktivSats, valdKategori])

  // Beräkna progress
  const progress = useMemo(() => {
    if (!aktivSats) return { done: 0, total: 0, percent: 0 }
    const total = aktivSats.kontrollpunkter.length
    const done = aktivSats.kontrollpunkter.filter(
      kp => kp.status === 'ok' || kp.status === 'ej_tillamplig'
    ).length
    return { done, total, percent: Math.round((done / total) * 100) }
  }, [aktivSats])

  // Hantera statusändring
  const handleStatusChange = (kp: Kontrollpunkt, status: KontrollStatus) => {
    if (!aktivSats) return

    if (status === 'avvikelse') {
      setAvvikelseDialog({ open: true, kontrollpunkt: kp })
    } else {
      uppdateraKontrollpunkt(aktivSats.id, kp.id, status)
    }
  }

  // Spara avvikelse
  const handleSparaAvvikelse = () => {
    if (!aktivSats || !avvikelseDialog.kontrollpunkt) return

    uppdateraKontrollpunkt(
      aktivSats.id,
      avvikelseDialog.kontrollpunkt.id,
      'avvikelse',
      avvikelseText
    )

    laggTillAvvikelse(
      avvikelseText,
      aktivSats.satsnummer,
      avvikelseDialog.kontrollpunkt.id
    )

    setAvvikelseDialog({ open: false, kontrollpunkt: null })
    setAvvikelseText('')
  }

  // Skapa ny sats
  const handleSkapaSats = () => {
    skapaSats(valdtRecept || undefined)
    setNySatsDialog(false)
    setValdtRecept('')
  }

  // Status-knappar styling
  const statusKnappar: { status: KontrollStatus; label: string; color: string }[] = [
    { status: 'ok', label: 'OK', color: '#107c10' },
    { status: 'avvikelse', label: 'Avv', color: '#d13438' },
    { status: 'ej_tillamplig', label: 'N/A', color: '#8a8886' },
  ]

  const kategorier: { value: KontrollKategori | 'alla'; label: string }[] = [
    { value: 'alla', label: 'Alla' },
    { value: 'delmaterial', label: t.kategorier.delmaterial },
    { value: 'utrustning', label: t.kategorier.utrustning },
    { value: 'tillverkning', label: t.kategorier.tillverkning },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{t.checklista.titel}</h2>
          {aktivSats && (
            <p style={{ margin: '4px 0 0', color: '#666' }}>
              {t.checklista.satsnummer}: <strong>{aktivSats.satsnummer}</strong>
              {aktivSats.recept && <> | {t.checklista.recept}: {aktivSats.recept}</>}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Välj sats dropdown */}
          {satser.length > 0 && (
            <DropDownListComponent
              dataSource={satser.map(s => ({ id: s.id, text: s.satsnummer }))}
              fields={{ text: 'text', value: 'id' }}
              value={aktivSats?.id}
              change={(e) => setAktivSatsId(e.value as string)}
              placeholder={t.checklista.valdSats}
              width="180px"
            />
          )}

          <button
            className="e-btn e-primary"
            onClick={() => setNySatsDialog(true)}
          >
            + {t.actions.nySats}
          </button>
        </div>
      </div>

      {/* Ingen sats vald */}
      {!aktivSats && (
        <div className="e-card" style={{ padding: '48px', textAlign: 'center' }}>
          <span className="e-icons e-plus" style={{ fontSize: '48px', color: '#8a8886', marginBottom: '16px', display: 'block' }} />
          <h3 style={{ margin: '0 0 8px', color: '#333' }}>{t.checklista.ingenSats}</h3>
          <p style={{ margin: '0 0 16px', color: '#666' }}>{t.checklista.skapaNy}</p>
          <button className="e-btn e-primary" onClick={() => setNySatsDialog(true)}>
            {t.actions.nySats}
          </button>
        </div>
      )}

      {/* Checklista */}
      {aktivSats && (
        <>
          {/* Progress & Kategorifilter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            {/* Kategori-tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {kategorier.map(kat => (
                <button
                  key={kat.value}
                  className={`e-btn ${valdKategori === kat.value ? 'e-primary' : ''}`}
                  onClick={() => setValdKategori(kat.value)}
                  style={{ fontSize: '13px' }}
                >
                  {kat.label}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '150px',
                height: '8px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progress.percent}%`,
                  height: '100%',
                  backgroundColor: progress.percent === 100 ? '#107c10' : '#0078d4',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{ fontSize: '13px', color: '#666' }}>
                {progress.done}/{progress.total} {t.checklista.avKlara}
              </span>
            </div>
          </div>

          {/* Kontrollpunkter lista */}
          <div className="e-card">
            {filtreradeKontrollpunkter.map((kp, index) => (
              <div
                key={kp.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderBottom: index < filtreradeKontrollpunkter.length - 1 ? '1px solid #e0e0e0' : 'none',
                  backgroundColor: kp.status === 'ok' ? '#f0fff0' : kp.status === 'avvikelse' ? '#fff0f0' : '#fff',
                }}
              >
                {/* Nummer */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#666',
                  flexShrink: 0,
                }}>
                  {kp.nummer}
                </div>

                {/* Innehåll */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="e-badge e-badge-pill" style={{
                      backgroundColor: kp.kategori === 'delmaterial' ? '#0078d4' :
                        kp.kategori === 'utrustning' ? '#8764b8' : '#107c10',
                      color: '#fff',
                      fontSize: '11px',
                    }}>
                      {kp.material}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: '#666',
                    }}>
                      {kp.frekvens}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 4px', fontWeight: 500 }}>{kp.kontroll}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{kp.syfte}</p>

                  {/* Anmärkning vid avvikelse */}
                  {kp.status === 'avvikelse' && kp.anmarkning && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#fef0f0',
                      borderLeft: '3px solid #d13438',
                      fontSize: '13px',
                      color: '#a80000',
                    }}>
                      {kp.anmarkning}
                    </div>
                  )}
                </div>

                {/* Status-knappar */}
                <div style={{ display: 'flex', gap: '6px', marginLeft: '16px' }}>
                  {statusKnappar.map(btn => (
                    <button
                      key={btn.status}
                      className={`e-btn ${kp.status === btn.status ? '' : 'e-outline'}`}
                      onClick={() => handleStatusChange(kp, btn.status)}
                      style={{
                        minWidth: '44px',
                        backgroundColor: kp.status === btn.status ? btn.color : 'transparent',
                        borderColor: btn.color,
                        color: kp.status === btn.status ? '#fff' : btn.color,
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Allt klart meddelande */}
          {progress.percent === 100 && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#dff6dd',
              borderRadius: '4px',
              textAlign: 'center',
              color: '#107c10',
              fontWeight: 500,
            }}>
              {t.checklista.allKlart}
            </div>
          )}
        </>
      )}

      {/* Ny sats dialog */}
      {nySatsDialog && (
        <DialogComponent
          width="400px"
          isModal={true}
          visible={true}
          close={() => setNySatsDialog(false)}
          header={t.actions.nySats}
          showCloseIcon={true}
          footerTemplate={() => (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="e-btn" onClick={() => setNySatsDialog(false)}>
                {t.actions.avbryt}
              </button>
              <button className="e-btn e-primary" onClick={handleSkapaSats}>
                {t.actions.nySats}
              </button>
            </div>
          )}
        >
          <div style={{ padding: '16px' }}>
            {recept.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  {t.checklista.recept} ({t.status.pending.toLowerCase()})
                </label>
                <DropDownListComponent
                  dataSource={recept.map(r => ({ id: r.id, text: r.namn }))}
                  fields={{ text: 'text', value: 'text' }}
                  value={valdtRecept}
                  change={(e) => setValdtRecept(e.value as string)}
                  placeholder={t.checklista.recept}
                  width="100%"
                  allowFiltering={true}
                />
              </div>
            )}
          </div>
        </DialogComponent>
      )}

      {/* Avvikelse dialog */}
      {avvikelseDialog.open && avvikelseDialog.kontrollpunkt && (
        <DialogComponent
          width="500px"
          isModal={true}
          visible={true}
          close={() => setAvvikelseDialog({ open: false, kontrollpunkt: null })}
          header={t.checklista.anmarkning}
          showCloseIcon={true}
          footerTemplate={() => (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                className="e-btn"
                onClick={() => setAvvikelseDialog({ open: false, kontrollpunkt: null })}
              >
                {t.actions.avbryt}
              </button>
              <button
                className="e-btn e-danger"
                onClick={handleSparaAvvikelse}
                disabled={!avvikelseText.trim()}
              >
                {t.actions.spara}
              </button>
            </div>
          )}
        >
          <div style={{ padding: '16px' }}>
            <p style={{ marginTop: 0 }}>
              <strong>{avvikelseDialog.kontrollpunkt.material}:</strong>{' '}
              {avvikelseDialog.kontrollpunkt.kontroll}
            </p>

            <TextBoxComponent
              multiline={true}
              placeholder={t.checklista.anmarkningPlaceholder}
              value={avvikelseText}
              input={(e) => setAvvikelseText(e.value || '')}
              cssClass="e-outline"
              floatLabelType="Auto"
            />
          </div>
        </DialogComponent>
      )}
    </div>
  )
}
