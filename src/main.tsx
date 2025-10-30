import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { showConsoleEasterEgg } from './utils/consoleEasterEgg'
import Index from './components/GlobalErrorBoundary'

// 显示控制台彩蛋
showConsoleEasterEgg();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index>
      <App />
    </Index>
  </StrictMode>,
)
