import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockMessages, markAsRead, markAllAsRead, getUnreadCount } from '@/data/mockMessages';
import { Message, MessageType } from '@/types';
import {
  getMessageTypeText,
  getMessageTypeColor,
  classnames
} from '@/utils';
import MessageCard from '@/components/MessageCard';
import { useAppContext } from '@/context/AppContext';
import styles from './index.module.scss';

type FilterType = 'all' | MessageType;

const MessagesPage: React.FC = () => {
  const { refreshData } = useAppContext();
  const [filter, setFilter] = useState<FilterType>('all');
  const [messages, setMessages] = useState(mockMessages);

  const unreadCount = useMemo(() => getUnreadCount(), []);
  const alertCount = useMemo(() => messages.filter(m => m.type === 'alert' && !m.isRead).length, [messages]);
  const reminderCount = useMemo(() => messages.filter(m => m.type === 'reminder' && !m.isRead).length, [messages]);

  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: 'all', label: '全部', count: unreadCount },
    { key: 'alert', label: '告警', count: alertCount },
    { key: 'reminder', label: '提醒', count: reminderCount },
    { key: 'handover', label: '交接班' },
    { key: 'system', label: '系统通知' }
  ];

  const filteredMessages = useMemo(() => {
    if (filter === 'all') return messages;
    return messages.filter(m => m.type === filter);
  }, [messages, filter]);

  const handleMessageClick = useCallback((message: Message) => {
    console.log('[Message] 查看消息详情:', message.id);
    markAsRead(message.id);
    setMessages([...mockMessages]);
    refreshData();

    if (message.relatedId) {
      if (message.type === 'alert') {
        Taro.navigateTo({
          url: `/pages/exception-detail/index?id=${message.relatedId}`
        });
      } else if (message.type === 'reminder') {
        Taro.navigateTo({
          url: `/pages/task-detail/index?id=${message.relatedId}`
        });
      }
    }
  }, [refreshData]);

  const handleMarkAllRead = useCallback(() => {
    console.log('[Message] 标记全部已读');
    markAllAsRead();
    setMessages([...mockMessages]);
    refreshData();
    Taro.showToast({
      title: '已全部标为已读',
      icon: 'success'
    });
  }, [refreshData]);

  return (
    <View className={styles.messagesPage}>
      {/* 头部 */}
      <View className={styles.headerSection}>
        <Text className={styles.pageTitle}>消息提醒</Text>
        {unreadCount > 0 && (
          <Text className={styles.markAllBtn} onClick={handleMarkAllRead}>
            全部已读
          </Text>
        )}
      </View>

      {/* 筛选标签 */}
      <ScrollView scrollX className={styles.filterSection}>
        {filters.map((f) => (
          <View
            key={f.key}
            className={classnames(styles.filterTab, { [styles.active]: filter === f.key })}
            onClick={() => setFilter(f.key)}
          >
            <Text className={styles.filterText}>
              {f.label}
              {f.count !== undefined && f.count > 0 && (
                <Text className={styles.filterCount}>({f.count})</Text>
              )}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* 统计卡片 */}
      {filter === 'all' && (
        <View className={styles.statsSection}>
          <View className={styles.statCard}>
            <View className={styles.statRow}>
              <View className={styles.statDot} style={{ backgroundColor: getMessageTypeColor('alert') }} />
              <Text className={styles.statLabel}>未处理告警</Text>
            </View>
            <Text className={styles.statNumber} style={{ color: getMessageTypeColor('alert') }}>
              {alertCount}
            </Text>
          </View>
          <View className={styles.statCard}>
            <View className={styles.statRow}>
              <View className={styles.statDot} style={{ backgroundColor: getMessageTypeColor('reminder') }} />
              <Text className={styles.statLabel}>待复查提醒</Text>
            </View>
            <Text className={styles.statNumber} style={{ color: getMessageTypeColor('reminder') }}>
              {reminderCount}
            </Text>
          </View>
        </View>
      )}

      {/* 消息列表 */}
      <ScrollView scrollY>
        <View className={styles.messagesList}>
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <MessageCard
                key={message.id}
                message={message}
                onClick={() => handleMessageClick(message)}
              />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📭</Text>
              <Text className={styles.emptyText}>暂无消息</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MessagesPage;
