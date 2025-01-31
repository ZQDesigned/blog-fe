import { Global, css } from '@emotion/react';
import { globalStyles } from './theme';

interface GlobalStylesProps {
  isDark: boolean;
}

const GlobalStyles: React.FC<GlobalStylesProps> = ({ isDark }) => {
  const globalCss = css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      user-select: none;
    }

    html, body {
      width: 100%;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: ${isDark ? 'rgba(255, 255, 255, 0.85)' : globalStyles.colors.text};
      background-color: ${isDark ? '#141414' : globalStyles.colors.secondary};
      line-height: 1.5;
      overflow-x: hidden;
      transition: all 0.3s;
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
      opacity: 0;
      transform: translateY(20px);
    }

    .page-transition-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: opacity ${globalStyles.transitions.default},
                  transform ${globalStyles.transitions.default};
    }

    .page-transition-exit {
      opacity: 1;
      transform: translateY(0);
    }

    .page-transition-exit-active {
      opacity: 0;
      transform: translateY(-20px);
      transition: opacity ${globalStyles.transitions.default},
                  transform ${globalStyles.transitions.default};
    }

    // 深色模式下的代码块样式
    pre, code {
      background-color: ${isDark ? '#1f1f1f' : globalStyles.colors.secondary};
    }

    // 深色模式下的引用样式
    blockquote {
      background-color: ${isDark ? '#1f1f1f' : globalStyles.colors.secondary};
      border-left-color: ${isDark ? globalStyles.colors.primary : globalStyles.colors.border};
    }

    // 深色模式下的表格样式
    table {
      th, td {
        border-color: ${isDark ? '#303030' : globalStyles.colors.border};
      }

      th {
        background-color: ${isDark ? '#1f1f1f' : globalStyles.colors.secondary};
      }
    }

    // 对话框样式
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

    // 允许博客详情页面的内容选择
    .blog-detail-content {
      user-select: text;
    }
  `;

  return <Global styles={globalCss} />;
};

export { GlobalStyles }; 