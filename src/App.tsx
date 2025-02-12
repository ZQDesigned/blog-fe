import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { MainLayout } from './components/Layout/MainLayout';
import { GlobalStyles } from './styles/GlobalStyles';
import { customTheme } from './styles/theme';
import { ROUTES } from './constants/routes';
import React, { lazy, Suspense } from 'react';
import AnimatedCursor from './components/AnimatedCursor';
import PageLoading from './components/PageLoading';
import { ToastProvider } from './components/Toast/ToastManager';

// 懒加载页面组件
const HomePage = lazy(() => import('./pages/Home'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogDetailPage = lazy(() => import('./pages/Blog/BlogDetail'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const AboutPage = lazy(() => import('./pages/About'));
const GamesPage = lazy(() => import('./pages/Games'));

function App() {
  return (
    <ConfigProvider theme={customTheme}>
      <GlobalStyles />
      <AnimatedCursor />
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
}

export default App;
