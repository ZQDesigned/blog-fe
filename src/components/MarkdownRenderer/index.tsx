import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Typography } from 'antd';
import styled from '@emotion/styled';
import { themeVars, withThemeAlpha } from '../../theme';

const { Paragraph } = Typography;

interface MarkdownContainerProps {
  className?: string;
}

const MarkdownContainer = styled.div<MarkdownContainerProps>`
  font-size: 16px;
  line-height: 1.8;

  h1, h2, h3, h4, h5, h6 {
    margin-top: ${themeVars.spacing.lg};
    margin-bottom: ${themeVars.spacing.md};
    font-weight: 600;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.25em;
  }

  p {
    margin-bottom: ${themeVars.spacing.md};
  }

  ul, ol {
    margin-bottom: ${themeVars.spacing.md};
    padding-left: ${themeVars.spacing.lg};
  }

  li {
    margin-bottom: ${themeVars.spacing.xs};
  }

  code {
    background-color: ${themeVars.colors.secondary};
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    color: ${themeVars.colors.primary};
  }

  pre {
    background-color: ${themeVars.colors.secondary};
    padding: ${themeVars.spacing.md};
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: ${themeVars.spacing.md};

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  blockquote {
    margin: ${themeVars.spacing.md} 0;
    padding-left: ${themeVars.spacing.md};
    border-left: 4px solid ${themeVars.colors.primary};
    color: ${themeVars.colors.lightText};
    background-color: ${themeVars.colors.secondary};
    padding: ${themeVars.spacing.md};
    border-radius: 0 4px 4px 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: ${themeVars.spacing.md} 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${themeVars.spacing.md} 0;
    background-color: ${themeVars.colors.background};

    th, td {
      border: 1px solid ${themeVars.colors.border};
      padding: ${themeVars.spacing.sm};
    }

    th {
      background-color: ${themeVars.colors.secondary};
    }
  }

  a {
    color: ${themeVars.colors.primary};
    text-decoration: none;
    transition: color ${themeVars.transitions.fast};

    &:hover {
      color: ${withThemeAlpha(themeVars.colors.primary, 0.8667)};
    }
  }
`;

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className }) => {
  return (
    <MarkdownContainer className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          p: ({ children }) => (
            <Paragraph>
              {children}
            </Paragraph>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </MarkdownContainer>
  );
};

export default MarkdownRenderer; 
