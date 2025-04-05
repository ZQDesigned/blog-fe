import React from 'react';
import { Card, Typography } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { HomeFeature } from '../../../types/types';
import { globalStyles } from '../../../styles/theme';
import * as Icons from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const SectionContainer = styled.div`
  padding: ${globalStyles.spacing.xl} 0;
  background: #fff;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${globalStyles.spacing.lg};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${globalStyles.spacing.xl};
`;

const SectionTitle = styled(Title)`
  margin-bottom: ${globalStyles.spacing.md} !important;
`;

const SectionDescription = styled(Paragraph)`
  font-size: 1.2em;
  color: ${globalStyles.colors.lightText};
  max-width: 600px;
  margin: 0 auto !important;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${globalStyles.spacing.lg};
  margin-top: ${globalStyles.spacing.xl};
`;

const FeatureCard = styled(motion(Card))`
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${globalStyles.shadows.medium};
  }
`;

const IconWrapper = styled.div`
  font-size: 2em;
  color: ${globalStyles.colors.primary};
  margin-bottom: ${globalStyles.spacing.md};
`;

interface HomeFeaturesProps {
  data: HomeFeature;
}

const HomeFeatures: React.FC<HomeFeaturesProps> = ({ data }) => {
  // 动态获取图标组件
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <SectionContainer>
      <Content>
        <Header>
          <SectionTitle level={2}>{data.title}</SectionTitle>
          <SectionDescription>{data.description}</SectionDescription>
        </Header>

        <FeaturesGrid>
          {data.items.map((feature, index) => (
            <FeatureCard
              key={index}
              onClick={() => feature.link && window.open(feature.link, '_blank')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <IconWrapper>
                {getIcon(feature.icon)}
              </IconWrapper>
              <Title level={4}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Content>
    </SectionContainer>
  );
};

export default HomeFeatures; 