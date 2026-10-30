import { useEffect, useState, useSyncExternalStore } from 'react';
import styled from '@emotion/styled';
import { themeVars } from '../../theme';
import { canReloadChunk, dismissChunkFailure, getChunkFailure, reloadForChunk, subscribeChunkFailure } from '../../utils/chunkRecovery';

const Surface = styled.div<{ $fatal: boolean }>`
  position: fixed; z-index: calc(${themeVars.zIndex.modal} + 10);
  ${p => p.$fatal ? `inset: 0; display: flex; align-items: center; justify-content: center; background: ${themeVars.colors.appBackground}; padding: 24px;`
    : 'right: 24px; bottom: 24px; width: min(420px, calc(100vw - 32px));'}
  .recovery-card {
    width: 100%; max-width: 460px; padding: 24px; border: 1px solid ${themeVars.colors.borderStrong};
    border-radius: ${themeVars.borderRadius.medium}; background: ${themeVars.colors.background}; box-shadow: ${themeVars.shadows.medium};
    color: ${themeVars.colors.text}; font-family: ${themeVars.typography.fontFamilyBase};
  }
  h2 { font: 400 24px/1.45 ${themeVars.typography.fontFamilyHeading}; margin: 0 0 12px; }
  p { color: ${themeVars.colors.lightText}; font-size: 14px; line-height: 1.85; margin: 0 0 16px; }
  .recovery-actions { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
  button { padding: 9px 14px; border: 1px solid ${themeVars.colors.border}; border-radius: 4px; background: transparent; color: inherit; cursor: pointer; }
  .recovery-refresh { background: ${themeVars.colors.primary}; border-color: ${themeVars.colors.primary}; color: ${themeVars.colors.onPrimary}; }
  button:disabled { opacity: 0.55; cursor: not-allowed; }
  @media (max-width: 640px) { right: ${p => p.$fatal ? '0' : '16px'}; bottom: ${p => p.$fatal ? '0' : '16px'}; }
`;

export default function ChunkRecoveryNotice() {
  const failure = useSyncExternalStore(subscribeChunkFailure, getChunkFailure, () => null);
  const [online, setOnline] = useState(navigator.onLine);
  const [allowed, setAllowed] = useState(canReloadChunk);
  useEffect(() => {
    if (!failure) return;
    const update = () => { setOnline(navigator.onLine); setAllowed(canReloadChunk()); };
    update();
    window.addEventListener('online', update); window.addEventListener('offline', update);
    const timer = setInterval(update, 1000);
    return () => { clearInterval(timer); window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, [failure]);
  if (!failure) return null;
  return <Surface $fatal={failure.fatal} role="alert">
    <div className="recovery-card">
      <h2>页面资源暂时无法加载</h2>
      <p>{!online ? '网络已断开，请恢复连接后重试。'
        : !allowed ? '刚刚已尝试刷新，资源仍未恢复。请稍后重试，或联系站点维护者。'
          : '可能是网站刚刚更新，或网络暂时中断。您可以尝试刷新页面，这或许能够解决问题。'}</p>
      <div className="recovery-actions">
        <button type="button" className="recovery-refresh" disabled={!online || !allowed}
          onClick={() => { setAllowed(false); reloadForChunk(); }}>刷新并继续阅读</button>
        {!failure.fatal && <button type="button" onClick={dismissChunkFailure}>暂时关闭</button>}
      </div>
    </div>
  </Surface>;
}
