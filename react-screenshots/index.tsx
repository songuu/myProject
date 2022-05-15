import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'

const div = document.getElementById('screenshotsDiv')

const root = createRoot(div as Element)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
