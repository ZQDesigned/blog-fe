import React, { Suspense, useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Spin, Typography } from 'antd';
import {
  HomeOutlined,
  GithubOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  ShareAltOutlined,
  ArrowRightOutlined,
  BugOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import {NAV_ITEMS, ROUTES} from '../../constants/routes';
import { themeVars, withThemeAlpha } from '../../theme';
import { useGameEasterEgg } from '../../hooks/useGameEasterEgg.tsx';
import ContextMenu from '../ContextMenu';
import { formatDate } from '../../utils/dateUtils';
import { useToast } from '../../hooks/useToast.ts';
import { useBackgroundSettings } from '../../hooks/useBackgroundSettings';
import SettingsDrawer from '../SettingsDrawer';
import FloatSidebar from '../FloatSidebar';
import { useStandaloneMode } from '../../hooks/useStandaloneMode';
import { getFooterProfile } from '../../services/api';
import { FooterProfile } from '../../types/types';
import * as Icons from '@ant-design/icons';

const GameModal = React.lazy(() => import('../GameModal'));

const { Header, Content} = Layout;
const { Paragraph } = Typography;

const StyledLayout = styled(Layout)<{ $backgroundUrl?: string | null; $isStandalone?: boolean }>`
  min-height: 100vh;
  width: 100%;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${props => !props.$isStandalone && props.$backgroundUrl ? `url(${props.$backgroundUrl})` : 'none'};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${props => props.$backgroundUrl ? 0.15 : 1};
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.3s ease;
  }
`;

const StyledHeader = styled(Header)<{ $scrolled: boolean }>`
  background: ${props => props.$scrolled ? themeVars.colors.background : 'transparent'};
  box-shadow: ${props => props.$scrolled ? themeVars.shadows.small : 'none'};
  position: fixed;
  width: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0 ${themeVars.spacing.xl};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 0 ${themeVars.spacing.md};
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeVars.spacing.md};
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledContent = styled(Content)<{ $isStandalone?: boolean }>`
  padding: ${props => props.$isStandalone ? 0 : themeVars.spacing.xl};
  margin-top: ${props => props.$isStandalone ? 0 : '64px'};
  background: ${themeVars.colors.secondary};
  min-height: ${props => props.$isStandalone ? '100vh' : 'calc(100vh - 64px - 70px)'};
  width: 100%;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const StyledMenu = styled(Menu)<{ $scrolled: boolean }>`
  flex: 1;
  border-bottom: none;
  justify-content: center;
  background: transparent;
  
  &.ant-menu {
    color: ${props => props.$scrolled ? themeVars.colors.text : themeVars.colors.text};
  }

  .ant-menu-item {
    border-radius: 20px !important;
    margin: 0 8px !important;
    padding: 0 16px !important;
    height: 36px !important;
    line-height: 36px !important;
    background: ${props =>
      props.$scrolled
        ? withThemeAlpha(themeVars.colors.text, 0.05)
        : withThemeAlpha(themeVars.colors.onPrimary, 0.1)} !important;
    border: 1px solid ${props =>
      props.$scrolled
        ? withThemeAlpha(themeVars.colors.text, 0.1)
        : withThemeAlpha(themeVars.colors.onPrimary, 0.2)} !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: ${themeVars.colors.primary} !important;
      border-color: ${themeVars.colors.primary} !important;
      color: ${themeVars.colors.onPrimary} !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${withThemeAlpha(themeVars.colors.text, 0.15)};
    }
    
    &.ant-menu-item-selected {
      background: ${themeVars.colors.primary} !important;
      border-color: ${themeVars.colors.primary} !important;
      color: ${themeVars.colors.onPrimary} !important;
      box-shadow: 0 2px 8px ${withThemeAlpha(themeVars.colors.text, 0.1)};
    }
    
    &::after {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    .ant-menu-item {
      margin: 0 4px !important;
      padding: 0 12px !important;
      font-size: 14px !important;
    }
  }
`;

const IcpLink = styled.a`
  color: inherit;
  text-decoration: none;
  &:hover {
    color: ${themeVars.colors.primary};
  }
`;

const BadgesGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeVars.spacing.md};
  flex-wrap: wrap;
  justify-content: center;

  a {
    line-height: 0;
  }

  img {
    height: 20px;
    width: auto;
  }
`;

const FooterContainer = styled.div`
  background: ${themeVars.colors.background};
  padding: ${themeVars.spacing.xl} 0 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${themeVars.spacing.xl};
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: ${themeVars.spacing.xl};

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 ${themeVars.spacing.lg};
    gap: ${themeVars.spacing.xl};
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeVars.spacing.md};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FooterMiddleRow = styled.div`
  display: contents;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${themeVars.spacing.lg};
  }
`;

const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 ${themeVars.spacing.md};
  color: ${themeVars.colors.text};
`;

const FooterLink = styled.span<{ $isExternal?: boolean }>`
  color: ${themeVars.colors.lightText};
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: ${themeVars.colors.primary};
  }
`;

const ExternalLinkContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${themeVars.spacing.xs};
`;

const ExternalLink = styled.a`
  color: ${themeVars.colors.lightText};
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;

  &:hover {
    color: ${themeVars.colors.primary};
  }

  &:hover + .link-icon {
    opacity: 1;
    transform: translateX(0);
  }
`;

const LinkIcon = styled(ArrowRightOutlined)`
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: ${themeVars.colors.primary};
`;

const FooterBottom = styled.div`
  margin-top: ${themeVars.spacing.xl};
  padding: ${themeVars.spacing.md} ${themeVars.spacing.xl};
  border-top: 1px solid ${themeVars.colors.border};
  text-align: center;
  color: ${themeVars.colors.lightText};
  font-size: 14px;

  @media (max-width: 768px) {
    padding: ${themeVars.spacing.md};
  }
`;
const BuildInfo = styled.div`
  color: ${themeVars.colors.lightText};
  font-size: 12px;
  opacity: 0.8;
  white-space: nowrap;
  display: flex;
  gap: ${themeVars.spacing.sm};
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
`;
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const IcpContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${themeVars.spacing.md};
  margin-top: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${themeVars.spacing.sm};
  }
`;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showGameModal, handleCloseGameModal } = useGameEasterEgg();
  const { showToast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [footerLinks, setFooterLinks] = useState<FooterProfile['links']>([]);
  const [loadingFooter, setLoadingFooter] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {
    backgroundType,
    backgroundUrl,
    isLoading,
    setBackgroundType,
    refreshBackground
  } = useBackgroundSettings();
  const isStandalone = useStandaloneMode();

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.dataset.standalone = String(isStandalone);
  }, [isStandalone]);

  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        delete document.documentElement.dataset.standalone;
      }
    };
  }, []);

  // 获取页脚数据
  useEffect(() => {
    const loadFooterData = async () => {
      try {
        setLoadingFooter(true);
        const data = await getFooterProfile();
        setFooterLinks(data.links);
      } catch (error) {
        console.error('Failed to load footer data:', error);
      } finally {
        setLoadingFooter(false);
      }
    };

    if (!isStandalone) {
      loadFooterData();
    }
  }, [isStandalone]);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    // 初始检查
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 获取图标组件
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="link-icon" /> : null;
  };

  // 监听路由变化，自动滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReload = () => {
    window.location.reload();
  };

  // 纯复制逻辑，不包含 Toast 提示
  const copyUrlToClipboard = async (): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        return true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          return successful;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          document.body.removeChild(textArea);
          return false;
        }
      }
    } catch (error) {
      console.error('复制链接失败:', error);
      return false;
    }
  };

  const handleCopyUrl = async () => {
    const successful = await copyUrlToClipboard();
    if (successful) {
      showToast('链接已复制到剪贴板', {
        type: 'success',
        duration: 2000,
      });
    } else {
      showToast('复制链接失败，请手动复制', {
        type: 'error',
        duration: 3000,
      });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share && navigator.canShare?.({
        title: document.title,
        url: window.location.href
      })) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        showToast('分享成功', {
          type: 'success',
          duration: 2000,
        });
      } else {
        const successful = await copyUrlToClipboard();
        showToast(
          successful
            ? '当前浏览器不支持分享功能，已复制链接到剪贴板'
            : '当前浏览器不支持分享功能，复制链接失败',
          {
            type: successful ? 'info' : 'error',
            duration: 3000,
          }
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        showToast('已取消分享', {
          type: 'info',
          duration: 2000,
        });
        return;
      }
      console.error('分享失败:', error);
      const successful = await copyUrlToClipboard();
      showToast(
        successful
          ? '分享失败，已复制链接到剪贴板'
          : '分享失败，复制链接也失败了',
        {
          type: successful ? 'warning' : 'error',
          duration: 3000,
        }
      );
    }
  };

  // 根据平台提示打开开发者工具的快捷键
  const handleOpenDevTools = async () => {
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const shortcutTips = isMac
      ? '打开开发者工具：⌘ + ⌥ + I（或 ⌘ + ⌥ + J）'
      : '打开开发者工具：Ctrl + Shift + I（或 F12）';

    type ExtendedWindow = typeof window & {
      __TAURI__?: {
        invoke?: (command: string, args?: Record<string, unknown>) => Promise<unknown>;
        window?: {
          appWindow?: {
            openDevTools?: () => Promise<void> | void;
          };
        };
      };
      electron?: {
        openDevTools?: () => Promise<void> | void;
        ipcRenderer?: {
          invoke?: (channel: string, ...args: unknown[]) => Promise<unknown>;
          send?: (channel: string, ...args: unknown[]) => void;
        };
      };
      ipcRenderer?: {
        invoke?: (channel: string, ...args: unknown[]) => Promise<unknown>;
        send?: (channel: string, ...args: unknown[]) => void;
      };
      chrome?: {
        devtools?: {
          open?: () => Promise<void> | void;
        };
        developerPrivate?: {
          openDevTools?: () => Promise<void> | void;
        };
      };
    };

    const extendedWindow = window as ExtendedWindow;
    const openers: Array<() => unknown | Promise<unknown>> = [];

    const tauriInvoke = extendedWindow.__TAURI__?.invoke;
    const tauriAppWindow = extendedWindow.__TAURI__?.window?.appWindow;
    if (tauriAppWindow?.openDevTools) {
      openers.push(() => tauriAppWindow.openDevTools?.());
    }
    if (tauriInvoke) {
      openers.push(() => tauriInvoke('plugin:window|toggle_devtools'));
      openers.push(() => tauriInvoke('toggle_devtools'));
    }

    const electronBridge = extendedWindow.electron;
    if (electronBridge?.openDevTools) {
      openers.push(() => electronBridge.openDevTools?.());
    }
    const electronIpc = electronBridge?.ipcRenderer;
    if (electronIpc?.invoke) {
      openers.push(() => electronIpc.invoke?.('open-devtools'));
    }
    if (electronIpc?.send) {
      openers.push(() => electronIpc.send?.('open-devtools'));
    }

    const standaloneIpc = extendedWindow.ipcRenderer;
    if (standaloneIpc?.invoke) {
      openers.push(() => standaloneIpc.invoke?.('open-devtools'));
    }
    if (standaloneIpc?.send) {
      openers.push(() => standaloneIpc.send?.('open-devtools'));
    }

    const chromeDevtools = extendedWindow.chrome?.devtools;
    if (chromeDevtools?.open) {
      openers.push(() => chromeDevtools.open?.());
    }
    const chromeDeveloperPrivate = extendedWindow.chrome?.developerPrivate;
    if (chromeDeveloperPrivate?.openDevTools) {
      openers.push(() => chromeDeveloperPrivate.openDevTools?.());
    }

    let opened = false;
    for (const openDevTools of openers) {
      try {
        const result = openDevTools();
        await Promise.resolve(result);
        opened = true;
        break;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // 忽略单个通道失败，尝试其他方式
      }
    }

    if (opened) return;

    showToast(`未能自动打开开发者工具，请手动操作。${shortcutTips}`, {
      type: 'warning',
      duration: 3000,
    });
    // 也在控制台输出醒目提示，便于用户确认
    console.log(
      '%c提示',
      `background:${themeVars.colors.primary};color:${themeVars.colors.onPrimary};padding:2px 6px;border-radius:3px`,
      shortcutTips
    );
  };

  const contextMenuItems = [
    {
      key: 'home',
      label: '返回首页',
      icon: <HomeOutlined />,
      onClick: () => navigate('/'),
    },
    {
      key: 'reload',
      label: '刷新页面',
      icon: <ReloadOutlined />,
      onClick: handleReload,
    },
    {
      key: 'scrollTop',
      label: '返回顶部',
      icon: <ArrowUpOutlined />,
      onClick: handleScrollToTop,
    },
    {
      key: 'copy',
      label: '复制链接',
      icon: <CopyOutlined />,
      onClick: handleCopyUrl,
    },
    {
      key: 'share',
      label: '分享页面',
      icon: <ShareAltOutlined />,
      onClick: handleShare,
    },
    // 新增分割线
    { key: 'divider-1', type: 'divider' as const },
    // 打开开发者工具
    {
      key: 'devtools',
      label: '打开开发者工具',
      icon: <BugOutlined />,
      onClick: handleOpenDevTools,
    },
    {
      key: 'github',
      label: '访问 GitHub',
      icon: <GithubOutlined />,
      onClick: () => window.open('https://github.com/ZQDesigned/blog-fe', '_blank'),
    },
  ];

  // 从环境变量获取ICP信息和构建时间
  const icpNumber = import.meta.env.VITE_ICP_NUMBER;
  const icpLink = import.meta.env.VITE_ICP_LINK;
  const buildTime = import.meta.env.VITE_BUILD_TIME || Date.now();

  return (
    <StyledLayout $backgroundUrl={backgroundType === 'anime' ? backgroundUrl : null} $isStandalone={isStandalone}>
      {!isStandalone && (
        <StyledHeader $scrolled={scrolled}>
          <HeaderLeft>
            <StyledAvatar
              size={40}
              src="https://www.loliapi.com/acg/pp/"
              onClick={() => setSettingsOpen(true)}
            />
          </HeaderLeft>
          <StyledMenu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            $scrolled={scrolled}
            items={NAV_ITEMS.map((item) => ({
              key: item.path,
              label: item.label,
              onClick: () => handleMenuClick(item.path),
            }))}
          />
        </StyledHeader>
      )}
      <StyledContent $isStandalone={isStandalone}>
        <Outlet />
        {!isStandalone && <FloatSidebar />}
      </StyledContent>
      {!isStandalone && (
        <FooterContainer>
          <FooterContent>
            <FooterColumn>
              <FooterTitle>关于</FooterTitle>
              <FooterLink style={{
                fontSize: '16px',
                fontWeight: 600,
                marginBottom: themeVars.spacing.xs
              }}>
                LumiCMS
              </FooterLink>
              <Paragraph style={{
                color: themeVars.colors.lightText,
                fontSize: '14px',
                margin: 0,
                lineHeight: '1.6'
              }}>
                轻量、自由、优雅——一款专为极简内容管理打造的 CMS。
              </Paragraph>
            </FooterColumn>
            <FooterMiddleRow>
              <FooterColumn>
                <FooterTitle>🚃逛逛</FooterTitle>
                <FooterLink onClick={() => navigate(ROUTES.BLOG)}>技术博客</FooterLink>
                <ExternalLinkContainer>
                  <ExternalLink href="https://github.com/ZQDesigned/blog-fe" target="_blank">
                    开源代码
                  </ExternalLink>
                  <LinkIcon className="link-icon" />
                </ExternalLinkContainer>
                <FooterLink onClick={() => navigate(ROUTES.GAMES)}>休闲游戏</FooterLink>
              </FooterColumn>
              <FooterColumn>
                <FooterTitle>我的</FooterTitle>
                {loadingFooter ? (
                  <Spin size="small" />
                ) : (
                  footerLinks.map((link, index) => (
                    <ExternalLinkContainer key={index}>
                      {link.icon && getIcon(link.icon)}
                      {link.isExternal ? (
                        <ExternalLink href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.title}
                        </ExternalLink>
                      ) : (
                        <FooterLink onClick={() => navigate(link.url)}>
                          {link.title}
                        </FooterLink>
                      )}
                      <LinkIcon className="link-icon" />
                    </ExternalLinkContainer>
                  ))
                )}
              </FooterColumn>
              <FooterColumn>
                <FooterTitle>友情链接</FooterTitle>
                <ExternalLinkContainer>
                  <ExternalLink href="https://www.loliapi.com/" target="_blank" rel="noopener noreferrer">
                    LoliAPI
                  </ExternalLink>
                  <LinkIcon className="link-icon" />
                </ExternalLinkContainer>
                <ExternalLinkContainer>
                  <ExternalLink href="https://dev.qweather.com/" target="_blank" rel="noopener noreferrer">
                    和风天气
                  </ExternalLink>
                  <LinkIcon className="link-icon" />
                </ExternalLinkContainer>
              </FooterColumn>
            </FooterMiddleRow>
            <FooterColumn>
              <FooterTitle>更多</FooterTitle>
              <BuildInfo>
                <span>构建于：{formatDate(Number(buildTime))}</span>
                <span>版本：{import.meta.env.VITE_GIT_HASH || 'unknown'}</span>
              </BuildInfo>
            </FooterColumn>
          </FooterContent>
          <FooterBottom>
            <div>©{new Date().getFullYear()} ZQDesigned | 记录技术 & 创新</div>
            <IcpContainer>
              <IcpLink href={icpLink} target="_blank" rel="noopener noreferrer">
                {icpNumber}
              </IcpLink>
              <BadgesGroup>
                <a href="https://ipw.cn/ssl/?site=blog.zqdesigned.city" title="本站支持SSL安全访问" target='_blank'>
                  <img alt="本站支持SSL安全访问" src="https://static.ipw.cn/icon/ssl-s4.svg" />
                </a>
                <a href="https://ipw.cn/ipv6webcheck/?site=blog.zqdesigned.city" title="本站支持IPv6访问" target='_blank'>
                  <img alt="本站支持IPv6访问" src="https://static.ipw.cn/icon/ipv6-s4.svg" />
                </a>
              </BadgesGroup>
            </IcpContainer>
          </FooterBottom>
        </FooterContainer>
      )}
      {!isStandalone && <ContextMenu items={contextMenuItems} />}
      {!isStandalone && (
        <SettingsDrawer
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          backgroundType={backgroundType}
          backgroundUrl={backgroundUrl}
          isLoading={isLoading}
          onBackgroundTypeChange={setBackgroundType}
          onRefreshBackground={refreshBackground}
        />
      )}
      <Suspense fallback={
        <LoadingContainer>
          <Spin size="large" tip="游戏加载中..." />
        </LoadingContainer>
      }>
        {showGameModal && <GameModal open={showGameModal} onClose={handleCloseGameModal} />}
      </Suspense>
    </StyledLayout>
  );
};
