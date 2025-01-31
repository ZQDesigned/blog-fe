import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { MainLayout } from './components/Layout/MainLayout';
import { GlobalStyles } from './styles/GlobalStyles';
import { customTheme } from './styles/theme';
import { ROUTES } from './constants/routes';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import AnimatedCursor from './components/AnimatedCursor';
import PageLoading from './components/PageLoading';

// 懒加载页面组件
const HomePage = lazy(() => import('./pages/Home'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogDetailPage = lazy(() => import('./pages/Blog/BlogDetail'));
const ProjectsPage = lazy(() => import('./pages/Projects'));
const AboutPage = lazy(() => import('./pages/About'));

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      localStorage.setItem('theme', e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const themeConfig = {
    ...customTheme,
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <GlobalStyles isDark={isDark} />
      <AnimatedCursor />
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
            </Route>
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
