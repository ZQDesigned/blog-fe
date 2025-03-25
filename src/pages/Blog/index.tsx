import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, Space, Tag, Radio, Modal, Button, Select, Pagination, Spin } from 'antd';
import { EyeOutlined, AppstoreOutlined, UnorderedListOutlined, TagsOutlined, FolderOutlined, ClockCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { globalStyles } from '../../styles/theme';
import { useTitle } from '../../hooks/useTitle';
import { blogApi, BlogQuery, CategoryData, TagData } from '../../services/api';
import { BlogData } from '../../types/types';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useStandaloneMode } from "../../hooks/useStandaloneMode.ts";
import { useDedupeRequest } from '../../hooks/useDedupeRequest';
import type { SelectProps } from 'antd';

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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
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
  useTitle('博客', { restoreOnUnmount: true });
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isStandaloneMode = useStandaloneMode();

  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const [query, setQuery] = useState<BlogQuery>({
    page: searchParams.get('page') || '1',
    pageSize: '10',
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
  });

  const dedupe = useDedupeRequest();

  const loadBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dedupe(
        `blogs-${JSON.stringify(query)}`,
        () => blogApi.getList(query)
      );
      setBlogs(response.content);
      setTotal(response.total);
      // @ts-ignore
      if (response.page !== query.page) {
        // @ts-ignore
        setQuery(prev => ({ ...prev, page: response.page }));
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [query, dedupe]);

  const loadFilters = useCallback(async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        dedupe('categories', () => blogApi.getCategories()),
        dedupe('tags', () => blogApi.getTags()),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  }, [dedupe]);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  useEffect(() => {
    loadBlogs();
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });
    navigate({ search: params.toString() }, { replace: true });
  }, [query, loadBlogs, navigate]);

  const handleCategoryChange: SelectProps['onChange'] = (value) => {
    setQuery(prev => ({ ...prev, category: value?.toString() || undefined, page: '1' }));
  };

  const handleTagClick: SelectProps['onChange'] = (value) => {
    setQuery(prev => ({ ...prev, tag: Array.isArray(value) && value.length > 0 ? value.join(',') : undefined, page: '1' }));
  };

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page: page.toString() }));
  };

  const handleViewModeChange = (e: any) => {
    setViewMode(e.target.value);
  };

  const handleBlogClick = (blog: BlogData) => {
    if (isStandaloneMode) {
      handleNavigateToBlog(blog);
    } else {
      setSelectedBlog(blog);
    }
  };

  const handleReadMore = (e: React.MouseEvent, blog: BlogData) => {
    e.stopPropagation();
    handleNavigateToBlog(blog);
  };

  const handleNavigateToBlog = (blog: BlogData) => {
    const searchParams = new URLSearchParams(location.search);
    const blogPath = `/blog/${blog.id}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    navigate(blogPath);
  };

  return (
    <Container>
      <ContentWrapper>
        <ViewControls>
          <Title level={2}>博客文章</Title>
          <div className="view-mode-controls">
            <Radio.Group
              value={viewMode}
              onChange={handleViewModeChange}
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
            value={query.category || null}
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
            value={query.tag ? query.tag.split(',') : []}
            onChange={handleTagClick}
            options={tags.map(tag => ({
              label: `${tag.name} (${tag.articleCount})`,
              value: tag.name
            }))}
          />
        </FilterContainer>

        {loading ? (
          <LoadingContainer>
            <Spin size="large" />
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
                              handleTagClick([tag]);
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
                // @ts-ignore
                current={query.page}
                total={total}
                // @ts-ignore
                pageSize={query.pageSize!}
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
