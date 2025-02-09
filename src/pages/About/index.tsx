import React, { useState } from 'react';
import { Typography, Card, Space, Modal } from 'antd';
import {
  MailOutlined,
  GithubOutlined,
  QqOutlined,
  WechatOutlined,
  EnvironmentOutlined,
  BookOutlined,
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { globalStyles } from '../../styles/theme';

const { Title, Paragraph, Text, Link } = Typography;

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

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.sm};
  margin: ${globalStyles.spacing.sm} 0;
`;

const ContactCard = styled(Card)`
  margin-top: ${globalStyles.spacing.xl};
  box-shadow: ${globalStyles.shadows.small};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${globalStyles.shadows.medium};
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.md};
  padding: ${globalStyles.spacing.md} 0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${globalStyles.colors.primary};
  }

  .anticon {
    font-size: 24px;
  }
`;

const QRCodeImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
`;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const About: React.FC = () => {
  const [isWechatModalVisible, setIsWechatModalVisible] = useState(false);

  const showWechatModal = () => {
    setIsWechatModalVisible(true);
  };

  return (
    <Container>
      <ContentWrapper>
        <StyledCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
        >
          <Title level={2}>关于我</Title>
          <Paragraph>
            👋 你好，我是 <strong>ZQDesigned</strong>，一名专注于 <strong>全栈开发 & 游戏开发</strong> 的工程师。
            我热爱技术，擅长 <strong>Spring Boot 后端开发、Kotlin 移动端开发、云原生架构</strong>，同时也在探索 <strong>Unity + xLua</strong> 进行游戏开发。
            这里是我的个人空间，记录我的思考、成长与项目经验。欢迎交流！
          </Paragraph>

          <Title level={3}>教育背景</Title>
          <ContactInfo>
            <BookOutlined />
            <Text>合肥工业大学 - 地球信息科学与技术 - 本科</Text>
          </ContactInfo>
          <ContactInfo>
            <EnvironmentOutlined />
            <Text>中国 安徽</Text>
          </ContactInfo>
          <Paragraph style={{ marginTop: globalStyles.spacing.sm }}>
            ⚡ 自学 & 实践驱动的开发者<br />
            🎓 热爱探索新技术，持续学习并追求卓越
          </Paragraph>
        </StyledCard>

        <StyledCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Title level={3}>专业技能</Title>
          <Space direction="vertical" size="middle">
            <div>
              <Text strong>后端开发</Text>
              <Paragraph>
                Java • Kotlin • Spring Boot • gRPC • MySQL • PostgreSQL
              </Paragraph>
            </div>
            <div>
              <Text strong>移动端 & 全栈</Text>
              <Paragraph>
                Android • Kotlin • Flutter • TypeScript
              </Paragraph>
            </div>
            <div>
              <Text strong>游戏开发</Text>
              <Paragraph>
                Unity • xLua
              </Paragraph>
            </div>
            <div>
              <Text strong>工具 & 云原生</Text>
              <Paragraph>
                Docker • Kubernetes • GitHub Actions • JetBrains IDE
              </Paragraph>
            </div>
          </Space>
        </StyledCard>

        <StyledCard
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Title level={3}>旅程</Title>
          <Paragraph>
            🌍 旅途仍在继续，探索从未止步。<br />
            🔭 我追逐技术的光，穿梭于代码的星海。<br />
            🛠️ 未来可期，愿与你共创更精彩的世界。
          </Paragraph>
        </StyledCard>

        <ContactCard title="联系方式">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Link href="https://github.com/ZQDesigned" target="_blank">
              <ContactItem>
                <GithubOutlined />
                <span>GitHub: ZQDesigned</span>
              </ContactItem>
            </Link>
            <Link href="mailto:zqdesigned@mail.lnyynet.com">
              <ContactItem>
                <MailOutlined />
                <span>zqdesigned@mail.lnyynet.com</span>
              </ContactItem>
            </Link>
            <ContactItem>
              <QqOutlined />
              <span>QQ: 2990918167</span>
            </ContactItem>
            <ContactItem onClick={showWechatModal}>
              <WechatOutlined />
              <span>微信：点击查看二维码</span>
            </ContactItem>
          </Space>
        </ContactCard>
      </ContentWrapper>

      <Modal
        title="微信二维码"
        open={isWechatModalVisible}
        onCancel={() => setIsWechatModalVisible(false)}
        footer={null}
      >
        <QRCodeImage
          src="/wechat-qr.jpg"
          alt="微信二维码"
          loading="lazy"
        />
      </Modal>
    </Container>
  );
};

export default About;
