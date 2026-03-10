import React from 'react';
import { Button, ColorPicker, Drawer, Input, Typography, Space, Spin, Switch } from 'antd';
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

const PaletteGrid = styled.div`
  display: grid;
  gap: ${themeVars.spacing.sm};
`;

const PaletteItem = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, 130px) 1fr 28px;
  gap: ${themeVars.spacing.sm};
  align-items: center;
`;

const PaletteLabel = styled.label`
  color: ${themeVars.colors.text};
  font-size: 12px;
`;

const PalettePreview = styled.span<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${themeVars.borderRadius.small};
  border: 1px solid ${themeVars.colors.border};
  background: ${props => props.$color};
  cursor: pointer;
`;

const paletteFieldMeta = [
  { key: 'dotBackground', label: '点背景' },
  { key: 'dotBorder', label: '点描边' },
  { key: 'ringBorder', label: '环描边' },
  { key: 'ringHoverBorder', label: '环悬停描边' },
  { key: 'ringActiveBorder', label: '环按下描边' },
  { key: 'ringBackground', label: '环背景' },
] as const;

const isValidCssColor = (value: string): boolean => {
  if (typeof window === 'undefined' || typeof window.CSS === 'undefined') {
    return true;
  }

  return window.CSS.supports('color', value);
};

const getColorPickerValue = (value: string): string | undefined => {
  const normalized = value.trim();
  if (!normalized || !isValidCssColor(normalized)) {
    return undefined;
  }

  return normalized;
};

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
    useCustomPalette,
    setUseCustomPalette,
    palette,
    updatePalette,
    resetPaletteToSystem,
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
          <SettingRow>
            <SettingLabel>启用自定义指针色板</SettingLabel>
            <Switch
              checked={useCustomPalette}
              disabled={!isCursorSupported}
              onChange={setUseCustomPalette}
            />
          </SettingRow>
          <SettingHint>
            默认关闭，关闭时使用系统主题默认指针配色；开启后可单独配置各颜色项。
          </SettingHint>
          {useCustomPalette && (
            <>
              <PaletteGrid>
                {paletteFieldMeta.map((item) => {
                  const colorValue = palette[item.key];
                  const colorValid = isValidCssColor(colorValue);

                  return (
                    <PaletteItem key={item.key}>
                      <PaletteLabel>{item.label}</PaletteLabel>
                      <Input
                        size="small"
                        value={colorValue}
                        status={colorValid ? undefined : 'error'}
                        onChange={(event) => updatePalette(item.key, event.target.value)}
                        placeholder="支持 hex / rgb / rgba / hsl"
                      />
                      <ColorPicker
                        value={getColorPickerValue(colorValue)}
                        onChange={(_, css) => updatePalette(item.key, css)}
                      >
                        <PalettePreview $color={colorValid ? colorValue : 'transparent'} />
                      </ColorPicker>
                    </PaletteItem>
                  );
                })}
              </PaletteGrid>
              <Button size="small" onClick={resetPaletteToSystem}>
                恢复系统默认
              </Button>
            </>
          )}
        </SettingSection>
      </Space>
    </Drawer>
  );
}

export default SettingsDrawer; 
