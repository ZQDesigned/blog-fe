import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import styled from '@emotion/styled';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { themeVars, withThemeAlpha } from '../../theme';
import {
  confirmCurrentExternalNavigation,
  dismissCurrentExternalNavigation,
  ExternalNavigationInfo,
  ExternalNavigationRequest,
  getExternalNavigationInfo,
  getTrustedParentDomain,
  requestExternalNavigation,
  setNativeWindowOpen,
  shouldGuardExternalNavigation,
  subscribeToExternalNavigation,
} from '../../utils/externalNavigation';

const { Paragraph, Text, Title } = Typography;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeVars.spacing.lg};
`;

const WarningHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${themeVars.spacing.md};
`;

const WarningIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${themeVars.colors.warning};
  background: ${withThemeAlpha(themeVars.colors.warning, 0.14)};
  font-size: 24px;
  flex-shrink: 0;
`;

const UrlPanel = styled.div`
  padding: ${themeVars.spacing.md};
  border-radius: ${themeVars.borderRadius.medium};
  border: 1px solid ${withThemeAlpha(themeVars.colors.warning, 0.28)};
  background: ${withThemeAlpha(themeVars.colors.warning, 0.08)};
  word-break: break-all;
`;

const HintList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeVars.spacing.xs};
  color: ${themeVars.colors.lightText};
  font-size: 14px;
`;

const getModalTitle = (navigationInfo: ExternalNavigationInfo | null) => {
  switch (navigationInfo?.kind) {
    case 'email':
      return '即将打开外部邮箱链接';
    case 'phone':
      return '即将调用外部电话链接';
    case 'custom':
      return '即将打开外部协议链接';
    default:
      return '即将跳转至第三方站点';
  }
};

const getModalSubtitle = (navigationInfo: ExternalNavigationInfo | null) => {
  switch (navigationInfo?.kind) {
    case 'email':
      return '当前仅信任 *.lnyynet.com 域下的邮箱地址，其他邮箱链接需要二次确认。';
    case 'phone':
      return '该链接会调用系统拨号或关联应用，请确认号码与用途。';
    case 'custom':
      return '该链接会调用第三方应用或系统协议，请确认来源与风险。';
    default:
      return '该目标不属于当前站点的受信任父域，访问前请确认风险。';
  }
};

const getTrustScopeLabel = (navigationInfo: ExternalNavigationInfo | null, trustedParentDomain: string | null, currentHostname: string) => {
  switch (navigationInfo?.kind) {
    case 'email':
      return '*.lnyynet.com';
    case 'phone':
    case 'custom':
      return '非 HTTP(S) 协议默认需人工确认';
    default:
      return trustedParentDomain ?? currentHostname;
  }
};

const getKindLabel = (navigationInfo: ExternalNavigationInfo | null) => {
  switch (navigationInfo?.kind) {
    case 'email':
      return '邮箱链接';
    case 'phone':
      return '电话链接';
    case 'custom':
      return '自定义协议';
    default:
      return '网页链接';
  }
};

const ExternalLinkGuardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingRequest, setPendingRequest] = useState<ExternalNavigationRequest | null>(null);
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  useEffect(() => {
    return subscribeToExternalNavigation(setPendingRequest);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const originalWindowOpen = window.open.bind(window);
    setNativeWindowOpen(originalWindowOpen);

    const guardedWindowOpen: typeof window.open = (...args) => {
      const [url, target, features] = args;
      const href = typeof url === 'string' ? url : url?.toString();

      if (!href) {
        return originalWindowOpen(...args);
      }

      if (!shouldGuardExternalNavigation(href)) {
        return originalWindowOpen(...args);
      }

      requestExternalNavigation(href, {
        mode: 'new-tab',
        target: target ?? '_blank',
        features: features ?? undefined,
      });

      return null;
    };

    window.open = guardedWindowOpen;

    return () => {
      window.open = originalWindowOpen;
      setNativeWindowOpen(originalWindowOpen);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleDocumentActivate = (event: MouseEvent) => {
      const isPrimaryClick = event.type === 'click' && event.button === 0;
      const isMiddleClick = event.type === 'auxclick' && event.button === 1;

      if (event.defaultPrevented || (!isPrimaryClick && !isMiddleClick)) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (anchor.dataset.skipExternalGuard === 'true' || anchor.hasAttribute('download')) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (!href || !shouldGuardExternalNavigation(href)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      requestExternalNavigation(anchor.href || href, {
        mode:
          isMiddleClick ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          anchor.target === '_blank' ||
          (!!anchor.target && anchor.target !== '_self')
            ? 'new-tab'
            : 'same-tab',
        target: anchor.target || undefined,
      });
    };

    document.addEventListener('click', handleDocumentActivate, true);
    document.addEventListener('auxclick', handleDocumentActivate, true);

    return () => {
      document.removeEventListener('click', handleDocumentActivate, true);
      document.removeEventListener('auxclick', handleDocumentActivate, true);
    };
  }, []);

  const trustedParentDomain = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return getTrustedParentDomain(window.location.hostname);
  }, []);

  const pendingInfo = useMemo(() => {
    if (!pendingRequest) {
      return null;
    }

    return getExternalNavigationInfo(pendingRequest.href);
  }, [pendingRequest]);

  return (
    <>
      {children}
      <Modal
        centered
        open={Boolean(pendingRequest)}
        closable={false}
        keyboard={false}
        maskClosable={false}
        footer={[
          <Button key="cancel" size="large" onClick={dismissCurrentExternalNavigation}>
            取消
          </Button>,
          <Button key="confirm" type="primary" size="large" onClick={confirmCurrentExternalNavigation}>
            继续访问
          </Button>,
        ]}
        onCancel={dismissCurrentExternalNavigation}
        title={null}
        width={560}
        maskStyle={{
          background: withThemeAlpha(themeVars.colors.text, 0.52),
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        <ModalContent>
          <WarningHeader>
            <WarningIcon>
              <SafetyCertificateOutlined />
            </WarningIcon>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {getModalTitle(pendingInfo)}
              </Title>
              <Text type="secondary">
                {getModalSubtitle(pendingInfo)}
              </Text>
            </div>
          </WarningHeader>

          <UrlPanel>
            <Text strong>目标地址</Text>
            <Paragraph style={{ marginBottom: 0, marginTop: 8 }}>
              {pendingRequest?.href}
            </Paragraph>
          </UrlPanel>

          <HintList>
            <span>目标类型：{getKindLabel(pendingInfo)}</span>
            <span>{pendingInfo?.displayLabel ?? '目标信息'}：{pendingInfo?.displayTarget || '未知'}</span>
            <span>受信任范围：{getTrustScopeLabel(pendingInfo, trustedParentDomain, currentHostname)}</span>
            <span>风险提示：第三方页面内容、下载文件和账号登录行为均不受本站控制。</span>
          </HintList>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ExternalLinkGuardProvider;
