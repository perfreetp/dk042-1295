import { RiskLevel, TaskStatus, MessageType } from '@/types';

export const getRiskLevelText = (level: RiskLevel): string => {
  const map: Record<RiskLevel, string> = {
    normal: '正常',
    attention: '注意',
    warning: '警告',
    danger: '危险'
  };
  return map[level];
};

export const getRiskLevelColor = (level: RiskLevel): string => {
  const map: Record<RiskLevel, string> = {
    normal: '#00C853',
    attention: '#FFD600',
    warning: '#FF9100',
    danger: '#FF1744'
  };
  return map[level];
};

export const getTaskStatusText = (status: TaskStatus): string => {
  const map: Record<TaskStatus, string> = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成'
  };
  return map[status];
};

export const getTaskStatusColor = (status: TaskStatus): string => {
  const map: Record<TaskStatus, string> = {
    pending: '#FF9100',
    processing: '#1E88E5',
    completed: '#00C853'
  };
  return map[status];
};

export const getMessageTypeText = (type: MessageType): string => {
  const map: Record<MessageType, string> = {
    system: '系统通知',
    alert: '告警',
    reminder: '提醒',
    handover: '交接班'
  };
  return map[type];
};

export const getMessageTypeColor = (type: MessageType): string => {
  const map: Record<MessageType, string> = {
    system: '#1E88E5',
    alert: '#FF1744',
    reminder: '#FF9100',
    handover: '#9C27B0'
  };
  return map[type];
};

export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
};

export const formatDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
};

export const getShiftTypeText = (type: string): string => {
  const map: Record<string, string> = {
    morning: '白班',
    afternoon: '中班',
    night: '夜班'
  };
  return map[type] || type;
};

export const calculateTemperatureRise = (current: number, ambient: number = 25): number => {
  return Math.round((current - ambient) * 10) / 10;
};

export const getRiskByTemperature = (temp: number, rise: number): RiskLevel => {
  if (temp >= 70 || rise >= 40) return 'danger';
  if (temp >= 60 || rise >= 30) return 'warning';
  if (temp >= 50 || rise >= 20) return 'attention';
  return 'normal';
};

export const classnames = (...args: (string | undefined | null | false | Record<string, boolean>)[]): string => {
  const classes: string[] = [];
  args.forEach(arg => {
    if (!arg) return;
    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'object') {
      Object.keys(arg).forEach(key => {
        if (arg[key]) classes.push(key);
      });
    }
  });
  return classes.join(' ');
};
