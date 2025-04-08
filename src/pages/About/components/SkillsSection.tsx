import React from 'react';
import { Space, Typography, Tag } from 'antd';
import styled from '@emotion/styled';
import { AboutSkills } from '../../../types/types';
import { globalStyles } from '../../../styles/theme';
import AboutSection from './AboutSection';

const { Text, Paragraph } = Typography;

interface SkillsCategoryProps {
  name: string;
  items: string[];
}

const SkillTag = styled(Tag)`
  margin: 4px;
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 4px;
`;

const SkillsContainer = styled.div`
  margin-bottom: ${globalStyles.spacing.md};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${globalStyles.spacing.xs};
`;

interface SkillsSectionProps {
  data: AboutSkills;
  delay?: number;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ data, delay = 0 }) => {
  const { skills } = data;
  
  return (
    <AboutSection title={data.title} delay={delay}>
      {skills.categories.map((category, index) => (
        <div key={index} style={{ marginBottom: globalStyles.spacing.md }}>
          <Typography.Title level={4}>{category.name}</Typography.Title>
          <TagsContainer>
            {category.items.map((skill, skillIndex) => (
              <SkillTag key={skillIndex} color={globalStyles.colors.primary}>
                {skill}
              </SkillTag>
            ))}
          </TagsContainer>
        </div>
      ))}
    </AboutSection>
  );
};

export default SkillsSection; 