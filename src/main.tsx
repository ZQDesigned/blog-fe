import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { showConsoleEasterEgg } from './utils/consoleEasterEgg'

// 显示控制台彩蛋
showConsoleEasterEgg();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
