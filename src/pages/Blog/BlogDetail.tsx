import React from 'react';
import { Typography, Space, Tag, Button, Skeleton } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { globalStyles } from '../../styles/theme';
import { MOCK_BLOGS } from './mockData';
import MarkdownRenderer from '../../components/MarkdownRenderer';

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
  background: #fff;
  padding: ${globalStyles.spacing.xl};
  border-radius: 8px;
  box-shadow: ${globalStyles.shadows.small};

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
`;

const StyledMarkdownRenderer = styled(MarkdownRenderer)`
  margin-top: ${globalStyles.spacing.lg};
`;

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 查找博客数据
  const blog = MOCK_BLOGS.find(blog => blog.id === Number(id));

  const handleBack = () => {
    navigate('/blog');
  };

  if (!blog) {
    return (
      <Container>
        <BackButton type="link" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回博客列表
        </BackButton>
        <Skeleton active />
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
          <CalendarOutlined /> {blog.date}
        </BlogMeta>

        <Space wrap>
          {blog.tags.map((tag) => (
            <BlogTag key={tag} color="blue">{tag}</BlogTag>
          ))}
        </Space>

        <StyledMarkdownRenderer content={blog.content} />
      </ContentWrapper>
    </Container>
  );
};

export default BlogDetail;
