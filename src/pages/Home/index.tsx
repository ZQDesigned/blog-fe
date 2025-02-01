import React from 'react';
import { Card, Typography, Space, Avatar } from 'antd';
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

const StyledCard = styled(motion(Card))`
  margin-bottom: ${globalStyles.spacing.lg};
  border-radius: 8px;
  box-shadow: ${globalStyles.shadows.small};
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.xl};
  margin-bottom: ${globalStyles.spacing.xl};
`;

const WelcomeContent = styled.div`
  flex: 1;
`;

const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  border: 4px solid #fff;
  box-shadow: ${globalStyles.shadows.medium};
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Home: React.FC = () => {
  return (
    <Container>
      <WelcomeSection>
        <WelcomeContent>
          <Title>你好，欢迎来到我的个人网站！</Title>
          <Paragraph>
            我是一名全栈开发工程师，热爱技术，喜欢分享。这里是我的个人空间，记录我的技术成长和思考。
          </Paragraph>
        </WelcomeContent>
        <StyledAvatar
          src="https://www.loliapi.com/acg/pp/"
          alt="头像"
        />
      </WelcomeSection>
      
      <ContentWrapper>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <StyledCard
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5 }}
          >
            <Title level={2}>👋 你好，我是...</Title>
            <Paragraph>
              一名热爱技术的全栈开发工程师，专注于 Web 开发和用户体验设计。
            </Paragraph>
          </StyledCard>

          <StyledCard
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Title level={3}>🚀 技术栈</Title>
            <Paragraph>
              <ul>
                <li>前端：React, TypeScript, Next.js, Vue.js</li>
                <li>后端：Node.js, Python, Java</li>
                <li>数据库：MongoDB, MySQL, PostgreSQL</li>
                <li>其他：Docker, AWS, Git</li>
              </ul>
            </Paragraph>
          </StyledCard>

          <StyledCard
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Title level={3}>💼 工作经历</Title>
            <Paragraph>
              <ul>
                <li>XXX 公司 - 全栈开发工程师（2022-至今）</li>
                <li>YYY 公司 - 前端开发实习生（2021-2022）</li>
              </ul>
            </Paragraph>
          </StyledCard>
        </Space>
      </ContentWrapper>
    </Container>
  );
};

export default Home; 