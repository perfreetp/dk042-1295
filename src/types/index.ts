export type RiskLevel = 'normal' | 'attention' | 'warning' | 'danger';

export type TaskStatus = 'pending' | 'processing' | 'completed';

export type MessageType = 'system' | 'alert' | 'reminder' | 'handover';

export interface GunPosition {
  id: string;
  name: string;
  code: string;
  riskLevel: RiskLevel;
  temperature: number;
  temperatureRise: number;
  lastCheckTime: string;
  isKeyPoint: boolean;
}

export interface Task {
  id: string;
  gunPositionId: string;
  gunPositionName: string;
  gunPositionCode: string;
  title: string;
  riskLevel: RiskLevel;
  status: TaskStatus;
  description: string;
  temperature: number;
  temperatureRise: number;
  createdAt: string;
  completedAt?: string;
  handler?: string;
  measures?: string;
  photoUrl?: string;
  photoUrls?: string[];
  reviewTime?: string;
  isUrgent: boolean;
  timeline?: TaskTimelineItem[];
}

export interface TaskTimelineItem {
  time: string;
  action: string;
  operator?: string;
  detail?: string;
}

export interface ExceptionReport {
  id: string;
  gunPositionId: string;
  gunPositionName: string;
  gunPositionCode: string;
  riskLevel: RiskLevel;
  temperature: number;
  temperatureRise: number;
  description: string;
  measures: string;
  photoUrls: string[];
  createdAt: string;
  reporter: string;
  repairCalled: boolean;
  repairer?: string;
}

export interface Message {
  id: string;
  type: MessageType;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface Record {
  id: string;
  date: string;
  gunPositionName: string;
  gunPositionCode: string;
  riskLevel: RiskLevel;
  action: string;
  description: string;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  steps: string[];
}

export interface UserInfo {
  name: string;
  role: string;
  team: string;
}

export interface ShiftInfo {
  date: string;
  shiftType: 'morning' | 'afternoon' | 'night';
  startTime: string;
  endTime: string;
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}
