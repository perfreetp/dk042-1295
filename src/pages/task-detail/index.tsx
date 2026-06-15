import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

const TaskDetailPage: React.FC = () => {
  return (
    <View className={styles.placeholderPage}>
      <Text className={styles.icon}>📋</Text>
      <Text className={styles.title}>任务详情</Text>
      <Text className={styles.desc}>功能正在开发中...</Text>
    </View>
  );
};

export default TaskDetailPage;
