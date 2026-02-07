import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Syncfusion Fluent2 CSS - ORDNING SPELAR ROLL
import '@syncfusion/ej2-base/styles/fluent2.css'
import '@syncfusion/ej2-buttons/styles/fluent2.css'
import '@syncfusion/ej2-calendars/styles/fluent2.css'
import '@syncfusion/ej2-dropdowns/styles/fluent2.css'
import '@syncfusion/ej2-inputs/styles/fluent2.css'
import '@syncfusion/ej2-lists/styles/fluent2.css'
import '@syncfusion/ej2-navigations/styles/fluent2.css'
import '@syncfusion/ej2-popups/styles/fluent2.css'
import '@syncfusion/ej2-splitbuttons/styles/fluent2.css'
import '@syncfusion/ej2-grids/styles/fluent2.css'
import '@syncfusion/ej2-notifications/styles/fluent2.css'

// Syncfusion License - hämtas från env
import { registerLicense, L10n, setCulture } from '@syncfusion/ej2-base'

// Svenska översättningar för Syncfusion
import svSE from './i18n/sv-SE.json'
import deDE from './i18n/de-DE.json'

// App CSS
import './index.css'
import App from './App'

// Registrera Syncfusion license (optional - community license för små företag)
const licenseKey = import.meta.env.VITE_SYNCFUSION_LICENSE_KEY
if (licenseKey) {
  registerLicense(licenseKey)
  console.log('[SF License] ✓ Registered')
}

// Ladda översättningar
L10n.load({ 'sv-SE': svSE, 'de-DE': deDE })

// Sätt kultur baserat på localStorage eller default svenska
const savedLang = localStorage.getItem('smbetong-lang') || 'sv-SE'
setCulture(savedLang)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
