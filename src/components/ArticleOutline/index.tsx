import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { themeVars } from '../../theme';
import type { ArticleHeading } from '../../hooks/useArticleOutline';

const Outline = styled.aside`
  color: ${themeVars.colors.lightText}; font-size: 13px; line-height: 1.65;
  a { display: block; padding: 5px 0; color: inherit; text-decoration: none; overflow-wrap: anywhere; }
  a[aria-current='location'] { color: ${themeVars.colors.primary}; font-weight: 600; }
  .outline-label { margin: 0 0 12px; color: ${themeVars.colors.text}; font-weight: 600; }
  .outline-desktop {
    position: fixed; left: calc(50% + 440px); top: 120px; width: 190px;
    max-height: calc(100dvh - 160px); overflow-y: auto; border-left: 1px solid ${themeVars.colors.border}; padding-left: 18px;
  }
  details { display: none; border-block: 1px solid ${themeVars.colors.border}; margin-top: 28px; padding: 14px 0; }
  summary { cursor: pointer; color: ${themeVars.colors.text}; }
  details nav { padding-top: 10px; max-height: 45vh; overflow-y: auto; }
  @media (max-width: 1349px) { .outline-desktop { display: none; } details { display: block; } }
`;

export default function ArticleOutline({ headings, activeId }: { headings: ArticleHeading[]; activeId: string }) {
  const navigate = useNavigate();
  if (headings.length < 3) return null;
  const links = headings.map(heading => <a key={heading.id} href={`#${encodeURIComponent(heading.id)}`}
    style={{ paddingLeft: Math.max(0, heading.level - 2) * 12 }}
    aria-current={heading.id === activeId ? 'location' : undefined}
    onClick={event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      navigate({ hash: `#${encodeURIComponent(heading.id)}` }, { replace: true, preventScrollReset: true });
    }}>{heading.text}</a>);
  return <Outline>
    <nav className="outline-desktop" aria-label="文章目录"><p className="outline-label">本文目录</p>{links}</nav>
    <details><summary>本文目录 · {headings.length} 节</summary><nav aria-label="文章目录">{links}</nav></details>
  </Outline>;
}
