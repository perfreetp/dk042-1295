import { Record, RiskLevel } from '@/types';
import { generateId, getCurrentDateTime, getCurrentDate, getRiskLevelText } from '@/utils';

export const mockRecords: Record[] = [
  {
    id: '1',
    date: '2026-06-16',
    gunPositionName: '4号充电枪',
    gunPositionCode: 'GUN-004',
    riskLevel: 'normal',
    action: '常规巡检',
    description: '巡检完成，一切正常，温度38.2℃',
    createdAt: '2026-06-16 08:00'
  },
  {
    id: '2',
    date: '2026-06-16',
    gunPositionName: '5号充电枪',
    gunPositionCode: 'GUN-005',
    riskLevel: 'normal',
    action: '常规巡检',
    description: '巡检完成，一切正常，温度36.8℃',
    createdAt: '2026-06-16 07:45'
  },
  {
    id: '3',
    date: '2026-06-16',
    gunPositionName: '7号充电枪',
    gunPositionCode: 'GUN-007',
    riskLevel: 'normal',
    action: '常规巡检',
    description: '巡检完成，一切正常，温度35.5℃',
    createdAt: '2026-06-16 07:15'
  },
  {
    id: '4',
    date: '2026-06-15',
    gunPositionName: '1号充电枪',
    gunPositionCode: 'GUN-001',
    riskLevel: 'warning',
    action: '异常处理',
    description: '发现温升异常，已开启通风设备降温，已呼叫维修',
    createdAt: '2026-06-15 16:30'
  },
  {
    id: '5',
    date: '2026-06-15',
    gunPositionName: '3号充电枪',
    gunPositionCode: 'GUN-003',
    riskLevel: 'attention',
    action: '温度复查',
    description: '复查温度正常，已解除关注',
    createdAt: '2026-06-15 14:20'
  },
  {
    id: '6',
    date: '2026-06-15',
    gunPositionName: '6号充电枪',
    gunPositionCode: 'GUN-006',
    riskLevel: 'normal',
    action: '常规巡检',
    description: '巡检完成，一切正常',
    createdAt: '2026-06-15 10:30'
  },
  {
    id: '7',
    date: '2026-06-14',
    gunPositionName: '2号充电枪',
    gunPositionCode: 'GUN-002',
    riskLevel: 'danger',
    action: '紧急处理',
    description: '温度达82℃，立即断电处理，更换枪线接头',
    createdAt: '2026-06-14 18:45'
  },
  {
    id: '8',
    date: '2026-06-14',
    gunPositionName: '8号充电枪',
    gunPositionCode: 'GUN-008',
    riskLevel: 'warning',
    action: '异常上报',
    description: '发现温升异常，已上报并记录',
    createdAt: '2026-06-14 11:20'
  },
  {
    id: '9',
    date: '2026-06-13',
    gunPositionName: '1号充电枪',
    gunPositionCode: 'GUN-001',
    riskLevel: 'normal',
    action: '常规巡检',
    description: '巡检完成，一切正常',
    createdAt: '2026-06-13 09:15'
  },
  {
    id: '10',
    date: '2026-06-13',
    gunPositionName: '4号充电枪',
    gunPositionCode: 'GUN-004',
    riskLevel: 'attention',
    action: '温度监测',
    description: '持续监测中，温度稳定在55℃左右',
    createdAt: '2026-06-13 15:30'
  }
];

export const getRecordsByDate = (date?: string): Record[] => {
  if (!date) return mockRecords;
  return mockRecords.filter(r => r.date === date);
};

export const getRecordsByRiskLevel = (riskLevel?: string): Record[] => {
  if (!riskLevel || riskLevel === 'all') return mockRecords;
  return mockRecords.filter(r => r.riskLevel === riskLevel);
};

export const getRecordById = (id: string): Record | undefined => {
  return mockRecords.find(r => r.id === id);
};

export const getStatistics = () => {
  const total = mockRecords.length;
  const byRisk = {
    normal: mockRecords.filter(r => r.riskLevel === 'normal').length,
    attention: mockRecords.filter(r => r.riskLevel === 'attention').length,
    warning: mockRecords.filter(r => r.riskLevel === 'warning').length,
    danger: mockRecords.filter(r => r.riskLevel === 'danger').length
  };
  return { total, byRisk };
};

export interface CreateRecordData {
  gunPositionName: string;
  gunPositionCode: string;
  riskLevel: RiskLevel;
  action: string;
  description: string;
  temperature?: number;
  temperatureRise?: number;
  measures?: string;
}

export const createReportRecord = (data: CreateRecordData): Record => {
  let description = data.description;
  if (data.temperature !== undefined && data.temperatureRise !== undefined) {
    description += `，温度${data.temperature}℃，温升${data.temperatureRise}K`;
  }
  if (data.measures) {
    description += `，已采取措施：${data.measures}`;
  }

  return {
    id: generateId(),
    date: getCurrentDate(),
    gunPositionName: data.gunPositionName,
    gunPositionCode: data.gunPositionCode,
    riskLevel: data.riskLevel,
    action: data.action,
    description,
    createdAt: getCurrentDateTime()
  };
};
