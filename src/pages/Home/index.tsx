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

  @media (max-width: 768px) {
    padding: ${globalStyles.spacing.xl} ${globalStyles.spacing.lg} ${globalStyles.spacing.md};
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
`;

const StyledCard = styled(motion(Card))`
  margin-bottom: ${globalStyles.spacing.lg};
  border-radius: 8px;
  box-shadow: ${globalStyles.shadows.small};

  @media (max-width: 768px) {
    margin-bottom: ${globalStyles.spacing.md};
  }
`;

const WelcomeSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.xl};
  margin-bottom: ${globalStyles.spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${globalStyles.spacing.md};
    margin-bottom: ${globalStyles.spacing.lg};
    padding: 0 ${globalStyles.spacing.sm};
  }
`;

const WelcomeContent = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;

    h1 {
      font-size: 24px !important;
      margin-bottom: ${globalStyles.spacing.md} !important;
    }
  }
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

  @media (max-width: 768px) {
    display: none;
  }
`;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TechStackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${globalStyles.spacing.sm};

  @media (max-width: 768px) {
    gap: ${globalStyles.spacing.xs};
  }
`;

const TechStackItem = styled.div`
  margin-bottom: 0;

  strong {
    display: block;
    margin-bottom: ${globalStyles.spacing.xs};
  }

  .ant-typography {
    margin-bottom: 0;
  }

  &:not(:last-child) {
    margin-bottom: ${globalStyles.spacing.sm};
  }

  @media (max-width: 768px) {
    &:not(:last-child) {
      margin-bottom: ${globalStyles.spacing.xs};
    }
  }
`;

const Home: React.FC = () => {
  return (
    <Container>
      <WelcomeSection>
        <WelcomeContent>
          <Title>👋 你好，欢迎来到我的个人主页！</Title>
          <Paragraph>
            👋 你好，我是 <strong>ZQDesigned</strong>，一名热衷于技术创新的 <strong>全栈 & 游戏开发者</strong>。
            我专注于 <strong>Spring Boot 后端开发、Kotlin 移动端开发、云原生架构</strong>，同时也在探索 <strong>Unity + xLua 的游戏开发</strong>。
            这里是我的个人空间，记录我的成长、思考和项目经验。欢迎交流！
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
            <Title level={2}>👨‍💻 关于我</Title>
            <Paragraph>
              我是一名充满热情的全栈开发者，专注于创建优秀的应用程序和游戏。
              我热爱编程，享受将创意转化为现实的过程，同时也乐于探索新技术和分享经验。
            </Paragraph>
          </StyledCard>

          <StyledCard
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Title level={3}>🚀 技术栈</Title>
            <TechStackList>
              <TechStackItem>
                <strong>后端开发</strong>
                <Paragraph>
                  Java • Kotlin • Spring Boot • gRPC • MySQL • PostgreSQL
                </Paragraph>
              </TechStackItem>
              <TechStackItem>
                <strong>移动端 & 全栈</strong>
                <Paragraph>
                  Android • Kotlin • Flutter • TypeScript
                </Paragraph>
              </TechStackItem>
              <TechStackItem>
                <strong>游戏开发</strong>
                <Paragraph>
                  Unity • xLua
                </Paragraph>
              </TechStackItem>
              <TechStackItem>
                <strong>工具 & 云原生</strong>
                <Paragraph>
                  Docker • Kubernetes • GitHub Actions • JetBrains IDE
                </Paragraph>
              </TechStackItem>
            </TechStackList>
          </StyledCard>

          <StyledCard
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Title level={3}>✨ 旅程</Title>
            <Paragraph>
              🌍 旅途仍在继续，探索从未止步。<br />
              🔭 我追逐技术的光，穿梭于代码的星海。<br />
              🛠️ 未来可期，愿与你共创更精彩的世界。
            </Paragraph>
          </StyledCard>
        </Space>
      </ContentWrapper>
    </Container>
  );
};

export default Home;
