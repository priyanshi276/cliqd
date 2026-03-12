import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ensureDemoAccount } from './utils/setupDemo'

ensureDemoAccount()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
