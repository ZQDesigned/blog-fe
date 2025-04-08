import React from 'react';
import { Typography, Card, List } from 'antd';
import styled from '@emotion/styled';
import { globalStyles } from '../../../styles/theme';
import AboutSection from './AboutSection';
import * as Icons from '@ant-design/icons';

const { Paragraph, Text } = Typography;

interface CustomSectionItem {
  title?: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  link?: string;
}

interface CustomSectionProps {
  title: string;
  content: string;
  type: 'text' | 'list' | 'cards';
  items?: CustomSectionItem[];
  delay?: number;
}

const ItemCard = styled(Card)`
  margin-bottom: ${globalStyles.spacing.sm};
  transition: all 0.3s ease;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${globalStyles.shadows.medium};
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: ${globalStyles.spacing.sm};
`;

const IconWrapper = styled.div`
  font-size: 24px;
  color: ${globalStyles.colors.primary};
  margin-right: ${globalStyles.spacing.sm};
  display: flex;
  align-items: center;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${globalStyles.spacing.md};
  margin-top: ${globalStyles.spacing.md};
`;

const CustomSection: React.FC<CustomSectionProps> = ({ 
  title, 
  content, 
  type, 
  items,
  delay = 0
}) => {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <AboutSection title={title} delay={delay}>
      <Paragraph>{content}</Paragraph>
      
      {type === 'list' && items && (
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon && <IconWrapper>{getIcon(item.icon)}</IconWrapper>}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      )}
      
      {type === 'cards' && items && (
        <CardsContainer>
          {items.map((item, index) => (
            <ItemCard 
              key={index} 
              hoverable 
              onClick={item.link ? () => window.open(item.link, '_blank') : undefined}
            >
              {item.imageUrl && <ItemImage src={item.imageUrl} alt={item.title || ''} />}
              {item.title && <Text strong>{item.title}</Text>}
              <Paragraph>{item.description}</Paragraph>
            </ItemCard>
          ))}
        </CardsContainer>
      )}
    </AboutSection>
  );
};

export default CustomSection; 