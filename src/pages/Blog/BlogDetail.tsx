import React, { useEffect, useState } from 'react';
import { Typography, Space, Tag, Button, Skeleton } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { globalStyles } from '../../styles/theme';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useTitle } from '../../hooks/useTitle';
import { blogApi } from '../../services/api';
import { BlogData } from '../../types/types';
import GameModal from '../../components/GameModal';
import { useGameEasterEgg } from '../../hooks/useGameEasterEgg';

const { Title } = Typography;

const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: ${globalStyles.spacing.lg};

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const ContentWrapper = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  padding: ${globalStyles.spacing.xl};
  border-radius: 8px;
  box-shadow: ${globalStyles.shadows.small};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    border-radius: 0;
    padding: ${globalStyles.spacing.lg};
  }
`;

const BlogTag = styled(Tag)`
  margin: ${globalStyles.spacing.xs};
`;

const BackButton = styled(Button)`
  margin-bottom: ${globalStyles.spacing.lg};

  @media (max-width: 768px) {
    margin: ${globalStyles.spacing.lg};
  }
`;

const BlogMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.sm};
  color: ${globalStyles.colors.lightText};
  margin: ${globalStyles.spacing.md} 0;
  flex-wrap: wrap;
`;

const MetaDivider = styled.span`
  margin: 0 ${globalStyles.spacing.xs};
  color: ${globalStyles.colors.border};
`;

const StyledMarkdownRenderer = styled(MarkdownRenderer)`
  margin-top: ${globalStyles.spacing.lg};
`;

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { showGameModal, handleCloseGameModal } = useGameEasterEgg();

  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);

  // 使用 useTitle hook
  useTitle(blog?.title || '加载中...', { restoreOnUnmount: true });

  useEffect(() => {
    const loadBlog = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const blogId = parseInt(id, 10);
        const data = await blogApi.getDetail(blogId);
        setBlog(data);

        // 增加阅读量
        await blogApi.increaseViewCount(blogId);
      } catch (error) {
        console.error('Failed to load blog:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

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

  if (!blog) {
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
            <BlogTag key={tag} color="blue">{tag}</BlogTag>
          ))}
        </Space>

        <StyledMarkdownRenderer content={blog.content} />
      </ContentWrapper>

      <GameModal open={showGameModal} onClose={handleCloseGameModal} />
    </Container>
  );
};

export default BlogDetail;
