import React, { useMemo } from 'react';
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

  const allPhotos = useMemo(() => {
    const photos: string[] = [];
    if (task.photoUrl) photos.push(task.photoUrl);
    if (task.photoUrls) photos.push(...task.photoUrls);
    return [...new Set(photos)];
  }, [task.photoUrl, task.photoUrls]);

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

  const handlePreviewPhoto = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    Taro.previewImage({
      current: allPhotos[index],
      urls: allPhotos
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

      {task.reviewTime && (
        <View className={styles.reviewBox}>
          <Text className={styles.reviewText}>
            ⏰ 复查提醒: {task.reviewTime}分钟后
          </Text>
        </View>
      )}

      {allPhotos.length > 0 && (
        <View className={styles.photoSection}>
          <Text className={styles.photoLabel}>现场照片 ({allPhotos.length})</Text>
          <View className={styles.photoGrid}>
            {allPhotos.slice(0, 3).map((photo, index) => (
              <View
                key={index}
                className={styles.photoThumb}
                onClick={(e) => handlePreviewPhoto(e, index)}
              >
                <Text className={styles.photoThumbIcon}>📷</Text>
              </View>
            ))}
            {allPhotos.length > 3 && (
              <View className={styles.photoThumb}>
                <Text className={styles.photoMoreText}>+{allPhotos.length - 3}</Text>
              </View>
            )}
          </View>
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
