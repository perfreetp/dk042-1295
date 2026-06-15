import React from 'react';
import { View, Text } from '@tarojs/components';
import { GunPosition } from '@/types';
import { getRiskLevelText, getRiskLevelColor, formatTime } from '@/utils';
import { classnames } from '@/utils';
import styles from './index.module.scss';

interface GunPositionCardProps {
  gun: GunPosition;
  showKeyTag?: boolean;
  onClick?: () => void;
}

const GunPositionCard: React.FC<GunPositionCardProps> = ({ gun, showKeyTag = true, onClick }) => {
  const riskColor = getRiskLevelColor(gun.riskLevel);
  const riskText = getRiskLevelText(gun.riskLevel);

  const bgColorMap = {
    normal: '#E8F5E9',
    attention: '#FFFDE7',
    warning: '#FFF3E0',
    danger: '#FFEBEE'
  };

  return (
    <View
      className={classnames(styles.gunCard, styles[gun.riskLevel])}
      style={{ backgroundColor: bgColorMap[gun.riskLevel] }}
      onClick={onClick}
    >
      <View className={styles.gunHeader}>
        <View className={styles.gunNameRow}>
          <Text className={styles.gunName}>{gun.name}</Text>
          {showKeyTag && gun.isKeyPoint && (
            <View className={styles.keyTag}>
              <Text className={styles.keyTagText}>重点</Text>
            </View>
          )}
        </View>
        <Text className={styles.gunCode}>{gun.code}</Text>
      </View>

      <View className={styles.gunBody}>
        <View className={styles.tempSection}>
          <Text className={styles.tempValue} style={{ color: riskColor }}>
            {gun.temperature}℃
          </Text>
          <Text className={styles.tempLabel}>当前温度</Text>
        </View>

        <View className={styles.divider} />

        <View className={styles.tempSection}>
          <Text className={styles.tempValue} style={{ color: riskColor }}>
            {gun.temperatureRise}K
          </Text>
          <Text className={styles.tempLabel}>温升</Text>
        </View>
      </View>

      <View className={styles.gunFooter}>
        <View className={styles.riskTag} style={{ backgroundColor: riskColor }}>
          <Text className={styles.riskTagText}>{riskText}</Text>
        </View>
        <Text className={styles.checkTime}>上次巡检: {formatTime(gun.lastCheckTime)}</Text>
      </View>
    </View>
  );
};

export default GunPositionCard;
