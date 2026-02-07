import { useState } from 'react'
import { DialogComponent } from '@syncfusion/ej2-react-popups'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { useTranslation } from '../hooks/useTranslation'
import { useAppState } from '../hooks/useAppState'
import type { JournalPost } from '../types'

export function DagligJournal() {
  const { t } = useTranslation()
  const { journal, satser, laggTillJournalpost } = useAppState()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [nyPost, setNyPost] = useState({
    typ: 'notering' as JournalPost['typ'],
    rubrik: '',
    beskrivning: '',
    satsnummer: '',
  })

  const typOptions = [
    { value: 'notering', text: t.journal.typ.notering },
    { value: 'avvikelse', text: t.journal.typ.avvikelse },
    { value: 'atgard', text: t.journal.typ.atgard },
  ]

  const handleSpara = () => {
    if (!nyPost.rubrik.trim() || !nyPost.beskrivning.trim()) return

    laggTillJournalpost(
      nyPost.typ,
      nyPost.rubrik,
      nyPost.beskrivning,
      nyPost.satsnummer || undefined
    )

    setDialogOpen(false)
    setNyPost({ typ: 'notering', rubrik: '', beskrivning: '', satsnummer: '' })
  }

  // Gruppera journal per datum
  const grupperad = journal.reduce((acc, post) => {
    if (!acc[post.datum]) acc[post.datum] = []
    acc[post.datum].push(post)
    return acc
  }, {} as Record<string, JournalPost[]>)

  const formatDatum = (datum: string) => {
    const idag = new Date().toISOString().split('T')[0]
    const igar = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (datum === idag) return t.datum.idag
    if (datum === igar) return t.datum.igar
    return new Date(datum).toLocaleDateString('sv-SE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const typFarg = (typ: JournalPost['typ']) => {
    switch (typ) {
      case 'notering': return '#0078d4'
      case 'avvikelse': return '#d13438'
      case 'atgard': return '#107c10'
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{t.journal.titel}</h2>
        <button className="e-btn e-primary" onClick={() => setDialogOpen(true)}>
          + {t.journal.nyPost}
        </button>
      </div>

      {/* Journal lista */}
      {Object.keys(grupperad).length === 0 ? (
        <div className="e-card" style={{ padding: '48px', textAlign: 'center', color: '#666' }}>
          <span className="e-icons e-edit" style={{ fontSize: '48px', marginBottom: '16px', display: 'block', opacity: 0.5 }} />
          <p>Inga journalposter ännu</p>
        </div>
      ) : (
        Object.entries(grupperad)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([datum, poster]) => (
            <div key={datum} style={{ marginBottom: '24px' }}>
              <h3 style={{
                margin: '0 0 12px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#666',
                textTransform: 'capitalize',
              }}>
                {formatDatum(datum)}
              </h3>

              <div className="e-card">
                {poster.map((post, index) => (
                  <div
                    key={post.id}
                    style={{
                      padding: '16px',
                      borderBottom: index < poster.length - 1 ? '1px solid #e0e0e0' : 'none',
                      display: 'flex',
                      gap: '16px',
                    }}
                  >
                    {/* Tidslinje */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>{post.tid}</span>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: typFarg(post.typ),
                        marginTop: '8px',
                      }} />
                    </div>

                    {/* Innehåll */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="e-badge e-badge-pill" style={{
                          backgroundColor: typFarg(post.typ),
                          color: '#fff',
                          fontSize: '11px',
                        }}>
                          {t.journal.typ[post.typ]}
                        </span>
                        {post.satsnummer && (
                          <span style={{ fontSize: '12px', color: '#666' }}>
                            Sats: {post.satsnummer}
                          </span>
                        )}
                      </div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 500 }}>
                        {post.rubrik}
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#444', whiteSpace: 'pre-wrap' }}>
                        {post.beskrivning}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
      )}

      {/* Ny post dialog */}
      {dialogOpen && (
        <DialogComponent
          width="500px"
          isModal={true}
          visible={true}
          close={() => setDialogOpen(false)}
          header={t.journal.nyPost}
          showCloseIcon={true}
          footerTemplate={() => (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="e-btn" onClick={() => setDialogOpen(false)}>
                {t.actions.avbryt}
              </button>
              <button
                className="e-btn e-primary"
                onClick={handleSpara}
                disabled={!nyPost.rubrik.trim() || !nyPost.beskrivning.trim()}
              >
                {t.actions.spara}
              </button>
            </div>
          )}
        >
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                Typ
              </label>
              <DropDownListComponent
                dataSource={typOptions}
                fields={{ text: 'text', value: 'value' }}
                value={nyPost.typ}
                change={(e) => setNyPost(prev => ({ ...prev, typ: e.value as JournalPost['typ'] }))}
                width="100%"
              />
            </div>

            {satser.length > 0 && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  {t.checklista.satsnummer} (valfritt)
                </label>
                <DropDownListComponent
                  dataSource={[{ text: '- Ingen -', value: '' }, ...satser.map(s => ({ text: s.satsnummer, value: s.satsnummer }))]}
                  fields={{ text: 'text', value: 'value' }}
                  value={nyPost.satsnummer}
                  change={(e) => setNyPost(prev => ({ ...prev, satsnummer: e.value as string }))}
                  width="100%"
                />
              </div>
            )}

            <div>
              <TextBoxComponent
                placeholder={t.journal.rubrik}
                value={nyPost.rubrik}
                input={(e) => setNyPost(prev => ({ ...prev, rubrik: e.value || '' }))}
                cssClass="e-outline"
                floatLabelType="Auto"
              />
            </div>

            <div>
              <TextBoxComponent
                multiline={true}
                placeholder={t.journal.beskrivning}
                value={nyPost.beskrivning}
                input={(e) => setNyPost(prev => ({ ...prev, beskrivning: e.value || '' }))}
                cssClass="e-outline"
                floatLabelType="Auto"
              />
            </div>
          </div>
        </DialogComponent>
      )}
    </div>
  )
}
