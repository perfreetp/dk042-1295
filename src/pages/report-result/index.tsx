import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppContext } from '@/context/AppContext';
import {
  getRiskLevelText,
  getRiskLevelColor
} from '@/utils';
import ActionButton from '@/components/ActionButton';
import styles from './index.module.scss';

const ReportResultPage: React.FC = () => {
  const router = useRouter();
  const { tasks, messages, records } = useAppContext();

  const taskId = router.params.taskId;
  const messageId = router.params.messageId;
  const recordId = router.params.recordId;

  const task = useMemo(() => tasks.find(t => t.id === taskId), [tasks, taskId]);
  const message = useMemo(() => messages.find(m => m.id === messageId), [messages, messageId]);
  const record = useMemo(() => records.find(r => r.id === recordId), [records, recordId]);

  const riskColor = task ? getRiskLevelColor(task.riskLevel) : '#86909C';
  const riskText = task ? getRiskLevelText(task.riskLevel) : '--';

  const handleGoTasks = () => {
    Taro.switchTab({ url: '/pages/tasks/index' });
  };

  const handleGoMessages = () => {
    Taro.switchTab({ url: '/pages/messages/index' });
  };

  const handleGoHome = () => {
    Taro.switchTab({ url: '/pages/home/index' });
  };

  return (
    <ScrollView className={styles.resultPage} scrollY>
      <View className={styles.successHeader}>
        <Text className={styles.successIcon}>✅</Text>
        <Text className={styles.successTitle}>上报成功</Text>
        <Text className={styles.successDesc}>异常信息已同步至相关模块</Text>
      </View>

      <View className={styles.resultSection}>
        <Text className={styles.resultSectionTitle}>📋 生成结果</Text>

        {task && (
          <View className={styles.resultItem}>
            <Text className={styles.resultItemIcon}>📌</Text>
            <View className={styles.resultItemContent}>
              <Text className={styles.resultItemLabel}>
                待处理任务已生成
              </Text>
              <Text className={styles.resultItemDesc}>
                <View className={styles.riskDot} style={{ backgroundColor: riskColor }} />
                {task.gunPositionName}({task.gunPositionCode}) · {riskText} · {task.temperature}℃/{task.temperatureRise}K
              </Text>
            </View>
          </View>
        )}

        {message && (
          <View className={styles.resultItem}>
            <Text className={styles.resultItemIcon}>🔔</Text>
            <View className={styles.resultItemContent}>
              <Text className={styles.resultItemLabel}>
                {message.type === 'alert' ? '异常告警已推送' : '提醒消息已生成'}
              </Text>
              <Text className={styles.resultItemDesc}>{message.content}</Text>
            </View>
          </View>
        )}

        {record && (
          <View className={styles.resultItem}>
            <Text className={styles.resultItemIcon}>📝</Text>
            <View className={styles.resultItemContent}>
              <Text className={styles.resultItemLabel}>上报记录已保存</Text>
              <Text className={styles.resultItemDesc}>
                {record.gunPositionName} · {record.action} · {record.description?.substring(0, 30)}...
              </Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.actionSection}>
        <View className={styles.actionBtn}>
          <ActionButton text="前往当班任务处理" type="primary" size="large" onClick={handleGoTasks} block />
        </View>

        <View className={styles.secondaryBtn} onClick={handleGoMessages}>
          <Text className={styles.secondaryBtnIcon}>🔔</Text>
          <Text className={styles.secondaryBtnText}>查看告警消息</Text>
        </View>
      </View>

      <View className={styles.backBtn} onClick={handleGoHome}>
        <Text className={styles.backBtnText}>返回首页</Text>
      </View>
    </ScrollView>
  );
};

export default ReportResultPage;
