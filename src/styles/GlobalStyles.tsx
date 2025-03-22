import { Global, css } from '@emotion/react';
import { globalStyles } from './theme';
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

    html, body {
      width: 100%;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: ${globalStyles.colors.text};
      background-color: ${isStandalone ? '#ffffff' : globalStyles.colors.secondary};
      line-height: 1.5;
      overflow-x: hidden;
      transition: all 0.3s;
    }

    /* 自定义滚动条样式 */
    @media (max-width: 768px) {
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      ::-webkit-scrollbar-track {
        background: ${globalStyles.colors.secondary};
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(
          45deg,
          ${globalStyles.colors.primary}40,
          ${globalStyles.colors.primary}80
        );
        border-radius: 4px;
        border: 2px solid ${globalStyles.colors.secondary};
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(
            45deg,
            ${globalStyles.colors.primary}60,
            ${globalStyles.colors.primary}
          );
        }
      }
    }

    /* PC 端隐藏滚动条 */
    @media (min-width: 769px) {
      ::-webkit-scrollbar {
        width: ${isStandalone ? '10px' : 0};
        height: ${isStandalone ? '10px' : 0};
      }

      /* Firefox */
      * {
        scrollbar-width: ${isStandalone ? 'auto' : 'none'};
      }

      /* IE */
      -ms-overflow-style: ${isStandalone ? 'auto' : 'none'};
    }

    #root {
      width: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    a {
      color: ${globalStyles.colors.primary};
      text-decoration: none;
      transition: color ${globalStyles.transitions.fast};

      &:hover {
        color: ${globalStyles.colors.primary}dd;
      }
    }

    .page-transition-enter {
      opacity: ${isStandalone ? 1 : 0};
      transform: ${isStandalone ? 'none' : 'translateY(20px)'};
    }

    .page-transition-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: ${isStandalone ? 'none' : `opacity ${globalStyles.transitions.default},
                  transform ${globalStyles.transitions.default}`};
    }

    .page-transition-exit {
      opacity: ${isStandalone ? 1 : 0};
      transform: ${isStandalone ? 'none' : 'translateY(0)'};
    }

    .page-transition-exit-active {
      opacity: ${isStandalone ? 1 : 0};
      transform: ${isStandalone ? 'none' : 'translateY(-20px)'};
      transition: ${isStandalone ? 'none' : `opacity ${globalStyles.transitions.default},
                  transform ${globalStyles.transitions.default}`};
    }

    pre, code {
      background-color: ${globalStyles.colors.secondary};
    }

    blockquote {
      background-color: ${globalStyles.colors.secondary};
      border-left-color: ${globalStyles.colors.border};
    }

    table {
      th, td {
        border-color: ${globalStyles.colors.border};
      }

      th {
        background-color: ${globalStyles.colors.secondary};
      }
    }

    .ant-modal {
      .ant-modal-content {
        border-radius: 16px;
        overflow: hidden;
      }

      .ant-modal-header {
        border-radius: 16px 16px 0 0;
      }

      .ant-modal-footer {
        border-radius: 0 0 16px 16px;
      }
    }

    .blog-detail-content {
      user-select: text;
    }
  `;

  return <Global styles={globalCss} />;
}

export { GlobalStyles }; 