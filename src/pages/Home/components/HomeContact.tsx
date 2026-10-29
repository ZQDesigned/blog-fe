import styled from '@emotion/styled';
import { Typography } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import type { HomeContact as HomeContactType } from '../../../types/types';
import { themeVars } from '../../../theme';
import DynamicIcon from '../../../components/DynamicIcon';
import { ContentGrid, GardenSection, SectionHeading } from '../../../components/Editorial';

const Contact = styled.div`
  padding: 20px 0;
  border-top: 1px solid ${themeVars.colors.border};
  .label { display: flex; align-items: center; gap: 10px; color: ${themeVars.colors.primary}; font-size: 13px; margin-bottom: 12px; }
  .value { font-size: 16px; overflow-wrap: anywhere; }
  a { display: block; color: ${themeVars.colors.text}; }
  a:hover { color: ${themeVars.colors.primary}; }
  .outbound { float: right; transform: rotate(45deg); }
`;

export default function HomeContact({ data }: { data: HomeContactType }) {
  return <GardenSection>
    <SectionHeading><h2>{data.title}</h2><p>{data.description}</p></SectionHeading>
    <ContentGrid>{data.contactItems.map((item, index) => <Contact key={index}>
      <div className="label"><DynamicIcon name={item.icon} />{item.type}</div>
      {item.link ? <a className="value" href={item.link} target="_blank" rel="noopener noreferrer">
        {item.value}<ArrowUpOutlined className="outbound" /></a>
        : <Typography.Text className="value" copyable>{item.value}</Typography.Text>}
    </Contact>)}</ContentGrid>
  </GardenSection>;
}
