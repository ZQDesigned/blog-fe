import React, { useMemo, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Card, Typography, Space, Tag, Spin, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { themeVars, withThemeAlpha } from '../../theme';
import LazyImage from '../LazyImage';
import { useWeather } from '../../hooks/useWeather';
import { formatDate } from '../../utils/dateUtils';
import { FloatSidebarData } from '../../types/types';
import { homeApi } from '../../services/api';
import { useDedupeRequest } from '../../hooks/useDedupeRequest';
import { getFullResourceUrl } from '../../utils/request';

const { Title, Paragraph } = Typography;

const SidebarContainer = styled(motion.div)`
  position: fixed;
  right: 0;
  top: calc(64px + ${themeVars.spacing.xl});
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${themeVars.spacing.lg};
  z-index: 1;
  padding-right: ${themeVars.spacing.xl};

  @media (max-width: 1500px) {
    display: none;
  }
`;

const SidebarTrigger = styled(motion.div)`
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 8px;
  background: ${themeVars.colors.primaryA20};
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  z-index: 1;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${themeVars.colors.primaryA40},
      transparent
    );
    animation: wave 3s ease-in-out infinite;
    transform-origin: center;
  }

  @keyframes wave {
    0% {
      transform: translateX(-100%) scaleY(1);
    }
    50% {
      transform: translateX(0%) scaleY(1.2);
    }
    100% {
      transform: translateX(100%) scaleY(1);
    }
  }

  @media (max-width: 1500px) {
    display: none;
  }
`;

const StyledCard = styled(Card)`
  box-shadow: ${themeVars.shadows.small};
  border-radius: 8px;
  background: ${withThemeAlpha(themeVars.colors.onPrimary, 0.9)};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const ProfileCard = styled(StyledCard)`
  .ant-card-body {
    padding: 0;
  }
`;

const ProfileHeader = styled.div`
  padding: ${themeVars.spacing.sm} ${themeVars.spacing.md};
  text-align: center;
  border-bottom: 1px solid ${themeVars.colors.border};
`;

const ProfileContent = styled.div`
  padding: ${themeVars.spacing.md};
`;

const OnlineStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeVars.spacing.xs};
  margin-top: ${themeVars.spacing.xs};
  color: ${themeVars.colors.lightText};
  font-size: 14px;
  justify-content: center;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${themeVars.colors.success};
`;

const WeatherCard = styled(StyledCard)`
  .ant-card-body {
    padding: ${themeVars.spacing.md};
  }
`;

const WeatherInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeVars.spacing.sm};
`;

const WeatherRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${themeVars.colors.text};
`;

const WeatherError = styled.div`
  color: ${themeVars.colors.lightText};
  text-align: center;
  padding: ${themeVars.spacing.md};
`;

const KeyboardShortcut = styled.span`
  kbd {
    display: inline-block;
    padding: 2px 4px;
    font-size: 12px;
    font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
    line-height: 1;
    color: ${themeVars.colors.text};
    background-color: ${themeVars.colors.secondary};
    border: 1px solid ${themeVars.colors.border};
    border-radius: 3px;
    box-shadow: 0 1px 1px ${withThemeAlpha(themeVars.colors.text, 0.2)};
    margin: 0 2px;
  }
`;

const WeatherTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeVars.spacing.xs};

  .weather-tip {
    color: ${themeVars.colors.lightText};
    cursor: help;
    font-size: 14px;

    &:hover {
      color: ${themeVars.colors.primary};
    }
  }
`;

const FloatSidebar: React.FC = () => {
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [sidebarData, setSidebarData] = useState<FloatSidebarData | null>(null);
  const [loading, setLoading] = useState(true);
  const dedupe = useDedupeRequest();

  // 检测操作系统
  const isMacOS = useMemo(() => {
    return navigator.platform.toLowerCase().includes('mac');
  }, []);

  // 根据操作系统生成刷新快捷键提示
  const refreshShortcut = useMemo(() => {
    if (isMacOS) {
      return (
        <KeyboardShortcut>
          <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd>
        </KeyboardShortcut>
      );
    }
    return (
      <KeyboardShortcut>
        <kbd>Ctrl</kbd> + <kbd>F5</kbd>
      </KeyboardShortcut>
    );
  }, [isMacOS]);

  // 加载侧边栏数据
  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        setLoading(true);
        const data = await dedupe('sidebar-data', () => homeApi.getSidebarData());
        setSidebarData(data);
      } catch (error) {
        console.error('Failed to load sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSidebarData();
  }, [dedupe]);

  // 处理鼠标进入触发区域
  useEffect(() => {
    let timeoutId: number;
    if (isHovering) {
      timeoutId = window.setTimeout(() => {
        setIsExpanded(true);
      }, 200);
    } else {
      timeoutId = window.setTimeout(() => {
        setIsExpanded(false);
      }, 300);
    }
    return () => window.clearTimeout(timeoutId);
  }, [isHovering]);

  const renderWeatherContent = () => {
    if (weatherLoading) {
      return (
        <div style={{ textAlign: 'center', padding: themeVars.spacing.md }}>
          <Spin size="small" />
        </div>
      );
    }

    if (weatherError) {
      return <WeatherError>{weatherError}</WeatherError>;
    }

    if (!weather) {
      return <WeatherError>暂无天气数据</WeatherError>;
    }

    return (
      <WeatherInfo>
        <WeatherRow>
          <span>{formatDate(new Date(weather.updateTime).getTime())}</span>
        </WeatherRow>
        <WeatherRow>
          <span>温度 {weather.temp}°C</span>
          <span>湿度 {weather.humidity}%</span>
        </WeatherRow>
        <WeatherRow>
          <span>{weather.text}/{weather.windDir}</span>
          <span>{weather.city}</span>
        </WeatherRow>
      </WeatherInfo>
    );
  };

  if (loading || !sidebarData) {
    return null;
  }

  return (
    <>
      <SidebarTrigger
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />
      <AnimatePresence>
        {(isExpanded || isHovering) && (
          <SidebarContainer
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <ProfileCard>
              <ProfileHeader>
                <LazyImage
                  src={getFullResourceUrl(sidebarData.profile.avatar)}
                  alt="头像"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    margin: '0 auto',
                  }}
                />
                <Title level={4} style={{ marginTop: themeVars.spacing.sm, marginBottom: 0 }}>
                  {sidebarData.profile.name}
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {sidebarData.profile.bio}
                </Paragraph>
                <OnlineStatus>
                  <StatusDot
                    style={{
                      backgroundColor: sidebarData.profile.status.online
                        ? themeVars.colors.success
                        : themeVars.colors.error,
                    }}
                  />
                  <span>{sidebarData.profile.status.text}</span>
                </OnlineStatus>
              </ProfileHeader>
              <ProfileContent>
                <Space direction="vertical" size="small">
                  <Tag
                    style={{
                      color: themeVars.colors.primary,
                      borderColor: withThemeAlpha(themeVars.colors.primary, 0.35),
                      background: withThemeAlpha(themeVars.colors.primary, 0.1),
                    }}
                  >
                    公告
                  </Tag>
                  {sidebarData.announcements.map((announcement, index) => (
                    announcement.type === 'link' ? (
                      <Paragraph key={index}>
                        {announcement.title}：<a href={announcement.link}>{announcement.content}</a>
                      </Paragraph>
                    ) : (
                      <Paragraph key={index}>
                        {announcement.title} {announcement.content}
                      </Paragraph>
                    )
                  ))}
                  <Paragraph>
                    🖱️ 页面异常？ 尝试 {refreshShortcut}
                  </Paragraph>
                  <Paragraph>
                    📧 如需联系：<a href={`mailto:${sidebarData.contact.email}`}>发送邮件📨</a>
                  </Paragraph>
                </Space>
              </ProfileContent>
            </ProfileCard>

            {sidebarData.settings.showWeather && (
              <WeatherCard 
                title={
                  <WeatherTitle>
                    天气
                    <Tooltip title="此位置基于您的 IP，可能存在错误">
                      <QuestionCircleOutlined className="weather-tip" />
                    </Tooltip>
                  </WeatherTitle>
                }
              >
                {renderWeatherContent()}
              </WeatherCard>
            )}
          </SidebarContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatSidebar;
