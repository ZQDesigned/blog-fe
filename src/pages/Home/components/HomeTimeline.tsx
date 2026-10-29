import styled from '@emotion/styled';
import type { HomeTimeline as HomeTimelineType } from '../../../types/types';
import { themeVars } from '../../../theme';
import DynamicIcon from '../../../components/DynamicIcon';
import { GardenSection, SectionHeading } from '../../../components/Editorial';

const Entries = styled.ol`
  list-style: none;
  li { display: grid; grid-template-columns: 150px minmax(0, 1fr); gap: 32px; padding: 28px 0; border-top: 1px solid ${themeVars.colors.border}; }
  time { color: ${themeVars.colors.lightText}; font-size: 14px; }
  h3 { display: flex; align-items: baseline; gap: 12px; font-family: ${themeVars.typography.fontFamilyHeading}; font-weight: 400; font-size: 26px; margin-bottom: 10px; }
  p { color: ${themeVars.colors.lightText}; white-space: pre-line; }
  @media (max-width: 640px) { li { grid-template-columns: minmax(0, 1fr); gap: 8px; } }
`;

export default function HomeTimeline({ data }: { data: HomeTimelineType }) {
  return <GardenSection>
    <SectionHeading><h2>{data.title}</h2><p>{data.description}</p></SectionHeading>
    <Entries>{data.timelineItems.map((item, index) => <li key={index}>
      <time>{item.date}</time><div>
        <h3><span style={{ color: item.color || themeVars.colors.primary }}><DynamicIcon name={item.icon} /></span>{item.title}</h3>
        <p>{item.description}</p>
      </div>
    </li>)}</Entries>
  </GardenSection>;
}
