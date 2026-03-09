import React from 'react';
import { Button, Space } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { HomeBanner as HomeBannerType } from '../../../types/types';
import { themeVars, withThemeAlpha } from '../../../theme';
import * as Icons from '@ant-design/icons';
import { getFullResourceUrl } from '../../../utils/request';

const BannerContainer = styled.div<{ $backgroundImage?: string }>`
  width: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${themeVars.spacing.xl};
  background: ${props => props.$backgroundImage 
    ? `linear-gradient(rgba(0, 0, 0, 0.00), rgba(0, 0, 0, 0.00)), url(${getFullResourceUrl(props.$backgroundImage)})`
    : themeVars.colors.secondary};
  background-size: cover;
  background-position: center;
  color: ${props => props.$backgroundImage ? themeVars.colors.text : themeVars.colors.text};

  @media (max-width: 768px) {
    min-height: 400px;
    padding: ${themeVars.spacing.lg};
  }
`;

const Content = styled(motion.div)`
  max-width: 800px;
  text-align: center;
  padding: ${themeVars.spacing.xl};
  border-radius: ${themeVars.borderRadius.large};
  background: ${withThemeAlpha(themeVars.colors.onPrimary, 0.3)};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 8px 32px 0 ${withThemeAlpha(themeVars.colors.primaryActive, 0.15)};
  border: 1px solid ${withThemeAlpha(themeVars.colors.onPrimary, 0.18)};
  
  @supports not (backdrop-filter: blur(20px)) {
    background: ${withThemeAlpha(themeVars.colors.onPrimary, 0.9)};
  }
`;

const Title = styled(motion.h1)`
  font-size: 3em;
  margin-bottom: ${themeVars.spacing.md};
  color: ${themeVars.colors.text};
  font-weight: 600;
  text-shadow: 0 2px 4px ${withThemeAlpha(themeVars.colors.text, 0.1)};

  @media (max-width: 768px) {
    font-size: 2em;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5em;
  margin-bottom: ${themeVars.spacing.lg};
  color: ${themeVars.colors.text};
  opacity: 0.9;
  font-weight: 500;
  text-shadow: 0 1px 2px ${withThemeAlpha(themeVars.colors.text, 0.1)};

  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.2em;
  margin-bottom: ${themeVars.spacing.xl};
  color: ${themeVars.colors.text};
  opacity: 0.85;
  line-height: 1.6;
  text-shadow: 0 1px 1px ${withThemeAlpha(themeVars.colors.text, 0.05)};

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const ButtonContainer = styled(motion.div)`
  .ant-btn {
    backdrop-filter: blur(8px);
    border: 1px solid ${withThemeAlpha(themeVars.colors.onPrimary, 0.3)};
    transition: all 0.3s ease;
    
    &:not(.ant-btn-primary) {
      background: ${withThemeAlpha(themeVars.colors.onPrimary, 0.5)};
      
      &:hover {
        background: ${withThemeAlpha(themeVars.colors.onPrimary, 0.8)};
        transform: translateY(-2px);
      }
    }
    
    &.ant-btn-primary {
      background: ${themeVars.colors.primaryAcc};
      
      &:hover {
        background: ${themeVars.colors.primary};
        transform: translateY(-2px);
      }
    }
  }
`;

interface HomeBannerProps {
  data: HomeBannerType;
}

const HomeBanner: React.FC<HomeBannerProps> = ({ data }) => {
  // 动态获取图标组件
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <BannerContainer $backgroundImage={data.banner.backgroundImage}>
      <Content
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {data.title}
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {data.banner.subtitle}
        </Subtitle>
        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {data.description}
        </Description>
        {data.banner.buttons && (
          <ButtonContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Space size="large">
              {data.banner.buttons.map((button, index) => (
                <Button
                  key={index}
                  type={button.type || 'default'}
                  icon={button.icon && getIcon(button.icon)}
                  href={button.link}
                  size="large"
                >
                  {button.text}
                </Button>
              ))}
            </Space>
          </ButtonContainer>
        )}
      </Content>
    </BannerContainer>
  );
};

export default HomeBanner;
