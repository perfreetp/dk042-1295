import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Message } from '@/types';
import { getMessageTypeText, getMessageTypeColor, formatDateTime, classnames } from '@/utils';
import styles from './index.module.scss';

interface MessageCardProps {
  message: Message;
  onClick?: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onClick }) => {
  const typeColor = getMessageTypeColor(message.type);
  const typeText = getMessageTypeText(message.type);

  const bgColorMap = {
    system: '#E3F2FD',
    alert: '#FFEBEE',
    reminder: '#FFF3E0',
    handover: '#F3E5F5'
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <View
      className={classnames(styles.messageCard, { [styles.unread]: !message.isRead })}
      onClick={handleClick}
    >
      <View className={styles.messageHeader}>
        <View
          className={styles.typeTag}
          style={{ backgroundColor: bgColorMap[message.type], color: typeColor }}
        >
          <Text className={styles.typeText}>{typeText}</Text>
        </View>
        {!message.isRead && <View className={styles.unreadDot} />}
        <Text className={styles.createTime}>{formatDateTime(message.createdAt)}</Text>
      </View>

      <Text className={styles.messageTitle}>{message.title}</Text>
      <Text className={styles.messageContent}>{message.content}</Text>
    </View>
  );
};

export default MessageCard;
