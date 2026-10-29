import { useState, useEffect, useCallback, useRef } from 'react';
import { Space, Tag, Radio, Modal, Button, Select, Pagination, Empty } from 'antd';
import { ArrowRightOutlined, AppstoreOutlined, UnorderedListOutlined, EyeOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { themeVars } from '../../theme';
import { useTitle } from '../../hooks/useTitle';
import { blogApi } from '../../services/api';
import type { CategoryData, TagData } from '../../services/api';
import type { BlogData } from '../../types/types';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useStandaloneMode } from '../../hooks/useStandaloneMode';
import { useDedupeRequest } from '../../hooks/useDedupeRequest';
import PageLoading from '../../components/PageLoading';
import DataErrorFallback from '../../components/DataErrorFallback';
import { EditorialTitle, Eyebrow } from '../../components/Editorial';

const Container = styled.div`
  width: min(100%, 1200px);
  min-width: 0;
  margin: 0 auto;
  padding: clamp(32px, 5vw, 72px) clamp(20px, 4vw, 56px);
  overflow-wrap: anywhere;
`;
const Heading = styled.header`
  position: relative;
  padding: 16px 220px 48px 0;
  min-height: 215px;
  > p:last-of-type { color: ${themeVars.colors.lightText}; line-height: 1.9; }
  img { position: absolute; right: 0; top: 0; width: 185px; height: 175px; object-fit: cover; opacity: 0.9; }
  @media (max-width: 640px) { padding-right: 0; min-height: 0; img { display: none; } }
`;
const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  flex-wrap: wrap;
  padding: 20px 0;
  border-top: 1px solid ${themeVars.colors.border};
  border-bottom: 1px solid ${themeVars.colors.border};
  .filters { display: flex; flex-wrap: wrap; gap: 12px; min-width: 0; flex: 1; }
  .ant-select { width: 180px; max-width: 100%; }
  @media (max-width: 640px) {
    .filters { width: 100%; }
    .ant-select { flex: 1; min-width: 120px; }
    .view-mode-controls { width: 100%; }
  }
`;
const BlogGrid = styled.div<{ $isGrid: boolean }>`
  display: grid;
  grid-template-columns: ${p => p.$isGrid ? 'repeat(auto-fit, minmax(min(100%, 310px), 1fr))' : 'minmax(0, 1fr)'};
  gap: ${p => p.$isGrid ? '0 32px' : '0'};
`;
const Entry = styled.article<{ $isGrid: boolean }>`
  display: grid;
  grid-template-columns: ${p => p.$isGrid ? 'minmax(0, 1fr)' : '130px minmax(0, 1fr)'};
  gap: 20px 32px;
  min-width: 0;
  padding: 32px 0;
  border-bottom: 1px solid ${themeVars.colors.border};
  .date { color: ${themeVars.colors.lightText}; font-size: 13px; padding-top: 6px; }
  .entry-body { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; }
  h2 { font-size: 25px; font-family: ${themeVars.typography.fontFamilyHeading}; font-weight: 400; line-height: 1.5; margin-bottom: 10px; width: 100%; }
  .title-button { display: block; text-align: left; background: none; border: none; color: inherit; padding: 0; font: inherit; cursor: pointer; overflow-wrap: anywhere; }
  .title-button:hover { color: ${themeVars.colors.primary}; }
  .meta { color: ${themeVars.colors.lightText}; display: flex; align-items: center; flex-wrap: wrap; gap: 8px 16px; font-size: 12px; margin-bottom: 14px; }
  .summary { max-height: 100px; overflow: hidden; color: ${themeVars.colors.lightText}; font-size: 15px; width: 100%; }
  .summary p { margin-bottom: 0; }
  .tags { display: flex; flex-wrap: wrap; gap: 4px; margin: 18px 0 10px; }
  @media (max-width: 640px) { grid-template-columns: minmax(0, 1fr); gap: 12px; padding: 24px 0; }
`;
const BlogTag = styled(Tag)`
  color: ${themeVars.colors.primary};
  background: transparent;
  border-color: ${themeVars.colors.border};
  white-space: normal;
  overflow-wrap: anywhere;
  margin-inline-end: 0;
  cursor: pointer;
`;
const ReadMore = styled(Button)`
  padding: 0;
  margin-top: auto;
  height: auto;
  font-size: 13px;
`;
const PaginationBar = styled.div`
  padding: 32px 0;
  display: flex;
  justify-content: center;
`;
const PreviewBody = styled.div`
  max-height: 55vh;
  overflow: auto;
  margin: 24px 0;
`;

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const standalone = useStandaloneMode();
  const dedupe = useDedupeRequest();
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const requestSequence = useRef(0);
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;
  useTitle('博客', { restoreOnUnmount: true });

  useEffect(() => {
    let active = true;
    Promise.all([dedupe('categories', () => blogApi.getCategories()), dedupe('tags', () => blogApi.getTags())])
      .then(([nextCategories, nextTags]) => {
        if (active) { setCategories(nextCategories); setTags(nextTags); }
      }).catch(err => console.error('Failed to load metadata:', err));
    return () => { active = false; };
  }, [dedupe]);

  const loadBlogs = useCallback(async () => {
    const sequence = ++requestSequence.current;
    setError(null);
    setLoading(true);
    try {
      const params = { category, tag, page: currentPage.toString(), pageSize: pageSize.toString(), keyword: '' };
      const data = await dedupe(`blogs-${JSON.stringify(params)}`, () => blogApi.getList(params));
      if (sequence !== requestSequence.current) return;
      setBlogs(data.content);
      setTotal(data.total);
    } catch (err) { if (sequence === requestSequence.current) setError(err as Error); }
    finally { if (sequence === requestSequence.current) setLoading(false); }
  }, [category, tag, currentPage, pageSize, dedupe]);

  useEffect(() => {
    void loadBlogs();
    return () => { requestSequence.current += 1; };
  }, [loadBlogs]);

  const setFilter = (key: 'category' | 'tag', value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setCurrentPage(1);
    setSearchParams(next);
  };
  const readArticle = (blog: BlogData) => navigate(`/blog/${blog.id}${location.search}`);

  return <Container>
    <Heading>
      <EditorialTitle>写下的，都是生长。</EditorialTitle>
      <p>一些技术探索，也有日常里的灵感与片刻。</p>
      <img src="/images/garden-illustration.webp" alt="" aria-hidden="true" />
    </Heading>
    <Controls>
      <div className="filters">
        <Select<string> aria-label="按分类筛选" allowClear placeholder="全部分类" value={category}
          onChange={value => setFilter('category', value)} options={categories.map(item => ({ label: `${item.name} (${item.articleCount})`, value: item.name }))} />
        <Select<string[]> aria-label="按标签筛选" mode="multiple" allowClear placeholder="全部标签" value={tag ? tag.split(',') : []}
          onChange={values => setFilter('tag', values.join(','))} maxTagCount="responsive"
          options={tags.map(item => ({ label: `${item.name} (${item.articleCount})`, value: item.name }))} />
      </div>
      <Radio.Group className="view-mode-controls" value={viewMode} onChange={e => setViewMode(e.target.value)} size="small" aria-label="文章展示方式">
        <Radio.Button value="list"><UnorderedListOutlined /> 列表视图</Radio.Button>
        <Radio.Button value="grid"><AppstoreOutlined /> 网格视图</Radio.Button>
      </Radio.Group>
    </Controls>
    {error ? <DataErrorFallback context="博客列表" error={error} onRetry={loadBlogs} />
      : loading ? <PageLoading tip="正在加载博客列表" />
        : blogs.length === 0 ? <Empty description="暂时没有匹配的文章" style={{ margin: '64px 0' }} />
          : <>
            <BlogGrid $isGrid={viewMode === 'grid'}>{blogs.map(blog => <Entry key={blog.id} $isGrid={viewMode === 'grid'}>
              <time className="date">{blog.createTime.split(' ')[0]}</time>
              <div className="entry-body">
                <h2><button className="title-button" onClick={() => standalone ? readArticle(blog) : setSelectedBlog(blog)}>{blog.title}</button></h2>
                <div className="meta"><span>{blog.categoryName}</span><span><EyeOutlined /> {blog.viewCount} 次浏览</span></div>
                <MarkdownRenderer className="summary" content={blog.summary} />
                <div className="tags">{blog.tagNames.map(name => <BlogTag key={name} role="button" tabIndex={0}
                  onClick={() => setFilter('tag', name)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFilter('tag', name); } }}>{name}</BlogTag>)}</div>
                <ReadMore type="link" onClick={() => readArticle(blog)}>阅读全文 <ArrowRightOutlined /></ReadMore>
              </div>
            </Entry>)}</BlogGrid>
            <PaginationBar><Pagination current={currentPage} pageSize={pageSize} total={total}
              onChange={(page, size) => { setCurrentPage(page); setPageSize(size); }} showSizeChanger={false} /></PaginationBar>
          </>}
    <Modal title={selectedBlog?.title} open={!!selectedBlog} onCancel={() => setSelectedBlog(null)} footer={null} width={800}>
      {selectedBlog && <>
        <Eyebrow>{selectedBlog.categoryName}</Eyebrow>
        <Space wrap>{selectedBlog.tagNames.map(name => <BlogTag key={name}>{name}</BlogTag>)}</Space>
        <PreviewBody><MarkdownRenderer content={selectedBlog.content} /></PreviewBody>
        <ReadMore type="link" onClick={() => readArticle(selectedBlog)}>阅读全文 <ArrowRightOutlined /></ReadMore>
      </>}
    </Modal>
  </Container>;
}
