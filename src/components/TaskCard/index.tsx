import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Task } from '@/types';
import {
  getRiskLevelText,
  getRiskLevelColor,
  getTaskStatusText,
  getTaskStatusColor,
  formatTime,
  classnames
} from '@/utils';
import styles from './index.module.scss';

interface TaskCardProps {
  task: Task;
  onProcess?: (task: Task) => void;
  onComplete?: (task: Task) => void;
  onCallRepair?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onProcess, onComplete, onCallRepair }) => {
  const riskColor = getRiskLevelColor(task.riskLevel);
  const riskText = getRiskLevelText(task.riskLevel);
  const statusColor = getTaskStatusColor(task.status);
  const statusText = getTaskStatusText(task.status);

  const bgColorMap = {
    normal: '#E8F5E9',
    attention: '#FFFDE7',
    warning: '#FFF3E0',
    danger: '#FFEBEE'
  };

  const handleProcess = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProcess?.(task);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onComplete?.(task);
  };

  const handleCallRepair = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCallRepair?.(task);
  };

  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/task-detail/index?id=${task.id}`
    });
  };

  return (
    <View className={classnames(styles.taskCard, styles[task.riskLevel])} onClick={handleClick}>
      <View className={styles.taskHeader}>
        <View className={styles.taskTitleRow}>
          <Text className={styles.taskTitle}>{task.title}</Text>
          {task.isUrgent && (
            <View className={styles.urgentTag}>
              <Text className={styles.urgentText}>紧急</Text>
            </View>
          )}
        </View>
        <View
          className={styles.riskTag}
          style={{ backgroundColor: riskColor }}
        >
          <Text className={styles.riskTagText}>{riskText}</Text>
        </View>
      </View>

      <View className={styles.taskInfo}>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>枪位:</Text>
          <Text className={styles.infoValue}>{task.gunPositionName} ({task.gunPositionCode})</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>温度:</Text>
          <Text className={styles.infoValue} style={{ color: riskColor }}>
            {task.temperature}℃ / 温升 {task.temperatureRise}K
          </Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>状态:</Text>
          <Text className={styles.infoValue} style={{ color: statusColor }}>{statusText}</Text>
        </View>
        {task.handler && (
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>处理人:</Text>
            <Text className={styles.infoValue}>{task.handler}</Text>
          </View>
        )}
      </View>

      <Text className={styles.taskDesc}>{task.description}</Text>

      {task.measures && (
        <View className={styles.measuresBox}>
          <Text className={styles.measuresLabel}>已采取措施:</Text>
          <Text className={styles.measuresText}>{task.measures}</Text>
        </View>
      )}

      <View className={styles.taskFooter}>
        <Text className={styles.createTime}>{formatTime(task.createdAt)} 创建</Text>

        <View className={styles.actionButtons}>
          {task.status === 'pending' && (
            <>
              <Button
                className={classnames(styles.actionBtn, styles.primaryBtn)}
                onClick={handleProcess}
              >
                <Text className={styles.btnText}>开始处理</Text>
              </Button>
              <Button
                className={classnames(styles.actionBtn, styles.dangerBtn)}
                onClick={handleCallRepair}
              >
                <Text className={styles.btnText}>呼叫维修</Text>
              </Button>
            </>
          )}
          {task.status === 'processing' && (
            <Button
              className={classnames(styles.actionBtn, styles.successBtn)}
              onClick={handleComplete}
            >
              <Text className={styles.btnText}>完成处理</Text>
            </Button>
          )}
          {task.status === 'completed' && task.completedAt && (
            <Text className={styles.completedTime}>
              {formatTime(task.completedAt)} 完成
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default TaskCard;
