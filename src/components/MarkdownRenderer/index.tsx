import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import styled from '@emotion/styled';
import { themeVars, withThemeAlpha } from '../../theme';

interface MarkdownContainerProps {
  className?: string;
}

const MarkdownContainer = styled.div<MarkdownContainerProps>`
  min-width: 0;
  max-width: 100%;
  font-size: 18px;
  line-height: 1.95;
  overflow-wrap: anywhere;
  user-select: text;
  & * { user-select: text; }
  /* The first content element, ignoring Emotion's injected style tags. */
  > :not(style):not(:not(style) ~ *) { margin-top: 0; }
  @media (max-width: 640px) { font-size: 16px; }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.8em;
    margin-bottom: 0.65em;
    font-family: ${themeVars.typography.fontFamilyHeading};
    font-weight: 400;
    line-height: 1.5;
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
    margin-bottom: 1.25em;
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
    font-family: ${themeVars.typography.fontFamilyMono};
    font-size: 0.85em;
    color: ${themeVars.colors.primary};
  }

  pre {
    background-color: ${themeVars.colors.secondary};
    padding: ${themeVars.spacing.md};
    border-radius: 8px;
    overflow-x: auto;
    max-width: 100%;
    min-width: 0;
    line-height: 1.8;
    overflow-wrap: normal;
    margin-bottom: ${themeVars.spacing.md};

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  blockquote {
    margin: ${themeVars.spacing.md} 0;
    padding-left: ${themeVars.spacing.md};
    border-left: 2px solid ${themeVars.colors.primary};
    color: ${themeVars.colors.lightText};
    background-color: transparent;
    padding: ${themeVars.spacing.md};
    border-radius: 0 4px 4px 0;
    font-family: ${themeVars.typography.fontFamilyHeading};
    font-size: 1.1em;
    p:last-child { margin-bottom: 0; }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: ${themeVars.spacing.md} 0;
  }

  table {
    display: block;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
    margin: ${themeVars.spacing.md} 0;
    background-color: ${themeVars.colors.background};

    th, td {
      border: 1px solid ${themeVars.colors.border};
      padding: ${themeVars.spacing.sm};
      min-width: 100px;
    }

    th {
      background-color: ${themeVars.colors.secondary};
    }
  }

  a {
    color: ${themeVars.colors.primary};
    text-decoration: underline;
    text-underline-offset: 4px;
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
      >
        {content}
      </ReactMarkdown>
    </MarkdownContainer>
  );
};

export default MarkdownRenderer; 
