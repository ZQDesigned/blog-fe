import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { showConsoleEasterEgg } from './utils/consoleEasterEgg'
import Index from './components/GlobalErrorBoundary'
import { initializeThemeRuntime } from './theme'

// 显示控制台彩蛋
showConsoleEasterEgg();
initializeThemeRuntime();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Index>
      <App />
    </Index>
  </StrictMode>,
)
