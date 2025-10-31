import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, Space, Tag, Radio, Modal, Button, Select, Pagination } from 'antd';
import { EyeOutlined, AppstoreOutlined, UnorderedListOutlined, TagsOutlined, FolderOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { globalStyles } from '../../styles/theme';
import { useTitle } from '../../hooks/useTitle';
import { blogApi, CategoryData, TagData } from '../../services/api';
import { BlogData } from '../../types/types';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useStandaloneMode } from "../../hooks/useStandaloneMode.ts";
import { useDedupeRequest } from '../../hooks/useDedupeRequest';
import PageLoading from '../../components/PageLoading';
import DataErrorFallback from '../../components/DataErrorFallback';

const { Title } = Typography;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${globalStyles.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  
  @media (max-width: 768px) {
    > .ant-card {
      border-radius: 0;
    }
  }
`;

const ViewControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${globalStyles.spacing.lg};
  position: relative;
  z-index: 0;

  @media (max-width: 768px) {
    padding: ${globalStyles.spacing.lg};
    margin-bottom: 0;
    .view-mode-controls {
      display: none;
    }
  }
`;

const BlogGrid = styled.div<{ isGrid: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.isGrid ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr'};
  gap: ${globalStyles.spacing.lg};

  @media (max-width: 768px) {
    gap: 0;

    > * {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }
  }
`;

const StyledCard = styled(motion(Card))`
  cursor: pointer;
  transition: all ${globalStyles.transitions.default};
  box-shadow: ${globalStyles.shadows.small};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${globalStyles.shadows.medium};
  }

  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const BlogTag = styled(Tag)`
  margin: ${globalStyles.spacing.xs};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const TagsContainer = styled.div`
  margin: ${globalStyles.spacing.md} 0;
`;

const ReadMoreButton = styled(Button)`
  margin-top: ${globalStyles.spacing.md};
  padding: 0;
  height: auto;
  line-height: 1;
  color: ${globalStyles.colors.primary};
  display: block;
  
  &:hover {
    color: ${globalStyles.colors.primary}dd;
  }
`;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const PreviewMarkdownRenderer = styled(MarkdownRenderer)`
  margin-top: ${globalStyles.spacing.md};
  max-height: 100px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(transparent, white);
  }
`;

const ModalMarkdownRenderer = styled(MarkdownRenderer)`
  margin-top: ${globalStyles.spacing.md};
  max-height: calc(60vh - 200px);
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(transparent, white);
    pointer-events: none;
  }
`;

const ModalContent = styled.div`
  max-height: 60vh;
  overflow: hidden;
`;

const ModalFooter = styled.div`
  margin-top: ${globalStyles.spacing.md};
  padding-top: ${globalStyles.spacing.md};
  border-top: 1px solid ${globalStyles.colors.border};
`;

const FilterContainer = styled.div`
  margin-bottom: ${globalStyles.spacing.lg};
  display: flex;
  gap: ${globalStyles.spacing.md};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 0 ${globalStyles.spacing.lg};
  }
`;

const FilterLabel = styled.span`
  color: ${globalStyles.colors.lightText};
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.xs};
`;

const StyledSelect = styled(Select)`
  min-width: 200px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${globalStyles.spacing.xl};
  padding: ${globalStyles.spacing.lg} 0;
  background-color: #fff;

  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const LoadingContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.sm};
  color: ${globalStyles.colors.lightText};
  margin: ${globalStyles.spacing.sm} 0;
  flex-wrap: wrap;
`;

const MetaDivider = styled.span`
  margin: 0 ${globalStyles.spacing.xs};
  color: ${globalStyles.colors.border};
`;

const Blog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isStandaloneMode = useStandaloneMode();

  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [filterParams, setFilterParams] = useState({
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
  });

  const dedupe = useDedupeRequest();

  useTitle('博客', { restoreOnUnmount: true });

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          dedupe('categories', () => blogApi.getCategories()),
          dedupe('tags', () => blogApi.getTags())
        ]);
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Failed to load metadata:', error);
      }
    };
    loadMetadata();
  }, [dedupe]);

  const loadBlogs = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await dedupe(
        `blogs-${JSON.stringify({ ...filterParams, page: currentPage, pageSize })}`,
        () => blogApi.getList({
          page: currentPage.toString(),
          pageSize: pageSize.toString(),
          keyword: '',
          ...filterParams
        })
      );
      setBlogs(data.content);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to load blogs:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filterParams, currentPage, pageSize, dedupe]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    const mode = params.get('mode');
    
    params.forEach((_, key) => params.delete(key));
    
    if (mode) {
      params.set('mode', mode);
    }
    
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    setSearchParams(params);
    setCurrentPage(1);
  }, [filterParams, setSearchParams, location.search]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const handleCategoryChange = useCallback((value: string | undefined) => {
    setFilterParams(prev => ({ ...prev, category: value }));
  }, []);

  const handleTagChange = useCallback((value: string | undefined) => {
    setFilterParams(prev => ({ ...prev, tag: value }));
  }, []);

  const handlePageChange = useCallback((page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  }, []);

  const handleViewModeChange = useCallback((mode: 'list' | 'grid') => {
    setViewMode(mode);
  }, []);

  const handleBlogClick = useCallback((blog: BlogData) => {
    if (isStandaloneMode) {
      handleNavigateToBlog(blog);
    } else {
      setSelectedBlog(blog);
    }
  }, [isStandaloneMode]);

  const handleReadMore = (e: React.MouseEvent, blog: BlogData) => {
    e.stopPropagation();
    handleNavigateToBlog(blog);
  };

  const handleNavigateToBlog = (blog: BlogData) => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    const blogPath = `/blog/${blog.id}${mode ? `?mode=${mode}` : ''}`;
    navigate(blogPath);
  };

  if (error) {
    return (
      <DataErrorFallback
        context="博客列表"
        error={error}
        onRetry={loadBlogs}
      />
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <ViewControls>
          <Title level={2}>博客文章</Title>
          <div className="view-mode-controls">
            <Radio.Group
              value={viewMode}
              onChange={(e) => handleViewModeChange(e.target.value as 'list' | 'grid')}
            >
              <Radio.Button value="grid">
                <AppstoreOutlined /> 网格视图
              </Radio.Button>
              <Radio.Button value="list">
                <UnorderedListOutlined /> 列表视图
              </Radio.Button>
            </Radio.Group>
          </div>
        </ViewControls>

        <FilterContainer>
          <FilterLabel>
            <FolderOutlined /> 按分类筛选：
          </FilterLabel>
          <StyledSelect
            allowClear
            placeholder="选择分类"
            value={filterParams.category}
            // @ts-ignore
            onChange={handleCategoryChange}
            options={categories.map(category => ({
              label: `${category.name} (${category.articleCount})`,
              value: category.name
            }))}
            style={{ minWidth: 150 }}
          />

          <FilterLabel>
            <TagsOutlined /> 按标签筛选：
          </FilterLabel>
          <StyledSelect
            mode="multiple"
            allowClear
            placeholder="选择标签"
            value={filterParams.tag ? filterParams.tag.split(',') : []}
            // @ts-ignore
            onChange={(values) => handleTagChange(values.join(','))}
            options={tags.map(tag => ({
              label: `${tag.name} (${tag.articleCount})`,
              value: tag.name
            }))}
          />
        </FilterContainer>

        {loading ? (
          <LoadingContainer>
            <PageLoading tip="正在加载博客列表" />
          </LoadingContainer>
        ) : (
          <>
            <BlogGrid isGrid={viewMode === 'grid'}>
              <AnimatePresence initial={false}>
                {blogs.map((blog) => (
                  <StyledCard
                    key={blog.id}
                    onClick={() => handleBlogClick(blog)}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Title level={4}>{blog.title}</Title>
                    <BlogMeta>
                      <Tag color="blue">{blog.categoryName}</Tag>
                      <Space>
                        <EyeOutlined /> {blog.viewCount} 次浏览
                      </Space>
                      <MetaDivider>•</MetaDivider>
                      <Space>
                        <ClockCircleOutlined /> {blog.createTime}
                      </Space>
                    </BlogMeta>
                    <PreviewMarkdownRenderer content={blog.summary} />
                    <TagsContainer>
                      <Space>
                        {blog.tagNames.map((tag) => (
                          <BlogTag
                            key={tag}
                            color={tags.some(t => t.name === tag) ? 'blue' : 'default'}
                            onClick={(e) => {
                              e.stopPropagation();
                              // @ts-ignore
                              handleTagChange([tag]);
                            }}
                          >
                            {tag}
                          </BlogTag>
                        ))}
                      </Space>
                    </TagsContainer>
                    <ReadMoreButton
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={(e) => handleReadMore(e, blog)}
                    >
                      阅读全文
                    </ReadMoreButton>
                  </StyledCard>
                ))}
              </AnimatePresence>
            </BlogGrid>

            <PaginationContainer>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </PaginationContainer>
          </>
        )}

        <Modal
          title={selectedBlog?.title}
          open={!!selectedBlog}
          onCancel={() => setSelectedBlog(null)}
          footer={null}
          width={800}
        >
          {selectedBlog && (
            <ModalContent>
              <Tag color="blue" style={{ marginBottom: globalStyles.spacing.sm }}>{selectedBlog.categoryName}</Tag>
              <Space>
                {selectedBlog.tagNames.map((tag) => (
                  <BlogTag key={tag} color="blue">{tag}</BlogTag>
                ))}
              </Space>
              <ModalMarkdownRenderer content={selectedBlog.content} />
              <ModalFooter>
                <ReadMoreButton
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={(e) => handleReadMore(e, selectedBlog)}
                >
                  阅读全文
                </ReadMoreButton>
              </ModalFooter>
            </ModalContent>
          )}
        </Modal>
      </ContentWrapper>
    </Container>
  );
};

export default Blog;
