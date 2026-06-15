import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/context/AppContext';
import { getShiftTypeText } from '@/utils';
import { mockGunPositions, getKeyGunPositions } from '@/data/mockGunPositions';
import { mockActions } from '@/data/mockActions';
import RiskCard from '@/components/RiskCard';
import ProgressBar from '@/components/ProgressBar';
import GunPositionCard from '@/components/GunPositionCard';
import ActionCard from '@/components/ActionCard';
import ModalPopup from '@/components/ModalPopup';
import { RiskLevel } from '@/types';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const { userInfo, shiftInfo, tasks, showHandoverModal, setShowHandoverModal, completionRate, pendingCount } = useAppContext();
  const [keyGunPositions] = useState(getKeyGunPositions());

  const getRiskCount = (level: RiskLevel): number => {
    return mockGunPositions.filter(g => g.riskLevel === level).length;
  };

  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed').length, [tasks]);
  const processingTasks = useMemo(() => tasks.filter(t => t.status === 'processing').length, [tasks]);
  const totalTasks = useMemo(() => tasks.length, [tasks]);

  const handleCloseModal = () => {
    setShowHandoverModal(false);
  };

  const handleViewAllKeyPoints = () => {
    Taro.switchTab({
      url: '/pages/tasks/index'
    });
  };

  return (
    <ScrollView className={styles.homePage} scrollY>
      <ModalPopup
        visible={showHandoverModal}
        title="交接班提醒"
        gunPositions={keyGunPositions}
        onClose={handleCloseModal}
        onConfirm={handleCloseModal}
        confirmText="开始巡检"
      />

      <View className={styles.userSection}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>{userInfo.name.charAt(0)}</Text>
          </View>
          <View className={styles.userDetails}>
            <Text className={styles.userName}>{userInfo.name}</Text>
            <Text className={styles.userTeam}>{userInfo.role} · {userInfo.team}</Text>
          </View>
        </View>

        <View className={styles.shiftInfo}>
          <View className={styles.shiftRow}>
            <Text className={styles.shiftLabel}>班次</Text>
            <Text className={styles.shiftValue}>{getShiftTypeText(shiftInfo.shiftType)}</Text>
          </View>
          <View className={styles.shiftRow}>
            <Text className={styles.shiftLabel}>时间</Text>
            <Text className={styles.shiftValue}>{shiftInfo.startTime} - {shiftInfo.endTime}</Text>
          </View>
          <View className={styles.shiftRow}>
            <Text className={styles.shiftLabel}>未处理异常</Text>
            <Text className={styles.shiftValue} style={{ color: '#FFEB3B' }}>{pendingCount} 项</Text>
          </View>
        </View>
      </View>

      <View className={styles.completionSection}>
        <Text className={styles.sectionTitle}>本班完成率</Text>
        <View className={styles.completionCard}>
          <View className={styles.completionHeader}>
            <Text className={styles.completionText}>任务完成进度</Text>
            <Text className={styles.completionRate}>{completionRate}%</Text>
          </View>
          <ProgressBar progress={completionRate} showText={false} height={20} />
          <View className={styles.progressSection}>
            <View className={styles.progressItem}>
              <Text className={styles.progressNumber}>{completedTasks}</Text>
              <Text className={styles.progressLabel}>已完成</Text>
            </View>
            <View className={styles.progressItem}>
              <Text className={styles.progressNumber}>{processingTasks}</Text>
              <Text className={styles.progressLabel}>处理中</Text>
            </View>
            <View className={styles.progressItem}>
              <Text className={styles.progressNumber}>{pendingCount}</Text>
              <Text className={styles.progressLabel}>待处理</Text>
            </View>
            <View className={styles.progressItem}>
              <Text className={styles.progressNumber}>{totalTasks}</Text>
              <Text className={styles.progressLabel}>总计</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.riskSection}>
        <Text className={styles.sectionTitle}>风险等级总览</Text>
        <View className={styles.riskGrid}>
          <RiskCard level="normal" count={getRiskCount('normal')} label="枪位正常" />
          <RiskCard level="attention" count={getRiskCount('attention')} label="需要关注" />
          <RiskCard level="warning" count={getRiskCount('warning')} label="警告状态" />
          <RiskCard level="danger" count={getRiskCount('danger')} label="危险状态" />
        </View>
      </View>

      <View className={styles.keyPointsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>重点枪位</Text>
          <Text className={styles.viewAll} onClick={handleViewAllKeyPoints}>查看全部</Text>
        </View>
        <View className={styles.gunList}>
          {keyGunPositions.slice(0, 3).map((gun) => (
            <GunPositionCard key={gun.id} gun={gun} />
          ))}
        </View>
      </View>

      <View className={styles.actionsSection}>
        <Text className={styles.sectionTitle}>常见处置动作</Text>
        <View className={styles.actionList}>
          {mockActions.slice(0, 3).map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
