import { Global, css } from '@emotion/react';
import { useStandaloneMode } from '../hooks/useStandaloneMode';

const GlobalStyles = () => {
  const isStandalone = useStandaloneMode();

  const globalCss = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      user-select: ${isStandalone ? 'auto' : 'none'};
    }

    html,
    body {
      width: 100%;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--theme-font-family-base);
      font-size: var(--theme-font-size-base);
      line-height: var(--theme-line-height-base);
      color: var(--theme-color-text-primary);
      background-color: ${isStandalone
        ? 'var(--theme-color-surface-base)'
        : 'var(--theme-color-surface-app)'};
      overflow-x: hidden;
      transition: background-color var(--theme-motion-normal), color var(--theme-motion-normal);
    }

    @media (max-width: 768px) {
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      ::-webkit-scrollbar-track {
        background: var(--theme-color-scrollbar-track);
        border-radius: var(--theme-radius-sm);
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(
          45deg,
          var(--theme-color-scrollbar-thumb-start),
          var(--theme-color-scrollbar-thumb-end)
        );
        border-radius: var(--theme-radius-sm);
        border: 2px solid var(--theme-color-scrollbar-track);
        transition: background var(--theme-motion-normal);

        &:hover {
          background: linear-gradient(
            45deg,
            var(--theme-color-brand-primary),
            var(--theme-color-brand-primary-hover)
          );
        }
      }
    }

    @media (min-width: 769px) {
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
      }

      * {
        scrollbar-width: none;
      }

      -ms-overflow-style: none;
    }

    #root {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    a {
      color: var(--theme-color-brand-primary);
      text-decoration: none;
      transition: color var(--theme-motion-fast);

      &:hover {
        color: var(--theme-color-brand-primary-hover);
      }
    }

    .page-transition-enter {
      opacity: ${isStandalone ? 1 : 0};
      transform: ${isStandalone ? 'none' : 'translateY(20px)'};
    }

    .page-transition-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: ${isStandalone
        ? 'none'
        : 'opacity var(--theme-motion-normal), transform var(--theme-motion-normal)'};
    }

    .page-transition-exit {
      opacity: ${isStandalone ? 1 : 0};
      transform: ${isStandalone ? 'none' : 'translateY(0)'};
    }

    .page-transition-exit-active {
      opacity: ${isStandalone ? 1 : 0};
      transform: ${isStandalone ? 'none' : 'translateY(-20px)'};
      transition: ${isStandalone
        ? 'none'
        : 'opacity var(--theme-motion-normal), transform var(--theme-motion-normal)'};
    }

    pre,
    code {
      background-color: var(--theme-color-surface-subtle);
    }

    blockquote {
      background-color: var(--theme-color-surface-subtle);
      border-left-color: var(--theme-color-border-default);
    }

    table {
      th,
      td {
        border-color: var(--theme-color-border-default);
      }

      th {
        background-color: var(--theme-color-surface-subtle);
      }
    }

    .ant-modal {
      .ant-modal-content {
        border-radius: var(--theme-radius-lg);
        overflow: hidden;
      }

      .ant-modal-header {
        border-radius: var(--theme-radius-lg) var(--theme-radius-lg) 0 0;
      }

      .ant-modal-footer {
        border-radius: 0 0 var(--theme-radius-lg) var(--theme-radius-lg);
      }
    }

    .blog-detail-content {
      user-select: text;
    }
  `;

  return <Global styles={globalCss} />;
};

export { GlobalStyles };
