import { Children, isValidElement, useEffect, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ExtraProps } from 'react-markdown';
import { LinkOutlined } from '@ant-design/icons';
import { copyText } from '../../utils/clipboard';

const textOf = (children: ReactNode): string => Children.toArray(children).map(child => {
  if (typeof child === 'string' || typeof child === 'number') return String(child);
  return isValidElement<{ children?: ReactNode }>(child) ? textOf(child.props.children) : '';
}).join('');

const useCopyFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; clearTimeout(timer.current); };
  }, []);
  const copy = async (text: string) => {
    try {
      await copyText(text);
      if (!mounted.current) return;
      setFeedback('已复制');
    } catch {
      if (!mounted.current) return;
      setFeedback('复制失败');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(''), 2000);
  };
  return { feedback, copy };
};

export function ReadingHeading({ node, children, ...props }: ComponentPropsWithoutRef<'h2'> & ExtraProps) {
  const Tag = (node?.tagName || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const ref = useRef<HTMLHeadingElement>(null);
  const { feedback, copy } = useCopyFeedback();
  return <Tag {...props} ref={ref} className={`reading-heading ${props.className || ''}`} aria-label={textOf(children)}>
    <span data-heading-text>{children}</span>
    <button type="button" className="heading-anchor" aria-label="复制本节链接" title={feedback || '复制本节链接'}
      onClick={() => {
        if (!ref.current?.id) return;
        const url = new URL(window.location.href);
        url.hash = ref.current.id;
        void copy(url.href);
      }}><LinkOutlined /></button>
    <span className="reading-sr-only" role="status">{feedback}</span>
  </Tag>;
}

export function ReadingCode({ node, children, ...props }: ComponentPropsWithoutRef<'pre'> & ExtraProps) {
  const ref = useRef<HTMLPreElement>(null);
  const { feedback, copy } = useCopyFeedback();
  const code = node?.children.find(child => child.type === 'element' && child.tagName === 'code');
  const classes = code?.type === 'element' ? code.properties.className : undefined;
  const language = Array.isArray(classes) ? classes.map(String).find(value => value.startsWith('language-'))?.slice(9) : '';
  return <div className="reading-code-block">
    <div className="reading-code-toolbar"><span>{language || '代码'}</span>
      <button type="button" aria-label="复制代码" onClick={() => void copy(ref.current?.textContent || '')}>
        {feedback || '复制代码'}
      </button><span className="reading-sr-only" role="status">{feedback}</span>
    </div>
    <pre {...props} ref={ref}>{children}</pre>
  </div>;
}
