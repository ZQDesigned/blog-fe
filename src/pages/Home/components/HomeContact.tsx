import React from 'react';
import { Typography, Card } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { HomeContact as HomeContactType } from '../../../types/types';
import { globalStyles } from '../../../styles/theme';
import * as Icons from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const SectionContainer = styled.div`
  padding: ${globalStyles.spacing.xl} 0;
  background: ${globalStyles.colors.background};
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${globalStyles.spacing.lg};
  margin-top: ${globalStyles.spacing.xl};
`;

const ContactCard = styled(motion(Card))`
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${globalStyles.shadows.medium};
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5em;
  color: ${globalStyles.colors.primary};
  margin-bottom: ${globalStyles.spacing.md};
`;

const ContactType = styled(Title)`
  margin-bottom: ${globalStyles.spacing.sm} !important;
`;

const ContactValue = styled(Paragraph)`
  color: ${globalStyles.colors.lightText};
  margin-bottom: 0 !important;
`;

interface HomeContactProps {
  data: HomeContactType;
}

const HomeContact: React.FC<HomeContactProps> = ({ data }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const handleClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <SectionContainer>
      <Content>
        <Header>
          <SectionTitle level={2}>{data.title}</SectionTitle>
          <SectionDescription>{data.description}</SectionDescription>
        </Header>

        <ContactGrid>
          {data.contactItems.map((item, index) => (
            <ContactCard
              key={index}
              onClick={() => handleClick(item.link)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <IconWrapper>{getIcon(item.icon)}</IconWrapper>
              <ContactType level={4}>{item.type}</ContactType>
              <ContactValue copyable={!item.link}>{item.value}</ContactValue>
            </ContactCard>
          ))}
        </ContactGrid>
      </Content>
    </SectionContainer>
  );
};

export default HomeContact; 