import React from 'react';
import { Drawer, Typography, Space, Spin, Switch } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { themeVars, withThemeAlpha } from '../../theme';
import { BackgroundType } from '../../hooks/useBackgroundSettings';
import LazyImage from '../LazyImage';
import { useCursor } from '../../cursor';

const { Title } = Typography;

const PreviewContainer = styled.div`
  display: flex;
  gap: ${themeVars.spacing.md};
  margin-top: ${themeVars.spacing.md};
  flex-direction: column;
`;

const PreviewCard = styled.div<{ $selected?: boolean }>`
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 2px solid ${props => props.$selected ? themeVars.colors.primary : 'transparent'};
  transition: all 0.3s ease;
  box-shadow: ${themeVars.shadows.small};

  &:hover {
    transform: scale(1.02);
    box-shadow: ${themeVars.shadows.medium};
  }

  @media (max-width: 768px) {
    aspect-ratio: 9/16;
  }
`;

const DefaultPreview = styled(PreviewCard)`
  background: ${themeVars.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${themeVars.colors.lightText};
  font-size: 16px;
`;

const ImagePreview = styled(PreviewCard)`
  position: relative;
`;

const RefreshButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${withThemeAlpha(themeVars.colors.onPrimary, 0.9)};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    background: ${themeVars.colors.background};
    transform: rotate(180deg);
  }
`;

const SettingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeVars.spacing.sm};
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${themeVars.spacing.md};
`;

const SettingLabel = styled.span`
  color: ${themeVars.colors.text};
  font-size: 14px;
  line-height: 1.4;
`;

const SettingHint = styled.p`
  margin: 0;
  color: ${themeVars.colors.lightText};
  font-size: 12px;
  line-height: 1.5;
`;

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  backgroundType: BackgroundType;
  backgroundUrl: string | null;
  isLoading: boolean;
  onBackgroundTypeChange: (type: BackgroundType) => void;
  onRefreshBackground: () => Promise<void>;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  open,
  onClose,
  backgroundType,
  backgroundUrl,
  isLoading,
  onBackgroundTypeChange,
  onRefreshBackground,
}) => {
  const {
    enabled: cursorEnabled,
    setEnabled: setCursorEnabled,
    isSupported: isCursorSupported,
  } = useCursor();

  return (
    <Drawer
      title="页面设置"
      placement="left"
      onClose={onClose}
      open={open}
      width={320}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>背景设置</Title>
          <PreviewContainer>
            <DefaultPreview 
              $selected={backgroundType === 'default'}
              onClick={() => onBackgroundTypeChange('default')}
            >
              默认背景
            </DefaultPreview>
            <ImagePreview 
              $selected={backgroundType === 'anime'}
              onClick={() => onBackgroundTypeChange('anime')}
            >
              {backgroundType === 'anime' && (
                <RefreshButton 
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    onRefreshBackground();
                  }}
                >
                  <ReloadOutlined />
                </RefreshButton>
              )}
              {isLoading ? (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: themeVars.colors.secondary 
                }}>
                  <Spin />
                </div>
              ) : (
                <LazyImage
                  src={backgroundUrl || 'https://www.loliapi.com/acg/'}
                  alt="动漫背景预览"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                />
              )}
            </ImagePreview>
          </PreviewContainer>
        </div>

        <SettingSection>
          <Title level={5}>鼠标样式</Title>
          <SettingRow>
            <SettingLabel>启用全局自定义鼠标</SettingLabel>
            <Switch
              checked={cursorEnabled}
              disabled={!isCursorSupported}
              onChange={setCursorEnabled}
            />
          </SettingRow>
          <SettingHint>
            {isCursorSupported
              ? '桌面端使用全局 custom cursor，刷新后仍会保留当前设置。'
              : '当前设备或系统环境不支持 custom cursor，已自动回退系统鼠标。'}
          </SettingHint>
        </SettingSection>
      </Space>
    </Drawer>
  );
}

export default SettingsDrawer; 
