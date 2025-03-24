import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Tag, Modal, Button, Spin } from 'antd';
import { GithubOutlined, LinkOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { globalStyles } from '../../styles/theme';
import { useTitle } from '../../hooks/useTitle';
import { useStandaloneMode } from '../../hooks/useStandaloneMode';
import { projectApi, Project } from '../../services/api';
import { getFullResourceUrl } from '../../utils/request';
import LazyImage from '../../components/LazyImage';

const { Title, Paragraph } = Typography;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${globalStyles.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ContentWrapper = styled.div`
  width: 100%;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${globalStyles.spacing.lg};
`;

const StyledCard = styled(motion(Card))`
  cursor: pointer;
  height: 100%;
  transition: all 0.3s ease;
  box-shadow: ${globalStyles.shadows.small};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${globalStyles.shadows.medium};
  }

  &.image-error {
    .ant-card-cover {
      display: none;
    }
  }
`;

const ProjectTag = styled(Tag)`
  margin: ${globalStyles.spacing.xs};
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: ${globalStyles.spacing.md};
  margin-top: ${globalStyles.spacing.md};
`;

const ProjectLink = styled(Button)<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.xs};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
`;

const StatusTag = styled(Tag)<{ $status: 'developing' | 'maintaining' | 'paused' }>`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0 ${globalStyles.spacing.sm};
  border-radius: 12px;
`;

const ImageErrorContainer = styled.div<{ $isModal?: boolean }>`
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(45deg, ${globalStyles.colors.secondary}80, ${globalStyles.colors.secondary});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${globalStyles.colors.lightText};
  gap: ${globalStyles.spacing.sm};
  border-radius: ${props => props.$isModal ? '8px' : '8px 8px 0 0'};
  padding: ${globalStyles.spacing.lg};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .icon-wrapper {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    padding: ${props => props.$isModal ? globalStyles.spacing.lg : globalStyles.spacing.md};
    backdrop-filter: blur(4px);
    margin-bottom: ${globalStyles.spacing.sm};
  }

  .error-text {
    font-size: ${props => props.$isModal ? '16px' : '14px'};
    text-align: center;
    color: ${globalStyles.colors.lightText};
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .retry-text {
    font-size: ${props => props.$isModal ? '14px' : '12px'};
    opacity: 0.8;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ModalContent = styled.div`
  padding: ${globalStyles.spacing.md};
`;

const List = styled.ul`
  list-style: disc;
  margin-left: ${globalStyles.spacing.lg};
  margin-bottom: ${globalStyles.spacing.md};
`;

const ListItem = styled.li`
  margin-bottom: ${globalStyles.spacing.sm};
  color: ${globalStyles.colors.text};
`;

const getStatusColor = (status: 'developing' | 'maintaining' | 'paused') => {
  switch (status) {
    case 'developing':
      return 'processing';
    case 'maintaining':
      return 'success';
    case 'paused':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusText = (status: 'developing' | 'maintaining' | 'paused') => {
  switch (status) {
    case 'developing':
      return '开发中';
    case 'maintaining':
      return '维护中';
    case 'paused':
      return '暂停维护';
    default:
      return '';
  }
};

const Projects: React.FC = () => {
  useTitle('项目', { restoreOnUnmount: true });
  const isStandalone = useStandaloneMode();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getList();
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleImageError = (projectId: number) => {
    setBrokenImages(prev => new Set([...prev, projectId]));
  };

  const ErrorDisplay = ({ isModal = false }) => (
    <ImageErrorContainer $isModal={isModal}>
      <div className="icon-wrapper">
        <ExclamationCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
      </div>
      <div className="error-text">图片加载失败</div>
      <span className="retry-text">请刷新页面重试</span>
    </ImageErrorContainer>
  );

  if (loading) {
    return (
      <LoadingContainer>
        <Spin size="large" />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        {!isStandalone && (
          <Title level={2} style={{ marginBottom: globalStyles.spacing.xl }}>
            个人项目展示
          </Title>
        )}

        <ProjectGrid>
          {projects.map((project) => (
            <StyledCard
              key={project.id}
              className={brokenImages.has(project.id) ? 'image-error' : ''}
              cover={
                !brokenImages.has(project.id) && (
                  <LazyImage
                    src={getFullResourceUrl(project.imageUrl)}
                    alt={project.title}
                    onError={() => handleImageError(project.id)}
                    loadingSize={40}
                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
                  />
                )
              }
              onClick={() => setSelectedProject(project)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <StatusTag
                $status={project.status}
                color={getStatusColor(project.status)}
              >
                {getStatusText(project.status)}
              </StatusTag>
              <Title level={4}>{project.title}</Title>
              <Paragraph ellipsis={{ rows: 2 }}>{project.description}</Paragraph>
              <Space wrap>
                {project.techStack.map((tech) => (
                  <ProjectTag key={tech} color="blue">{tech}</ProjectTag>
                ))}
              </Space>
            </StyledCard>
          ))}
        </ProjectGrid>

        <Modal
          title={selectedProject?.title}
          open={!!selectedProject}
          onCancel={() => setSelectedProject(null)}
          footer={null}
          width={800}
        >
          {selectedProject && (
            <ModalContent>
              {brokenImages.has(selectedProject.id) ? (
                <ErrorDisplay isModal />
              ) : (
                <LazyImage
                  src={getFullResourceUrl(selectedProject.imageUrl)}
                  alt={selectedProject.title}
                  onError={() => handleImageError(selectedProject.id)}
                  loadingSize={60}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    marginBottom: globalStyles.spacing.md,
                    aspectRatio: '16/9',
                    objectFit: 'cover'
                  }}
                />
              )}

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Title level={4}>项目描述</Title>
                  <Paragraph>{selectedProject.description}</Paragraph>
                </div>
                <div>
                  <Title level={4}>主要功能</Title>
                  <List>
                    {selectedProject.features.map((feature, index) => (
                      <ListItem key={index}>{feature}</ListItem>
                    ))}
                  </List>
                </div>
                <div>
                  <Title level={4}>技术栈</Title>
                  <Space size={[0, 8]} wrap>
                    {selectedProject.techStack.map((tech) => (
                      <Tag key={tech} color="blue">
                        {tech}
                      </Tag>
                    ))}
                  </Space>
                </div>
                <Space>
                  {selectedProject.github && !selectedProject.github.disabled && (
                    <Button
                      type="primary"
                      icon={<GithubOutlined />}
                      href={selectedProject.github.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={selectedProject.github.disabledReason || undefined}
                    >
                      查看源码
                    </Button>
                  )}
                  {selectedProject.demo && !selectedProject.demo.disabled && (
                    <Button
                      icon={<LinkOutlined />}
                      href={selectedProject.demo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={selectedProject.demo.disabledReason || undefined}
                    >
                      在线演示
                    </Button>
                  )}
                </Space>
              </Space>
            </ModalContent>
          )}
        </Modal>
      </ContentWrapper>
    </Container>
  );
};

export default Projects;
