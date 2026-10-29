import React, { ReactNode } from 'react';
import { Card, Typography } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { themeVars } from '../../../theme';

const { Title } = Typography;

interface AboutSectionProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

const StyledCard = styled(motion(Card))`
  min-width: 0;
  .ant-card-body { padding: clamp(16px, 3vw, 24px); }
  h3.ant-typography { font-family: ${themeVars.typography.fontFamilyHeading}; font-weight: 400; font-size: 28px; }
  margin-bottom: ${themeVars.spacing.lg};
  border-radius: 8px;
  box-shadow: ${themeVars.shadows.small};
`;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutSection: React.FC<AboutSectionProps> = ({ 
  title, 
  children, 
  delay = 0 
}) => {
  return (
    <StyledCard
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay }}
    >
      <Title level={3}>{title}</Title>
      {children}
    </StyledCard>
  );
};

export default AboutSection;
