import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { RiskLevel } from '@/types';
import {
  getRiskLevelText,
  getRiskLevelColor,
  getShiftTypeText,
  classnames,
  getCurrentDate
} from '@/utils';
import RecordCard from '@/components/RecordCard';
import { useAppContext } from '@/context/AppContext';
import styles from './index.module.scss';

const RecordsPage: React.FC = () => {
  const { userInfo, shiftInfo, tasks, records, completionRate } = useAppContext();
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const today = getCurrentDate();

  const shiftSummary = useMemo(() => {
    const todayTasks = tasks;
    const todayCompleted = todayTasks.filter(t => t.status === 'completed').length;
    const todayPending = todayTasks.filter(t => t.status === 'pending').length;
    const todayProcessing = todayTasks.filter(t => t.status === 'processing').length;
    const todayReports = records.filter(r => r.action === '异常上报').length;

    const byRisk = {
      normal: todayTasks.filter(t => t.riskLevel === 'normal').length,
      attention: todayTasks.filter(t => t.riskLevel === 'attention').length,
      warning: todayTasks.filter(t => t.riskLevel === 'warning').length,
      danger: todayTasks.filter(t => t.riskLevel === 'danger').length
    };

    const exceptionReports = records.filter(r => r.action === '异常上报');
    const reportsByRisk = {
      normal: exceptionReports.filter(r => r.riskLevel === 'normal').length,
      attention: exceptionReports.filter(r => r.riskLevel === 'attention').length,
      warning: exceptionReports.filter(r => r.riskLevel === 'warning').length,
      danger: exceptionReports.filter(r => r.riskLevel === 'danger').length
    };

    return {
      totalTasks: todayTasks.length,
      completed: todayCompleted,
      pending: todayPending,
      processing: todayProcessing,
      reports: todayReports,
      byRisk,
      reportsByRisk
    };
  }, [tasks, records]);

  const statistics = useMemo(() => {
    const total = records.length;
    const byRisk = {
      normal: records.filter(r => r.riskLevel === 'normal').length,
      attention: records.filter(r => r.riskLevel === 'attention').length,
      warning: records.filter(r => r.riskLevel === 'warning').length,
      danger: records.filter(r => r.riskLevel === 'danger').length
    };
    return { total, byRisk };
  }, [records]);

  const dateOptions = [
    { value: 'all', label: '全部' },
    { value: today, label: '今天' },
    { value: '2026-06-15', label: '昨天' },
    { value: '2026-06-14', label: '前天' },
    { value: '2026-06-13', label: '更早' }
  ];

  const riskOptions: { value: string; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'normal', label: '正常' },
    { value: 'attention', label: '注意' },
    { value: 'warning', label: '警告' },
    { value: 'danger', label: '危险' }
  ];

  const filteredRecords = useMemo(() => {
    let filtered = records;

    if (dateFilter !== 'all') {
      if (dateFilter === '2026-06-13') {
        filtered = filtered.filter(r => r.date <= '2026-06-13');
      } else {
        filtered = filtered.filter(r => r.date === dateFilter);
      }
    }

    if (riskFilter !== 'all') {
      filtered = filtered.filter(r => r.riskLevel === riskFilter);
    }

    return filtered;
  }, [records, dateFilter, riskFilter]);

  const riskBgColors: Record<string, string> = {
    normal: '#E8F5E9',
    attention: '#FFFDE7',
    warning: '#FFF3E0',
    danger: '#FFEBEE',
    all: 'transparent'
  };

  return (
    <ScrollView className={styles.recordsPage} scrollY>
      <View className={styles.profileSection}>
        <View className={styles.userInfo}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>{userInfo.name.charAt(0)}</Text>
          </View>
          <View className={styles.userDetails}>
            <Text className={styles.userName}>{userInfo.name}</Text>
            <Text className={styles.userRole}>{userInfo.role} · {userInfo.team}</Text>
          </View>
        </View>

        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{statistics.total}</Text>
            <Text className={styles.statLabel}>总记录</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{statistics.byRisk.normal}</Text>
            <Text className={styles.statLabel}>正常</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{statistics.byRisk.warning + statistics.byRisk.danger}</Text>
            <Text className={styles.statLabel}>异常</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statNumber}>{completionRate}%</Text>
            <Text className={styles.statLabel}>完成率</Text>
          </View>
        </View>
      </View>

      <View className={styles.shiftSummarySection}>
        <View className={styles.shiftSummaryHeader}>
          <Text className={styles.shiftSummaryTitle}>本班汇总</Text>
          <Text className={styles.shiftSummaryShift}>{getShiftTypeText(shiftInfo.shiftType)} · {shiftInfo.startTime}-{shiftInfo.endTime}</Text>
        </View>

        <View className={styles.summaryCards}>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryCardNumber} style={{ color: '#00C853' }}>{shiftSummary.completed}</Text>
            <Text className={styles.summaryCardLabel}>已完成任务</Text>
          </View>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryCardNumber} style={{ color: '#1E88E5' }}>{shiftSummary.processing}</Text>
            <Text className={styles.summaryCardLabel}>处理中</Text>
          </View>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryCardNumber} style={{ color: '#FF9100' }}>{shiftSummary.pending}</Text>
            <Text className={styles.summaryCardLabel}>待处理</Text>
          </View>
          <View className={styles.summaryCard}>
            <Text className={styles.summaryCardNumber} style={{ color: '#FF1744' }}>{shiftSummary.reports}</Text>
            <Text className={styles.summaryCardLabel}>异常上报</Text>
          </View>
        </View>

        <View className={styles.summaryDetail}>
          <View className={styles.summaryDetailRow}>
            <Text className={styles.summaryDetailLabel}>任务风险分布</Text>
            <View className={styles.riskDistribution}>
              {(['danger', 'warning', 'attention', 'normal'] as RiskLevel[]).map((level) => (
                shiftSummary.byRisk[level] > 0 && (
                  <View key={level} className={styles.riskDistItem} style={{ backgroundColor: riskBgColors[level] }}>
                    <Text style={{ color: getRiskLevelColor(level), fontSize: '22rpx', fontWeight: 'bold' }}>
                      {shiftSummary.byRisk[level]}
                    </Text>
                    <Text style={{ fontSize: '20rpx', color: '#86909C' }}>{getRiskLevelText(level)}</Text>
                  </View>
                )
              ))}
            </View>
          </View>
          <View className={styles.summaryDetailRow}>
            <Text className={styles.summaryDetailLabel}>异常上报分布</Text>
            <View className={styles.riskDistribution}>
              {(['danger', 'warning', 'attention', 'normal'] as RiskLevel[]).map((level) => (
                shiftSummary.reportsByRisk[level] > 0 && (
                  <View key={level} className={styles.riskDistItem} style={{ backgroundColor: riskBgColors[level] }}>
                    <Text style={{ color: getRiskLevelColor(level), fontSize: '22rpx', fontWeight: 'bold' }}>
                      {shiftSummary.reportsByRisk[level]}
                    </Text>
                    <Text style={{ fontSize: '20rpx', color: '#86909C' }}>{getRiskLevelText(level)}</Text>
                  </View>
                )
              ))}
              {Object.values(shiftSummary.reportsByRisk).every(v => v === 0) && (
                <Text style={{ fontSize: '24rpx', color: '#86909C' }}>暂无上报</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.summarySection}>
        <Text className={styles.summaryTitle}>风险分布</Text>
        <View className={styles.summaryGrid}>
          {(['normal', 'attention', 'warning', 'danger'] as RiskLevel[]).map((level) => (
            <View
              key={level}
              className={styles.summaryItem}
              style={{ backgroundColor: riskBgColors[level] }}
            >
              <Text
                className={styles.summaryNumber}
                style={{ color: getRiskLevelColor(level) }}
              >
                {statistics.byRisk[level]}
              </Text>
              <Text className={styles.summaryLabel}>{getRiskLevelText(level)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterRow}>
          <Text className={styles.filterLabel}>日期:</Text>
          <View className={styles.dateOptions}>
            {dateOptions.map((opt) => (
              <View
                key={opt.value}
                className={classnames(styles.dateOption, { [styles.active]: dateFilter === opt.value })}
                onClick={() => setDateFilter(opt.value)}
              >
                {opt.label}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.filterRow}>
          <Text className={styles.filterLabel}>风险:</Text>
          <View className={styles.riskOptions}>
            {riskOptions.map((opt) => (
              <View
                key={opt.value}
                className={classnames(styles.riskOption, { [styles.active]: riskFilter === opt.value })}
                style={{
                  color: opt.value === 'all' ? '#4E5969' : getRiskLevelColor(opt.value as RiskLevel)
                }}
                onClick={() => setRiskFilter(opt.value)}
              >
                <Text className={styles.riskText}>{opt.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.recordsList}>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default RecordsPage;
