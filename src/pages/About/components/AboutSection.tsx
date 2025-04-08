import React, { ReactNode } from 'react';
import { Card, Typography } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { globalStyles } from '../../../styles/theme';

const { Title } = Typography;

interface AboutSectionProps {
  title: string;
  children: ReactNode;
  delay?: number;
}

const StyledCard = styled(motion(Card))`
  margin-bottom: ${globalStyles.spacing.lg};
  border-radius: 8px;
  box-shadow: ${globalStyles.shadows.small};
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