import { useEffect, useEffectEvent, useState } from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { themeVars } from '../../../theme';

const SearchForm = styled.form`
  display: flex; align-items: center; gap: 8px; flex: 1; min-width: 220px;
  height: 36px; padding: 0 10px; border: 1px solid ${themeVars.colors.border};
  border-radius: ${themeVars.borderRadius.small}; color: ${themeVars.colors.lightText};
  background: ${themeVars.colors.background};
  &:focus-within { border-color: ${themeVars.colors.primary}; }
  input { min-width: 0; width: 100%; border: 0; outline: none; color: ${themeVars.colors.text}; background: transparent; font-size: 13px; user-select: text; }
  input::-webkit-search-cancel-button { display: none; }
  button { border: 0; padding: 3px; background: none; color: ${themeVars.colors.primary}; cursor: pointer; white-space: nowrap; font-size: 12px; }
  @media (max-width: 640px) { flex-basis: 100%; }
`;

export default function ArticleSearch({ value, onSearch }: { value: string; onSearch: (keyword: string, replace: boolean) => void }) {
  const [draft, setDraft] = useState(value);
  const commit = useEffectEvent((text: string) => onSearch(text, true));
  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => {
    if (draft.trim() === value) return;
    const timer = setTimeout(() => commit(draft.trim()), 350);
    return () => clearTimeout(timer);
  }, [draft, value]);
  return <SearchForm role="search" onSubmit={event => { event.preventDefault(); onSearch(draft.trim(), false); }}>
    <SearchOutlined aria-hidden />
    <input type="search" aria-label="搜索文章" placeholder="搜索文章" maxLength={200} value={draft}
      onChange={event => setDraft(event.target.value)} />
    {draft && <button type="button" aria-label="清空搜索" onClick={() => { setDraft(''); onSearch('', true); }}><CloseOutlined /></button>}
    <button type="submit">搜索</button>
  </SearchForm>;
}
