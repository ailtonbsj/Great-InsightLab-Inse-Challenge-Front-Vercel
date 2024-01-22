import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: false }}>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>,
)
