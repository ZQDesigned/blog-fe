import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { notification } from 'antd';
import { ReadOutlined } from '@ant-design/icons';
import { useStandaloneMode } from './useStandaloneMode';

const ARTICLE_READ_COUNT_KEY = 'article_read_count';
const GAME_SHOWN_TIME_KEY = 'game_shown_time';
const PAGE_REFRESH_KEY = 'page_refresh_time';

export const useGameEasterEgg = () => {
  const [showGameModal, setShowGameModal] = useState(false);
  const location = useLocation();
  const isStandalone = useStandaloneMode();

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

    // 获取并增加阅读计数
    const count = parseInt(localStorage.getItem(ARTICLE_READ_COUNT_KEY) || '0') + 1;
    localStorage.setItem(ARTICLE_READ_COUNT_KEY, count.toString());

    // 当阅读大于等于3篇文章时显示通知
    if (count >= 3) {
      // 延迟3秒显示，给用户一些阅读时间
      setTimeout(() => {
        notification.info({
          message: '要不要休息一下？',
          description: '看了这么多文章，要不要玩个小游戏放松一下？',
          icon: <ReadOutlined style={{ color: '#1890ff' }} />,
          duration: 0,
          placement: 'topRight',
          btn: (
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <a onClick={() => {
                setShowGameModal(true);
                notification.destroy();
              }}>
                好啊，玩玩看
              </a>
              <a onClick={() => notification.destroy()}>
                继续阅读
              </a>
            </div>
          ),
        });
        localStorage.setItem(GAME_SHOWN_TIME_KEY, currentTime.toString());
        localStorage.setItem(ARTICLE_READ_COUNT_KEY, '0'); // 重置计数
      }, 3000);
    }
  }, [location.pathname, isStandalone]);

  const handleCloseGameModal = () => {
    setShowGameModal(false);
  };

  return {
    showGameModal,
    handleCloseGameModal
  };
};
