import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { RiskLevel } from '@/types';
import {
  getRiskLevelText,
  getRiskLevelColor,
  classnames,
  getCurrentDate
} from '@/utils';
import RecordCard from '@/components/RecordCard';
import { useAppContext } from '@/context/AppContext';
import styles from './index.module.scss';

const RecordsPage: React.FC = () => {
  const { userInfo, records, completionRate } = useAppContext();
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const today = getCurrentDate();

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
