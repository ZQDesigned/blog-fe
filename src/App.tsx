import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, FloatButton } from 'antd';
import { MainLayout } from './components/Layout/MainLayout';
import { ROUTES } from './constants/routes';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import PageLoading from './components/PageLoading';
import { ToastProvider } from './components/Toast/ToastManager';
import { ThemeProvider, useTheme } from './theme';
import { CursorProvider } from './cursor';
import { BugOutlined } from '@ant-design/icons';
import ExternalLinkGuardProvider from './components/ExternalLinkGuard';

// 懒加载页面组件
const HomePage = lazy(() => import('./pages/Home'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogDetailPage = lazy(() => import('./pages/Blog/BlogDetail'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const AboutPage = lazy(() => import('./pages/About'));
const GamesPage = lazy(() => import('./pages/Games'));
const AnimatedCursor = lazy(() => import('./components/AnimatedCursor'));

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
  const [shouldLoadAnimatedCursor, setShouldLoadAnimatedCursor] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if ('requestIdleCallback' in window) {
      const idleCallbackId = window.requestIdleCallback(() => {
        setShouldLoadAnimatedCursor(true);
      });

      return () => {
        window.cancelIdleCallback(idleCallbackId);
      };
    }

    const timeoutId = globalThis.setTimeout(() => {
      setShouldLoadAnimatedCursor(true);
    }, 1);

    return () => {
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <ConfigProvider theme={antdTheme}>
      <ExternalLinkGuardProvider>
        {shouldLoadAnimatedCursor && (
          <Suspense fallback={null}>
            <AnimatedCursor />
          </Suspense>
        )}
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
      </ExternalLinkGuardProvider>
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
