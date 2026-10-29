import type { ComponentType } from 'react';
import * as Icons from '@ant-design/icons';

// The CMS can supply any exported Ant Design icon name at runtime.
export default function DynamicIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;
  const icon = (Icons as unknown as Record<string, unknown>)[name];
  if (!icon || typeof icon !== 'object' || !('$$typeof' in icon)) return null;
  const Icon = icon as ComponentType<{ className?: string }>;
  return <Icon className={className} />;
}
