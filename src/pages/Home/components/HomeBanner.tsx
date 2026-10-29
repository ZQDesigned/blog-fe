import { useState } from 'react';
import { Button } from 'antd';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import type { HomeBanner as HomeBannerType } from '../../../types/types';
import { themeVars } from '../../../theme';
import { getFullResourceUrl } from '../../../utils/request';
import { requestExternalNavigation } from '../../../utils/externalNavigation';
import DynamicIcon from '../../../components/DynamicIcon';

const Banner = styled.section`
  width: min(100%, 1280px);
  margin: 0 auto;
  padding: 56px clamp(20px, 4vw, 56px);
  min-height: 660px;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: center;
  gap: clamp(24px, 4vw, 64px);
  overflow-wrap: anywhere;
  @media (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
    padding-top: 40px;
    gap: 28px;
  }
`;

const Introduction = styled.div`
  min-width: 0;
  h1 {
    font-family: ${themeVars.typography.fontFamilyHeading};
    font-size: clamp(36px, 4.6vw, 64px);
    font-weight: 400;
    line-height: 1.35;
    margin: 0 0 24px;
    white-space: pre-line;
    text-wrap: balance;
  }
  h2 { font-size: 17px; font-weight: 600; line-height: 1.8; margin: 0 0 12px; }
  .description { color: ${themeVars.colors.lightText}; line-height: 1.95; margin-bottom: 32px; white-space: pre-line; }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  .ant-btn { height: auto; min-height: 44px; padding: 10px 20px; max-width: 100%; }
  .ant-btn > span { white-space: normal; overflow-wrap: anywhere; }
`;

const Artwork = styled.figure`
  min-width: 0;
  margin: 0;
  img { display: block; width: 100%; aspect-ratio: 1.1; object-fit: cover; border-radius: 4px; }
  @media (max-width: 768px) { img { aspect-ratio: 1.4; } }
`;

export default function HomeBanner({ data }: { data: HomeBannerType }) {
  const navigate = useNavigate();
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const suppliedSource = data.banner.backgroundImage ? getFullResourceUrl(data.banner.backgroundImage) : '';
  const imageSource = suppliedSource && suppliedSource !== failedSource
    ? suppliedSource : '/images/garden-illustration.webp';

  const goTo = (link: string) => {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(link)) {
      requestExternalNavigation(link, { mode: 'same-tab', target: '_self' });
    } else { navigate(link); }
  };

  return <Banner>
    <Introduction>
      <h1>{data.title}</h1>
      {data.banner.subtitle && <h2>{data.banner.subtitle}</h2>}
      {data.description && <p className="description">{data.description}</p>}
      <Actions>{data.banner.buttons?.map((button, index) =>
        <Button key={index} type={button.type || 'default'} icon={<DynamicIcon name={button.icon} />}
          onClick={() => goTo(button.link)}>{button.text}</Button>)}</Actions>
    </Introduction>
    <Artwork>
      <img src={imageSource} alt="" aria-hidden="true" fetchPriority="high"
        onError={() => setFailedSource(suppliedSource)} />
    </Artwork>
  </Banner>;
}
