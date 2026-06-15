import { ActionItem } from '@/types';

export const mockActions: ActionItem[] = [
  {
    id: '1',
    title: '温度过高处理',
    description: '当枪线温度超过70℃时的紧急处理步骤',
    steps: [
      '立即按下急停按钮断电',
      '开启备用通风设备降温',
      '设置警示标识，禁止使用',
      '一键呼叫维修人员',
      '每15分钟记录一次温度'
    ]
  },
  {
    id: '2',
    title: '温升异常处理',
    description: '当温升超过30K时的处理步骤',
    steps: [
      '检查枪线连接是否松动',
      '查看冷却系统运行状态',
      '降低充电功率或暂停使用',
      '拍照记录发热点位置',
      '设置30分钟后复查提醒'
    ]
  },
  {
    id: '3',
    title: '交接班流程',
    description: '规范的交接班操作步骤',
    steps: [
      '查看上一班未处理异常',
      '确认重点关注枪位列表',
      '现场巡检关键设备状态',
      '确认工具和防护用品齐全',
      '签字确认交接完成'
    ]
  },
  {
    id: '4',
    title: '日常巡检要点',
    description: '日常巡检需要关注的重点',
    steps: [
      '查看温度监测系统数据',
      '检查枪线外观有无破损',
      '确认散热风扇运行正常',
      '记录异常情况并上报',
      '完成巡检记录签字'
    ]
  },
  {
    id: '5',
    title: '应急断电操作',
    description: '紧急情况下的断电步骤',
    steps: [
      '确认人员安全距离',
      '按下急停按钮（红色）',
      '关闭主控柜电源开关',
      '在操作屏上确认断电',
      '挂"禁止合闸"警示牌'
    ]
  },
  {
    id: '6',
    title: '维修呼叫流程',
    description: '呼叫维修人员的规范流程',
    steps: [
      '确认异常类型和位置',
      '点击一键呼叫维修按钮',
      '语音描述现场情况',
      '上传现场照片',
      '保持通讯畅通等待回复'
    ]
  }
];

export const getActionById = (id: string): ActionItem | undefined => {
  return mockActions.find(a => a.id === id);
};
