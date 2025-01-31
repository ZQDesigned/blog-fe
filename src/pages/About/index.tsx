import React, { useState } from 'react';
import { Typography, Card, Timeline, Space, Modal } from 'antd';
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
            你好！我是一名充满热情的全栈开发工程师，专注于创建优秀的 Web 应用程序。
            我热爱编程，享受将创意转化为现实的过程。
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
              <Text strong>前端开发</Text>
              <Paragraph>
                精通 React、TypeScript、Vue.js 等现代前端技术，
                具有丰富的响应式设计和性能优化经验。
              </Paragraph>
            </div>
            <div>
              <Text strong>后端开发</Text>
              <Paragraph>
                熟练使用 Node.js、Python、Java 进行后端开发，
                具有数据库设计和 API 开发经验。
              </Paragraph>
            </div>
            <div>
              <Text strong>开发工具</Text>
              <Paragraph>
                熟练使用 Git、Docker、Webpack 等开发工具，
                具有 CI/CD 流程搭建经验。
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
          <Title level={3}>工作经历</Title>
          <Timeline
            items={[
              {
                color: 'blue',
                children: (
                  <>
                    <Text strong>全栈开发工程师 @ XXX公司</Text>
                    <br />
                    <Text type="secondary">2022年 - 至今</Text>
                    <Paragraph>
                      负责公司核心产品的前端开发和维护工作，
                      参与后端 API 设计和开发。
                    </Paragraph>
                  </>
                ),
              },
              {
                color: 'blue',
                children: (
                  <>
                    <Text strong>前端开发实习生 @ YYY公司</Text>
                    <br />
                    <Text type="secondary">2021年 - 2022年</Text>
                    <Paragraph>
                      参与公司电商平台的前端开发工作，
                      负责实现新功能和优化用户体验。
                    </Paragraph>
                  </>
                ),
              },
            ]}
          />
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
