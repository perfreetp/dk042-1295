import { GunPosition } from '@/types';

export const mockGunPositions: GunPosition[] = [
  {
    id: '1',
    name: '1号充电枪',
    code: 'GUN-001',
    riskLevel: 'danger',
    temperature: 78.5,
    temperatureRise: 45.2,
    lastCheckTime: '2026-06-16 08:30',
    isKeyPoint: true
  },
  {
    id: '2',
    name: '2号充电枪',
    code: 'GUN-002',
    riskLevel: 'warning',
    temperature: 65.3,
    temperatureRise: 32.1,
    lastCheckTime: '2026-06-16 08:15',
    isKeyPoint: true
  },
  {
    id: '3',
    name: '3号充电枪',
    code: 'GUN-003',
    riskLevel: 'attention',
    temperature: 55.0,
    temperatureRise: 22.5,
    lastCheckTime: '2026-06-16 08:00',
    isKeyPoint: false
  },
  {
    id: '4',
    name: '4号充电枪',
    code: 'GUN-004',
    riskLevel: 'normal',
    temperature: 38.2,
    temperatureRise: 8.5,
    lastCheckTime: '2026-06-16 07:45',
    isKeyPoint: false
  },
  {
    id: '5',
    name: '5号充电枪',
    code: 'GUN-005',
    riskLevel: 'normal',
    temperature: 36.8,
    temperatureRise: 6.2,
    lastCheckTime: '2026-06-16 07:30',
    isKeyPoint: false
  },
  {
    id: '6',
    name: '6号充电枪',
    code: 'GUN-006',
    riskLevel: 'attention',
    temperature: 52.1,
    temperatureRise: 19.8,
    lastCheckTime: '2026-06-16 07:15',
    isKeyPoint: true
  },
  {
    id: '7',
    name: '7号充电枪',
    code: 'GUN-007',
    riskLevel: 'normal',
    temperature: 35.5,
    temperatureRise: 5.8,
    lastCheckTime: '2026-06-16 07:00',
    isKeyPoint: false
  },
  {
    id: '8',
    name: '8号充电枪',
    code: 'GUN-008',
    riskLevel: 'warning',
    temperature: 62.0,
    temperatureRise: 28.5,
    lastCheckTime: '2026-06-16 06:45',
    isKeyPoint: false
  }
];

export const getKeyGunPositions = (): GunPosition[] => {
  return mockGunPositions.filter(g => g.isKeyPoint || g.riskLevel === 'danger' || g.riskLevel === 'warning');
};

export const getGunPositionById = (id: string): GunPosition | undefined => {
  return mockGunPositions.find(g => g.id === id);
};
