import React from 'react';
import { Drawer, Typography, Space, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { globalStyles } from '../../styles/theme';
import { BackgroundType } from '../../hooks/useBackgroundSettings';
import LazyImage from '../LazyImage';

const { Title } = Typography;

const PreviewContainer = styled.div`
  display: flex;
  gap: ${globalStyles.spacing.md};
  margin-top: ${globalStyles.spacing.md};
  flex-direction: column;
`;

const PreviewCard = styled.div<{ $selected?: boolean }>`
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 2px solid ${props => props.$selected ? globalStyles.colors.primary : 'transparent'};
  transition: all 0.3s ease;
  box-shadow: ${globalStyles.shadows.small};

  &:hover {
    transform: scale(1.02);
    box-shadow: ${globalStyles.shadows.medium};
  }

  @media (max-width: 768px) {
    aspect-ratio: 9/16;
  }
`;

const DefaultPreview = styled(PreviewCard)`
  background: ${globalStyles.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${globalStyles.colors.lightText};
  font-size: 16px;
`;

const ImagePreview = styled(PreviewCard)`
  position: relative;
`;

const RefreshButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
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
    background: white;
    transform: rotate(180deg);
  }
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
                  background: globalStyles.colors.secondary 
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
      </Space>
    </Drawer>
  );
}

export default SettingsDrawer; 