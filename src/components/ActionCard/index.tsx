import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { ActionItem } from '@/types';
import styles from './index.module.scss';

interface ActionCardProps {
  action: ActionItem;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, onClick }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <View className={styles.actionCard} onClick={onClick}>
      <View className={styles.actionHeader} onClick={toggleExpand}>
        <View className={styles.actionInfo}>
          <Text className={styles.actionTitle}>{action.title}</Text>
          <Text className={styles.actionDesc}>{action.description}</Text>
        </View>
        <View className={styles.expandIcon}>
          <Text className={styles.expandText}>{expanded ? '收起' : '展开'}</Text>
        </View>
      </View>

      {expanded && (
        <View className={styles.actionSteps}>
          {action.steps.map((step, index) => (
            <View key={index} className={styles.stepItem}>
              <View className={styles.stepNumber}>
                <Text className={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text className={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ActionCard;
