import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Typography } from 'antd';
import styled from '@emotion/styled';
import { globalStyles } from '../../styles/theme';

const { Paragraph } = Typography;

interface MarkdownContainerProps {
  className?: string;
}

const MarkdownContainer = styled.div<MarkdownContainerProps>`
  font-size: 16px;
  line-height: 1.8;

  h1, h2, h3, h4, h5, h6 {
    margin-top: ${globalStyles.spacing.lg};
    margin-bottom: ${globalStyles.spacing.md};
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
    margin-bottom: ${globalStyles.spacing.md};
  }

  ul, ol {
    margin-bottom: ${globalStyles.spacing.md};
    padding-left: ${globalStyles.spacing.lg};
  }

  li {
    margin-bottom: ${globalStyles.spacing.xs};
  }

  code {
    background-color: ${globalStyles.colors.secondary};
    padding: 2px 4px;
    border-radius: 4px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    color: ${globalStyles.colors.primary};
  }

  pre {
    background-color: ${globalStyles.colors.secondary};
    padding: ${globalStyles.spacing.md};
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: ${globalStyles.spacing.md};

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  blockquote {
    margin: ${globalStyles.spacing.md} 0;
    padding-left: ${globalStyles.spacing.md};
    border-left: 4px solid ${globalStyles.colors.primary};
    color: ${globalStyles.colors.lightText};
    background-color: ${globalStyles.colors.secondary};
    padding: ${globalStyles.spacing.md};
    border-radius: 0 4px 4px 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: ${globalStyles.spacing.md} 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: ${globalStyles.spacing.md} 0;
    background-color: #fff;

    th, td {
      border: 1px solid ${globalStyles.colors.border};
      padding: ${globalStyles.spacing.sm};
    }

    th {
      background-color: ${globalStyles.colors.secondary};
    }
  }

  a {
    color: ${globalStyles.colors.primary};
    text-decoration: none;
    transition: color ${globalStyles.transitions.fast};

    &:hover {
      color: ${globalStyles.colors.primary}dd;
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