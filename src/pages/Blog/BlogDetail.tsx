import React, { useCallback, useEffect, useState } from 'react';
import { Space, Tag, Button, Skeleton } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { themeVars, withThemeAlpha } from '../../theme';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useTitle } from '../../hooks/useTitle';
import { blogApi } from '../../services/api';
import { BlogData } from '../../types/types';
import DataErrorFallback from '../../components/DataErrorFallback';
import { EditorialTitle, Eyebrow } from '../../components/Editorial';

const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  min-width: 0;
  padding: clamp(32px, 5vw, 64px) clamp(20px, 4vw, 56px) 80px;
  overflow-wrap: anywhere;
`;

const ContentWrapper = styled.article`
  min-width: 0;
  max-width: 760px;
  .title-clause { display: inline-block; max-width: 100%; vertical-align: top; }
  .ant-space { max-width: 100%; }
  .ant-space-item { min-width: 0; overflow-wrap: anywhere; }
`;

const BlogTag = styled(Tag)`
  margin: ${themeVars.spacing.xs};
  color: ${themeVars.colors.primary};
  border-color: ${withThemeAlpha(themeVars.colors.primary, 0.35)};
  background: transparent;
  white-space: normal;
  overflow-wrap: anywhere;
`;

const BackButton = styled(Button)`
  margin-bottom: 48px;
  padding: 0;
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeVars.spacing.sm};
  color: ${themeVars.colors.lightText};
  margin: 24px 0;
  font-size: 12px;
  line-height: 1.9;
  flex-wrap: wrap;
`;

const MetaDivider = styled.span`
  margin: 0 ${themeVars.spacing.xs};
  color: ${themeVars.colors.border};
`;

const StyledMarkdownRenderer = styled(MarkdownRenderer)`
  margin-top: 40px;
  padding-top: 36px;
  border-top: 1px solid ${themeVars.colors.border};
`;

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);

  // 使用 useTitle hook
  useTitle(blog?.title || '加载中...', { restoreOnUnmount: true });

  const loadBlog = useCallback(async () => {
    if (!id) {
      setError(new Error('未提供文章 ID'));
      setLoading(false);
      return;
    }

    const blogId = Number(id);

    if (Number.isNaN(blogId)) {
      setError(new Error('无效的文章 ID'));
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setNotFound(false);
      setLoading(true);
      const data = await blogApi.getDetail(blogId);
      setBlog(data);
      setNotFound(false);

      void blogApi.increaseViewCount(blogId).catch((err) => {
        console.error('Failed to increase blog view count:', err);
      });
    } catch (err) {
      console.error('Failed to load blog:', err);
      const message = (err as Error).message ?? '';
      if (message.includes('不存在') || message.toLowerCase().includes('not found')) {
        setNotFound(true);
        setBlog(null);
        setError(null);
      } else {
        setError(err as Error);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadBlog();
  }, [loadBlog]);

  const handleBack = () => {
    const searchParams = new URLSearchParams(location.search);
    const blogPath = `/blog${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    navigate(blogPath);
  };

  if (loading) {
    return (
      <Container>
        <BackButton type="link" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回博客列表
        </BackButton>
        <Skeleton active />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <BackButton type="link" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回博客列表
        </BackButton>
        <DataErrorFallback
          context="文章内容"
          error={error}
          onRetry={loadBlog}
        />
      </Container>
    );
  }

  if (notFound || !blog) {
    return (
      <Container>
        <BackButton type="link" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回博客列表
        </BackButton>
        <div>博客不存在或已被删除</div>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton type="link" icon={<ArrowLeftOutlined />} onClick={handleBack}>
        返回博客列表
      </BackButton>

      <ContentWrapper className="blog-detail-content">
        <Eyebrow>{blog.categoryName}</Eyebrow>
        <EditorialTitle aria-label={blog.title}>{blog.title.split(/(?<=：)/u).map((clause, index) =>
          <span className="title-clause" key={index}>{clause}</span>)}</EditorialTitle>

        <BlogMeta>
          <Space>
            <ClockCircleOutlined /> 发布于 {blog.createTime}
          </Space>
          <MetaDivider>•</MetaDivider>
          <Space>
            <EditOutlined /> 更新于 {blog.updateTime}
          </Space>
          <MetaDivider>•</MetaDivider>
          <Space>
            <EyeOutlined /> {blog.viewCount} 次浏览
          </Space>
        </BlogMeta>

        <Space wrap>
          {blog.tagNames.map((tag) => (
            <BlogTag key={tag}>{tag}</BlogTag>
          ))}
        </Space>

        <StyledMarkdownRenderer content={blog.content} />
      </ContentWrapper>
    </Container>
  );
};

export default BlogDetail;
