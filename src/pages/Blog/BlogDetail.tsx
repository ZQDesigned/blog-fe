import React, { useCallback, useEffect, useState } from 'react';
import { Typography, Space, Tag, Button, Skeleton } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { themeVars, withThemeAlpha } from '../../theme';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useTitle } from '../../hooks/useTitle';
import { blogApi } from '../../services/api';
import { BlogData } from '../../types/types';
import DataErrorFallback from '../../components/DataErrorFallback';

const { Title } = Typography;

const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: ${themeVars.spacing.lg};

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ContentWrapper = styled(motion.div)`
  background: ${withThemeAlpha(themeVars.colors.onPrimary, 0.9)};
  padding: ${themeVars.spacing.xl};
  border-radius: 8px;
  box-shadow: ${themeVars.shadows.small};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    border-radius: 0;
    padding: ${themeVars.spacing.lg};
  }
`;

const BlogTag = styled(Tag)`
  margin: ${themeVars.spacing.xs};
  color: ${themeVars.colors.primary};
  border-color: ${withThemeAlpha(themeVars.colors.primary, 0.35)};
  background: ${withThemeAlpha(themeVars.colors.primary, 0.1)};
`;

const BackButton = styled(Button)`
  margin-bottom: ${themeVars.spacing.lg};

  @media (max-width: 768px) {
    margin: ${themeVars.spacing.lg};
  }
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeVars.spacing.sm};
  color: ${themeVars.colors.lightText};
  margin: ${themeVars.spacing.md} 0;
  flex-wrap: wrap;
`;

const MetaDivider = styled.span`
  margin: 0 ${themeVars.spacing.xs};
  color: ${themeVars.colors.border};
`;

const StyledMarkdownRenderer = styled(MarkdownRenderer)`
  margin-top: ${themeVars.spacing.lg};
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

      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="blog-detail-content"
      >
        <Title level={2}>{blog.title}</Title>

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
