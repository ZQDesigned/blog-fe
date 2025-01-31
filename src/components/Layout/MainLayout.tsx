import React, { Suspense } from 'react';
import { Layout, Menu, Avatar, Spin } from 'antd';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import { NAV_ITEMS } from '../../constants/routes';
import { globalStyles } from '../../styles/theme';
import { useGameEasterEgg } from '../../hooks/useGameEasterEgg.tsx';

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

  // 从环境变量获取ICP信息
  const icpNumber = import.meta.env.VITE_ICP_NUMBER;
  const icpLink = import.meta.env.VITE_ICP_LINK;

  return (
    <StyledLayout>
      <StyledHeader>
        <HeaderLeft>
          <StyledAvatar
            size={40}
            src="https://q1.qlogo.cn/g?b=qq&nk=2990918167&s=640"
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
        <div>©{new Date().getFullYear()} 个人博客 - 基于 React + TypeScript 开发</div>
        {icpNumber && (
          <div style={{ marginTop: 8 }}>
            <IcpLink href={icpLink} target="_blank" rel="noopener noreferrer">
              {icpNumber}
            </IcpLink>
          </div>
        )}
      </StyledFooter>

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
