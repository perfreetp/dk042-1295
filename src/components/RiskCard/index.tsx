import React from 'react';
import { View, Text } from '@tarojs/components';
import { RiskLevel } from '@/types';
import { getRiskLevelText, getRiskLevelColor } from '@/utils';
import styles from './index.module.scss';

interface RiskCardProps {
  level: RiskLevel;
  count: number;
  label: string;
  onClick?: () => void;
}

const RiskCard: React.FC<RiskCardProps> = ({ level, count, label, onClick }) => {
  const color = getRiskLevelColor(level);
  const text = getRiskLevelText(level);

  const bgColorMap: Record<RiskLevel, string> = {
    normal: '#E8F5E9',
    attention: '#FFFDE7',
    warning: '#FFF3E0',
    danger: '#FFEBEE'
  };

  return (
    <View
      className={styles.riskCard}
      style={{ backgroundColor: bgColorMap[level] }}
      onClick={onClick}
    >
      <View className={styles.riskIndicator} style={{ backgroundColor: color }} />
      <View className={styles.riskContent}>
        <Text className={styles.riskCount} style={{ color }}>{count}</Text>
        <Text className={styles.riskLabel}>{label}</Text>
        <Text className={styles.riskText} style={{ color }}>{text}</Text>
      </View>
    </View>
  );
};

export default RiskCard;
