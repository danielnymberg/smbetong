import { useState } from 'react'
import { DialogComponent } from '@syncfusion/ej2-react-popups'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { useTranslation } from '../hooks/useTranslation'
import { useAppState } from '../hooks/useAppState'
import type { Avvikelse } from '../types'

export function Avvikelser() {
  const { t } = useTranslation()
  const { avvikelser, satser, laggTillAvvikelse, uppdateraAvvikelse } = useAppState()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [redigeraDialog, setRedigeraDialog] = useState<Avvikelse | null>(null)
  const [nyAvvikelse, setNyAvvikelse] = useState({
    beskrivning: '',
    satsnummer: '',
  })
  const [redigeraData, setRedigeraData] = useState({
    orsak: '',
    atgard: '',
    ansvarig: '',
    status: 'oppen' as Avvikelse['status'],
  })

  const statusOptions = [
    { value: 'oppen', text: t.status.oppen },
    { value: 'pagaende', text: t.status.pagaende },
    { value: 'avslutad', text: t.status.avslutad },
  ]

  const handleSkapaAvvikelse = () => {
    if (!nyAvvikelse.beskrivning.trim()) return

    laggTillAvvikelse(
      nyAvvikelse.beskrivning,
      nyAvvikelse.satsnummer || undefined
    )

    setDialogOpen(false)
    setNyAvvikelse({ beskrivning: '', satsnummer: '' })
  }

  const handleOpenRedigera = (av: Avvikelse) => {
    setRedigeraDialog(av)
    setRedigeraData({
      orsak: av.orsak || '',
      atgard: av.atgard || '',
      ansvarig: av.ansvarig || '',
      status: av.status,
    })
  }

  const handleSparaRedigering = () => {
    if (!redigeraDialog) return

    uppdateraAvvikelse(redigeraDialog.id, {
      orsak: redigeraData.orsak || undefined,
      atgard: redigeraData.atgard || undefined,
      ansvarig: redigeraData.ansvarig || undefined,
      status: redigeraData.status,
    })

    setRedigeraDialog(null)
  }

  const statusFarg = (status: Avvikelse['status']) => {
    switch (status) {
      case 'oppen': return '#d13438'
      case 'pagaende': return '#ffaa44'
      case 'avslutad': return '#107c10'
    }
  }

  // Sortera: öppna först, sedan pågående, sedan avslutade
  const sorteradeAvvikelser = [...avvikelser].sort((a, b) => {
    const order = { oppen: 0, pagaende: 1, avslutad: 2 }
    return order[a.status] - order[b.status]
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{t.avvikelser.titel}</h2>
          <p style={{ margin: '4px 0 0', color: '#666' }}>
            {avvikelser.filter(a => a.status === 'oppen').length} öppna avvikelser
          </p>
        </div>
        <button className="e-btn e-primary" onClick={() => setDialogOpen(true)}>
          + {t.avvikelser.nyAvvikelse}
        </button>
      </div>

      {/* Avvikelser lista */}
      {avvikelser.length === 0 ? (
        <div className="e-card" style={{ padding: '48px', textAlign: 'center', color: '#666' }}>
          <span className="e-icons e-check" style={{ fontSize: '48px', marginBottom: '16px', display: 'block', color: '#107c10' }} />
          <p>Inga avvikelser registrerade</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sorteradeAvvikelser.map(av => (
            <div
              key={av.id}
              className="e-card"
              style={{
                padding: '16px',
                borderLeft: `4px solid ${statusFarg(av.status)}`,
                cursor: 'pointer',
                transition: 'box-shadow 0.15s ease',
              }}
              onClick={() => handleOpenRedigera(av)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="e-badge e-badge-pill" style={{
                      backgroundColor: statusFarg(av.status),
                      color: '#fff',
                      fontSize: '11px',
                    }}>
                      {t.status[av.status]}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {av.datum}
                    </span>
                    {av.satsnummer && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        | Sats: {av.satsnummer}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 500 }}>
                    {av.beskrivning}
                  </p>

                  {(av.orsak || av.atgard) && (
                    <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: '#666' }}>
                      {av.orsak && (
                        <div>
                          <strong>{t.avvikelser.orsak}:</strong> {av.orsak}
                        </div>
                      )}
                      {av.atgard && (
                        <div>
                          <strong>{t.avvikelser.atgard}:</strong> {av.atgard}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {av.ansvarig && (
                  <div style={{
                    padding: '4px 12px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#666',
                  }}>
                    {av.ansvarig}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ny avvikelse dialog */}
      {dialogOpen && (
        <DialogComponent
          width="500px"
          isModal={true}
          visible={true}
          close={() => setDialogOpen(false)}
          header={t.avvikelser.nyAvvikelse}
          showCloseIcon={true}
        >
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {satser.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  {t.checklista.satsnummer} (valfritt)
                </label>
                <DropDownListComponent
                  dataSource={[{ text: '- Ingen -', value: '' }, ...satser.map(s => ({ text: s.satsnummer, value: s.satsnummer }))]}
                  fields={{ text: 'text', value: 'value' }}
                  value={nyAvvikelse.satsnummer}
                  change={(e) => setNyAvvikelse(prev => ({ ...prev, satsnummer: e.value as string }))}
                  width="100%"
                />
              </div>
            )}

            <div>
              <TextBoxComponent
                multiline={true}
                placeholder="Beskriv avvikelsen..."
                value={nyAvvikelse.beskrivning}
                input={(e) => setNyAvvikelse(prev => ({ ...prev, beskrivning: e.value || '' }))}
                cssClass="e-outline"
                floatLabelType="Auto"
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="e-btn" onClick={() => setDialogOpen(false)}>
                {t.actions.avbryt}
              </button>
              <button
                className="e-btn e-danger"
                onClick={handleSkapaAvvikelse}
                disabled={!nyAvvikelse.beskrivning.trim()}
              >
                {t.actions.spara}
              </button>
            </div>
          </div>
        </DialogComponent>
      )}

      {/* Redigera avvikelse dialog */}
      {redigeraDialog && (
        <DialogComponent
          width="550px"
          isModal={true}
          visible={true}
          close={() => setRedigeraDialog(null)}
          header={t.actions.redigera}
          showCloseIcon={true}
        >
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Ursprunglig beskrivning */}
            <div style={{
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              borderLeft: `4px solid ${statusFarg(redigeraDialog.status)}`,
            }}>
              <p style={{ margin: 0, fontWeight: 500 }}>{redigeraDialog.beskrivning}</p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>
                {redigeraDialog.datum}
                {redigeraDialog.satsnummer && ` | Sats: ${redigeraDialog.satsnummer}`}
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Status
              </label>
              <DropDownListComponent
                dataSource={statusOptions}
                fields={{ text: 'text', value: 'value' }}
                value={redigeraData.status}
                change={(e) => setRedigeraData(prev => ({ ...prev, status: e.value as Avvikelse['status'] }))}
                width="100%"
              />
            </div>

            <div>
              <TextBoxComponent
                placeholder={t.avvikelser.orsak}
                value={redigeraData.orsak}
                input={(e) => setRedigeraData(prev => ({ ...prev, orsak: e.value || '' }))}
                cssClass="e-outline"
                floatLabelType="Auto"
              />
            </div>

            <div>
              <TextBoxComponent
                multiline={true}
                placeholder={t.avvikelser.atgard}
                value={redigeraData.atgard}
                input={(e) => setRedigeraData(prev => ({ ...prev, atgard: e.value || '' }))}
                cssClass="e-outline"
                floatLabelType="Auto"
              />
            </div>

            <div>
              <TextBoxComponent
                placeholder={t.avvikelser.ansvarig}
                value={redigeraData.ansvarig}
                input={(e) => setRedigeraData(prev => ({ ...prev, ansvarig: e.value || '' }))}
                cssClass="e-outline"
                floatLabelType="Auto"
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button className="e-btn" onClick={() => setRedigeraDialog(null)}>
                {t.actions.avbryt}
              </button>
              <button className="e-btn e-primary" onClick={handleSparaRedigering}>
                {t.actions.spara}
              </button>
            </div>
          </div>
        </DialogComponent>
      )}
    </div>
  )
}
