// Import walletConfig to initialize wagmi config
import './config/walletConfig'

import { Buffer } from 'buffer'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WalletProvider } from './components/WalletProvider'
import { ErrorBoundary } from './components/ErrorBoundary'

// Make Buffer available globally
window.Buffer = Buffer
globalThis.Buffer = Buffer

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <WalletProvider>
        <App />
      </WalletProvider>
    </ErrorBoundary>
  </StrictMode>,
)
