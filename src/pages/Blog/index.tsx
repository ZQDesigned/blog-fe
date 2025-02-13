import React, { useState, useMemo } from 'react';
import { Card, Typography, Space, Tag, Radio, Modal, Button, Select, Pagination } from 'antd';
import { EyeOutlined, AppstoreOutlined, UnorderedListOutlined, TagsOutlined, FolderOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { globalStyles } from '../../styles/theme';
import { MOCK_BLOGS } from './mockData';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useTitle } from '../../hooks/useTitle';

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

interface BlogData {
  id: number;
  title: string;
  summary: string;
  tags: string[];
  category: string;
  date: string;
  content: string;
  viewCount: number;
}

const Blog: React.FC = () => {
  // 使用 useTitle hook，设置博客列表页面标题
  useTitle('博客', { restoreOnUnmount: true });

  const [isGrid, setIsGrid] = useState(() => {
    const savedViewMode = localStorage.getItem('blogViewMode');
    return savedViewMode === null ? true : savedViewMode === 'grid';
  });
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  // 获取所有唯一的标签和分类
  const { allTags, allCategories } = useMemo(() => {
    const tagSet = new Set<string>();
    const categorySet = new Set<string>();
    MOCK_BLOGS.forEach(blog => {
      blog.tags.forEach(tag => tagSet.add(tag));
      categorySet.add(blog.category);
    });
    return {
      allTags: Array.from(tagSet),
      allCategories: Array.from(categorySet)
    };
  }, []);

  // 根据选中的标签和分类筛选博客
  const filteredBlogs = useMemo(() => {
    return MOCK_BLOGS.filter(blog => {
      const matchTags = selectedTags.length === 0 || selectedTags.some(tag => blog.tags.includes(tag));
      const matchCategory = !selectedCategory || blog.category === selectedCategory;
      return matchTags && matchCategory;
    });
  }, [selectedTags, selectedCategory]);

  // 计算当前页的博客
  const currentBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredBlogs.slice(startIndex, startIndex + pageSize);
  }, [filteredBlogs, currentPage]);

  const handleBlogClick = (blog: BlogData) => {
    setSelectedBlog(blog);
  };

  const handleReadMore = (e: React.MouseEvent, blog: BlogData) => {
    e.stopPropagation();
    navigate(`/blog/${blog.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewModeChange = (e: any) => {
    const newIsGrid = e.target.value === 'grid';
    setIsGrid(newIsGrid);
    localStorage.setItem('blogViewMode', newIsGrid ? 'grid' : 'list');
  };

  return (
    <Container>
      <ContentWrapper>
        <ViewControls>
          <Title level={2}>博客文章</Title>
          <div className="view-mode-controls">
            <Radio.Group
              value={isGrid ? 'grid' : 'list'}
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
            value={selectedCategory}
              // @ts-expect-error 忽略类型检查
            onChange={(value: string) => setSelectedCategory(value)}
            options={allCategories.map(category => ({ label: category, value: category }))}
            style={{ minWidth: 150 }}
          />

          <FilterLabel>
            <TagsOutlined /> 按标签筛选：
          </FilterLabel>
          <StyledSelect
            mode="multiple"
            allowClear
            placeholder="选择标签"
            value={selectedTags}
              // @ts-expect-error 忽略类型检查
            onChange={(value: string[]) => setSelectedTags(value)}
            options={allTags.map(tag => ({ label: tag, value: tag }))}
          />
        </FilterContainer>

        <BlogGrid isGrid={isGrid}>
          <AnimatePresence initial={false}>
            {currentBlogs.map((blog) => (
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
                <Tag color="blue">{blog.category}</Tag>
                <Space style={{ marginLeft: globalStyles.spacing.sm }}>
                  <EyeOutlined /> {blog.viewCount} 次浏览
                </Space>
                <PreviewMarkdownRenderer content={blog.summary} />
                <TagsContainer>
                  <Space>
                    {blog.tags.map((tag) => (
                      <BlogTag
                        key={tag}
                        color={selectedTags.includes(tag) ? 'blue' : 'default'}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          );
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
            total={filteredBlogs.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </PaginationContainer>

        <Modal
          title={selectedBlog?.title}
          open={!!selectedBlog}
          onCancel={() => setSelectedBlog(null)}
          footer={null}
          width={800}
        >
          {selectedBlog && (
            <ModalContent>
              <Tag color="blue" style={{ marginBottom: globalStyles.spacing.sm }}>{selectedBlog.category}</Tag>
              <Space>
                {selectedBlog.tags.map((tag) => (
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
