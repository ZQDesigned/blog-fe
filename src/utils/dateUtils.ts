export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    console.error('Invalid date timestamp:', timestamp);
    return '未知时间';
  }

  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '未知时间';
  }
};
