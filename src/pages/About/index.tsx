import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import styled from '@emotion/styled';
import { globalStyles } from '../../styles/theme';
import { useTitle } from '../../hooks/useTitle';
import { aboutApi } from '../../services/api';
import { AboutMeData, AboutSectionItem } from '../../types/types';
import PageLoading from '../../components/PageLoading';
import { useDedupeRequest } from '../../hooks/useDedupeRequest';
import { mockAboutData } from '../../mock/aboutData';
import ProfileSection from './components/ProfileSection';
import SkillsSection from './components/SkillsSection';
import JourneySection from './components/JourneySection';
import ContactSection from './components/ContactSection';
import CustomSection from './components/CustomSection';

const { Title } = Typography;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: ${globalStyles.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ContentWrapper = styled.div`
  width: 100%;
`;

const LoadingContainer = styled.div`
  min-height: calc(100vh - 64px);
`;

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutMeData | null>(null);
  const [loading, setLoading] = useState(true);
  const dedupe = useDedupeRequest();

  // 设置关于页面标题
  useTitle('关于我', { restoreOnUnmount: true });

  // 加载数据
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        setLoading(true);

        const data = await dedupe('about-data', () => aboutApi.getAboutMe());

        setAboutData(data);

      } catch (error) {
        console.error('Failed to load about data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, [dedupe]);

  // 渲染内容区块
  const renderSection = (section: AboutSectionItem, index: number) => {
    const delay = index * 0.2; // 为每个区块设置不同的延迟以实现动画效果

    switch (section.type) {
      case 'profile':
        return <ProfileSection key={`profile-${index}`} data={section} delay={delay} />;
      case 'skills':
        return <SkillsSection key={`skills-${index}`} data={section} delay={delay} />;
      case 'journey':
        return <JourneySection key={`journey-${index}`} data={section} delay={delay} />;
      case 'contact':
        return <ContactSection key={`contact-${index}`} items={section.contact.items} />;
      case 'custom':
        return (
          <CustomSection
            key={`custom-${index}`}
            title={section.title}
            content={section.custom.description}
            type={section.custom.blockType}
            items={section.custom.items}
            delay={delay}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <PageLoading tip="正在加载个人信息" />
      </LoadingContainer>
    );
  }

  if (!aboutData) {
    return null;
  }

  return (
    <Container>
      <ContentWrapper>
        {aboutData.sections.map((section, index) => renderSection(section, index))}
      </ContentWrapper>
    </Container>
  );
};

export default About;
