import { Task } from '@/types';

export const mockTasks: Task[] = [
  {
    id: '1',
    gunPositionId: '1',
    gunPositionName: '1号充电枪',
    gunPositionCode: 'GUN-001',
    title: '枪线温升巡检',
    riskLevel: 'danger',
    status: 'pending',
    description: '枪线温度78.5℃，温升45.2K，需立即处理',
    temperature: 78.5,
    temperatureRise: 45.2,
    createdAt: '2026-06-16 08:30',
    isUrgent: true
  },
  {
    id: '2',
    gunPositionId: '2',
    gunPositionName: '2号充电枪',
    gunPositionCode: 'GUN-002',
    title: '枪线温升巡检',
    riskLevel: 'warning',
    status: 'processing',
    description: '枪线温度65.3℃，温升32.1K，需密切关注',
    temperature: 65.3,
    temperatureRise: 32.1,
    createdAt: '2026-06-16 08:15',
    handler: '张三',
    measures: '已开启备用通风设备',
    isUrgent: false
  },
  {
    id: '3',
    gunPositionId: '3',
    gunPositionName: '3号充电枪',
    gunPositionCode: 'GUN-003',
    title: '常规巡检',
    riskLevel: 'attention',
    status: 'pending',
    description: '枪线温度55.0℃，温升22.5K，需关注',
    temperature: 55.0,
    temperatureRise: 22.5,
    createdAt: '2026-06-16 08:00',
    isUrgent: false
  },
  {
    id: '4',
    gunPositionId: '6',
    gunPositionName: '6号充电枪',
    gunPositionCode: 'GUN-006',
    title: '重点枪位巡检',
    riskLevel: 'attention',
    status: 'pending',
    description: '重点关注枪位，需按时巡检',
    temperature: 52.1,
    temperatureRise: 19.8,
    createdAt: '2026-06-16 07:15',
    isUrgent: false
  },
  {
    id: '5',
    gunPositionId: '8',
    gunPositionName: '8号充电枪',
    gunPositionCode: 'GUN-008',
    title: '枪线温升巡检',
    riskLevel: 'warning',
    status: 'pending',
    description: '枪线温度62.0℃，温升28.5K，需处理',
    temperature: 62.0,
    temperatureRise: 28.5,
    createdAt: '2026-06-16 06:45',
    isUrgent: false
  },
  {
    id: '6',
    gunPositionId: '4',
    gunPositionName: '4号充电枪',
    gunPositionCode: 'GUN-004',
    title: '常规巡检',
    riskLevel: 'normal',
    status: 'completed',
    description: '巡检完成，一切正常',
    temperature: 38.2,
    temperatureRise: 8.5,
    createdAt: '2026-06-16 07:45',
    completedAt: '2026-06-16 08:00',
    handler: '张三',
    measures: '正常巡检，无需处理',
    isUrgent: false
  },
  {
    id: '7',
    gunPositionId: '5',
    gunPositionName: '5号充电枪',
    gunPositionCode: 'GUN-005',
    title: '常规巡检',
    riskLevel: 'normal',
    status: 'completed',
    description: '巡检完成，一切正常',
    temperature: 36.8,
    temperatureRise: 6.2,
    createdAt: '2026-06-16 07:30',
    completedAt: '2026-06-16 07:45',
    handler: '张三',
    measures: '正常巡检，无需处理',
    isUrgent: false
  },
  {
    id: '8',
    gunPositionId: '7',
    gunPositionName: '7号充电枪',
    gunPositionCode: 'GUN-007',
    title: '常规巡检',
    riskLevel: 'normal',
    status: 'completed',
    description: '巡检完成，一切正常',
    temperature: 35.5,
    temperatureRise: 5.8,
    createdAt: '2026-06-16 07:00',
    completedAt: '2026-06-16 07:15',
    handler: '张三',
    measures: '正常巡检，无需处理',
    isUrgent: false
  }
];

export const getTasksByStatus = (status?: string): Task[] => {
  if (!status || status === 'all') return mockTasks;
  return mockTasks.filter(t => t.status === status);
};

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find(t => t.id === id);
};

export const getPendingTasksCount = (): number => {
  return mockTasks.filter(t => t.status === 'pending').length;
};

export const getCompletionRate = (): number => {
  const completed = mockTasks.filter(t => t.status === 'completed').length;
  return Math.round((completed / mockTasks.length) * 100);
};
