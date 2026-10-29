import { Progress, Tooltip } from 'antd';
import styled from '@emotion/styled';
import type { HomeSkills as HomeSkillsType } from '../../../types/types';
import { themeVars } from '../../../theme';
import DynamicIcon from '../../../components/DynamicIcon';
import { ContentGrid, GardenSection, SectionHeading } from '../../../components/Editorial';

const Category = styled.div`
  h3 { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; margin: 0 0 24px; color: ${themeVars.colors.primary}; }
  .skill { margin-bottom: 20px; }
  .skill-label { display: flex; gap: 10px; align-items: center; margin-bottom: 8px; }
  .skill-label .anticon { color: ${themeVars.colors.primary}; }
  .ant-progress { display: block; line-height: 1; }
`;

export default function HomeSkills({ data }: { data: HomeSkillsType }) {
  return <GardenSection>
    <SectionHeading><h2>{data.title}</h2><p>{data.description}</p></SectionHeading>
    <ContentGrid>{data.categories.map((category, index) => <Category key={index}>
      <h3>{category.name}</h3>
      {category.items.map((skill, skillIndex) => <div className="skill" key={skillIndex}>
        <div className="skill-label"><DynamicIcon name={skill.icon} /><span>{skill.name}</span></div>
        <Tooltip title={skill.description}><Progress percent={Math.max(0, Math.min(100, skill.level * 20))}
          strokeColor={themeVars.colors.primary} size="small" showInfo={false} /></Tooltip>
      </div>)}
    </Category>)}</ContentGrid>
  </GardenSection>;
}
