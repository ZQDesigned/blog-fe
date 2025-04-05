import React from 'react';
import { Typography, Progress, Tooltip } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { HomeSkills as HomeSkillsType } from '../../../types/types';
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

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${globalStyles.spacing.xl};
`;

const CategoryContainer = styled(motion.div)`
  background: #fff;
  padding: ${globalStyles.spacing.lg};
  border-radius: ${globalStyles.borderRadius.medium};
  box-shadow: ${globalStyles.shadows.small};
  transition: all ${globalStyles.transitions.default};

  &:hover {
    box-shadow: ${globalStyles.shadows.medium};
    transform: translateY(-2px);
  }
`;

const CategoryTitle = styled(Title)`
  margin-bottom: ${globalStyles.spacing.lg} !important;
  text-align: center;
`;

const SkillItem = styled.div`
  margin-bottom: ${globalStyles.spacing.md};
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${globalStyles.spacing.sm};
`;

const IconWrapper = styled.div`
  margin-right: ${globalStyles.spacing.sm};
  font-size: 1.2em;
  color: ${globalStyles.colors.primary};
`;

interface HomeSkillsProps {
  data: HomeSkillsType;
}

const HomeSkills: React.FC<HomeSkillsProps> = ({ data }) => {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
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

        <SkillsGrid>
          {data.categories.map((category, categoryIndex) => (
            <CategoryContainer
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <CategoryTitle level={3}>{category.name}</CategoryTitle>
              {category.items.map((skill, skillIndex) => (
                <SkillItem key={skillIndex}>
                  <SkillHeader>
                    {skill.icon && (
                      <IconWrapper>{getIcon(skill.icon)}</IconWrapper>
                    )}
                    <Title level={5} style={{ margin: 0 }}>
                      {skill.name}
                    </Title>
                  </SkillHeader>
                  <Tooltip title={skill.description}>
                    <Progress
                      percent={skill.level * 20}
                      strokeColor={globalStyles.colors.primary}
                      showInfo={false}
                    />
                  </Tooltip>
                </SkillItem>
              ))}
            </CategoryContainer>
          ))}
        </SkillsGrid>
      </Content>
    </SectionContainer>
  );
};

export default HomeSkills; 