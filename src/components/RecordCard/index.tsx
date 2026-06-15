import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Record } from '@/types';
import { getRiskLevelText, getRiskLevelColor, formatDateTime, classnames } from '@/utils';
import styles from './index.module.scss';

interface RecordCardProps {
  record: Record;
  onClick?: () => void;
}

const RecordCard: React.FC<RecordCardProps> = ({ record, onClick }) => {
  const riskColor = getRiskLevelColor(record.riskLevel);
  const riskText = getRiskLevelText(record.riskLevel);

  const bgColorMap = {
    normal: '#E8F5E9',
    attention: '#FFFDE7',
    warning: '#FFF3E0',
    danger: '#FFEBEE'
  };

  const handleClick = () => {
    onClick?.();
    if (!onClick) {
      Taro.navigateTo({
        url: `/pages/record-detail/index?id=${record.id}`
      });
    }
  };

  return (
    <View
      className={classnames(styles.recordCard, styles[record.riskLevel])}
      onClick={handleClick}
    >
      <View className={styles.recordHeader}>
        <View className={styles.recordInfo}>
          <Text className={styles.gunName}>{record.gunPositionName}</Text>
          <Text className={styles.gunCode}>({record.gunPositionCode})</Text>
        </View>
        <View
          className={styles.riskTag}
          style={{ backgroundColor: bgColorMap[record.riskLevel], color: riskColor }}
        >
          <Text className={styles.riskText}>{riskText}</Text>
        </View>
      </View>

      <View className={styles.recordBody}>
        <View className={styles.actionRow}>
          <Text className={styles.actionLabel}>操作:</Text>
          <Text className={styles.actionValue}>{record.action}</Text>
        </View>
        <Text className={styles.recordDesc}>{record.description}</Text>
      </View>

      <View className={styles.recordFooter}>
        <Text className={styles.recordDate}>{record.date}</Text>
        <Text className={styles.recordTime}>{formatDateTime(record.createdAt)}</Text>
      </View>
    </View>
  );
};

export default RecordCard;
