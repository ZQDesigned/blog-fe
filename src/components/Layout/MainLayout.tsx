import React, { Suspense } from 'react';
import { Layout, Menu, Avatar, Spin } from 'antd';
import {
  HomeOutlined,
  GithubOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { NAV_ITEMS } from '../../constants/routes';
import { globalStyles } from '../../styles/theme';
import { useGameEasterEgg } from '../../hooks/useGameEasterEgg.tsx';
import ContextMenu from '../ContextMenu';

const GameModal = React.lazy(() => import('../GameModal'));

const { Header, Content, Footer } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  width: 100%;
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

const StyledFooter = styled(Footer)`
  text-align: center;
  background: #fff;
  width: 100%;
  padding: ${globalStyles.spacing.lg};
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

const FooterLinks = styled.div`
  margin-top: ${globalStyles.spacing.md};
  padding-top: ${globalStyles.spacing.md};
  border-top: 1px solid ${globalStyles.colors.border};
  color: ${globalStyles.colors.lightText};
  font-size: 14px;

  a {
    color: inherit;
    text-decoration: none;
    margin: 0 ${globalStyles.spacing.sm};
    &:hover {
      color: ${globalStyles.colors.primary};
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showGameModal, handleCloseGameModal } = useGameEasterEgg();

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error('分享失败:', error);
      }
    } else {
      handleCopyUrl();
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

  // 从环境变量获取ICP信息
  const icpNumber = import.meta.env.VITE_ICP_NUMBER;
  const icpLink = import.meta.env.VITE_ICP_LINK;

  return (
    <StyledLayout>
      <StyledHeader>
        <HeaderLeft>
          <StyledAvatar
            size={40}
            src="https://www.loliapi.com/acg/pp/"
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
      </StyledContent>
      <StyledFooter>
        <div>©{new Date().getFullYear()} ZQDesigned | 记录技术 & 创新</div>
        {icpNumber && (
          <div style={{ marginTop: 8 }}>
            <IcpLink href={icpLink} target="_blank" rel="noopener noreferrer">
              {icpNumber}
            </IcpLink>
          </div>
        )}
        <FooterLinks>
          <span>友情链接：</span>
          <a href="https://www.loliapi.com/" target="_blank" rel="noopener noreferrer">
            LoliAPI
          </a>
        </FooterLinks>
      </StyledFooter>

      <ContextMenu items={contextMenuItems} />

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
