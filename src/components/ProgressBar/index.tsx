import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ProgressBarProps {
  progress: number;
  showText?: boolean;
  height?: number;
  color?: string;
  bgColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showText = true,
  height = 16,
  color = '#1E88E5',
  bgColor = '#E5E6EB'
}) => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <View className={styles.progressWrapper}>
      <View
        className={styles.progressBar}
        style={{ height: `${height}rpx`, backgroundColor: bgColor }}
      >
        <View
          className={styles.progressFill}
          style={{
            width: `${safeProgress}%`,
            height: `${height}rpx`,
            backgroundColor: color
          }}
        />
      </View>
      {showText && (
        <Text className={styles.progressText} style={{ color }}>{safeProgress}%</Text>
      )}
    </View>
  );
};

export default ProgressBar;
