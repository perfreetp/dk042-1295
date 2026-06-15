import { Message } from '@/types';

export const mockMessages: Message[] = [
  {
    id: '1',
    type: 'alert',
    title: '高温告警',
    content: '1号充电枪温度达78.5℃，请立即处理！',
    isRead: false,
    createdAt: '2026-06-16 08:30',
    relatedId: '1'
  },
  {
    id: '2',
    type: 'reminder',
    title: '复查提醒',
    content: '2号充电枪需在30分钟后复查温度',
    isRead: false,
    createdAt: '2026-06-16 08:15',
    relatedId: '2'
  },
  {
    id: '3',
    type: 'handover',
    title: '交接班提醒',
    content: '请查看上一班遗留的3项未处理异常',
    isRead: false,
    createdAt: '2026-06-16 08:00'
  },
  {
    id: '4',
    type: 'system',
    title: '系统通知',
    content: '今日白班巡检任务已生成，共8项',
    isRead: true,
    createdAt: '2026-06-16 07:30'
  },
  {
    id: '5',
    type: 'alert',
    title: '温升异常',
    content: '8号充电枪温升达28.5K，需关注',
    isRead: true,
    createdAt: '2026-06-16 06:45',
    relatedId: '5'
  },
  {
    id: '6',
    type: 'reminder',
    title: '日常巡检提醒',
    content: '请按时完成上午的巡检任务',
    isRead: true,
    createdAt: '2026-06-16 06:00'
  },
  {
    id: '7',
    type: 'system',
    title: '维修响应',
    content: '维修人员已接单，预计20分钟后到达',
    isRead: true,
    createdAt: '2026-06-15 16:30'
  },
  {
    id: '8',
    type: 'handover',
    title: '交接班完成',
    content: '夜班已顺利交接给白班',
    isRead: true,
    createdAt: '2026-06-16 07:55'
  }
];

export const getUnreadCount = (): number => {
  return mockMessages.filter(m => !m.isRead).length;
};

export const getMessagesByType = (type?: string): Message[] => {
  if (!type || type === 'all') return mockMessages;
  return mockMessages.filter(m => m.type === type);
};

export const markAsRead = (id: string): void => {
  const msg = mockMessages.find(m => m.id === id);
  if (msg) msg.isRead = true;
};

export const markAllAsRead = (): void => {
  mockMessages.forEach(m => m.isRead = true);
};
