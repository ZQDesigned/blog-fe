import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import isPropValid from '@emotion/is-prop-valid'
import App from './App.tsx'
import './styles/base.css'
import 'lxgw-wenkai-webfont/lxgwwenkai-regular.css'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/600.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import { showConsoleEasterEgg } from './utils/consoleEasterEgg'
import Index from './components/GlobalErrorBoundary'
import { initializeThemeRuntime } from './theme'
import { installChunkRecovery } from './utils/chunkRecovery'
import ChunkRecoveryNotice from './components/ChunkRecoveryNotice'

// 显示控制台彩蛋
showConsoleEasterEgg();
initializeThemeRuntime();
installChunkRecovery();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChunkRecoveryNotice />
    <Index>
      <MotionConfig isValidProp={isPropValid}>
        <App />
      </MotionConfig>
    </Index>
  </StrictMode>,
)
