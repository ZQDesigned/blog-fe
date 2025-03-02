import React, { Suspense, useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Spin } from 'antd';
import {
  HomeOutlined,
  GithubOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  ShareAltOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import {NAV_ITEMS, ROUTES} from '../../constants/routes';
import { globalStyles } from '../../styles/theme';
import { useGameEasterEgg } from '../../hooks/useGameEasterEgg.tsx';
import ContextMenu from '../ContextMenu';
import { formatDate } from '../../utils/dateUtils';
import { useToast } from '../../hooks/useToast.ts';
import { useBackgroundSettings } from '../../hooks/useBackgroundSettings';
import SettingsDrawer from '../SettingsDrawer';
import FloatSidebar from '../FloatSidebar';

const GameModal = React.lazy(() => import('../GameModal'));

const { Header, Content, Footer } = Layout;

const StyledLayout = styled(Layout)<{ $backgroundUrl?: string | null }>`
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
    background-image: ${props => props.$backgroundUrl ? `url(${props.$backgroundUrl})` : 'none'};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: ${props => props.$backgroundUrl ? 0.15 : 1};
    pointer-events: none;
    z-index: 0;
    transition: opacity 0.3s ease;
  }
`;

const StyledHeader = styled(Header)`
  background: #fff;
  box-shadow: ${globalStyles.shadows.small};
  position: fixed;
  width: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0 ${globalStyles.spacing.xl};

  @media (max-width: 768px) {
    padding: 0 ${globalStyles.spacing.md};
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.md};
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const StyledContent = styled(Content)`
  padding: ${globalStyles.spacing.xl};
  margin-top: 64px;
  background: ${globalStyles.colors.secondary};
  min-height: calc(100vh - 64px - 70px);
  width: 100%;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const StyledMenu = styled(Menu)`
  flex: 1;
  border-bottom: none;
  justify-content: flex-end;
  background: transparent;
`;

const IcpLink = styled.a`
  color: inherit;
  text-decoration: none;
  &:hover {
    color: ${globalStyles.colors.primary};
  }
`;

const BadgesGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.md};
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
  background: #fff;
  padding: ${globalStyles.spacing.xl} 0 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${globalStyles.spacing.xl};
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: ${globalStyles.spacing.xl};

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    padding: 0 ${globalStyles.spacing.lg};
    gap: ${globalStyles.spacing.xl};
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${globalStyles.spacing.md};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FooterMiddleRow = styled.div`
  display: contents;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${globalStyles.spacing.lg};
  }
`;

const FooterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 ${globalStyles.spacing.md};
  color: ${globalStyles.colors.text};
`;

const FooterLink = styled.span<{ $isExternal?: boolean }>`
  color: ${globalStyles.colors.lightText};
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: ${globalStyles.colors.primary};
  }
`;

const ExternalLinkContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${globalStyles.spacing.xs};
`;

const ExternalLink = styled.a`
  color: ${globalStyles.colors.lightText};
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;

  &:hover {
    color: ${globalStyles.colors.primary};
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
  color: ${globalStyles.colors.primary};
`;

const FooterBottom = styled.div`
  margin-top: ${globalStyles.spacing.xl};
  padding: ${globalStyles.spacing.md} ${globalStyles.spacing.xl};
  border-top: 1px solid ${globalStyles.colors.border};
  text-align: center;
  color: ${globalStyles.colors.lightText};
  font-size: 14px;

  @media (max-width: 768px) {
    padding: ${globalStyles.spacing.md};
  }
`;
const BuildInfo = styled.div`
  color: ${globalStyles.colors.lightText};
  font-size: 12px;
  opacity: 0.8;
  white-space: nowrap;
  display: flex;
  gap: ${globalStyles.spacing.sm};
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
  gap: ${globalStyles.spacing.md};
  margin-top: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${globalStyles.spacing.sm};
  }
`;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showGameModal, handleCloseGameModal } = useGameEasterEgg();
  const { showToast } = useToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    backgroundType,
    backgroundUrl,
    isLoading,
    setBackgroundType,
    refreshBackground
  } = useBackgroundSettings();

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
    <StyledLayout $backgroundUrl={backgroundType === 'anime' ? backgroundUrl : null}>
      <StyledHeader>
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
          items={NAV_ITEMS.map((item) => ({
            key: item.path,
            label: item.label,
            onClick: () => handleMenuClick(item.path),
          }))}
        />
      </StyledHeader>
      <StyledContent>
        <Outlet />
        <FloatSidebar />
      </StyledContent>
      <FooterContainer>
        <FooterContent>
          <FooterColumn>
            <FooterTitle>关于</FooterTitle>
            <FooterLink onClick={() => navigate('/')}>ZQDesigned's Blog</FooterLink>
            <FooterLink onClick={() => navigate(ROUTES.ABOUT)}>关于我</FooterLink>
            <FooterLink onClick={() => navigate(ROUTES.PROJECTS)}>项目展示</FooterLink>
            <FooterLink onClick={() => navigate(ROUTES.GAMES)}>休闲游戏</FooterLink>
          </FooterColumn>
          <FooterMiddleRow>
            <FooterColumn>
              <FooterTitle>资源</FooterTitle>
              <FooterLink onClick={() => navigate(ROUTES.BLOG)}>技术博客</FooterLink>
              <ExternalLinkContainer>
                <ExternalLink href="https://github.com/ZQDesigned/blog-fe" target="_blank">
                  开源代码
                </ExternalLink>
                <LinkIcon className="link-icon" />
              </ExternalLinkContainer>
            </FooterColumn>
            <FooterColumn>
              <FooterTitle>我的</FooterTitle>
              <ExternalLinkContainer>
                <ExternalLink href="https://github.com/ZQDesigned" target="_blank">
                  GitHub
                </ExternalLink>
                <LinkIcon className="link-icon" />
              </ExternalLinkContainer>
              <ExternalLinkContainer>
                <ExternalLink href="mailto:zqdesigned@mail.lnyynet.com">
                  联系我
                </ExternalLink>
                <LinkIcon className="link-icon" />
              </ExternalLinkContainer>
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

      <ContextMenu items={contextMenuItems} />

      <Suspense fallback={
        <LoadingContainer>
          <Spin size="large" tip="游戏加载中..." />
        </LoadingContainer>
      }>
        {showGameModal && <GameModal open={showGameModal} onClose={handleCloseGameModal} />}
      </Suspense>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        backgroundType={backgroundType}
        backgroundUrl={backgroundUrl}
        isLoading={isLoading}
        onBackgroundTypeChange={setBackgroundType}
        onRefreshBackground={refreshBackground}
      />
    </StyledLayout>
  );
};
