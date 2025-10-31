import React from 'react';
import { Result, Button } from 'antd';
import { CONTACT_EMAIL, CONTACT_QQ } from '../../constants/contact';

type GlobalErrorBoundaryProps = {
  children: React.ReactNode;
};

type GlobalErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class GlobalErrorBoundary extends React.Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  public state: GlobalErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 将错误信息输出到控制台，便于排查
    // eslint-disable-next-line no-console
    console.error('应用运行时出现未捕获错误:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const contactQQ = CONTACT_QQ;
      const contactEmail = CONTACT_EMAIL;
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
      const { error } = this.state;
      const mailSubject = encodeURIComponent('LumiCMS 页面错误反馈');
      const mailBody = encodeURIComponent(
        [
          '您好，',
          '',
          `我在访问：${currentUrl}`,
          '',
          `遇到的错误信息：${error?.message ?? '未知错误（未捕获 message）'}`,
          '',
          '错误堆栈：',
          error?.stack ?? '（暂无堆栈信息）',
          '',
          `浏览器信息：${userAgent}`,
          '',
          '---',
          '请协助排查，谢谢！',
        ].join('\n')
      );
      const mailHref = `mailto:${contactEmail}?subject=${mailSubject}&body=${mailBody}`;

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100vw',
            padding: 24,
            backgroundColor: '#ffffff',
          }}
        >
          <Result
            status="error"
            title="页面似乎出了点问题"
            subTitle="我们已经记录了错误，请稍后再试。如果问题持续存在，请联系站点维护者。"
            extra={[
              <Button type="primary" onClick={this.handleReload} key="reload">
                刷新页面
              </Button>,
              <Button key="email" href={mailHref}>
                邮件反馈
              </Button>,
            ]}
          >
            <div
              style={{
                marginTop: 16,
                fontSize: 14,
                color: '#595959',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <span>
                联系 QQ：
                <a
                  href={`tencent://message/?uin=${contactQQ}&Site=&Menu=yes`}
                  style={{ color: '#1677ff' }}
                >
                  {contactQQ}
                </a>
              </span>
              <span>
                联系邮箱：
                <a href={mailHref} style={{ color: '#1677ff' }}>
                  {contactEmail}
                </a>
              </span>
            </div>
            {this.state.error ? (
              <div
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  color: '#8c8c8c',
                  maxWidth: 420,
                  wordBreak: 'break-word',
                }}
              >
                错误信息：{this.state.error.message}
              </div>
            ) : null}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
