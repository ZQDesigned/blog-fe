import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Result, Space, Tag, Typography } from 'antd';
import { ReloadOutlined, PoweroffOutlined, CloudOutlined, MailOutlined } from '@ant-design/icons';
import { checkApiStatus } from '../../services/apiStatus';
import { CONTACT_EMAIL, CONTACT_QQ } from '../../constants/contact';

type ApiStatus = 'checking' | 'online' | 'offline';

type DataErrorFallbackProps = {
  context?: string;
  error?: unknown;
  onRetry?: () => Promise<unknown> | void;
};

const DataErrorFallback: React.FC<DataErrorFallbackProps> = ({ context, error, onRetry }) => {
  const [status, setStatus] = useState<ApiStatus>('checking');
  const [retrying, setRetrying] = useState(false);

  const probeStatus = useCallback(async (signal?: AbortSignal): Promise<ApiStatus> => {
    try {
      const result = await checkApiStatus(signal);
      return result.online ? 'online' : 'offline';
    } catch (probeError) {
      if ((probeError as Error).name === 'AbortError') {
        throw probeError;
      }
      return 'offline';
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    probeStatus(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setStatus(result);
        }
      })
      .catch((error) => {
        if ((error as Error).name !== 'AbortError') {
          setStatus('offline');
        }
      });

    return () => {
      controller.abort();
    };
  }, [probeStatus]);

  const handleRetry = async () => {
    if (!onRetry) return;
    try {
      setRetrying(true);
      setStatus('checking');
      try {
        await onRetry();
      } catch (retryError) {
        console.error('数据刷新失败:', retryError);
      }
    } finally {
      try {
        const result = await probeStatus();
        setStatus(result);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setStatus('offline');
        }
      }
      setRetrying(false);
    }
  };

  const failureTitle = useMemo(() => {
    if (context) {
      return `加载${context}时出现问题`;
    }
    return '加载数据失败';
  }, [context]);

  const statusTag = useMemo(() => {
    switch (status) {
      case 'online':
        return <Tag color="green">API 服务器在线</Tag>;
      case 'offline':
        return <Tag color="red">API 服务器不可用</Tag>;
      default:
        return <Tag color="default">正在检查 API 服务器状态...</Tag>;
    }
  }, [status]);

  const contactMailHref = useMemo(() => {
    const subject = encodeURIComponent('LumiCMS 数据加载异常反馈');
    const bodyLines = [
      '您好，',
      '',
      `页面：${typeof window !== 'undefined' ? window.location.href : ''}`,
      `场景：加载${context ?? '页面数据'}失败`,
      '',
      `错误信息：${error instanceof Error ? error.message : '未知错误'}`,
      '',
      '---',
      '请协助排查，谢谢！',
    ];
    const body = encodeURIComponent(bodyLines.join('\n'));
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }, [context, error]);

  const subTitle = useMemo(() => {
    if (status === 'offline') {
      return 'API 服务器暂不可用，请联系站点维护者。';
    }
    if (status === 'online') {
      return 'API 服务器正常，请刷新重试或稍后再试。';
    }
    return '正在检查 API 服务器状态，请稍候...';
  }, [status]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 'calc(100vh - 128px)',
        padding: 24,
      }}
    >
      <Result
        status={status === 'offline' ? 'error' : 'warning'}
        title={failureTitle}
        subTitle={subTitle}
        extra={[
          <Button
            type="primary"
            icon={status === 'offline' ? <PoweroffOutlined /> : <ReloadOutlined />}
            onClick={handleRetry}
            loading={retrying}
            disabled={!onRetry}
            key="retry"
          >
            刷新重试
          </Button>,
          <Button icon={<MailOutlined />} href={contactMailHref} key="mail">
            邮件反馈
          </Button>,
        ]}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space size="middle">
            {statusTag}
            {status === 'online' ? <CloudOutlined style={{ color: '#52c41a' }} /> : null}
            {status === 'offline' ? <PoweroffOutlined style={{ color: '#ff4d4f' }} /> : null}
          </Space>
          {error instanceof Error ? (
            <Typography.Text type="secondary">
              错误详情：{error.message}
            </Typography.Text>
          ) : null}
          <Space direction="vertical" size={4}>
            <Typography.Text>
              联系 QQ：
              <a
                href={`tencent://message/?uin=${CONTACT_QQ}&Site=&Menu=yes`}
                style={{ color: '#1677ff' }}
              >
                {CONTACT_QQ}
              </a>
            </Typography.Text>
            <Typography.Text>
              联系邮箱：
              <a href={contactMailHref} style={{ color: '#1677ff' }}>
                {CONTACT_EMAIL}
              </a>
            </Typography.Text>
          </Space>
        </Space>
      </Result>
    </div>
  );
};

export default DataErrorFallback;
