import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Card, Typography, Space, Tag, Spin, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { globalStyles } from '../../styles/theme';
import LazyImage from '../LazyImage';
import { useWeather } from '../../hooks/useWeather';
import { formatDate } from '../../utils/dateUtils';

const { Title, Paragraph } = Typography;

const SidebarContainer = styled.div`
  position: fixed;
  right: ${globalStyles.spacing.xl};
  top: calc(64px + ${globalStyles.spacing.xl});
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: ${globalStyles.spacing.lg};
  z-index: 1;

  @media (max-width: 1500px) {
    display: none;
  }
`;

const StyledCard = styled(Card)`
  box-shadow: ${globalStyles.shadows.small};
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const ProfileCard = styled(StyledCard)`
  .ant-card-body {
    padding: 0;
  }
`;

const ProfileHeader = styled.div`
  padding: ${globalStyles.spacing.sm} ${globalStyles.spacing.md};
  text-align: center;
  border-bottom: 1px solid ${globalStyles.colors.border};
`;

const ProfileContent = styled.div`
  padding: ${globalStyles.spacing.md};
`;

const OnlineStatus = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.xs};
  margin-top: ${globalStyles.spacing.xs};
  color: ${globalStyles.colors.lightText};
  font-size: 14px;
  justify-content: center;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #52c41a;
`;

const WeatherCard = styled(StyledCard)`
  .ant-card-body {
    padding: ${globalStyles.spacing.md};
  }
`;

const WeatherInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${globalStyles.spacing.sm};
`;

const WeatherRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${globalStyles.colors.text};
`;

const WeatherError = styled.div`
  color: ${globalStyles.colors.lightText};
  text-align: center;
  padding: ${globalStyles.spacing.md};
`;

const KeyboardShortcut = styled.span`
  kbd {
    display: inline-block;
    padding: 2px 4px;
    font-size: 12px;
    font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
    line-height: 1;
    color: ${globalStyles.colors.text};
    background-color: ${globalStyles.colors.secondary};
    border: 1px solid ${globalStyles.colors.border};
    border-radius: 3px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin: 0 2px;
  }
`;

const WeatherTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.xs};

  .weather-tip {
    color: ${globalStyles.colors.lightText};
    cursor: help;
    font-size: 14px;

    &:hover {
      color: ${globalStyles.colors.primary};
    }
  }
`;

const FloatSidebar: React.FC = () => {
  const { weather, loading, error } = useWeather();

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

  const renderWeatherContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: globalStyles.spacing.md }}>
          <Spin size="small" />
        </div>
      );
    }

    if (error) {
      return <WeatherError>{error}</WeatherError>;
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

  return (
    <SidebarContainer>
      <ProfileCard>
        <ProfileHeader>
          <LazyImage
            src="/avatar.jpg"
            alt="头像"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              margin: '0 auto',
            }}
          />
          <Title level={4} style={{ marginTop: globalStyles.spacing.sm, marginBottom: 0 }}>
            ZQDesigned
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            分享开发历程、科技生活～
          </Paragraph>
          <OnlineStatus>
            <StatusDot />
            <span>一日之计在于晨</span>
          </OnlineStatus>
        </ProfileHeader>
        <ProfileContent>
          <Space direction="vertical" size="small">
            <Tag color="blue">公告</Tag>
            <Paragraph>
              👋 Hi, 我是 ZQDesigned！欢迎你！
            </Paragraph>
            <Paragraph>
              ❓ 有任何问题欢迎评论区交流！
            </Paragraph>
            <Paragraph>
              🖱️ 页面异常？ 尝试 {refreshShortcut}
            </Paragraph>
            <Paragraph>
              📧 如需联系：<a href="mailto:zqdesigned@mail.lnyynet.com">发送邮件📨</a>
            </Paragraph>
          </Space>
        </ProfileContent>
      </ProfileCard>

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
    </SidebarContainer>
  );
};

export default FloatSidebar;
