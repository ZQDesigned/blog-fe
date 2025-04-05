import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { HomeData, HomeContentItem } from '../../types/types';
import { useTitle } from '../../hooks/useTitle';
import { homeApi } from '../../services/api';
import { useDedupeRequest } from '../../hooks/useDedupeRequest';
import HomeBanner from './components/HomeBanner';
import HomeFeatures from './components/HomeFeatures';
import HomeSkills from './components/HomeSkills';
import HomeTimeline from './components/HomeTimeline';
import HomeContact from './components/HomeContact';
import PageLoading from '../../components/PageLoading';

const LoadingContainer = styled.div`
  min-height: calc(100vh - 64px);
`;

const Home: React.FC = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const dedupe = useDedupeRequest();

  // 使用 useTitle hook，设置首页标题
  useTitle('首页', { restoreOnUnmount: true });

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        setLoading(true);
        const data: HomeData = await dedupe('home-content', () => homeApi.getContent());


        setHomeData(data);

        // 更新页面标题和描述
        if (data.meta) {
          document.title = `${data.meta.title} - ${import.meta.env.VITE_APP_TITLE}`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.meta.description);
          }
        }
      } catch (error) {
        console.error('Failed to load home content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeContent();
  }, [dedupe]);

  // 渲染内容区块
  const renderSection = (section: HomeContentItem) => {
    switch (section.type) {
      case 'banner':
        return <HomeBanner key="banner" data={section} />;
      case 'features':
        return <HomeFeatures key="features" data={section} />;
      case 'skills':
        return <HomeSkills key="skills" data={section} />;
      case 'timeline':
        return <HomeTimeline key="timeline" data={section} />;
      case 'contact':
        return <HomeContact key="contact" data={section} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <PageLoading tip="正在加载首页内容" />
      </LoadingContainer>
    );
  }

  if (!homeData) {
    return null;
  }

  return (
    <>
      {homeData.sections.map((section) => renderSection(section))}
    </>
  );
};

export default Home;
