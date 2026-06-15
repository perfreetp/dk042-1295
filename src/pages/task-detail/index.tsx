import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppContext } from '@/context/AppContext';
import {
  getRiskLevelText,
  getRiskLevelColor,
  getTaskStatusText,
  getTaskStatusColor,
  formatDateTime,
  classnames
} from '@/utils';
import ActionButton from '@/components/ActionButton';
import styles from './index.module.scss';

const TaskDetailPage: React.FC = () => {
  const router = useRouter();
  const { tasks, updateTaskStatus, addRecord, addReviewReminder } = useAppContext();
  const taskId = router.params.id;

  const task = useMemo(() => {
    return tasks.find(t => t.id === taskId);
  }, [tasks, taskId]);

  const timeline = useMemo(() => {
    if (!task) return [];
    const items = [
      {
        time: task.createdAt,
        action: '任务创建',
        detail: `${task.gunPositionName}(${task.gunPositionCode}) 温度${task.temperature}℃，温升${task.temperatureRise}K`,
        done: true
      }
    ];
    if (task.timeline && task.timeline.length > 0) {
      task.timeline.forEach(t => {
        items.push({
          time: t.time,
          action: t.action,
          operator: t.operator,
          detail: t.detail,
          done: task.status === 'completed' || t.action !== '开始处理'
        });
      });
    }
    return items;
  }, [task]);

  const allPhotos = useMemo(() => {
    if (!task) return [];
    const photos: string[] = [];
    if (task.photoUrl) photos.push(task.photoUrl);
    if (task.photoUrls) photos.push(...task.photoUrls);
    return [...new Set(photos)];
  }, [task]);

  const handlePreviewPhoto = useCallback((index: number) => {
    Taro.previewImage({
      current: allPhotos[index],
      urls: allPhotos
    });
  }, [allPhotos]);

  const handleCallRepair = useCallback(() => {
    Taro.makePhoneCall({ phoneNumber: '400-123-4567' }).catch(() => {});
  }, []);

  const handleStartReview = useCallback(() => {
    if (!task) return;
    addReviewReminder(task);
    Taro.showToast({ title: '已设置复查提醒', icon: 'success' });
  }, [task, addReviewReminder]);

  const handleProcess = useCallback(() => {
    if (!task) return;
    Taro.navigateBack().then(() => {
      setTimeout(() => {
        Taro.eventCenter.trigger('taskAction', { taskId: task.id, action: 'process' });
      }, 300);
    });
  }, [task]);

  const handleComplete = useCallback(() => {
    if (!task) return;
    Taro.navigateBack().then(() => {
      setTimeout(() => {
        Taro.eventCenter.trigger('taskAction', { taskId: task.id, action: 'complete' });
      }, 300);
    });
  }, [task]);

  if (!task) {
    return (
      <View className={styles.detailPage}>
        <View style={{ textAlign: 'center', padding: '120rpx 0' }}>
          <Text style={{ fontSize: '80rpx', opacity: 0.3 }}>📋</Text>
          <Text style={{ display: 'block', fontSize: '32rpx', color: '#86909C', marginTop: '24rpx' }}>任务不存在</Text>
        </View>
      </View>
    );
  }

  const riskColor = getRiskLevelColor(task.riskLevel);
  const riskText = getRiskLevelText(task.riskLevel);
  const statusColor = getTaskStatusColor(task.status);
  const statusText = getTaskStatusText(task.status);

  return (
    <ScrollView className={styles.detailPage} scrollY>
      <View className={styles.statusBar} style={{ backgroundColor: riskColor + '10', borderLeft: `8rpx solid ${riskColor}` }}>
        <View className={styles.statusInfo}>
          <View className={styles.statusDot} style={{ backgroundColor: statusColor }} />
          <Text className={styles.statusText} style={{ color: statusColor }}>{statusText}</Text>
        </View>
        <View className={styles.riskTag} style={{ backgroundColor: riskColor }}>
          <Text className={styles.riskTagText}>{riskText}</Text>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>基本信息</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoCell}>
            <Text className={styles.infoCellLabel}>枪位</Text>
            <Text className={styles.infoCellValue}>{task.gunPositionName}</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.infoCellLabel}>编号</Text>
            <Text className={styles.infoCellValue}>{task.gunPositionCode}</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.infoCellLabel}>当前温度</Text>
            <Text className={styles.infoCellValue} style={{ color: riskColor }}>{task.temperature}℃</Text>
          </View>
          <View className={styles.infoCell}>
            <Text className={styles.infoCellLabel}>温升</Text>
            <Text className={styles.infoCellValue} style={{ color: riskColor }}>{task.temperatureRise}K</Text>
          </View>
          {task.handler && (
            <View className={styles.infoCell}>
              <Text className={styles.infoCellLabel}>处理人</Text>
              <Text className={styles.infoCellValue}>{task.handler}</Text>
            </View>
          )}
          <View className={styles.infoCell}>
            <Text className={styles.infoCellLabel}>创建时间</Text>
            <Text className={styles.infoCellValue}>{formatDateTime(task.createdAt)}</Text>
          </View>
        </View>
      </View>

      {task.description && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>现场描述</Text>
          <Text className={styles.descText}>{task.description}</Text>
        </View>
      )}

      {task.measures && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>临时措施</Text>
          <View className={styles.measuresBox}>
            <Text className={styles.measuresLabel}>已采取措施:</Text>
            <Text className={styles.measuresText}>{task.measures}</Text>
          </View>
        </View>
      )}

      {task.reviewTime && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>复查提醒</Text>
          <View className={styles.reviewBox}>
            <View className={styles.reviewInfo}>
              <Text className={styles.reviewIcon}>⏰</Text>
              <Text className={styles.reviewText}>{task.reviewTime}分钟后复查</Text>
            </View>
            <View className={styles.reviewBtn} onClick={handleStartReview}>
              <Text className={styles.reviewBtnText}>设置提醒</Text>
            </View>
          </View>
        </View>
      )}

      {allPhotos.length > 0 && (
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>现场照片 ({allPhotos.length})</Text>
          <View className={styles.photoGrid}>
            {allPhotos.map((photo, index) => (
              <View
                key={index}
                className={styles.photoItem}
                onClick={() => handlePreviewPhoto(index)}
              >
                <Text className={styles.photoPlaceholder}>�</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>处理时间线</Text>
        <View className={styles.timeline}>
          {timeline.map((item, index) => (
            <View key={index} className={styles.timelineItem}>
              <View className={classnames(styles.timelineDot, {
                [styles.timelineDotDone]: item.done,
                [styles.timelineDotActive]: !item.done
              })} />
              <Text className={styles.timelineTime}>{formatDateTime(item.time)}</Text>
              <Text className={styles.timelineAction}>{item.action}</Text>
              {item.operator && <Text className={styles.timelineOperator}>操作人: {item.operator}</Text>}
              {item.detail && <Text className={styles.timelineDetail}>{item.detail}</Text>}
            </View>
          ))}
        </View>
      </View>

      {task.status !== 'completed' && (
        <View className={styles.actionSection}>
          {task.status === 'pending' && (
            <View className={styles.actionBtn}>
              <ActionButton text="开始处理" type="primary" size="large" onClick={handleProcess} block />
            </View>
          )}
          {task.status === 'processing' && (
            <View className={styles.actionBtn}>
              <ActionButton text="完成处理" type="success" size="large" onClick={handleComplete} block />
            </View>
          )}
        </View>
      )}

      {task.status !== 'completed' && (
        <View className={styles.callBtn} onClick={handleCallRepair}>
          <Text className={styles.callIcon}>📞</Text>
          <Text className={styles.callText}>一键呼叫维修人员</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default TaskDetailPage;
