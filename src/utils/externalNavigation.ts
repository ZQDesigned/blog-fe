export type ExternalNavigationMode = 'same-tab' | 'new-tab';
export type ExternalNavigationKind = 'web' | 'email' | 'phone' | 'custom';

export interface ExternalNavigationRequest {
  href: string;
  mode: ExternalNavigationMode;
  target?: string;
  features?: string;
}

export interface ExternalNavigationInfo {
  href: string;
  protocol: string;
  kind: ExternalNavigationKind;
  displayTarget: string;
  displayLabel: string;
  isTrusted: boolean;
}

type ExternalNavigationSubscriber = (request: ExternalNavigationRequest | null) => void;

const externalNavigationQueue: ExternalNavigationRequest[] = [];
const externalNavigationSubscribers = new Set<ExternalNavigationSubscriber>();

let nativeWindowOpen: typeof window.open | null = null;

const isIpAddress = (hostname: string) => {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':');
};

const isLocalHostname = (hostname: string) => {
  return hostname === 'localhost' || hostname.endsWith('.localhost') || isIpAddress(hostname);
};

const isTrustedMailDomain = (domain: string) => {
  return domain.toLowerCase().endsWith('.lnyynet.com');
};

const getMailtoRecipients = (url: URL) => {
  return decodeURIComponent(url.pathname)
    .split(/[;,]/)
    .map((recipient) => recipient.trim())
    .filter(Boolean);
};

const getEmailDomain = (recipient: string) => {
  const atIndex = recipient.lastIndexOf('@');
  if (atIndex <= 0 || atIndex === recipient.length - 1) {
    return null;
  }

  return recipient.slice(atIndex + 1).toLowerCase();
};

export const getTrustedParentDomain = (hostname = window.location.hostname): string | null => {
  const normalizedHostname = hostname.trim().toLowerCase();
  if (!normalizedHostname || isLocalHostname(normalizedHostname)) {
    return null;
  }

  const parts = normalizedHostname.split('.').filter(Boolean);
  if (parts.length < 2) {
    return normalizedHostname;
  }

  return parts.slice(-2).join('.');
};

const isTrustedHttpHost = (hostname: string) => {
  const currentHostname = window.location.hostname.toLowerCase();
  const normalizedHostname = hostname.toLowerCase();

  if (normalizedHostname === currentHostname) {
    return true;
  }

  const trustedParentDomain = getTrustedParentDomain(currentHostname);
  if (!trustedParentDomain) {
    return false;
  }

  return (
    normalizedHostname === trustedParentDomain ||
    normalizedHostname.endsWith(`.${trustedParentDomain}`)
  );
};

export const getExternalNavigationInfo = (href: string): ExternalNavigationInfo | null => {
  if (typeof window === 'undefined' || !href) {
    return null;
  }

  try {
    const url = new URL(href, window.location.href);

    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return {
        href,
        protocol: url.protocol,
        kind: 'web',
        displayTarget: url.hostname,
        displayLabel: '目标域名',
        isTrusted: url.origin === window.location.origin || isTrustedHttpHost(url.hostname),
      };
    }

    if (url.protocol === 'mailto:') {
      const recipients = getMailtoRecipients(url);
      const isTrusted =
        recipients.length > 0 &&
        recipients.every((recipient) => {
          const domain = getEmailDomain(recipient);
          return Boolean(domain && isTrustedMailDomain(domain));
        });

      return {
        href,
        protocol: url.protocol,
        kind: 'email',
        displayTarget: recipients.join(', ') || decodeURIComponent(url.pathname) || href,
        displayLabel: '邮箱地址',
        isTrusted,
      };
    }

    if (url.protocol === 'tel:') {
      return {
        href,
        protocol: url.protocol,
        kind: 'phone',
        displayTarget: decodeURIComponent(url.pathname) || href,
        displayLabel: '电话号码',
        isTrusted: false,
      };
    }

    return {
      href,
      protocol: url.protocol,
      kind: 'custom',
      displayTarget: url.protocol.replace(':', ''),
      displayLabel: '协议类型',
      isTrusted: false,
    };
  } catch {
    return null;
  }
};

export const getExternalNavigationDisplayHost = (href: string) => {
  const info = getExternalNavigationInfo(href);
  return info?.displayTarget ?? href;
};

export const shouldGuardExternalNavigation = (href: string) => {
  const trimmedHref = href.trim();
  if (!trimmedHref || trimmedHref.startsWith('#') || trimmedHref.startsWith('javascript:')) {
    return false;
  }

  const navigationInfo = getExternalNavigationInfo(trimmedHref);
  if (!navigationInfo) {
    return false;
  }

  return !navigationInfo.isTrusted;
};

const notifyExternalNavigationSubscribers = () => {
  const currentRequest = externalNavigationQueue[0] ?? null;
  externalNavigationSubscribers.forEach((subscriber) => {
    subscriber(currentRequest);
  });
};

export const subscribeToExternalNavigation = (subscriber: ExternalNavigationSubscriber) => {
  externalNavigationSubscribers.add(subscriber);
  subscriber(externalNavigationQueue[0] ?? null);

  return () => {
    externalNavigationSubscribers.delete(subscriber);
  };
};

export const setNativeWindowOpen = (open: typeof window.open) => {
  nativeWindowOpen = open;
};

const getNativeWindowOpen = () => {
  if (nativeWindowOpen) {
    return nativeWindowOpen;
  }

  return window.open.bind(window);
};

export const openExternalNavigationDirectly = (request: ExternalNavigationRequest) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const shouldOpenInCurrentTab =
    request.mode === 'same-tab' || !request.target || request.target === '_self';

  if (shouldOpenInCurrentTab) {
    window.location.assign(request.href);
    return null;
  }

  return getNativeWindowOpen()(request.href, request.target, request.features);
};

export const dismissCurrentExternalNavigation = () => {
  if (!externalNavigationQueue.length) {
    return;
  }

  externalNavigationQueue.shift();
  notifyExternalNavigationSubscribers();
};

export const confirmCurrentExternalNavigation = () => {
  const currentRequest = externalNavigationQueue.shift();
  notifyExternalNavigationSubscribers();

  if (!currentRequest) {
    return null;
  }

  return openExternalNavigationDirectly(currentRequest);
};

export const requestExternalNavigation = (
  href: string,
  options: Partial<Omit<ExternalNavigationRequest, 'href'>> = {},
) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const normalizedRequest: ExternalNavigationRequest = {
    href,
    mode: options.mode ?? 'new-tab',
    target: options.target,
    features: options.features,
  };

  if (!shouldGuardExternalNavigation(href)) {
    return openExternalNavigationDirectly(normalizedRequest);
  }

  externalNavigationQueue.push(normalizedRequest);
  notifyExternalNavigationSubscribers();
  return null;
};
