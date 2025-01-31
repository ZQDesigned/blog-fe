import React, { useState } from 'react';
import { Card, Typography, Space, Tag, Modal, Button, Tooltip } from 'antd';
import { GithubOutlined, GlobalOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { globalStyles } from '../../styles/theme';

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

interface ProjectLink {
  url: string;
  disabled?: boolean;
  disabledReason?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  github?: ProjectLink;
  demo?: ProjectLink;
  status: 'developing' | 'maintaining' | 'paused';
  details: {
    features: string[];
    techStack: string[];
  };
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: '个人博客系统',
    description: '基于 React + TypeScript + Ant Design 开发的个人博客系统，支持文章管理、标签分类、评论等功能。',
    tags: ['React', 'TypeScript', 'Ant Design'],
    image: 'https://via.placeholder.com/300x200',
    github: {
      url: 'https://github.com/yourusername/blog'
    },
    demo: {
      url: 'https://blog.yourdomain.com'
    },
    status: 'maintaining',
    details: {
      features: [
        '响应式设计，支持多端适配',
        '文章管理系统',
        '评论系统',
        '数据统计分析',
      ],
      techStack: [
        'React',
        'TypeScript',
        'Ant Design',
        'MongoDB',
      ],
    },
  },
  {
    id: 2,
    title: '在线笔记应用',
    description: '一个支持 Markdown 编辑的在线笔记应用，具有实时保存、标签管理、笔记分享等功能。',
    tags: ['Vue', 'Node.js', 'MongoDB'],
    image: 'https://via.placeholder.com/300x200',
    github: {
      url: 'https://github.com/yourusername/notes',
      disabled: true,
      disabledReason: '代码整理中，暂不开放'
    },
    demo: {
      url: 'https://notes.yourdomain.com',
      disabled: true,
      disabledReason: '演示环境部署中'
    },
    status: 'developing',
    details: {
      features: [
        '实时协作编辑',
        '历史版本管理',
        '权限控制',
        '实时聊天',
      ],
      techStack: [
        'Vue',
        'Node.js',
        'MongoDB',
      ],
    },
  },
  {
    id: 3,
    title: '天气预报小程序',
    description: '基于微信小程序开发的天气预报应用，支持多城市天气查询、天气预警、生活指数等功能。',
    tags: ['微信小程序', 'JavaScript'],
    image: 'https://via.placeholder.com/300x200',
    github: {
      url: 'https://github.com/yourusername/weather',
      disabled: true,
      disabledReason: '仓库暂未开放'
    },
    status: 'paused',
    details: {
      features: [
        '实时天气查询',
        '天气预警',
        '生活指数',
      ],
      techStack: [
        '微信小程序',
        'JavaScript',
      ],
    },
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  return (
    <Container>
      <ContentWrapper>
        <Title level={2} style={{ marginBottom: globalStyles.spacing.xl }}>
          个人项目展示
        </Title>

        <ProjectGrid>
          {PROJECTS.map((project) => (
            <StyledCard
              key={project.id}
              cover={<img alt={project.title} src={project.image} />}
              onClick={() => setSelectedProject(project)}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
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
                {project.tags.map((tag) => (
                  <ProjectTag key={tag} color="blue">{tag}</ProjectTag>
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
            <>
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                style={{ width: '100%', borderRadius: '8px', marginBottom: globalStyles.spacing.md }}
              />

              <Title level={4}>项目描述</Title>
              <Paragraph>{selectedProject.description}</Paragraph>

              <Title level={4}>主要功能</Title>
              <ul>
                {selectedProject.details.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              <Title level={4}>技术栈</Title>
              <Space wrap>
                {selectedProject.details.techStack.map((tech) => (
                  <ProjectTag key={tech} color="blue">{tech}</ProjectTag>
                ))}
              </Space>

              <ProjectLinks>
                {selectedProject.github && (
                  <Tooltip title={selectedProject.github.disabled ? selectedProject.github.disabledReason : ''}>
                    <ProjectLink
                      type="primary"
                      icon={<GithubOutlined />}
                      href={selectedProject.github.disabled ? undefined : selectedProject.github.url}
                      target="_blank"
                      $disabled={selectedProject.github.disabled}
                      onClick={(e) => {
                        if (selectedProject.github?.disabled) {
                          e.preventDefault();
                        }
                      }}
                    >
                      查看源码
                    </ProjectLink>
                  </Tooltip>
                )}
                {selectedProject.demo && (
                  <Tooltip title={selectedProject.demo.disabled ? selectedProject.demo.disabledReason : ''}>
                    <ProjectLink
                      icon={<GlobalOutlined />}
                      href={selectedProject.demo.disabled ? undefined : selectedProject.demo.url}
                      target="_blank"
                      $disabled={selectedProject.demo.disabled}
                      onClick={(e) => {
                        if (selectedProject.demo?.disabled) {
                          e.preventDefault();
                        }
                      }}
                    >
                      在线演示
                    </ProjectLink>
                  </Tooltip>
                )}
              </ProjectLinks>
            </>
          )}
        </Modal>
      </ContentWrapper>
    </Container>
  );
};

export default Projects;
