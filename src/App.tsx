import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, FloatButton } from 'antd';
import { MainLayout } from './components/Layout/MainLayout';
import { ROUTES } from './constants/routes';
import React, { lazy, Suspense, useState } from 'react';
import AnimatedCursor from './components/AnimatedCursor';
import PageLoading from './components/PageLoading';
import { ToastProvider } from './components/Toast/ToastManager';
import { ThemeProvider, useTheme } from './theme';
import { CursorProvider } from './cursor';
import { BugOutlined } from '@ant-design/icons';

// 懒加载页面组件
const HomePage = lazy(() => import('./pages/Home'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogDetailPage = lazy(() => import('./pages/Blog/BlogDetail'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const AboutPage = lazy(() => import('./pages/About'));
const GamesPage = lazy(() => import('./pages/Games'));

const DevErrorTrigger: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (!import.meta.env.DEV) {
    return null;
  }

  if (shouldThrow) {
    throw new Error('[DEV] Manual blocking exception from FloatButton');
  }

  return (
    <FloatButton
      type="primary"
      icon={<BugOutlined />}
      tooltip="Dev: Trigger Global Error"
      onClick={() => setShouldThrow(true)}
      style={{ right: 24, bottom: 160, zIndex: 1100 }}
    />
  );
};

const AppShell: React.FC = () => {
  const { antdTheme } = useTheme();

  return (
    <ConfigProvider theme={antdTheme}>
      <AnimatedCursor />
      <DevErrorTrigger />
      <ToastProvider>
        <BrowserRouter>
          <React.Suspense fallback={<PageLoading tip="页面加载中" />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path={ROUTES.HOME} element={
                  <Suspense fallback={<PageLoading tip="加载首页内容" />}>
                    <HomePage />
                  </Suspense>
                } />
                <Route path={ROUTES.BLOG} element={
                  <Suspense fallback={<PageLoading tip="加载博客列表" />}>
                    <BlogPage />
                  </Suspense>
                } />
                <Route path={ROUTES.BLOG_DETAIL} element={
                  <Suspense fallback={<PageLoading tip="加载文章内容" />}>
                    <BlogDetailPage />
                  </Suspense>
                } />
                <Route path={ROUTES.PROJECTS} element={
                  <Suspense fallback={<PageLoading tip="加载项目列表" />}>
                    <ProjectsPage />
                  </Suspense>
                } />
                <Route path={ROUTES.ABOUT} element={
                  <Suspense fallback={<PageLoading tip="加载个人信息" />}>
                    <AboutPage />
                  </Suspense>
                } />
                <Route path={ROUTES.GAMES} element={
                  <Suspense fallback={<PageLoading tip="加载游戏列表" />}>
                    <GamesPage />
                  </Suspense>
                } />
              </Route>
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <CursorProvider>
        <AppShell />
      </CursorProvider>
    </ThemeProvider>
  );
}

export default App;
