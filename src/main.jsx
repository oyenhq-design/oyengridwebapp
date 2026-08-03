import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LoaderProvider } from './components/ui/LoaderProvider.jsx'
import DeviceGuard from './components/layout/DeviceGuard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DeviceGuard>
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </DeviceGuard>
  </StrictMode>,
)

