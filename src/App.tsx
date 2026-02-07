import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Checklista } from './components/Checklista'
import { DagligJournal } from './components/DagligJournal'
import { Avvikelser } from './components/Avvikelser'
import { Installningar } from './components/Installningar'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/checklista" replace />} />
        <Route path="checklista" element={<Checklista />} />
        <Route path="journal" element={<DagligJournal />} />
        <Route path="avvikelser" element={<Avvikelser />} />
        <Route path="installningar" element={<Installningar />} />
      </Route>
    </Routes>
  )
}

export default App
