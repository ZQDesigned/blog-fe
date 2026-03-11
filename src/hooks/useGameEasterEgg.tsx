import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Space, notification } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
import { useStandaloneMode } from './useStandaloneMode';
import { themeVars } from '../theme';
import { ROUTES } from '../constants/routes';

const ARTICLE_READ_COUNT_KEY = 'article_read_count';
const GAME_SHOWN_TIME_KEY = 'game_shown_time';
const PAGE_REFRESH_KEY = 'page_refresh_time';
const LAST_COUNTED_ARTICLE_PATH_KEY = 'last_counted_article_path';
const LAST_COUNTED_ARTICLE_TIME_KEY = 'last_counted_article_time';
const GAME_EASTER_EGG_NOTIFICATION_KEY = 'game-easter-egg-notification';

export const useGameEasterEgg = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isStandalone = useStandaloneMode();
  const notificationTimerRef = useRef<number | null>(null);

  const clearPendingNotification = useCallback(() => {
    if (notificationTimerRef.current !== null) {
      window.clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }
  }, []);

  // 在组件挂载时检查是否需要重置计数器
  useEffect(() => {
    if (isStandalone) return;

    const lastRefreshTime = localStorage.getItem(PAGE_REFRESH_KEY);
    const currentTime = new Date().getTime();

    // 如果是首次访问或者距离上次刷新超过30分钟，重置计数器
    if (!lastRefreshTime || currentTime - parseInt(lastRefreshTime) > 30 * 60 * 1000) {
      localStorage.setItem(ARTICLE_READ_COUNT_KEY, '0');
    }

    // 更新刷新时间
    localStorage.setItem(PAGE_REFRESH_KEY, currentTime.toString());
  }, [isStandalone]);

  useEffect(() => {
    clearPendingNotification();

    if (isStandalone) return;

    // 只在博客详情页面计数
    const isBlogDetail = /^\/blog\/\d+$/.test(location.pathname);
    if (!isBlogDetail) {
      return;
    }

    const lastShownTime = localStorage.getItem(GAME_SHOWN_TIME_KEY);
    const currentTime = new Date().getTime();

    // 如果距离上次显示不足6小时，不再显示
    if (lastShownTime && currentTime - parseInt(lastShownTime) < 6 * 60 * 60 * 1000) {
      return;
    }

    // 防止同一路由在短时间内重复计数（例如 StrictMode 或重复挂载）
    const lastCountedPath = sessionStorage.getItem(LAST_COUNTED_ARTICLE_PATH_KEY);
    const lastCountedTime = Number(sessionStorage.getItem(LAST_COUNTED_ARTICLE_TIME_KEY) || '0');
    if (lastCountedPath === location.pathname && currentTime - lastCountedTime < 5000) {
      return;
    }

    // 获取并增加阅读计数
    const count = parseInt(localStorage.getItem(ARTICLE_READ_COUNT_KEY) || '0') + 1;
    localStorage.setItem(ARTICLE_READ_COUNT_KEY, count.toString());
    sessionStorage.setItem(LAST_COUNTED_ARTICLE_PATH_KEY, location.pathname);
    sessionStorage.setItem(LAST_COUNTED_ARTICLE_TIME_KEY, currentTime.toString());

    // 当阅读大于等于3篇文章时显示通知
    if (count >= 3) {
      localStorage.setItem(GAME_SHOWN_TIME_KEY, currentTime.toString());
      localStorage.setItem(ARTICLE_READ_COUNT_KEY, '0'); // 重置计数
      // 延迟3秒显示，给用户一些阅读时间
      notificationTimerRef.current = window.setTimeout(() => {
        notificationTimerRef.current = null;
        notification.info({
          key: GAME_EASTER_EGG_NOTIFICATION_KEY,
          message: '要不要休息一下？',
          description: '看了这么多文章，要不要玩个小游戏放松一下？',
          icon: <ReadOutlined style={{ color: themeVars.colors.primary }} />,
          duration: 0,
          placement: 'topRight',
          btn: (
            <Space size={8} style={{ marginTop: '8px' }}>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  notification.destroy(GAME_EASTER_EGG_NOTIFICATION_KEY);
                  navigate(ROUTES.GAMES);
                }}
              >
                好啊，玩玩看
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => notification.destroy(GAME_EASTER_EGG_NOTIFICATION_KEY)}
              >
                继续阅读
              </Button>
            </Space>
          ),
        });
      }, 3000);
    }

    return () => {
      clearPendingNotification();
    };
  }, [clearPendingNotification, location.pathname, isStandalone, navigate]);

  useEffect(() => {
    return () => {
      clearPendingNotification();
      notification.destroy(GAME_EASTER_EGG_NOTIFICATION_KEY);
    };
  }, [clearPendingNotification]);
};
