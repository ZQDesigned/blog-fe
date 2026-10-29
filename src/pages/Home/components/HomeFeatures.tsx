import styled from '@emotion/styled';
import { ArrowRightOutlined } from '@ant-design/icons';
import type { HomeFeature } from '../../../types/types';
import { themeVars } from '../../../theme';
import DynamicIcon from '../../../components/DynamicIcon';
import { ContentGrid, GardenSection, SectionHeading } from '../../../components/Editorial';

const Feature = styled.article`
  border-top: 1px solid ${themeVars.colors.border};
  padding: 24px 0;
  .feature-icon { display: block; color: ${themeVars.colors.primary}; font-size: 26px; min-height: 36px; margin-bottom: 20px; }
  h3 { font-family: ${themeVars.typography.fontFamilyHeading}; font-weight: 400; font-size: 26px; margin-bottom: 12px; }
  p { color: ${themeVars.colors.lightText}; line-height: 1.9; white-space: pre-line; }
  a { display: block; color: inherit; }
  a:hover h3 { color: ${themeVars.colors.primary}; }
  .entry-arrow { margin-top: 20px; color: ${themeVars.colors.primary}; }
`;

export default function HomeFeatures({ data }: { data: HomeFeature }) {
  return <GardenSection>
    <SectionHeading><h2>{data.title}</h2><p>{data.description}</p></SectionHeading>
    <ContentGrid>{data.items.map((item, index) => {
      const body = <><span className="feature-icon"><DynamicIcon name={item.icon} /></span>
        <h3>{item.title}</h3><p>{item.description}</p></>;
      return <Feature key={index}>{item.link
        ? <a href={item.link} target="_blank" rel="noopener noreferrer">{body}<ArrowRightOutlined className="entry-arrow" /></a>
        : body}</Feature>;
    })}</ContentGrid>
  </GardenSection>;
}
